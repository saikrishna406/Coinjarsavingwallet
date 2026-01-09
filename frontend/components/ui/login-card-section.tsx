"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Eye,
    EyeOff,
    Github,
    Lock,
    Mail,
    ArrowRight,
    Chrome,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginCardSection() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Using 'email' state variable which now holds phone number
            const phone = "91" + email; // Prefix country code if needed, assuming user enters 10 digits

            const res = await fetch('http://localhost:3002/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (res.ok) {
                // Store phone for verify page
                localStorage.setItem("demo_phone", email); // Store without prefix for display, or with prefix for API?
                // Let's store raw value for display, add prefix in verify step

                router.push("/auth/verify");
            } else {
                const data = await res.json();
                alert("Error sending OTP: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Login error", error);
            alert("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    // Canvas Logic for Particles
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId = 0;
        type Particle = { x: number; y: number; v: number; o: number };
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 9000);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    v: Math.random() * 0.25 + 0.05,
                    o: Math.random() * 0.35 + 0.15,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.y -= p.v;
                if (p.y < 0) {
                    p.x = Math.random() * canvas.width;
                    p.y = canvas.height + Math.random() * 40;
                    p.v = Math.random() * 0.25 + 0.05;
                    p.o = Math.random() * 0.35 + 0.15;
                }
                ctx.fillStyle = `rgba(250,250,250,${p.o})`;
                ctx.fillRect(p.x, p.y, 0.7, 2.2);
            });
            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-50 overflow-hidden">
            {/* Back button */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
            </Link>
            <style>{`
        /* Animated accent lines */
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}

        /* Card fade-up animation */
        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

            {/* Animated accent lines (Optional, kept from original design) */}
            <div className="accent-lines">
                <div className="hline" />
                <div className="hline" />
                <div className="hline" />
                <div className="vline" />
                <div className="vline" />
                <div className="vline" />
            </div>

            {/* Particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none"
            />

            {/* Centered Login Card */}
            <div className="relative z-10 w-full px-4 flex items-center justify-center">
                <Card className="card-animate w-full max-w-sm border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-5">
                        <form onSubmit={handleLogin} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-zinc-300">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    {/* Using Mail icon as placeholder or import Phone if exists */}
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 flex items-center justify-center font-bold text-xs" >+91</div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="9876543210"
                                        className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                                        value={email} // Using email state variable for phone to minimize changes, effectively 'phone'
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                            </div>

                            {/* Password section removed as we are doing OTP flow */}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
                                    />
                                    <Label htmlFor="remember" className="text-zinc-400 cursor-pointer">
                                        Remember me
                                    </Label>
                                </div>
                            </div>

                            <Button
                                className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 transition-colors"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending OTP..." : "Continue"}
                            </Button>
                        </form>

                        <div className="relative">
                            <Separator className="bg-zinc-800" />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-widest text-zinc-500">
                                or
                            </span>
                        </div>

                        <div className="flex justify-center w-full">
                            <Button
                                variant="outline"
                                className="w-full h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80 transition-colors"
                            >
                                <Chrome className="h-4 w-4 mr-2" />
                                Google
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
                        Don’t have an account?
                        <Link className="ml-1 text-zinc-200 hover:underline" href="/auth/register">
                            Create one
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
