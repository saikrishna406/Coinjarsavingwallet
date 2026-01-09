import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto } from './dto/auth.dto';
import { PhoneEmailService } from './phone-email.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private phoneEmailService: PhoneEmailService
    ) { }

    @Post('verify-phone-widget')
    async verifyPhoneWidget(@Body('access_token') accessToken: string) {
        // 1. Verify with Phone.Email
        const { phone } = await this.phoneEmailService.verifyPhoneToken(accessToken);

        // 2. Login/Register user via Supabase (or custom logic)
        return this.authService.loginWithPhone(phone);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('send-otp')
    async sendOtp(@Body('phone') phone: string) {
        return this.authService.sendOtp(phone);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() body: { email?: string; phone?: string; token: string; type?: 'email' | 'phone' }) {
        const identifier = body.phone || body.email;
        const type = body.type || (body.phone ? 'phone' : 'email');
        return this.authService.verifyOtp(identifier, body.token, type);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body('refresh_token') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }
}
