"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faQuestionCircle,
    faEnvelope,
    faPhone,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

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

export default function HelpPage() {
    const faqs = [
        { q: "How do I create a new savings goal?", a: "You can create a new goal by clicking the 'New Goal' button on your dashboard. Enter the target amount and deadline to get started." },
        { q: "Is my money safe?", a: "Yes, CoinJar uses bank-grade security and encryption to ensure your funds and data are protected at all times." },
        { q: "How can I withdraw my funds?", a: "Go to your Wallet page and click 'Withdraw'. Funds typically arrive in your bank account within 2-3 business days." },
        { q: "Can I pause a goal?", a: "Absolutely. You can pause contributions to any goal from the goal details page and resume whenever you're ready." },
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1000px]"
        >
            {/* Header */}
            <motion.div variants={item} className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                <p className="text-sm text-gray-500 mt-1">Get answers to your questions and support</p>
            </motion.div>

            <motion.div variants={item} className="grid md:grid-cols-3 gap-8">
                {/* FAQs */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-gray-100">
                                    <AccordionTrigger className="text-gray-700 hover:text-gray-900 hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-500">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                {/* Contact Options */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h2>

                    <Card className="border border-gray-100 bg-white hover:border-gray-200 transition-colors shadow-none cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">Email Us</p>
                                    <p className="text-gray-500">support@coinjar.com</p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 group-hover:text-gray-500 transition-colors text-xs" />
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 bg-white hover:border-gray-200 transition-colors shadow-none cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">Call Us</p>
                                    <p className="text-gray-500">+91 1800-123-4567</p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 group-hover:text-gray-500 transition-colors text-xs" />
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 text-white border-0 shadow-lg">
                        <CardContent className="p-6 text-center">
                            <div className="h-12 w-12 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faQuestionCircle} className="text-white text-xl" />
                            </div>
                            <h3 className="font-semibold mb-1">Still need help?</h3>
                            <p className="text-sm text-gray-400 mb-4">Our support team is available 24/7 to assist you.</p>
                            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">Chat with Support</Button>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </motion.div>
    )
}
