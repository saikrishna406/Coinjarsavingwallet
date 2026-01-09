import { SupabaseService } from '../../supabase/supabase.service';
export declare class WalletService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getWallet(userId: string): Promise<any>;
}
