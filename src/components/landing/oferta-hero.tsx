"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Shield, Zap, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function OfertaHero() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-white dark:bg-[#030712]">
            {/* Disruptive Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10" />
                
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Urgency Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm"
                    >
                        <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">
                            Lançamento: 3 Meses Grátis no Plano Anual
                        </span>
                    </motion.div>

                    {/* Aggressive but Honest Headline */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white leading-tight tracking-tight"
                    >
                        Simplifique sua vida. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-400 dark:to-blue-500">
                            Economize tempo e dinheiro.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Use a tecnologia da Júlia no seu WhatsApp para organizar suas finanças sem esforço. Aproveite a oferta de lançamento e garanta 1 ano de controle absoluto.
                    </motion.p>

                    {/* Authority Points - Focused on Tech and Security */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-6 pt-4"
                    >
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <Shield className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-bold tracking-wide">Segurança Bancária</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-bold tracking-wide">IA de Última Geração</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-bold tracking-wide">Ativação Imediata</span>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="pt-12"
                    >
                        <Link href="#pricing-compare" className="text-zinc-400 dark:text-zinc-500 hover:text-green-500 transition-colors">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs uppercase font-bold tracking-[0.2em]">Ver Planos</span>
                                <ArrowRight className="w-5 h-5 rotate-90" />
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
