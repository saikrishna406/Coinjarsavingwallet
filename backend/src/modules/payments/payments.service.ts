import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentsService {
    constructor(private configService: ConfigService) { }

    /**
   * Validates a UPI ID using Heuristic checks (Regex + Provider list).
   * Does NOT perform real bank verification.
   */
    async verifyUpiId(vpa: string): Promise<{ valid: boolean; name?: string; message?: string; verified: boolean }> {
        // 1. Validate Format
        // Regex: Alphanumeric, dot, hyphen, underscore (min 2 chars) @ Alphabetic (min 3 chars)
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/;

        if (!upiRegex.test(vpa)) {
            return { valid: false, verified: false, message: 'Invalid UPI ID format' };
        }

        // 2. Validate Known Providers (Optional check for warning)
        const knownHandles = ["okicici", "okhdfc", "ybl", "paytm", "oksbi", "upi", "axl", "ibl", "paylm"];
        const handle = vpa.split("@")[1];

        const isKnownProvider = knownHandles.includes(handle.toLowerCase());

        if (!isKnownProvider) {
            console.warn(`Warning: Unknown UPI provider handle '@${handle}'`);
            // We still allow it, but flag it potentially? 
            // User asked to "warn", but for the API response we'll just mark it as not bank verified.
        }

        // 3. Return Success (but not verified)
        return {
            valid: true,
            verified: false, // Explicitly false as requested
            name: 'User (Unverified)',
            message: 'UPI ID saved (not bank-verified)'
        };
    }

    /**
     * Mock Payment Initiation
     */
    async initiateMockPayment(amount: number, upiId: string) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than 0');
        }

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: 'Payment simulated successfully',
            transactionId: 'txn_mock_' + Date.now(),
            amount,
            upiId
        };
    }
}
