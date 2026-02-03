import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class WalletService {
    constructor(
        private supabaseService: SupabaseService,
        private transactionsService: TransactionsService
    ) { }

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

    /**
     * Add funds to wallet (CREDIT)
     * Rule: Always update through a transaction
     */
    async addFunds(userId: string, amount: number, source: 'SAVE' | 'UPI' = 'UPI', referenceId?: string) {
        const supabase = this.supabaseService.getClient();
        let transactionId: string | null = null;

        try {
            // 0. Fetch Wallet to get ID (Required for Transaction)
            let wallet = await this.getWallet(userId).catch(() => null);
            if (!wallet) {
                // Create wallet if not exists (Auto-provisioning)
                console.log(`Wallet not found for user ${userId}, creating new one...`);
                const { data, error } = await supabase.from('wallets').insert({ user_id: userId, balance: 0 }).select().single();
                if (error) {
                    console.error('Error creating wallet:', error);
                    throw new Error('Failed to create wallet');
                }
                wallet = data;
            }

            console.log('Using Wallet for Transaction:', JSON.stringify(wallet));
            if (!wallet?.id) {
                console.error('CRITICAL: Wallet object has no ID!', wallet);
                throw new Error('Wallet ID is missing');
            }

            // 1. Create Transaction (PENDING)
            const transaction = await this.transactionsService.createTransaction({
                userId,
                walletId: wallet.id,
                amount,
                type: 'CREDIT',
                source,
                referenceId,
                status: 'PENDING'
            });
            transactionId = transaction.id;

            // 2. Update Wallet Balance
            // Note: In a real production app, this should be a DB transaction/RPC
            const { error } = await supabase.rpc('increment_wallet_balance', {
                row_id: userId, // Assuming rpc takes user_id, or we do a direct update
                amount_to_add: amount
            });

            // Fallback to direct update if RPC doesn't exist (User might not have RPC)
            if (error) {
                // Fetch current balance
                const current = await this.getWallet(userId);
                const { error: updateError } = await supabase
                    .from('wallets')
                    .update({ balance: (current.balance || 0) + amount })
                    .eq('user_id', userId);

                if (updateError) {
                    throw new Error(`Failed to update wallet balance: ${updateError.message}`);
                }
            }

            // 3. Mark Transaction SUCCESS
            await this.transactionsService.updateStatus(transaction.id, 'SUCCESS');

            return { success: true, transactionId: transaction.id };
        } catch (error) {
            // ROLLBACK: Mark transaction as FAILED if it was created
            if (transactionId) {
                try {
                    await this.transactionsService.updateStatus(transactionId, 'FAILED');
                } catch (rollbackError) {
                    console.error('CRITICAL: Failed to mark transaction as FAILED during rollback:', rollbackError);
                }
            }
            throw error;
        }
    }

    /**
     * Withdraw funds from wallet (DEBIT)
     * ATOMIC OPERATION: Either all steps succeed or all fail
     */
    async withdrawFunds(userId: string, amount: number, source: 'WITHDRAW' | 'GOAL_CONTRIBUTION', referenceId?: string) {
        const supabase = this.supabaseService.getClient();
        let transactionId: string | null = null;
        let walletUpdateSuccess = false;

        try {
            // 1. Check Balance FIRST (Fail Fast)
            const wallet = await this.getWallet(userId);
            if ((wallet.balance || 0) < amount) {
                throw new InternalServerErrorException('Insufficient wallet balance');
            }

            // 2. Create Transaction (PENDING) - This is our audit trail
            const transaction = await this.transactionsService.createTransaction({
                userId,
                walletId: wallet.id,
                amount,
                type: 'DEBIT',
                source,
                referenceId,
                status: 'PENDING'
            });
            transactionId = transaction.id;

            // 3. Deduct Wallet Balance (CRITICAL STEP)
            const { error: walletError } = await supabase
                .from('wallets')
                .update({ balance: (wallet.balance || 0) - amount })
                .eq('user_id', userId);

            if (walletError) {
                throw new InternalServerErrorException(`Failed to update wallet: ${walletError.message}`);
            }

            walletUpdateSuccess = true;

            // 4. Mark Transaction SUCCESS
            await this.transactionsService.updateStatus(transaction.id, 'SUCCESS');

            return { success: true, transactionId: transaction.id };

        } catch (error) {
            // ROLLBACK LOGIC
            console.error('WITHDRAWAL FAILED - Initiating Rollback:', error);

            // If wallet was updated but transaction marking failed, we need to refund
            if (walletUpdateSuccess && transactionId) {
                console.error('CRITICAL: Wallet was debited but transaction failed. Refunding...');
                try {
                    // Refund the wallet
                    const wallet = await this.getWallet(userId);
                    await supabase
                        .from('wallets')
                        .update({ balance: (wallet.balance || 0) + amount })
                        .eq('user_id', userId);

                    console.log(`Rollback successful: Refunded ${amount} to user ${userId}`);
                } catch (rollbackError) {
                    // CRITICAL: This should trigger an alert in production
                    console.error('CRITICAL FAILURE: Could not rollback wallet deduction!', {
                        userId,
                        amount,
                        transactionId,
                        error: rollbackError
                    });
                    // In production: Send alert to ops team, log to monitoring system
                }
            }

            // Mark transaction as FAILED
            if (transactionId) {
                try {
                    await this.transactionsService.updateStatus(transactionId, 'FAILED');
                } catch (statusError) {
                    console.error('Failed to mark transaction as FAILED:', statusError);
                }
            }

            throw error;
        }
    }
}

