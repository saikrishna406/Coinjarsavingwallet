import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from './mail.service';
import { PhoneEmailService } from './phone-email.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, MailService, PhoneEmailService],
    exports: [AuthService, MailService],
})
export class AuthModule { }
