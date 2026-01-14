"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#0A0F1C]">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-medium text-blue-400">Controle Financeiro Inteligente</span>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Controle seu dinheiro <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            sem complicação.
                        </span>
                    </h1>

                    <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto lg:mx-0">
                        A Assistente Julia organiza suas finanças pessoais em um único lugar — entradas, saídas, cartões, contas e investimentos, tudo em tempo real.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Button size="lg" className="w-full sm:w-auto h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 text-base shadow-lg shadow-blue-600/20" asChild>
                            <Link href="/cadastro">
                                Criar conta gratuita
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative lg:h-[600px] flex items-center justify-center -mr-20 lg:mr-0 perspective-1000"
                >
                    {/* Main Dashboard Panel */}
                    <div className="relative w-full max-w-md aspect-[4/5] bg-[#111827] rounded-3xl border border-white/10 shadow-2xl p-6 overflow-hidden z-20">
                        {/* Header Fake */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                                <div className="h-2 w-24 bg-white/10 rounded-full" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5" />
                        </div>

                        {/* Cards */}
                        <div className="space-y-4">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-[#1F2937] p-4 rounded-xl border border-white/5"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-green-500/20 rounded-lg text-green-500">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-zinc-400">Receitas</span>
                                    </div>
                                    <span className="text-xs text-green-500">+12%</span>
                                </div>
                                <div className="text-2xl font-bold text-white">R$ 5.240,00</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="bg-[#1F2937] p-4 rounded-xl border border-white/5"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-red-500/20 rounded-lg text-red-500">
                                            <TrendingDown className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-zinc-400">Despesas</span>
                                    </div>
                                    <span className="text-xs text-green-500">-5%</span>
                                </div>
                                <div className="text-2xl font-bold text-white">R$ 2.180,50</div>
                            </motion.div>
                        </div>

                        {/* Graph Area */}
                        <div className="mt-8 relative h-32 flex items-end justify-between gap-2 px-2">
                            {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                    className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400/50 rounded-t-sm"
                                />
                            ))}
                        </div>

                        {/* Absolute Floating Card 1: Dividendos */}
                        <motion.div
                            animate={{ y: [10, -10, 10], x: [0, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 -right-8 bg-[#1F2937] p-3 rounded-lg border border-white/10 shadow-xl backdrop-blur-sm z-30"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-400">Dividendos</div>
                                    <div className="text-sm font-bold text-white">+ R$ 150,00</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Absolute Floating Card 2: Metas (New) */}
                        <motion.div
                            animate={{ y: [-5, 5, -5], x: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute bottom-20 -left-6 bg-[#1F2937] p-3 rounded-lg border border-white/10 shadow-xl backdrop-blur-sm z-30"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500/20 p-2 rounded-full text-purple-500">
                                    <Target className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-400">Meta: Viagem</div>
                                    <div className="w-24 h-1.5 bg-zinc-700 rounded-full mt-1.5">
                                        <div className="h-full w-[70%] bg-purple-500 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Background Phone/Glow Effect */}
                    <div className="absolute top-0 right-[-10%] w-[300px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
