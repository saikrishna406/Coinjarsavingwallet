export declare class PhoneEmailService {
    verifyPhoneToken(userJsonUrl: string): Promise<{
        valid: boolean;
        phone: string;
        countryCode: any;
        phoneNumber: any;
    }>;
}
