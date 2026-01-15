"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, CreditCard, Wallet, LineChart } from "lucide-react";

const solutions = [
    {
        icon: ArrowLeftRight,
        title: "Entradas e Saídas",
        description: "Visualize tudo o que entra e sai em tempo real, sem esforço manual.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: CreditCard,
        title: "Gestão de Cartões",
        description: "Controle faturas, limites e datas de compra para não ter surpresas.",
        gradient: "from-purple-500 to-violet-500"
    },
    {
        icon: Wallet,
        title: "Todas as Contas",
        description: "Centralize Santander, Nubank, Itaú e muito mais em um único painel.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: LineChart,
        title: "Fluxo de Caixa",
        description: "Saiba exatamente sua previsão financeira para hoje, amanhã e o futuro.",
        gradient: "from-orange-500 to-amber-500"
    }
];

export function SolutionSection() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Como a Julia te ajuda
                    </h2>
                    <p className="text-muted-foreground">
                        Ferramentas poderosas para simplificar sua vida.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {solutions.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-6 bg-card p-6 lg:p-8 rounded-2xl border border-border shadow-lg group hover:bg-accent transition-colors"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5 shadow-lg`}>
                                <div className="w-full h-full bg-card rounded-xl flex items-center justify-center group-hover:bg-opacity-90 transition-all">
                                    <item.icon className="w-6 h-6 text-foreground" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
