"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/contexts/currency-context";

interface ExpensesDonutChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

const RADIAN = Math.PI / 180;

export function ExpensesDonutChart({ data }: ExpensesDonutChartProps) {
    const { formatCurrency } = useCurrency();

    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Don't show label for small slices

        return (
            <text
                x={x}
                y={y}
                fill="white"
                stroke="black"
                strokeWidth="2"
                paintOrder="stroke"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground mb-1">{data.name}</p>
                    <p className="text-lg font-bold text-foreground">
                        {formatCurrency(data.value)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {((data.value / total) * 100).toFixed(1)}% do total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4 md:p-6"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Despesas por Categoria
                </h3>
                <p className="text-sm text-muted-foreground">
                    Distribuição dos gastos
                </p>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={85}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground truncate">{entry.name}</span>
                        </div>
                        <span className="font-medium text-foreground ml-2 flex-shrink-0">
                            {formatCurrency(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
