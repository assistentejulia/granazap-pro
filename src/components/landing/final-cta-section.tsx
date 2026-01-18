"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export function FinalCtaSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-muted/50 to-background dark:from-black dark:via-[#1a0b2e] dark:to-black">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-[150px]"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 backdrop-blur-sm"
                    >
                        <Sparkles className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">
                            Comece Hoje Mesmo
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight"
                    >
                        Comece Sua Jornada
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-blue-500 animate-gradient">
                            Financeira Hoje
                        </span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Junte-se a mais de 10.000 pessoas que já transformaram suas finanças com a Assistente Julia
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                    >
                        <Button
                            size="lg"
                            className="h-16 px-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold shadow-2xl shadow-green-500/40 transition-all hover:scale-110 hover:shadow-green-500/60 group"
                            asChild
                        >
                            <Link href="/cadastro" prefetch={false}>
                                CRIAR MINHA CONTA AGORA
                                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Guarantee */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-3 text-muted-foreground"
                    >
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="text-sm">
                            Garantia de 7 dias ou seu dinheiro de volta
                        </span>
                    </motion.div>

                    {/* Features List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto"
                    >
                        {[
                            {
                                icon: "⚡",
                                title: "Ativação Instantânea",
                                description: "Comece a usar em segundos"
                            },
                            {
                                icon: "🔒",
                                title: "100% Seguro",
                                description: "Seus dados protegidos"
                            },
                            {
                                icon: "💚",
                                title: "Suporte Dedicado",
                                description: "Estamos aqui para ajudar"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="text-foreground font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
        </section>
    );
}
