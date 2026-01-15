"use client";

import { motion } from "framer-motion";
import { Zap, Database, MessageSquareText, FileText } from "lucide-react";

export function TechSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Tech Grid Background (CSS generated) */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
                        TECNOLOGIA AVANÇADA
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Inteligência por trás da simplicidade
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Nossa tecnologia trabalha em segundo plano para que você tome decisões em segundos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: MessageSquareText, title: "WhatsApp com IA", desc: "Envie áudios ou textos e a Julia registra tudo para você." },
                        { icon: Zap, title: "Tempo Real", desc: "Seus dados atualizados instantaneamente." },
                        { icon: Database, title: "Investimentos", desc: "Cotações de ações e fundos direto da B3." },
                        { icon: FileText, title: "Relatórios", desc: "Receba resumos semanais direto no seu Zap." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative p-6 rounded-2xl bg-card border border-border hover:border-violet-500/50 transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-bl-[100px] -z-0" />
                            <div className="relative z-10">
                                <item.icon className="w-10 h-10 text-violet-400 mb-4" />
                                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
