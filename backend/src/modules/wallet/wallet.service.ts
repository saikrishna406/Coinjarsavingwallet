import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class WalletService {
    constructor(private supabaseService: SupabaseService) { }

    async getWallet(userId: string) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    // Add more wallet methods here (add funds, withdraw, etc.)
}
