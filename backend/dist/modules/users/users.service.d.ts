import { SupabaseService } from '../../supabase/supabase.service';
import { PaymentsService } from '../payments/payments.service';
export declare class UsersService {
    private supabaseService;
    private paymentsService;
    constructor(supabaseService: SupabaseService, paymentsService: PaymentsService);
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateData: any): Promise<any>;
    linkUpi(userId: string, upiId: string): Promise<any>;
}
