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
// import { useRouter } from "next/navigation"
import { GoalsService } from "@/services/goals.service"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateGoalDialogProps {
    onGoalCreated?: () => void
}

export function CreateGoalDialog({ onGoalCreated }: CreateGoalDialogProps) {
    const [open, setOpen] = useState(false)
    // const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        target_amount: "",
        current_amount: "0",
        target_date: "",
        category: "General"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleCategoryChange = (value: string) => {
        setFormData({ ...formData, category: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const token = localStorage.getItem("auth_token")
            if (!token) {
                alert("You are not logged in")
                return
            }

            await GoalsService.createGoal(token, {
                title: formData.title,
                target_amount: parseFloat(formData.target_amount),
                current_amount: parseFloat(formData.current_amount || '0'),
                target_date: formData.target_date,
                category: formData.category
            })

            setOpen(false)
            setFormData({
                title: "",
                target_amount: "",
                current_amount: "0",
                target_date: "",
                category: "General"
            })

            if (onGoalCreated) {
                onGoalCreated()
            } else {
                // Fallback if not passed
                window.location.reload()
            }

        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to create goal")
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate daily savings
    const calculateDailySavings = () => {
        if (!formData.target_amount || !formData.target_date) return null;

        const target = parseFloat(formData.target_amount);
        const current = parseFloat(formData.current_amount || '0');
        const remaining = Math.max(0, target - current);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(formData.target_date);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days remaining

        if (diffDays <= 0) return null;

        const daily = remaining / diffDays;

        return {
            days: diffDays,
            daily: Math.ceil(daily)
        };
    }

    const savingsPlan = calculateDailySavings();

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
                        <Label htmlFor="title" className="text-sm font-medium">
                            Goal Name
                        </Label>
                        <Input id="title" placeholder="e.g. New iPhone" required value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="target_amount" className="text-sm font-medium">
                            Target Amount (₹)
                        </Label>
                        <Input id="target_amount" type="number" placeholder="50000" required value={formData.target_amount} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="current_amount" className="text-sm font-medium">
                            Initial Savings (Optional)
                        </Label>
                        <Input id="current_amount" type="number" placeholder="0" value={formData.current_amount} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="target_date" className="text-sm font-medium">
                            Target Date
                        </Label>
                        <Input id="target_date" type="date" required value={formData.target_date} onChange={handleChange} />
                    </div>

                    {/* Daily Savings Calculator Insight */}
                    {savingsPlan && (
                        <div className="rounded-lg bg-blue-50 p-3 border border-blue-100 text-sm text-blue-800 flex flex-col gap-1">
                            <span className="font-semibold">💡 Savings Plan:</span>
                            <span>
                                To reach your goal in <strong>{savingsPlan.days} days</strong>, you need to save approximately
                                <span className="font-bold text-blue-600 bg-blue-100 px-1 rounded ml-1">₹{savingsPlan.daily}/day</span>.
                            </span>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="category" className="text-sm font-medium">
                            Category
                        </Label>
                        <Select onValueChange={handleCategoryChange} defaultValue="General">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Travel">Travel</SelectItem>
                                <SelectItem value="Gadgets">Gadgets</SelectItem>
                                <SelectItem value="Vehicle">Vehicle</SelectItem>
                                <SelectItem value="Security">Security</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-gray-900 text-white hover:bg-gray-800 border-0">{isLoading ? "Creating..." : "Create Goal"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
