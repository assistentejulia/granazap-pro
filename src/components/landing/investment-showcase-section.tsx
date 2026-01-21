"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Brain, Wallet, ArrowRight } from "lucide-react";
import Image from "next/image";

const steps = [
    {
        number: "1",
        icon: MessageCircle,
        title: "Você fala com a Julia no WhatsApp",
        description: "Basta enviar uma mensagem simples com seus gastos",
        gradient: "from-green-400 to-emerald-500"
    },
    {
        number: "2",
        icon: Brain,
        title: "Ela entende e registra",
        description: "Nossa IA categoriza e salva tudo automaticamente",
        gradient: "from-blue-400 to-cyan-500"
    },
    {
        number: "3",
        icon: Wallet,
        title: "Tudo organizado no painel",
        description: "Acompanhe seus relatórios e gráficos em tempo real",
        gradient: "from-purple-400 to-pink-500"
    }
];

export function InvestmentShowcaseSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    // Create floating particles
    const particles = Array.from({ length: 20 });

    return (
        <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden">
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
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm"
                    >
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Simples e Automático
                        </span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                        Veja como é <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">fácil e rápido</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Em 3 passos simples, você terá controle total das suas finanças
                    </p>
                </motion.div>

                {/* Steps Flow */}
                <div ref={ref} className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 relative">
                        {/* Connecting Lines (Desktop) */}
                        <div className="absolute top-[64px] left-0 w-full h-0.5 border-t-2 border-dashed border-white/10 hidden md:block -z-10" />

                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group relative flex-1">
                                {/* Icon Container */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    className="relative mb-8"
                                >
                                    <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#111827]/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-green-500/50 group-hover:shadow-green-500/20 group-hover:-translate-y-2`}>
                                        <step.icon className={`w-10 h-10 md:w-14 md:h-14 text-white group-hover:scale-110 transition-transform duration-500`} />

                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl rounded-3xl`} />
                                    </div>

                                    {/* Number Badge */}
                                    <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                        {step.number}
                                    </div>
                                </motion.div>

                                {/* Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                                    className="px-4"
                                >
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-blue-100/60 max-w-[200px] mx-auto leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>

                                {/* Arrow (Desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-[48px] -right-4 translate-x-1/2 z-20">
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-8 h-8 text-white/20" />
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 }}
                    className="text-center mt-20"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 backdrop-blur-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-lg font-semibold text-foreground">
                            Tudo acontece em segundos, 24 horas por dia
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
