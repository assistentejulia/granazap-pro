"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown, DollarSign, Target, Laptop } from "lucide-react";
import Link from "next/link";

export function WebFeatureSection() {
    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Dashboard Mockup (Visual) - Order 2 on mobile, 1 on desktop if we want text right, but let's keep text left for variety or alternate? 
                        The user liked the previous layout which was Text Left, Image Right. 
                        Let's mirror it or keep it similar?
                        The previous hero was Text Left, Image Right.
                        The new Hero (WhatsApp) is Text Left, Image Right.
                        Maybe we switch here? Text Right, Image Left?
                        Let's try Image Left (Mockup), Text Right.
                    */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative lg:h-[600px] flex items-center justify-center lg:justify-start perspective-1000 order-2 lg:order-1"
                    >
                        {/* Main Dashboard Panel */}
                        <div className="relative w-full max-w-md aspect-[4/5] bg-card rounded-3xl border border-border shadow-2xl p-6 z-20">
                            {/* Header Fake */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                                    <div className="h-2 w-24 bg-muted rounded-full" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-muted" />
                            </div>

                            {/* Cards */}
                            <div className="space-y-4">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="bg-muted/50 p-4 rounded-xl border border-border"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-green-500/20 rounded-lg text-green-500">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">Receitas</span>
                                        </div>
                                        <span className="text-xs text-green-500">+12%</span>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">R$ 5.240,00</div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="bg-muted/50 p-4 rounded-xl border border-border"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-red-500/20 rounded-lg text-red-500">
                                                <TrendingDown className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">Despesas</span>
                                        </div>
                                        <span className="text-xs text-green-500">-5%</span>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">R$ 2.180,50</div>
                                </motion.div>
                            </div>

                            {/* Graph Area */}
                            <div className="mt-8 relative h-32 flex items-end justify-between gap-2 px-2">
                                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}% ` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400/50 rounded-t-sm"
                                    />
                                ))}
                            </div>

                            {/* Absolute Floating Card 1: Dividendos */}
                            <motion.div
                                animate={{ y: [10, -10, 10], x: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 -right-8 bg-card p-3 rounded-lg border border-border shadow-xl backdrop-blur-sm z-30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Dividendos</div>
                                        <div className="text-sm font-bold text-foreground">+ R$ 150,00</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Absolute Floating Card 2: Metas */}
                            <motion.div
                                animate={{ y: [-5, 5, -5], x: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-20 -left-6 bg-card p-3 rounded-lg border border-border shadow-xl backdrop-blur-sm z-30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500/20 p-2 rounded-full text-purple-500">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Meta: Viagem</div>
                                        <div className="w-24 h-1.5 bg-muted rounded-full mt-1.5">
                                            <div className="h-full w-[70%] bg-purple-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Background Glow Effect */}
                        <div className="absolute top-0 left-[-10%] w-[300px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left order-1 lg:order-2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                            <Laptop className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Dashboards Completos</span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                            Controle avançado <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                                pela Web.
                            </span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 text-pretty">
                            A Assistente Julia organiza suas finanças pessoais em um único lugar. Além da praticidade do WhatsApp, você tem acesso a um painel web completo para gerenciar metas, budgets, investimentos e relatórios profundos.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" className="h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 text-base shadow-lg shadow-blue-600/20" asChild>
                                <Link href="/cadastro" prefetch={false}>
                                    Criar conta Web
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
