"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { PaymentModal } from "@/components/dashboard/payment-modal"
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from "framer-motion"
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
    const goals = [
        {
            title: "Trip to Goa",
            target: 20000,
            current: 8500,
            percent: 42,
            icon: faPlane,
            status: "On Track",
            daysLeft: 45,
            category: "Travel"
        },
        {
            title: "New Laptop",
            target: 80000,
            current: 12000,
            percent: 15,
            icon: faLaptop,
            status: "Behind",
            daysLeft: 120,
            category: "Gadgets"
        },
        {
            title: "Emergency Fund",
            target: 50000,
            current: 45000,
            percent: 90,
            icon: faShield,
            status: "Almost There",
            daysLeft: 10,
            category: "Security"
        },
        {
            title: "Bike Downpayment",
            target: 30000,
            current: 5000,
            percent: 16,
            icon: faMotorcycle,
            status: "At Risk",
            daysLeft: 20,
            category: "Vehicle"
        },
    ]

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
                <CreateGoalDialog />
            </motion.div>

            <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                            </div>

                            {/* Progress Section */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">₹{goal.current.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 mt-1">of ₹{goal.target.toLocaleString()} target</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${goal.status === 'On Track' || goal.status === 'Almost There'
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
                                    <PaymentModal />
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
            </motion.div>
        </motion.div>
    )
}
