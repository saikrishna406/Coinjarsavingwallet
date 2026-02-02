"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSackDollar, faCheck, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { GoalsService } from "@/services/goals.service"
import { useToast } from "@/hooks/use-toast"

interface WithdrawModalProps {
    goalId: string;
    goalTitle: string;
    currentAmount: number;
    onSuccess?: () => void;
}

export function WithdrawModal({ goalId, goalTitle, currentAmount, onSuccess }: WithdrawModalProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [step, setStep] = useState<"input" | "processing" | "success">("input")
    const [error, setError] = useState("")
    const { toast } = useToast()

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        const withdrawAmount = parseFloat(amount)
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setError("Please enter a valid amount")
            return
        }
        if (withdrawAmount > currentAmount) {
            setError(`Amount cannot exceed ₹${currentAmount}`)
            return
        }

        setStep("processing")
        setError("")

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error("Not authenticated")

            await GoalsService.withdrawFunds(token, goalId, withdrawAmount)

            setStep("success")
            toast({
                title: "Withdrawal Successful",
                description: `₹${withdrawAmount} has been added to your wallet (Demo mode).`,
            })
            if (onSuccess) onSuccess()
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || err.message || "Withdrawal failed")
            setStep("input")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                setTimeout(() => {
                    setStep("input")
                    setAmount("")
                    setError("")
                }, 300)
            }
        }}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="w-full border-gray-200 hover:bg-gray-50 text-gray-700">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 h-3 w-3" /> Withdraw
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {step === "input" && (
                    <form onSubmit={handleWithdraw}>
                        <DialogHeader>
                            <DialogTitle>Withdraw from {goalTitle}</DialogTitle>
                            <DialogDescription>
                                Transfer funds from this goal to your wallet.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                                <FontAwesomeIcon icon={faSackDollar} className="h-16 w-16 text-green-500 opacity-80" />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Amount to withdraw</span>
                                    <span>Available: ₹{currentAmount}</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="pl-8 text-lg font-semibold"
                                        max={currentAmount}
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <div className="flex gap-2 justify-end mt-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="xs"
                                        className="text-xs text-blue-600 h-6"
                                        onClick={() => setAmount(currentAmount.toString())}
                                    >
                                        Withdraw Full Amount
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white border-0">
                                Confirm Withdraw
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="font-medium animate-pulse">Processing Withdrawal...</p>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-600">Withdrawal Successful</h3>
                            <p className="text-muted-foreground">₹{amount} has been transferred to your wallet.</p>
                        </div>
                        <Button onClick={() => setOpen(false)} className="mt-4 w-full">Done</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
