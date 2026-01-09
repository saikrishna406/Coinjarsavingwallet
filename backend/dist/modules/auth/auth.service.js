"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../supabase/supabase.service");
let AuthService = class AuthService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async register(registerDto) {
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
            throw new common_1.UnauthorizedException(error.message);
        }
        return {
            message: 'Registration successful!',
            user: data.user,
            session: data.session,
        };
    }
    async login(loginDto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginDto.email,
            password: loginDto.password,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
        };
    }
    async loginWithPhone(phone) {
        const adminSupabase = this.supabaseService.getAdminClient();
        const { data: profile, error: profileError } = await adminSupabase
            .from('users')
            .select('*')
            .eq('phone_number', phone)
            .single();
        let userPayload = profile;
        if (!profile) {
            const dummyEmail = `${phone}@phone.email.user`;
            const randomPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
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
                throw new common_1.UnauthorizedException(`User creation failed: ${createError.message}`);
            }
            userPayload = newUser.user;
        }
        return {
            message: 'Phone verified and User authenticated.',
            user: userPayload,
            warning: 'JWT Token not generated. Backend requires JWT_SECRET to mint tokens for custom flows.'
        };
    }
    async sendOtp(phone) {
        const supabase = this.supabaseService.getClient();
        const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(emailOrPhone, token, type = 'email') {
        const supabase = this.supabaseService.getClient();
        let params;
        if (type === 'phone') {
            params = {
                phone: emailOrPhone,
                token,
                type: 'sms',
            };
        }
        else {
            params = {
                email: emailOrPhone,
                token,
                type: 'email',
            };
        }
        const { data, error } = await supabase.auth.verifyOtp(params);
        if (error) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        return {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
            user: data.user,
        };
    }
    async refreshToken(refreshToken) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    }
    async validateUser(accessToken) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (error || !data.user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return data.user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map