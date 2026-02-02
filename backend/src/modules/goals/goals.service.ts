import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { WalletService } from '../../modules/wallet/wallet.service';

@Injectable()
export class GoalsService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly walletService: WalletService
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

        // 2. Withdraw Funds from Wallet (Creates Transaction + Updates Wallet Balance)
        // Source is 'WITHDRAW'
        await this.walletService.withdrawFunds(userId, amount, 'WITHDRAW', goalId);

        // 3. Update Goal Balance & Status
        const newGoalAmount = goal.current_amount - amount;
        let newStatus = 'completed';

        // If balance becomes 0 (or close to 0 due to float), mark as withdrawn
        if (newGoalAmount <= 0) {
            newStatus = 'withdrawn';
        }

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
            // CRITICAL: We deducted money but failed to update goal. 
            // Ideally we should rollback wallet transaction here.
            console.error('CRITICAL: Money deducted but goal update failed!');
            throw new InternalServerErrorException('Failed to update goal after withdrawal');
        }

        return updatedGoal;
    }
}
