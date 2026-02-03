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
import { motion } from "framer-motion"

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
                <Button size="sm" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 border-0 shadow-sm transition-all hover:scale-[1.02]">
                    <FontAwesomeIcon icon={faRupeeSign} className="mr-2 h-3.5 w-3.5" /> Save Now
                </Button>
            </DialogTrigger>

            {/* Glassmorphism Container Override */}
            <DialogContent className="sm:max-w-[380px] p-0 border-0 bg-transparent shadow-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5"
                >

                    {/* Background Noise/Glow Effects */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-[50px] pointer-events-none"
                    ></motion.div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-[50px] pointer-events-none"
                    ></motion.div>

                    {step === "input" && (
                        <form onSubmit={handlePay} className="relative z-10 p-6 flex flex-col h-full">

                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-center mb-8"
                            >
                                <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-inner">
                                    <FontAwesomeIcon icon={faRupeeSign} className="text-blue-400 text-xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Add Amount</h2>
                                <p className="text-white/50 text-sm mt-1">Enter amount to save</p>
                            </motion.div>

                            {/* Input Area */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative mb-6 group"
                            >
                                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-4 transition-all group-focus-within:bg-white/10 group-focus-within:border-blue-500/50">
                                    <span className="text-2xl text-white/50 mr-2">₹</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        required
                                        autoFocus
                                        value={amount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length < 8) setAmount(val);
                                        }}
                                        className="h-10 border-0 bg-transparent text-3xl font-bold text-white placeholder:text-white/20 p-0 focus-visible:ring-0 w-full"
                                    />
                                </div>
                            </motion.div>

                            {/* Presets */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-4 gap-2 mb-8"
                            >
                                {[100, 500, 1000, 2000].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className="px-2 py-3 text-xs font-medium text-white/70 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-white transition-all active:scale-95"
                                    >
                                        +₹{val}
                                    </button>
                                ))}
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl text-center backdrop-blur-md"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Action Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-md font-semibold shadow-lg shadow-blue-900/20 border-t border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={!amount || parseFloat(amount) <= 0}
                                >
                                    Pay ₹{amount || '0'}
                                </Button>
                            </motion.div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 flex items-center justify-center gap-1.5 opacity-50"
                            >
                                <FontAwesomeIcon icon={faQrcode} className="text-[10px] text-white" />
                                <span className="text-[10px] uppercase tracking-widest text-white font-medium">Secured by Razorpay</span>
                            </motion.div>
                        </form>
                    )}

                    {step === "processing" && (
                        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6 text-center text-white">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative h-20 w-20 mb-6"
                            >
                                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-lg font-bold"
                            >
                                Processing...
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/50 text-sm mt-2"
                            >
                                Please verify on your UPI app
                            </motion.p>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="relative z-10 flex flex-col items-center justify-center py-12 px-6 text-center text-white">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="h-20 w-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                            >
                                <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-400" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-2xl font-bold">Payment Success!</h3>
                                <p className="text-white/60 mt-2">₹{amount} added to your goal.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full"
                            >
                                <Button
                                    onClick={() => setOpen(false)}
                                    className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl backdrop-blur-md"
                                >
                                    Close
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
