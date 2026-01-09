import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        if (apiKey) {
            this.resend = new Resend(apiKey);
        }
    }

    async sendWelcomeEmail(email: string, name: string) {
        if (!this.resend) {
            console.warn('Resend API Key missing. Skipping email.');
            return;
        }

        try {
            await this.resend.emails.send({
                from: 'Savings Wallet <onboarding@resend.dev>', // Update with verify domain in Prod
                to: email,
                subject: 'Welcome to Savings Wallet!',
                html: `<strong>Hello ${name}!</strong><br>Welcome to your new savings journey.`,
            });
        } catch (error) {
            console.error('Failed to send email:', error);
            // Don't block flow if email fails
        }
    }

    async sendOtp(email: string, otp: string) {
        if (!this.resend) {
            console.warn('Resend API key missing');
            return;
        }

        await this.resend.emails.send({
            from: 'Savings Wallet <auth@resend.dev>',
            to: email,
            subject: 'Your Login OTP',
            html: `<p>Your verification code is: <strong>${otp}</strong></p>`
        });
    }
}
