"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faBell,
    faLock,
    faCreditCard,
    faSave
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function SettingsPage() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1000px]"
        >
            {/* Header */}
            <motion.div variants={item} className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-black">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account preferences and profile</p>
            </motion.div>

            {/* Profile Section */}
            <motion.div variants={item}>
                <Card className="border border-gray-100 bg-white shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-black">
                                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-black">Profile Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-black">Full Name</Label>
                                <Input id="name" defaultValue="Saikrishna" className="bg-gray-50 border-gray-200 text-black" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-black">Email</Label>
                                <Input id="email" defaultValue="sai@example.com" className="bg-gray-50 border-gray-200 text-black" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
                                <FontAwesomeIcon icon={faSave} className="mr-2 h-3.5 w-3.5" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications Section */}
            <motion.div variants={item}>
                <Card className="border border-gray-100 bg-white shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-black">
                                <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-black">Notifications</CardTitle>
                                <CardDescription>Choose what you want to be notified about</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium text-black">Goal Updates</Label>
                                <p className="text-sm text-gray-500">Receive alerts when you reach milestones</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="py-2 border-t border-gray-100"></div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium text-black">Weekly Report</Label>
                                <p className="text-sm text-gray-500">Get a summary of your spending and savings</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div variants={item}>
                <Card className="border border-gray-100 bg-white shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-black">
                                <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-black">Security</CardTitle>
                                <CardDescription>Manage your password and authentication</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full sm:w-auto border-gray-200 text-black hover:bg-gray-50">Change Password</Button>
                        <Button variant="outline" className="w-full sm:w-auto border-gray-200 ml-0 sm:ml-4 mt-2 sm:mt-0 text-black hover:bg-gray-50">Enable 2FA</Button>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
