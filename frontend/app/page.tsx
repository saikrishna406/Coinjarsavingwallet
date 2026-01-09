import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import Silk from "@/components/silk-canvas"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { Features } from "@/components/ui/features-2"
import { Timeline } from "@/components/ui/timeline"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { Github, Linkedin, Mail, Twitter, Coins } from "lucide-react"

import BlurText from "@/components/ui/blur-text"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <FloatingNav
        navItems={[
          {
            name: "Features",
            link: "#features",
            icon: <TrendingUp className="h-4 w-4 text-neutral-500 dark:text-white" />,
          },
          {
            name: "How it Works",
            link: "#how-it-works",
            icon: <Wallet className="h-4 w-4 text-neutral-500 dark:text-white" />,
          }
        ]}
      />
      <main className="flex-1">
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <Silk color="#5227ff" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 flex flex-col items-center">
                <BlurText
                  text="Savings. Reimagined."
                  className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-balance text-foreground justify-center"
                  delay={150}
                  animateBy="words"
                  direction="top"
                />
                <BlurText
                  text="The smart way to turn small change into big dreams."
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-2xl font-medium justify-center"
                  delay={100}
                  animateBy="words"
                  direction="top"
                />
              </div>
              <div className="space-x-4 flex items-center justify-center">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    Start Saving Now
                  </span>
                </ShimmerButton>
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        <Features />

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <BlurText
                text="How It Works"
                className="text-3xl font-bold tracking-tighter sm:text-5xl text-balance text-white justify-center"
                delay={150}
                animateBy="words"
                direction="top"
              />
              <BlurText
                text="Start saving in just 3 simple steps."
                className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed justify-center"
                delay={100}
                animateBy="words"
                direction="top"
              />
            </div>

            <Timeline
              data={[
                {
                  title: "1. Link UPI",
                  content: (
                    <div key="link-upi">
                      <p className="text-neutral-400 text-xs md:text-sm font-normal mb-8">
                        Securely link your UPI ID. We support all major UPI apps like Google Pay, PhonePe, and Paytm.
                        Your data is encrypted and safe.
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        <img
                          src="https://f46fa3330-0d09-45d1-8e35-244dfb6a84a7.files.usr.usercontent.goog/upi_link_illustration_1767872618933.png"
                          alt="Link UPI"
                          width={500}
                          height={500}
                          className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  title: "2. Set Goals",
                  content: (
                    <div key="set-goals">
                      <p className="text-neutral-400 text-xs md:text-sm font-normal mb-8">
                        Create savings jars for your dreams. Whether it's a new iPhone, a trip to Bali, or an emergency fund.
                        Set a target amount and deadline.
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        <img
                          src="https://f46fa3330-0d09-45d1-8e35-244dfb6a84a7.files.usr.usercontent.goog/savings_goal_illustration_1767872636062.png"
                          alt="Set Goals"
                          width={500}
                          height={500}
                          className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  title: "3. Auto-Save",
                  content: (
                    <div key="auto-save">
                      <p className="text-neutral-400 text-xs md:text-sm font-normal mb-8">
                        Enable auto-pay and let CoinJar handle the rest. We'll automatically deduct small amounts daily or weekly
                        based on your preferences. Watch your wealth grow!
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        <img
                          src="https://f46fa3330-0d09-45d1-8e35-244dfb6a84a7.files.usr.usercontent.goog/auto_save_illustration_1767872665455.png"
                          alt="Auto Save"
                          width={500}
                          height={500}
                          className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>
      </main>
      <MinimalFooter />
    </div>
  )
}
