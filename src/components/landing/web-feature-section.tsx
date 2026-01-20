"use client";

import { Button } from "@/components/ui/button";
import { LandingLogo } from "@/components/landing/logo";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown, DollarSign, Target, Laptop } from "lucide-react";
import Link from "next/link";

export function WebFeatureSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] opacity-50" />

                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: -20 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative lg:h-[600px] flex items-center justify-center lg:justify-start perspective-1000 order-2 lg:order-1"
                    >
                        {/* Main Dashboard Panel with enhanced glassmorphism */}
                        <div className="relative w-full max-w-md aspect-[4/5] bg-[#1a1f2e]/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-3xl p-6 z-20">
                            {/* Header Fake */}
                            <div className="flex items-center justify-between mb-8 overflow-hidden rounded-xl bg-white/5 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                        <LandingLogo className="w-full h-full" />
                                    </div>
                                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>

                            {/* Cards with better contrast */}
                            <div className="space-y-4">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="bg-white/[0.03] backdrop-blur-md p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-green-500/20 rounded-lg text-green-400">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-white/60">Receitas</span>
                                        </div>
                                        <span className="text-xs text-green-400">+12%</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">R$ 5.240,00</div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="bg-white/[0.03] backdrop-blur-md p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-red-500/20 rounded-lg text-red-400">
                                                <TrendingDown className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-white/60">Despesas</span>
                                        </div>
                                        <span className="text-xs text-red-400">-5%</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white font-outfit">R$ 2.180,50</div>
                                </motion.div>
                            </div>

                            {/* Graph Area */}
                            <div className="mt-8 relative h-32 flex items-end justify-between gap-1.5 px-1">
                                {[35, 65, 40, 85, 55, 75, 45, 90, 60, 80].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.05) }}
                                        className="w-full bg-gradient-to-t from-green-500/50 to-blue-500/50 rounded-t-sm"
                                    />
                                ))}
                            </div>

                            {/* Absolute Floating Card 1: Dividendos */}
                            <motion.div
                                animate={{ y: [10, -10, 10], x: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 -right-8 bg-[#1a1f2e]/80 backdrop-blur-xl p-3.5 rounded-xl border border-white/10 shadow-2xl z-30 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/20 p-2.5 rounded-full text-green-400">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Dividendos</div>
                                        <div className="text-sm font-bold text-white">+ R$ 150,00</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Absolute Floating Card 2: Metas */}
                            <motion.div
                                animate={{ y: [-5, 5, -5], x: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-16 -left-10 bg-[#1a1f2e]/80 backdrop-blur-xl p-3.5 rounded-xl border border-white/10 shadow-2xl z-30 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-2.5 rounded-full text-blue-400">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Meta: Viagem</div>
                                        <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "70%" }}
                                                transition={{ duration: 1.5, delay: 1 }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Background Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left order-1 lg:order-2"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 backdrop-blur-sm">
                            <Laptop className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Interface Profissional</span>
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                            Controle total <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                                pela Web.
                            </span>
                        </h2>

                        <p className="text-lg text-white/60 mb-10 text-pretty leading-relaxed max-w-xl mx-auto lg:mx-0">
                            A Assistente Julia organiza suas finanças em um único lugar. Além do WhatsApp, você conta com um dashboard web de última geração para gerenciar metas, budgets e investimentos com precisão cirúrgica.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" className="h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 text-base font-bold shadow-xl shadow-green-500/20 active:scale-95 transition-all group" asChild>
                                <Link href="/cadastro" prefetch={false}>
                                    Acessar agora
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
