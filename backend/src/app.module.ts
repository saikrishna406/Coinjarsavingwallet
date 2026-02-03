import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { GoalsModule } from './modules/goals/goals.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NudgesModule } from './modules/nudges/nudges.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        SupabaseModule,
        AuthModule,
        UsersModule,
        WalletModule,
        GoalsModule,
        TransactionsModule,
        PaymentsModule,
        NudgesModule,
        GamificationModule,
        DashboardModule,
    ],
})
export class AppModule { }
