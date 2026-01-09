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
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export default function VerifyCardSection() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState("1234567897"); // Default for demo
    const router = useRouter();

    useEffect(() => {
        const storedPhone = localStorage.getItem("demo_phone");
        if (storedPhone) {
            setPhone(storedPhone);
        }
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const rawPhone = phone;
            const fullPhone = "91" + rawPhone; // Ensure matching prefix

            const res = await fetch('http://localhost:3002/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: fullPhone,
                    token: otp,
                    type: 'phone'
                })
            });

            if (res.ok) {
                const data = await res.json();
                // Store Auth Token
                localStorage.setItem("auth_token", data.access_token);
                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                const data = await res.json();
                alert("Verification failed: " + (data.message || "Invalid OTP"));
            }
        } catch (error) {
            console.error("Verify error", error);
            alert("Verification failed: Network error");
        } finally {
            setIsLoading(false);
        }
    };

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

            {/* Animated accent lines */}
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

            {/* Header */}
            <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 z-10">
                <span className="text-xs tracking-[0.14em] uppercase text-zinc-400">
                    NOVA
                </span>
                <Button
                    variant="outline"
                    className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80"
                >
                    <span className="mr-2">Contact</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </header>

            {/* Centered Verify Card */}
            <div className="relative z-10 w-full px-4 flex items-center justify-center">
                <Card className="card-animate w-full max-w-sm border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 shadow-2xl">
                    <CardHeader className="text-center space-y-1">
                        <div className="flex justify-center mb-0">
                            <TrendingUp className="h-6 w-6 text-zinc-50" />
                        </div>
                        <CardTitle className="text-2xl mt-4">Verify OTP</CardTitle>
                        <CardDescription className="text-zinc-400">
                            We've sent a code to <span className="font-medium text-zinc-200">+91 {phone}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} className="border-zinc-700 text-zinc-50" />
                                        <InputOTPSlot index={1} className="border-zinc-700 text-zinc-50" />
                                        <InputOTPSlot index={2} className="border-zinc-700 text-zinc-50" />
                                        <InputOTPSlot index={3} className="border-zinc-700 text-zinc-50" />
                                        <InputOTPSlot index={4} className="border-zinc-700 text-zinc-50" />
                                        <InputOTPSlot index={5} className="border-zinc-700 text-zinc-50" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <Button
                                className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 transition-colors"
                                type="submit"
                                disabled={isLoading || otp.length < 6}
                            >
                                {isLoading ? "Verifying..." : "Verify & Continue"}
                            </Button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-sm text-zinc-400 hover:text-zinc-200 hover:underline"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
