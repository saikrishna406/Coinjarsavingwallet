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
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateGoalDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API
        setTimeout(() => {
            setIsLoading(false)
            setOpen(false)
            alert("Goal created successfully!")
            router.refresh()
        }, 1000)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button id="create-goal-trigger" className="bg-gray-900 text-white hover:bg-gray-800 border-0">
                    <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Create Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                    <DialogDescription>
                        Set a target and start saving small amounts automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Goal Name
                        </label>
                        <Input id="name" placeholder="e.g. New iPhone" required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                            Target Amount (₹)
                        </label>
                        <Input id="amount" type="number" placeholder="50000" required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="date" className="text-sm font-medium">
                            Target Date
                        </label>
                        <Input id="date" type="date" required />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-gray-900 text-white hover:bg-gray-800 border-0">{isLoading ? "Creating..." : "Create Goal"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
