"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, Wallet, DollarSign, PieChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function InvestmentShowcaseSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-black via-[#0A0F1C] to-[#1a0b2e]">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-400">
                            Gestão de Investimentos
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
                        Seus Investimentos
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            em Tempo Real
                        </span>
                    </h2>

                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Acompanhe ações, FIIs, ETFs, renda fixa, criptomoedas e BDRs com atualização automática de preços
                    </p>
                </motion.div>

                {/* Dashboard Mockup */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />

                        {/* Dashboard Image */}
                        <div className="relative">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Image
                                    src="/dashboard_investments_julia.png"
                                    alt="Dashboard de Investimentos - Assistente Julia"
                                    width={700}
                                    height={600}
                                    className="rounded-2xl shadow-2xl border border-white/10"
                                />
                            </motion.div>

                            {/* Floating Stats */}
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                                className="absolute -top-6 -right-6 bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400">Lucro Total</div>
                                        <div className="text-lg font-bold text-green-400">+R$ 17.784,50</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, -12, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                                className="absolute -bottom-6 -left-6 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <PieChart className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400">Total de Ativos</div>
                                        <div className="text-lg font-bold text-white">12 ativos</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right - Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Feature 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Portfólio Completo
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Visualize todos os seus investimentos em um único lugar com valores atualizados em tempo real
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Análise de Rentabilidade
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Acompanhe lucros, prejuízos e rentabilidade percentual de cada ativo automaticamente
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Controle de Dividendos
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Registre e acompanhe todos os dividendos recebidos de FIIs e ações com histórico completo
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                                <PieChart className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Distribuição de Ativos
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Veja a distribuição do seu portfólio por tipo de ativo com gráficos interativos e percentuais
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            <Button
                                size="lg"
                                className="h-12 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl shadow-purple-500/20 transition-all hover:scale-105 group"
                                asChild
                            >
                                <Link href="/cadastro">
                                    Começar a Investir Melhor
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Supported Assets */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 text-center"
                >
                    <p className="text-zinc-500 text-sm mb-6">Tipos de ativos suportados:</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {[
                            { name: "Ações", color: "blue" },
                            { name: "FIIs", color: "green" },
                            { name: "ETFs", color: "purple" },
                            { name: "Renda Fixa", color: "yellow" },
                            { name: "Criptomoedas", color: "orange" },
                            { name: "BDRs", color: "cyan" },
                        ].map((asset, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`px-4 py-2 rounded-full bg-${asset.color}-500/10 border border-${asset.color}-500/20 text-${asset.color}-400 text-sm font-medium`}
                            >
                                {asset.name}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
