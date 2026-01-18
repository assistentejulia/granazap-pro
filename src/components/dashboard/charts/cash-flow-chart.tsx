"use client";

import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useCurrency } from "@/contexts/currency-context";

interface CashFlowChartProps {
    data: Array<{
        month: string;
        income: number;
        expenses: number;
    }>;
}

export function CashFlowChart({ data }: CashFlowChartProps) {
    const { formatCurrency } = useCurrency();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-semibold text-foreground">
                                {formatCurrency(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

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

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-sm text-muted-foreground">{value}</span>
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="income"
                        name="Receitas"
                        stroke="#22C55E"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        name="Despesas"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
