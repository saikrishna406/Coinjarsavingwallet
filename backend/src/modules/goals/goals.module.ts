import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { WalletModule } from '../../modules/wallet/wallet.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
    imports: [SupabaseModule, WalletModule, GamificationModule],
    controllers: [GoalsController],
    providers: [GoalsService],
    exports: [GoalsService]
})
export class GoalsModule { }
