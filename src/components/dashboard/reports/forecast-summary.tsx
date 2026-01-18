"use client";

import { motion } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

interface ForecastSummaryProps {
    data: {
        pendingIncome: number;
        pendingExpense: number;
        projectedBalance: number;
    };
}

export function ForecastSummary({ data }: ForecastSummaryProps) {
    const cards = [
        {
            title: "A Receber",
            amount: data.pendingIncome,
            icon: ArrowUpRight,
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        },
        {
            title: "A Pagar",
            amount: data.pendingExpense,
            icon: ArrowDownRight,
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/20"
        },
        {
            title: "Saldo Previsto",
            amount: data.projectedBalance,
            icon: Wallet,
            color: data.projectedBalance >= 0 ? "text-blue-500" : "text-red-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            subtitle: "Saldo Atual + Receitas - Despesas"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                        "bg-card border rounded-xl p-6 relative overflow-hidden group hover:shadow-md transition-all",
                        "border-border/50"
                    )}
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className={cn("p-1.5 rounded-lg", card.bg)}>
                                <card.icon className={cn("w-4 h-4", card.color)} />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">{card.title}</span>
                        </div>
                        <p className={cn("text-2xl font-bold font-mono", card.color)}>
                            {formatCurrency(card.amount)}
                        </p>
                        {card.subtitle && (
                            <p className="text-[10px] text-muted-foreground mt-1 opacity-70">
                                {card.subtitle}
                            </p>
                        )}
                    </div>
                    {/* Glow Effect */}
                    <div className={cn("absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity", card.bg.replace('/10', ''))} />
                </motion.div>
            ))}
        </div>
    );
}
