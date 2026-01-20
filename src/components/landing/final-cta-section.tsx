"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function Counter({ from = 0, to, duration = 2, prefix = "", suffix = "" }: { from?: number; to: number; duration?: number; prefix?: string; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(from);

    useEffect(() => {
        if (!isInView) return;

        const controls = animate(from, to, {
            duration,
            ease: "easeOut",
            onUpdate: (value) => setCount(Math.floor(value))
        });

        return controls.stop;
    }, [isInView, from, to, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{count.toLocaleString('pt-BR')}{suffix}
        </span>
    );
}

export function FinalCtaSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Create floating particles
    const particles = Array.from({ length: 20 });

    return (
        <section ref={ref} className="relative py-32 lg:py-40 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a4f] to-[#0f172a] dark:from-[#030712] dark:via-[#0f1629] dark:to-[#030712]">
                {/* Animated gradient overlay */}
                <motion.div
                    animate={{
                        background: [
                            "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                            "radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
                            "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
                        ]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0"
                />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Floating Particles */}
                {particles.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: window.innerHeight + 100,
                            opacity: 0
                        }}
                        animate={{
                            y: -100,
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-green-400 rounded-full"
                        style={{
                            boxShadow: "0 0 10px 2px rgba(34, 197, 94, 0.5)"
                        }}
                    />
                ))}

                {/* Large Glowing Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.08, 0.15, 0.08],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[150px]"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4 text-green-300" />
                            <span className="text-sm font-semibold text-green-300">
                                Comece Hoje Mesmo
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                        >
                            Experimente a Assistente Julia{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                                por 7 dias grátis
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-blue-100/90 mb-12 leading-relaxed"
                        >
                            Junte-se a milhares de pessoas que já transformaram suas finanças
                        </motion.p>

                        {/* Stats Counters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-green-300" />
                                    </div>
                                </div>
                                <div className="text-4xl font-extrabold text-white mb-1">
                                    +<Counter to={10000} duration={2.5} suffix="" />
                                </div>
                                <div className="text-sm text-blue-200">Usuários ativos</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-blue-300" />
                                    </div>
                                </div>
                                <div className="text-4xl font-extrabold text-white mb-1">
                                    R$ <Counter to={2} duration={2} />M+
                                </div>
                                <div className="text-sm text-blue-200">Gerenciado/mês</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-purple-300" />
                                    </div>
                                </div>
                                <div className="text-4xl font-extrabold text-white mb-1">
                                    <Counter to={70} duration={2.5} />%
                                </div>
                                <div className="text-sm text-blue-200">Economia média</div>
                            </div>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                size="lg"
                                className="h-16 px-10 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 hover:from-green-500 hover:via-green-600 hover:to-emerald-600 text-white text-lg font-bold shadow-2xl shadow-green-500/40 transition-all hover:scale-105 hover:shadow-green-500/60 group relative overflow-hidden"
                                asChild
                            >
                                <Link href="/cadastro" prefetch={false}>
                                    {/* Pulse animation on button */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0, 0.5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 bg-white rounded-full"
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Zap className="w-6 h-6" />
                                        COMEÇAR GRATUITAMENTE
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </Button>

                            <p className="text-sm text-blue-200/80 mt-4">
                                ✓ Sem cartão de crédito • ✓ Sem instalação • ✓ Suporte em português
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right - Floating Phone */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                        animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotateZ: [0, 2, -2, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            {/* Glow behind phone */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-3xl blur-3xl scale-110" />

                            {/* Phone mockup */}
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-800 bg-white w-80 mx-auto">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
                                <Image
                                    src="/screenshots/mobile-dash-1.jpeg"
                                    alt="App Mobile Dashboard"
                                    width={350}
                                    height={700}
                                    className="w-full h-auto"
                                />
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 1 }}
                                className="absolute -left-12 top-1/4 bg-card/95 backdrop-blur-md border-2 border-border rounded-2xl p-4 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Novos usuários</div>
                                        <div className="text-lg font-bold text-foreground">+150 hoje</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 1.2 }}
                                className="absolute -right-12 bottom-1/3 bg-card/95 backdrop-blur-md border-2 border-border rounded-2xl p-4 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Economia</div>
                                        <div className="text-lg font-bold text-green-600 dark:text-green-400">+R$ 450</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
