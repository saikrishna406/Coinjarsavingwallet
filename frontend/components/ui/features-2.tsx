"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MonitorPlay, Settings2, ShieldCheck, Sparkles, Target, Wallet, Zap } from 'lucide-react'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import BlurText from './blur-text'

export function Features() {
    return (
        <section className="py-16 md:py-32">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center flex flex-col items-center">
                    <BlurText
                        text="Everything you need to grow your wealth"
                        className="text-balance text-4xl font-semibold lg:text-5xl justify-center mb-2"
                        delay={100}
                        animateBy="words"
                        direction="top"
                    />
                    <BlurText
                        text="Smart tools designed to help you save effortlessly and reach your financial goals faster."
                        className="mt-4 text-muted-foreground justify-center"
                        delay={50}
                        animateBy="words"
                        direction="top"
                    />
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Card className="group border-0 bg-muted shadow-none h-full">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    <Target className="size-6 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden />
                                </CardDecorator>

                                <h3 className="mt-6 font-medium">Goal-Based Savings</h3>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm">Create custom goals for travel, gadgets, or rainy days. Track your progress visually with our intuitive dashboard.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Card className="group border-0 bg-muted shadow-none h-full">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    <Wallet className="size-6 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden />
                                </CardDecorator>

                                <h3 className="mt-6 font-medium">UPI Autopay</h3>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm">Seamlessly link your UPI for automatic daily or weekly savings. No manual deposits needed.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Card className="group border-0 bg-muted shadow-none h-full">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    <ShieldCheck className="size-6 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden />
                                </CardDecorator>

                                <h3 className="mt-6 font-medium">Bank Grade Security</h3>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm">Your money is safe. We use industry-standard encryption and RBI compliant flows to ensure your data is protected.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">{children}</div>
    </div>
)
