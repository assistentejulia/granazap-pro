"use client";

import { motion } from "framer-motion";
import { useCurrency } from "@/contexts/currency-context";

interface SimpleCashFlowChartProps {
    data: Array<{
        month: string;
        income: number;
        expenses: number;
    }>;
}

export function SimpleCashFlowChart({ data }: SimpleCashFlowChartProps) {
    const { formatCurrency } = useCurrency();

    // Validate data
    const hasData = data && Array.isArray(data) && data.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-xl p-4 md:p-6"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Fluxo de Caixa</h3>
                <p className="text-sm text-muted-foreground">
                    Receitas e despesas ao longo do tempo
                </p>
            </div>

            {!hasData ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    Sem dados disponíveis
                </div>
            ) : (
                <div className="space-y-2">
                    {data.slice(0, 6).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">{item.month}</span>
                            <div className="flex gap-4">
                                <span className="text-sm text-green-500">
                                    +{formatCurrency(item.income)}
                                </span>
                                <span className="text-sm text-red-500">
                                    -{formatCurrency(item.expenses)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
