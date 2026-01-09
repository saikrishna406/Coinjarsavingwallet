import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private supabaseService: SupabaseService) { }

    async register(registerDto: RegisterDto) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase.auth.signUp({
            email: registerDto.email,
            password: registerDto.password,
            options: {
                data: {
                    name: registerDto.name,
                    phone: registerDto.phone,
                },
            },
        });

        if (error) {
            throw new UnauthorizedException(error.message);
        }

        return {
            message: 'Registration successful!',
            user: data.user,
            session: data.session, // If auto-confirm is on, session might be returned here
        };
    }

    async login(loginDto: LoginDto) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginDto.email,
            password: loginDto.password,
        });

        if (error) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
        };
    }

    async loginWithPhone(phone: string) {
        const adminSupabase = this.supabaseService.getAdminClient();

        // 1. Try to find the user by phone number in Supabase Auth
        // Note: listUsers is an admin function.
        // We filter manually because listUsers doesn't strictly support filtering by phone in v1 easily (depends on version).
        // A better way is to query the 'users' table if you are syncing properly.
        // Let's rely on 'public.users' for lookup as it triggers from auth.users.

        const { data: profile, error: profileError } = await adminSupabase
            .from('users')
            .select('*')
            .eq('phone_number', phone) // Assumes we store the mapped phone number here
            .single();

        let userPayload = profile;

        if (!profile) {
            // 2. User doesn't exist? Create them in Supabase Auth.
            // We use a dummy email because Supabase Auth requires email (usually) unless Phone Auth is strictly enabled & detached.
            // Phone-only users in Supabase usually need to be created via signInWithOtp, but we are bypassing that.
            // Workaround: Create a dummy email user or use admin.createUser with phone.

            const dummyEmail = `${phone}@phone.email.user`; // Unique dummy email
            const randomPassword = Math.random().toString(36).slice(-8) + 'Aa1!'; // Random strong password

            const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
                email: dummyEmail,
                password: randomPassword,
                phone: phone,
                email_confirm: true,
                phone_confirm: true,
                user_metadata: {
                    phone_verified_by: 'phone.email'
                }
            });

            if (createError) {
                // Handle case where phone might exist in Auth but not in public.users (sync issue)
                throw new UnauthorizedException(`User creation failed: ${createError.message}`);
            }

            // The trigger in SQL should handle public.users creation. 
            // We might need to fetch the profile again or just return the auth user.
            userPayload = newUser.user;
        }

        // 3. Issue a Token
        // Since we don't have the User's password (we either just made it or don't know it), 
        // we can't use signInWithPassword.
        // And we don't want to use signInWithOtp because that sends an SMS.

        // LIMITATION: Without the JWT Verification Secret, we cannot MINT a custom token.
        // The current structure validates tokens by calling getUser(), which requires a real Supabase token.

        // TEMPORARY FIX: We will return the User Object. 
        // The Frontend won't be able to make authenticated calls yet without a real token.
        // You MUST enable JWT generation or use a different auth strategy to proceed.

        return {
            message: 'Phone verified and User authenticated.',
            user: userPayload,
            warning: 'JWT Token not generated. Backend requires JWT_SECRET to mint tokens for custom flows.'
        };
    }

    async sendOtp(phone: string) {
        const supabase = this.supabaseService.getClient();

        const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });

        if (error) {
            throw new UnauthorizedException(error.message);
        }

        return { message: 'OTP sent successfully' };
    }

    async verifyOtp(emailOrPhone: string, token: string, type: 'email' | 'phone' = 'email') {
        const supabase = this.supabaseService.getClient();

        let params: any;

        if (type === 'phone') {
            params = {
                phone: emailOrPhone,
                token,
                type: 'sms',
            };
        } else {
            params = {
                email: emailOrPhone,
                token,
                type: 'email',
            };
        }

        const { data, error } = await supabase.auth.verifyOtp(params);

        if (error) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        return {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
            user: data.user,
        };
    }

    async refreshToken(refreshToken: string) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    }

    async validateUser(accessToken: string) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error || !data.user) {
            throw new UnauthorizedException('Invalid token');
        }

        return data.user;
    }
}
