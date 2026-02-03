import { Injectable } from '@nestjs/common';
import { GoalsService } from '../goals/goals.service';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class DashboardService {
    constructor(
        private goalsService: GoalsService,
        private walletService: WalletService,
        private usersService: UsersService,
        private gamificationService: GamificationService
    ) { }

    async getDashboardData(userId: string) {
        const [goals, wallet, profile, gamification] = await Promise.all([
            this.goalsService.getGoals(userId),
            this.walletService.getWallet(userId),
            this.usersService.getProfile(userId),
            this.gamificationService.getUserStatus(userId)
        ]);

        return {
            goals,
            wallet,
            profile,
            gamification
        };
    }
}
