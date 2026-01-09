"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheck,
    faClock,
    faFilter,
    faSearch,
    faTrophy,
    faMoneyBillWave,
    faBullseye
} from '@fortawesome/free-solid-svg-icons'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
}

export default function ActivityPage() {
    const activities = [
        { id: 1, title: "Goal Reached!", description: "You hit your target for 'Emergency Fund'", time: "2 hours ago", icon: faTrophy, color: "text-yellow-600 bg-yellow-50", amount: null },
        { id: 2, title: "Money Added", description: "Deposit via UPI", time: "5 hours ago", icon: faMoneyBillWave, color: "text-green-600 bg-green-50", amount: "+₹5,000" },
        { id: 3, title: "Goal Created", description: "New goal 'Trip to Goa' started", time: "Yesterday", icon: faBullseye, color: "text-blue-600 bg-blue-50", amount: null },
        { id: 4, title: "Weekly Auto-save", description: "Automatic deduction for savings", time: "Yesterday", icon: faClock, color: "text-purple-600 bg-purple-50", amount: "-₹500" },
        { id: 5, title: "Withdrawal", description: "Transfer to bank account", time: "Apr 5", icon: faMoneyBillWave, color: "text-gray-600 bg-gray-50", amount: "-₹1,000" },
        { id: 6, title: "Milestone Unlocked", description: "Saved ₹1,00,000 total lifetime", time: "Apr 1", icon: faTrophy, color: "text-orange-600 bg-orange-50", amount: null },
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1200px]"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your financial journey and milestones</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <Input placeholder="Search activity..." className="pl-9 w-[200px] md:w-[260px] bg-white border-gray-200" />
                    </div>
                    <Button variant="outline" size="icon" className="border-gray-200 text-gray-500">
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </div>
            </motion.div>

            <div className="space-y-4">
                {activities.map((activity, i) => (
                    <motion.div key={activity.id} variants={item}>
                        <Card className="border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                                    <FontAwesomeIcon icon={activity.icon} className="h-4 w-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{activity.title}</h4>
                                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    {activity.amount && (
                                        <p className={`font-semibold mb-1 ${activity.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                                            }`}>{activity.amount}</p>
                                    )}
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={item} className="text-center pt-4">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    Load More History
                </Button>
            </motion.div>
        </motion.div>
    )
}
