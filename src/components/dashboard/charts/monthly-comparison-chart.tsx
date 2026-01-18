"use client";

import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useCurrency } from "@/contexts/currency-context";

interface MonthlyComparisonChartProps {
    data: Array<{
        month: string;
        income: number;
        expenses: number;
    }>;
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
    const { formatCurrency } = useCurrency();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs mb-1">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: entry.fill }}
                            />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-semibold text-foreground">
                                {formatCurrency(entry.value)}
                            </span>
                        </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Saldo: </span>
                        <span
                            className={`text-xs font-semibold ${payload[0].value - payload[1].value >= 0
                                ? "text-green-500"
                                : "text-red-500"
                                }`}
                        >
                            {formatCurrency(payload[0].value - payload[1].value)}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4 md:p-6"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Receitas vs Despesas
                </h3>
                <p className="text-sm text-muted-foreground">
                    Comparação mensal
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={({ x, y, payload }) => (
                            <text
                                x={x}
                                y={y}
                                dy={16}
                                textAnchor="middle"
                                className="fill-foreground text-xs font-bold"
                            >
                                {payload.value}
                            </text>
                        )}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={({ x, y, payload }) => (
                            <text
                                x={x}
                                y={y}
                                dx={-4}
                                dy={4}
                                textAnchor="end"
                                className="fill-foreground text-xs font-bold"
                            >
                                {`R$ ${(payload.value / 1000).toFixed(0)}k`}
                            </text>
                        )}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="rect"
                        formatter={(value) => (
                            <span className="text-sm text-muted-foreground">{value}</span>
                        )}
                    />
                    <Bar
                        dataKey="income"
                        name="Receitas"
                        fill="#22C55E"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                    />
                    <Bar
                        dataKey="expenses"
                        name="Despesas"
                        fill="#EF4444"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
