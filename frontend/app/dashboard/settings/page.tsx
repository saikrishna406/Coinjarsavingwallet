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
import UpiLinkCard from "@/components/dashboard/upi-link-card"

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

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { UserService } from "@/services/user.service"


export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar_url: ''
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) return

            const profile = await UserService.getProfile(token)
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                avatar_url: profile.avatar_url || ''
            })
        } catch (error) {
            console.error("Failed to load profile", error)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setIsUploading(true)
            const { supabase } = await import('@/lib/supabase')

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update local state handles visual update immediately
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }))

            // Auto-save to profile
            await handleSaveProfile({ ...formData, avatar_url: publicUrl })

        } catch (error: any) {
            alert('Error uploading avatar: ' + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSaveProfile = async (dataToSave = formData) => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('auth_token')
            if (!token) return

            await UserService.updateProfile(token, dataToSave)
            alert('Profile updated successfully')
        } catch (error: any) {
            alert('Failed to update profile: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }
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
                    <CardContent className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-100">
                                    <img
                                        src={formData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || 'User'}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <span className="text-white text-xs font-medium">Change</span>
                                </div>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploading}
                                />
                            </div>
                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                <h3 className="font-medium text-black">Profile Picture</h3>
                                <p className="text-sm text-gray-500">
                                    {isUploading ? 'Uploading...' : 'Click on the image to upload a new photo. JPG, PNG or GIF.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-black">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-gray-50 border-gray-200 text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-black">Email</Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-gray-50 border-gray-200 text-black"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                className="bg-gray-900 text-white hover:bg-gray-800"
                                onClick={() => handleSaveProfile()}
                                disabled={isLoading}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2 h-3.5 w-3.5" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* UPI Payment Methods Section */}
            <motion.div variants={item}>
                <UpiLinkCard />
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
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">Change Password</Button>
                        <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">Enable 2FA</Button>
                        <Button
                            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                            onClick={() => {
                                localStorage.removeItem('auth_token')
                                window.location.href = '/auth/login'
                            }}
                        >
                            Logout
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
