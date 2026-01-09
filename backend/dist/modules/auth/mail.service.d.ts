import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private resend;
    constructor(configService: ConfigService);
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendOtp(email: string, otp: string): Promise<void>;
}
