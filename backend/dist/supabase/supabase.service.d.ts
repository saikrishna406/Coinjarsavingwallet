import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    getAuthenticatedClient(accessToken: string): SupabaseClient;
    getAdminClient(): SupabaseClient;
}
