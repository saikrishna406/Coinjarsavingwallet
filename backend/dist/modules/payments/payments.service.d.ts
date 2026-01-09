import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private configService;
    constructor(configService: ConfigService);
    verifyUpiId(vpa: string): Promise<{
        valid: boolean;
        name?: string;
        message?: string;
        verified: boolean;
    }>;
    initiateMockPayment(amount: number, upiId: string): Promise<{
        success: boolean;
        message: string;
        transactionId: string;
        amount: number;
        upiId: string;
    }>;
}
