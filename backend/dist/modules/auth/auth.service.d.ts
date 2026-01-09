import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: import("@supabase/auth-js").User;
        session: import("@supabase/auth-js").Session;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
    loginWithPhone(phone: string): Promise<{
        message: string;
        user: any;
        warning: string;
    }>;
    sendOtp(phone: string): Promise<{
        message: string;
    }>;
    verifyOtp(emailOrPhone: string, token: string, type?: 'email' | 'phone'): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    validateUser(accessToken: string): Promise<import("@supabase/auth-js").User>;
}
