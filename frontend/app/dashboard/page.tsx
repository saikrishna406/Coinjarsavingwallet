"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from "framer-motion"
import {
    faPlane,
    faLaptop,
    faShield,
    faChartLine,
    faPlus,
    faArrowRight,
    faBookmark,
    faClock,
    faMapMarkerAlt,
    faWallet,
    faFire,
    faBullseye,
    faCalendar
} from '@fortawesome/free-solid-svg-icons'
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { PaymentModal } from "@/components/dashboard/payment-modal"

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

export default function DashboardPage() {
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1200px]"
        >
            {/* Hero Section */}
            <motion.div variants={item} className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">CoinJar</h1>
                <p className="text-gray-600 max-w-md">
                    Start your savings journey. Your next financial goal is here! Don't hold the ball - get it rolling.
                </p>
            </motion.div>

            {/* Quick Stats Cards */}
            <motion.div variants={item} className="grid md:grid-cols-2 gap-4">
                <Card className="border border-gray-100 bg-white">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Track Your Savings</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            We monitor your savings progress automatically. They are actually growing for you!
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            See Progress
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border border-gray-100 bg-white">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Get Helpful Tips</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            We have curated resources to help you get better at saving and managing money.
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            See Resources
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Stats Row */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-sm" />
                        <p className="text-sm text-gray-600">Total Savings</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹12,450</p>
                    <div className="flex items-center gap-1 mt-1">
                        <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-xs" />
                        <span className="text-xs text-green-600">+20.1%</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faBullseye} className="text-gray-400 text-sm" />
                        <p className="text-sm text-gray-600">Active Goals</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-500 mt-1">2 on track</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-sm" />
                        <p className="text-sm text-gray-600">Wallet Balance</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹450</p>
                    <Button variant="link" className="h-auto p-0 text-xs mt-1">
                        Withdraw
                    </Button>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faFire} className="text-gray-400 text-sm" />
                        <p className="text-sm text-gray-600">Saving Streak</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">12 Days</p>
                    <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
                </div>
            </motion.div>

            {/* Active Goals Section */}
            <motion.div variants={item}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Active Goals</h2>
                    <Button variant="link" className="text-sm text-gray-600 hover:text-gray-900">
                        See all goals
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            title: "Trip to Goa",
                            company: "Vacation Fund",
                            amount: "₹8,500 / ₹20,000",
                            location: "45 days left",
                            type: "Remote, Remote, India",
                            hours: "42% complete",
                            posted: "Started Apr 8, 2025",
                            percent: 42,
                            icon: faPlane,
                            color: "blue"
                        },
                        {
                            title: "New Laptop",
                            company: "Tech Upgrade",
                            amount: "₹12,000 / ₹80,000",
                            location: "120 days left",
                            type: "Hybrid, Onsite, Bangalore",
                            hours: "15% complete",
                            posted: "Started Apr 8, 2025",
                            percent: 15,
                            icon: faLaptop,
                            color: "purple"
                        },
                        {
                            title: "Emergency Fund",
                            company: "Safety Net",
                            amount: "₹45,000 / ₹50,000",
                            location: "10 days left",
                            type: "Hybrid, Onsite, Mumbai",
                            hours: "90% complete",
                            posted: "Started Apr 7, 2025",
                            percent: 90,
                            icon: faShield,
                            color: "green"
                        },
                    ].map((goal, i) => (
                        <Card key={i} className="border border-gray-100 bg-white hover:shadow-md transition-shadow group">
                            <CardContent className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                            <FontAwesomeIcon icon={goal.icon} className="text-gray-600 text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                                            <p className="text-sm text-gray-600">{goal.company}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FontAwesomeIcon icon={faBookmark} className="text-gray-400 text-sm" />
                                    </Button>
                                </div>

                                {/* Amount */}
                                <div className="mb-3">
                                    <p className="text-lg font-semibold text-gray-900">{goal.amount}</p>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
                                        <span>{goal.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                                        <span>{goal.hours}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <Progress value={goal.percent} className="h-1" />
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{goal.posted}</span>
                                    <PaymentModal />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
