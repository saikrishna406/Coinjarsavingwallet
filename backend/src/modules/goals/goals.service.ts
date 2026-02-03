import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { WalletService } from '../../modules/wallet/wallet.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class GoalsService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly walletService: WalletService,
        private readonly gamificationService: GamificationService
    ) { }

    async getGoals(userId: string) {
        const supabase = this.supabaseService.getClient();

        // Fetch goals for the specific user
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return data;
    }

    async createGoal(userId: string, goalData: any) {
        const supabase = this.supabaseService.getClient();

        // Prepare goal object
        const newGoal = {
            user_id: userId,
            name: goalData.title, // Map frontend 'title' to DB 'name'
            target_amount: goalData.target_amount,
            current_amount: goalData.current_amount || 0,
            target_date: goalData.target_date,
            status: 'active', // Default status must vary based on constraint check ('active', 'completed')
            category: goalData.category || 'General',
            created_at: new Date()
        };

        const { data, error } = await supabase
            .from('goals')
            .insert(newGoal)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }



        return data;
    }

    async addSavings(userId: string, goalId: string, amount: number) {
        // Gamification: Update Streak
        await this.gamificationService.updateStreak(userId);

        const supabase = this.supabaseService.getClient();

        // 1. Add Funds to Wallet (Creates Transaction + Updates Wallet Balance)
        // This satisfies "Rule 1.2: Wallet balance derived from transactions"
        await this.walletService.addFunds(userId, amount, 'SAVE', goalId);

        // 2. Update Goal Current Amount
        // Optimistic update: we assume wallet add succeeded if we are here (addFunds throws if fails)

        // Fetch current goal to ensure it exists and belongs to user
        const { data: goal, error: fetchError } = await supabase
            .from('goals')
            .select('*')
            .eq('id', goalId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !goal) {
            throw new InternalServerErrorException('Goal not found');
        }

        const newAmount = (goal.current_amount || 0) + amount;
        let newStatus = goal.status;

        // Check if goal is completed
        if (newAmount >= goal.target_amount && goal.status !== 'completed' && goal.status !== 'withdrawn') {
            newStatus = 'completed';
            // Gamification: Award Badge
            await this.gamificationService.checkGoalCompletionBadges(userId);
        }

        const { data: updatedGoal, error: updateError } = await supabase
            .from('goals')
            .update({
                current_amount: newAmount,
                status: newStatus
            })
            .eq('id', goalId)
            .select()
            .single();

        if (updateError) {
            throw new InternalServerErrorException('Failed to update goal amount');
        }

        return updatedGoal;
    }

    async withdrawFunds(userId: string, goalId: string, amount: number) {
        const supabase = this.supabaseService.getClient();
        let walletTransactionId: string | null = null;
        let goalUpdateSuccess = false;

        try {
            // 1. Fetch Goal & Validate
            const { data: goal, error: fetchError } = await supabase
                .from('goals')
                .select('*')
                .eq('id', goalId)
                .eq('user_id', userId)
                .single();

            if (fetchError || !goal) {
                throw new InternalServerErrorException('Goal not found');
            }

            // Validation Checks
            if (goal.status !== 'completed') {
                throw new InternalServerErrorException('Goal is not completed yet so you cannot withdraw');
            }

            if (amount > goal.current_amount) {
                throw new InternalServerErrorException('Withdrawal amount exceeds goal balance');
            }

            // 2. Withdraw from Wallet (This creates a transaction record)
            // If this fails, nothing else happens - safe to fail here
            const walletResult = await this.walletService.withdrawFunds(userId, amount, 'WITHDRAW', goalId);
            walletTransactionId = walletResult.transactionId;

            // 3. Update Goal Balance & Status (CRITICAL STEP)
            const newGoalAmount = goal.current_amount - amount;
            let newStatus = 'completed'; // Keep as completed even if balance is 0

            const { data: updatedGoal, error: updateError } = await supabase
                .from('goals')
                .update({
                    current_amount: newGoalAmount,
                    status: newStatus
                })
                .eq('id', goalId)
                .select()
                .single();

            if (updateError) {
                // CRITICAL: Wallet was debited but goal update failed
                // We MUST rollback the wallet transaction
                throw new InternalServerErrorException(`Failed to update goal: ${updateError.message}`);
            }

            goalUpdateSuccess = true;
            return updatedGoal;

        } catch (error) {
            // ROLLBACK LOGIC
            console.error('GOAL WITHDRAWAL FAILED - Initiating Rollback:', error);

            // If wallet was debited but goal update failed, refund the wallet
            if (walletTransactionId && !goalUpdateSuccess) {
                console.error('CRITICAL: Wallet debited but goal update failed. Refunding wallet...');
                try {
                    // Refund by adding the amount back to wallet
                    await this.walletService.addFunds(userId, amount, 'UPI', `REFUND_${walletTransactionId}`);
                    console.log(`Rollback successful: Refunded ${amount} to wallet for user ${userId}`);
                } catch (rollbackError) {
                    // CRITICAL FAILURE: Money is lost in the system
                    console.error('CRITICAL FAILURE: Could not refund wallet after goal update failure!', {
                        userId,
                        goalId,
                        amount,
                        walletTransactionId,
                        error: rollbackError
                    });
                    // In production:
                    // 1. Send immediate alert to ops team
                    // 2. Log to error monitoring (Sentry/DataDog)
                    // 3. Create manual reconciliation ticket
                    // 4. Freeze user account until resolved
                }
            }

            throw error;
        }
    }
}
