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
import { faRupeeSign, faQrcode, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

import { GoalsService } from "@/services/goals.service"

interface PaymentModalProps {
    goalId?: string;
    onSuccess?: () => void;
}

export function PaymentModal({ goalId, onSuccess }: PaymentModalProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [step, setStep] = useState<"input" | "processing" | "success">("input")
    const [error, setError] = useState("")

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault()
        setStep("processing")
        setError("")

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error("Not authenticated")

            // 1. Create Order
            const { PaymentsService } = await import("@/services/payments.service") // Dynamic import to avoid cycles? No, just import top level usually.
            const order = await PaymentsService.createOrder(token, parseFloat(amount))

            // 2. Load Razorpay
            const isLoaded = await loadRazorpay()
            if (!isLoaded) throw new Error("Razorpay SDK failed to load")

            // 3. Open Options
            const options = {
                key: "rzp_test_S725ahmuTOc1mm", // Ideally from env, but user gave it directly
                amount: order.amount,
                currency: order.currency,
                name: "Saving Wallet",
                description: "Goal Contribution",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        await PaymentsService.verifyPayment(token, response)
                        setStep("success")
                        if (onSuccess) onSuccess()
                    } catch (verifyErr: any) {
                        console.error(verifyErr)
                        setError(verifyErr.message || "Payment verification failed")
                        setStep("input")
                    }
                },
                prefill: {
                    name: "User", // Can fetch from profile
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#111827"
                }
            }

            const paymentObject = new (window as any).Razorpay(options)
            paymentObject.open()

            // Keep processing state until handler called
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Payment initialization failed")
            setStep("input")
        }
    }

    const handleDemoPay = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount")
            return
        }

        setStep("processing")
        setError("")

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error("Not authenticated")

            // Direct call to add savings without payment gateway
            if (goalId) {
                await GoalsService.addSavings(token, goalId, parseFloat(amount))
            } else {
                throw new Error("Goal ID is missing")
            }

            setStep("success")
            if (onSuccess) onSuccess()
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Demo payment failed")
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
                <Button size="sm" className="w-full bg-gray-900 text-white hover:bg-gray-800 border-0">
                    <FontAwesomeIcon icon={faRupeeSign} className="mr-2 h-3 w-3" /> Save Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {step === "input" && (
                    <form onSubmit={handlePay}>
                        <DialogHeader>
                            <DialogTitle>Add Money to Goal</DialogTitle>
                            <DialogDescription>
                                Instant transfer via UPI. Secure and fast.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                                <FontAwesomeIcon icon={faQrcode} className="h-24 w-24 text-muted-foreground opacity-20" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="amount" className="text-sm font-medium">
                                    Amount (₹)
                                </label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="100"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-lg font-bold text-white bg-gray-800 border-gray-700 focus:ring-gray-600"
                                />
                                {error && <p className="text-sm text-red-500">{error}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                    onClick={handleDemoPay}
                                >
                                    Demo Pay
                                </Button>
                                <Button type="submit" className="flex-1 bg-gray-900 text-white hover:bg-gray-800 border-0">
                                    Pay ₹{amount || '0'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="font-medium animate-pulse">Processing Payment...</p>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-600">Payment Successful</h3>
                            <p className="text-muted-foreground">₹{amount} added to your goal.</p>
                        </div>
                        <Button onClick={() => setOpen(false)} className="mt-4 w-full">Done</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
