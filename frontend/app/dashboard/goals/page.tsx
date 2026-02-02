"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { PaymentModal } from "@/components/dashboard/payment-modal"
import { WithdrawModal } from "@/components/dashboard/withdraw-modal"
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { GoalsService } from "@/services/goals.service"
import {
    faPlane,
    faLaptop,
    faShield,
    faMotorcycle,
    faPlus,
    faClock,
    faBullseye,
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchGoals = async () => {
        try {
            const token = localStorage.getItem("auth_token")
            if (!token) return
            const data = await GoalsService.getGoals(token)
            // Transform backend data to frontend model if necessary
            // Backend: { id, title, target_amount, current_amount, status, category, target_date }
            // Frontend: { title, target, current, percent, icon, status, daysLeft, category }

            const mappedGoals = data.map((g: any) => {
                const target = parseFloat(g.target_amount) || 0
                const current = parseFloat(g.current_amount) || 0
                const percent = target > 0 ? Math.round((current / target) * 100) : 0

                // Calculate days left
                const today = new Date()
                const targetDate = g.target_date ? new Date(g.target_date) : new Date()
                const diffTime = targetDate.getTime() - today.getTime()
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                return {
                    id: g.id,
                    title: g.title || g.name || 'Untitled Goal',
                    target: target,
                    current: current,
                    percent: percent,
                    icon: getIconForCategory(g.category),
                    status: g.status || 'active',
                    daysLeft: daysLeft,
                    category: g.category || 'General'
                }
            })
            setGoals(mappedGoals)
        } catch (error) {
            console.error("Failed to fetch goals", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const getIconForCategory = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'travel': return faPlane
            case 'gadgets': return faLaptop
            case 'security': return faShield
            case 'vehicle': return faMotorcycle
            default: return faBullseye
        }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1200px]"
        >
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your savings targets and track progress</p>
                </div>
                <CreateGoalDialog onGoalCreated={fetchGoals} />
            </motion.div>

            {isLoading ? (
                <div>Loading goals...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal, i) => (
                        <Card key={i} className="border border-gray-100 bg-white hover:shadow-md transition-shadow group">
                            <CardContent className="p-6">
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <FontAwesomeIcon icon={goal.icon} className="text-gray-700 text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
                                            <p className="text-sm text-gray-500">{goal.category}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                        <FontAwesomeIcon icon={faEllipsisH} />
                                    </Button>
                                    {/* Debug Info */}
                                    {/* <span className="text-xs text-red-500">{goal.id}</span> */}
                                </div>

                                {/* Progress Section */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-bold text-gray-900">₹{goal.current.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 mt-1">of ₹{goal.target.toLocaleString()} target</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${goal.status === 'active' || goal.status === 'On Track'
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                {goal.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Progress value={goal.percent} className="h-2" />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{goal.percent}% completed</span>
                                            <span className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                                {goal.daysLeft} days left
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-4 border-t border-gray-50 flex gap-3">
                                    <div className="flex-1">
                                        {goal.status === 'completed' ? (
                                            <WithdrawModal
                                                goalId={goal.id}
                                                goalTitle={goal.title}
                                                currentAmount={goal.current}
                                                onSuccess={fetchGoals}
                                            />
                                        ) : (
                                            <PaymentModal goalId={goal.id} onSuccess={fetchGoals} />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create New Goal Card */}
                    <Card className="border border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all flex flex-col items-center justify-center min-h-[300px] cursor-pointer group" onClick={() => document.getElementById('create-goal-trigger')?.click()}>
                        <div className="text-center p-6">
                            <div className="h-16 w-16 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                <FontAwesomeIcon icon={faPlus} className="text-gray-400 group-hover:text-gray-600 text-xl" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Create New Goal</h3>
                            <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Start saving for your next big dream or purchase</p>
                        </div>
                    </Card>
                </div>
            )}
        </motion.div>
    )
}
