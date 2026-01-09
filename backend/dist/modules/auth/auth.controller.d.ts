import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { PhoneEmailService } from './phone-email.service';
export declare class AuthController {
    private authService;
    private phoneEmailService;
    constructor(authService: AuthService, phoneEmailService: PhoneEmailService);
    verifyPhoneWidget(accessToken: string): Promise<{
        message: string;
        user: any;
        warning: string;
    }>;
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
    sendOtp(phone: string): Promise<{
        message: string;
    }>;
    verifyOtp(body: {
        email?: string;
        phone?: string;
        token: string;
        type?: 'email' | 'phone';
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
