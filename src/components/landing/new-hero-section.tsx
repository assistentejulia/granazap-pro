"use client";

import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2, Users, TrendingUp, Zap, Star } from "lucide-react";
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

export function NewHeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Create floating particles
    const particles = Array.from({ length: 20 });

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-40 pb-20 overflow-hidden">
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
                            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000,
                            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
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
                        className="text-white space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm"
                        >
                            <MessageCircle className="w-4 h-4 text-green-300" />
                            <span className="text-sm font-semibold text-green-300">
                                Integração Total com WhatsApp
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
                        >
                            Controle financeiro com{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                                IA
                            </span>
                            {" "}direto no WhatsApp.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-blue-100/90 leading-relaxed"
                        >
                            Acompanhe gastos por mensagem, monitore suas{" "}
                            <strong className="text-white">dashboards profissionais</strong>, sem planilhas, sem complicação.
                        </motion.p>

                        {/* Feature List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 }}
                            className="space-y-3"
                        >
                            {[
                                "Fale com a Julia e ela registra tudo para você",
                                "Conta PJ e Pessoa Física no mesmo lugar",
                                "Dashboards na web e no celular",
                                "Relatórios em PDF e Excel",
                                "7 dias grátis — sem cartão"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-100/90">{feature}</span>
                                </div>
                            ))}
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
                                        Começar grátis por 7 dias
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </Button>

                            <p className="text-sm text-blue-200/80 mt-4">
                                Sem cartão • Cancelamento em 1 clique • Ativação imediata
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right - Dashboard Screenshot + Mobile Phone */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 30 }}
                        animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            {/* Glow behind */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-3xl blur-3xl scale-110" />

                            {/* Dashboard screenshot (laptop/web) */}
                            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white dark:bg-zinc-900">
                                <Image
                                    src="/screenshots/dashboard-hero.png"
                                    alt="Dashboard Completo Assistente Julia"
                                    width={900}
                                    height={600}
                                    className="w-full h-auto"
                                    priority
                                />

                                {/* Badge on Dashboard */}
                                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
                                    Dashboard Web
                                </div>
                            </div>

                            {/* Mobile Phone - Overlapping on right side */}
                            <motion.div
                                initial={{ opacity: 0, x: 40, y: 30 }}
                                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="absolute -right-12 lg:-right-20 top-1/4 w-48 lg:w-56 z-20"
                            >
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        rotateZ: [0, 2, -2, 0]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                >
                                    {/* Glow behind phone */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-3xl blur-2xl" />

                                    {/* iPhone Frame */}
                                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-800 bg-white">
                                        {/* Notch */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-3xl z-10" />

                                        {/* Mobile Screenshot */}
                                        <Image
                                            src="/screenshots/mobile-dash-1.jpeg"
                                            alt="App Mobile Dashboard"
                                            width={280}
                                            height={560}
                                            className="w-full h-auto"
                                        />
                                    </div>

                                    {/* Badge on Phone */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl whitespace-nowrap">
                                        📱 App Mobile
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>


            </div>
        </section>
    );
}
