"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { PieChart as PieChartIcon } from "lucide-react";

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface CategoryAnalysisProps {
    incomeCategories: CategoryData[];
    expenseCategories: CategoryData[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                    <span className="text-xs font-semibold text-foreground">{payload[0].name}</span>
                </div>
                <span className="text-sm font-mono font-bold text-foreground block">
                    {formatCurrency(payload[0].value)}
                </span>
            </div>
        );
    }
    return null;
};

export function CategoryAnalysis({ incomeCategories, expenseCategories }: CategoryAnalysisProps) {

    // Helper to render a chart card
    const renderChart = (title: string, data: CategoryData[], type: 'income' | 'expense') => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/50 rounded-xl p-6 flex flex-col h-full shadow-sm"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className={`p-2 rounded-lg ${type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <PieChartIcon className={`w-5 h-5 ${type === 'income' ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1">
                {/* Chart */}
                <div className="h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data as any[]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={<CustomTooltip />}
                                offset={40}
                                wrapperStyle={{ pointerEvents: 'none' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
                        {data.length > 0 ? (
                            <span className="text-lg font-bold text-foreground">100%</span>
                        ) : (
                            <span className="text-sm text-muted-foreground">--</span>
                        )}
                    </div>
                </div>

                {/* Legend List */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {data.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            Sem dados para exibir
                        </div>
                    ) : (
                        data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-medium text-muted-foreground truncate group-hover:text-foreground transition-colors">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-xs font-mono font-bold text-foreground whitespace-nowrap ml-2">
                                    {formatCurrency(item.value)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderChart("Origem das Receitas", incomeCategories, 'income')}
            {renderChart("Destino das Despesas", expenseCategories, 'expense')}
        </div>
    );
}
