"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface EvolutionChartProps {
    data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-4 min-w-[200px]">
                <p className="text-sm font-semibold mb-2 text-foreground border-b border-border/50 pb-2">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-muted-foreground capitalize">
                                    {entry.name}
                                </span>
                            </div>
                            <span className="text-sm font-bold font-mono text-foreground">
                                {formatCurrency(entry.value)}
                            </span>
                        </div>
                    ))}
                    {payload.length >= 2 && (
                        <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center">
                            <span className="text-xs font-semibold text-muted-foreground">Saldo:</span>
                            <span className={`text-sm font-bold font-mono ${(payload[0].payload.Receitas - payload[0].payload.Despesas) >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                                }`}>
                                {formatCurrency(payload[0].payload.Receitas - payload[0].payload.Despesas)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export function EvolutionChart({ data }: EvolutionChartProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card border border-border/50 rounded-xl p-6 h-full shadow-sm"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">Evolução Financeira</h3>
                    <p className="text-xs text-muted-foreground">Receitas vs Despesas no período</p>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22C55E" stopOpacity={1} />
                                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tick={({ x, y, payload }) => (
                                <text x={x} y={y} dy={16} textAnchor="middle" className="fill-muted-foreground text-[10px] font-medium uppercase">
                                    {payload.value}
                                </text>
                            )}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={({ x, y, payload }) => (
                                <text x={x} y={y} dx={-4} dy={4} textAnchor="end" className="fill-muted-foreground text-[10px] font-medium">
                                    {`${(payload.value / 1000).toFixed(0)}k`}
                                </text>
                            )}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-xs font-medium text-muted-foreground capitalize ml-1">{value}</span>}
                        />
                        <Bar
                            name="Receitas"
                            dataKey="Receitas"
                            fill="url(#incomeGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                            animationDuration={1500}
                        />
                        <Bar
                            name="Despesas"
                            dataKey="Despesas"
                            fill="url(#expenseGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
