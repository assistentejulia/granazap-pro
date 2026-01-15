"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileSpreadsheet, CreditCard, SearchX } from "lucide-react";

const problems = [
    {
        icon: SearchX,
        title: "Dinheiro Sumindo",
        description: "Você não sabe exatamente para onde seu dinheiro vai todo mês."
    },
    {
        icon: FileSpreadsheet,
        title: "Planilhas Caóticas",
        description: "Planilhas manuais que dão trabalho, quebram e viram bagunça."
    },
    {
        icon: CreditCard,
        title: "Cartão no Vermelho",
        description: "Várias faturas, datas diferentes e o limite sempre estourando."
    },
    {
        icon: AlertCircle,
        title: "Descontrole Total",
        description: "Finanças pessoais e contas misturadas em uma confusão diária."
    }
];

export function ProblemSection() {
    return (
        <section className="py-24 bg-background relative border-t border-border">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Parece familiar?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A maioria das pessoas vive no caos financeiro sem perceber.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card p-6 rounded-2xl border border-border hover:border-red-500/30 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                                <problem.icon className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">{problem.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {problem.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <p className="text-xl md:text-2xl font-medium text-foreground">
                        A <span className="text-blue-400">Assistente Julia</span> foi criada para acabar com isso.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
