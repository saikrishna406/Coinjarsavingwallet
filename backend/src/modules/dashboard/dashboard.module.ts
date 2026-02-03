import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { GoalsModule } from '../goals/goals.module';
import { WalletModule } from '../wallet/wallet.module';
import { UsersModule } from '../users/users.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
    imports: [GoalsModule, WalletModule, UsersModule, GamificationModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
