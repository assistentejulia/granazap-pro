"use client";

import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ComposedChart,
} from "recharts";
import { useCurrency } from "@/contexts/currency-context";

interface SavingsTrendChartProps {
    data: Array<{
        month: string;
        savings: number;
    }>;
    target?: number;
}

export function SavingsTrendChart({ data, target = 50000 }: SavingsTrendChartProps) {
    const { formatCurrency } = useCurrency();

    const currentSavings = data[data.length - 1]?.savings || 0;
    const progress = (currentSavings / target) * 100;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">Economia:</span>
                        <span className="font-semibold text-foreground">
                            {formatCurrency(payload[0].value)}
                        </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Meta: </span>
                        <span className="text-xs font-semibold text-foreground">
                            {formatCurrency(target)}
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-4 md:p-6"
        >
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Tendência de Economia
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Progresso em direção à meta
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                        {progress.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">da meta anual</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                    <ReferenceLine
                        y={target}
                        stroke="#F59E0B"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{
                            value: "Meta",
                            position: "right",
                            fill: "hsl(var(--muted-foreground))",
                            fontSize: 12,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="savings"
                        stroke="none"
                        fillOpacity={1}
                        fill="url(#colorSavings)"
                        animationDuration={1500}
                    />
                    <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1500}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Progresso</span>
                    <span className="text-xs font-semibold text-foreground">
                        {formatCurrency(currentSavings)} / {formatCurrency(target)}
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
}
