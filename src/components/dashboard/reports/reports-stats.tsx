import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReportsStatsProps {
    stats: {
        income: number;
        expenses: number;
        balance: number;
        savingsRate: number;
        incomeCount: number;
        expensesCount: number;
    };
    loading?: boolean;
}

export function ReportsStats({ stats, loading }: ReportsStatsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-card/50 animate-pulse" />
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Receitas",
            amount: stats.income,
            count: stats.incomeCount,
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20",
            gradient: "from-green-500/5 to-transparent",
            arrow: ArrowUpRight
        },
        {
            title: "Despesas",
            amount: stats.expenses,
            count: stats.expensesCount,
            icon: TrendingDown,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/20",
            gradient: "from-red-500/5 to-transparent",
            arrow: ArrowDownRight
        },
        {
            title: "Saldo",
            amount: stats.balance,
            count: null,
            icon: Wallet,
            color: stats.balance >= 0 ? "text-blue-500" : "text-red-500",
            bgColor: stats.balance >= 0 ? "bg-blue-500/10" : "bg-red-500/10",
            borderColor: stats.balance >= 0 ? "border-blue-500/20" : "border-red-500/20",
            gradient: stats.balance >= 0 ? "from-blue-500/5 to-transparent" : "from-red-500/5 to-transparent",
            arrow: null,
            extra: (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Taxa de Economia:</span>
                    <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        stats.savingsRate >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                        {stats.savingsRate.toFixed(1)}%
                    </span>
                </div>
            )
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={cn(
                        "relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg backdrop-blur-sm",
                        "bg-card hover:bg-card/80",
                        card.borderColor
                    )}
                >
                    {/* Background Gradient */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 dark:opacity-50 opacity-20", card.gradient)} />

                    {/* Glowing Icon Background */}
                    <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 transform scale-150">
                        <card.icon className={cn("w-24 h-24", card.color)} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={cn("p-2 rounded-lg", card.bgColor)}>
                                <card.icon className={cn("w-5 h-5", card.color)} />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h3 className={cn("text-3xl font-bold font-mono tracking-tight", card.color)}>
                                {formatCurrency(card.amount)}
                            </h3>
                            {card.count !== null && (
                                <p className="text-xs text-muted-foreground">
                                    {card.count} transações registradas
                                </p>
                            )}
                            {card.extra}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
