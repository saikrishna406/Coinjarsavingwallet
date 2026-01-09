import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class UsersService {
    constructor(
        private supabaseService: SupabaseService,
        private paymentsService: PaymentsService
    ) { }

    async getProfile(userId: string) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    async updateProfile(userId: string, updateData: any) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async linkUpi(userId: string, upiId: string) {
        // Verify UPI ID first
        const verification = await this.paymentsService.verifyUpiId(upiId);

        if (!verification.valid) {
            throw new BadRequestException('Invalid UPI ID. Please check and try again.');
        }

        // If valid, link it
        return this.updateProfile(userId, { upi_id: upiId });
    }
}
