"use client"

import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AchievementsCard } from "@/components/dashboard/achievements-card"
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
    faCalendar,
    faSpinner,
    faCheckCircle,
    faExclamationTriangle,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { PaymentModal } from "@/components/dashboard/payment-modal"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { DashboardService } from "@/services/dashboard.service"

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
    const [goals, setGoals] = useState<any[]>([])
    const [wallet, setWallet] = useState<any>(null)
    const [userProfile, setUserProfile] = useState<any>(null)
    const [streak, setStreak] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Handle Google OAuth Redirect
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
            const params = new URLSearchParams(hash.replace('#', '?')) // handle hash as query params
            const accessToken = params.get('access_token')
            if (accessToken) {
                localStorage.setItem('auth_token', accessToken)
                // Optional: Clear hash to clean up URL
                window.history.replaceState(null, '', window.location.pathname)
            }
        }

        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('auth_token')

            if (!token) {
                setError('Please login to view dashboard')
                return
            }

            // Fetch goals, wallet, user profile, and gamification data in parallel
            // Fetch aggregated dashboard data from backend (Optimized for performance)
            const data = await DashboardService.getSummary(token)

            const goalsData = data.goals
            const walletData = data.wallet
            const profileData = data.profile
            const gameData = data.gamification

            setGoals(goalsData)
            setWallet(walletData)
            setUserProfile(profileData)
            setStreak(gameData.streak || 0)
            setError(null)
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err)
            setError(err.message || 'Failed to load dashboard data')
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate stats from real data
    const totalSavings = goals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0)
    const activeGoalsCount = goals.filter(goal => goal.status === 'active').length
    const walletBalance = wallet?.balance || 0

    // UPI integration status
    const isUpiLinked = userProfile?.upi_id ? true : false
    const isUpiVerified = userProfile?.upi_verified || false
    const upiId = userProfile?.upi_id || ''

    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-gray-400 animate-spin mb-4" />
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchDashboardData}>Retry</Button>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1200px]"
        >
            {/* Hero Section */}
            <motion.div variants={item} className="flex items-start justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">CoinJar</h1>
                    <p className="text-gray-600 max-w-md">
                        Start your savings journey. Your next financial goal is here! Don't hold the ball - get it rolling.
                    </p>
                </div>
                <NotificationBell />
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
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">UPI Integration</h3>
                            {isUpiLinked && isUpiVerified && (
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg" />
                            )}
                            {isUpiLinked && !isUpiVerified && (
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 text-lg" />
                            )}
                            {!isUpiLinked && (
                                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-lg" />
                            )}
                        </div>
                        {isUpiLinked ? (
                            <>
                                <p className="text-sm text-gray-600 mb-2">
                                    UPI ID: <span className="font-medium text-gray-900">{upiId}</span>
                                </p>
                                <div className="flex items-center gap-2 mb-4">
                                    {isUpiVerified ? (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                            ✓ Verified
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                                            ⚠ Pending Verification
                                        </span>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    Manage UPI
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600 mb-4">
                                    Link your UPI ID to enable seamless withdrawals and transactions.
                                </p>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    Link UPI ID
                                </Button>
                            </>
                        )}
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
                    <p className="text-2xl font-bold text-gray-900">₹{totalSavings.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-xs" />
                        <span className="text-xs text-green-600">Active</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faBullseye} className="text-gray-400 text-sm" />
                        <p className="text-sm text-gray-600">Active Goals</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{activeGoalsCount}</p>
                    <p className="text-xs text-gray-500 mt-1">{goals.length} total</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-sm" />
                        <p className="text-sm text-gray-600">Wallet Balance</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{walletBalance.toLocaleString()}</p>
                    <Button variant="link" className="h-auto p-0 text-xs mt-1">
                        Withdraw
                    </Button>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 text-sm" />
                        <p className="text-sm text-gray-600">Saving Streak</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{streak} Days</p>
                    <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
                </div>
            </motion.div>

            {/* Gamification Section */}
            <motion.div variants={item}>
                <AchievementsCard />
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
                    {goals.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <FontAwesomeIcon icon={faBullseye} className="text-gray-400 text-xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No active goals</h3>
                            <p className="text-sm text-gray-500 mb-4">Create your first savings goal to get started.</p>
                            <CreateGoalDialog onGoalCreated={fetchDashboardData} />
                        </div>
                    ) : (
                        goals.map((goal, i) => {
                            const percent = goal.target_amount > 0
                                ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
                                : 0;

                            const daysLeft = goal.target_date
                                ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                : 0;

                            return (
                                <Card key={goal.id || i} className="border border-gray-100 bg-white hover:shadow-md transition-shadow group">
                                    <CardContent className="p-5">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faBullseye} className="text-blue-600 text-lg" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                                                    <p className="text-sm text-gray-600 capitalize">{goal.category}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FontAwesomeIcon icon={faBookmark} className="text-gray-400 text-sm" />
                                            </Button>
                                        </div>

                                        {/* Amount */}
                                        <div className="mb-3">
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-lg font-semibold text-gray-900">₹{goal.current_amount?.toLocaleString()}</p>
                                                <span className="text-sm text-gray-500">/ ₹{goal.target_amount?.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                                                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}</span>
                                            </div>

                                            {/* Daily Savings Insight */}
                                            {daysLeft > 0 && goal.target_amount > goal.current_amount && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                                    <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                                                    <span>Save ₹{Math.ceil((goal.target_amount - goal.current_amount) / daysLeft)}/day</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FontAwesomeIcon icon={faChartLine} className="text-gray-400 text-xs" />
                                                <span>{percent}% complete</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <Progress value={percent} className="h-1" />
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                Created {new Date(goal.created_at).toLocaleDateString()}
                                            </span>
                                            {/* Pass goal ID to payment modal if needed, currently generic */}
                                            <PaymentModal />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    )
                    }
                </div>
            </motion.div>
        </motion.div>
    )
}
