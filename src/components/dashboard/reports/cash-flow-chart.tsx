"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

interface ReportsCashFlowProps {
    data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-3">
                <p className="text-xs font-semibold mb-1 text-muted-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">Acumulado:</span>
                    <span className="text-sm font-mono font-bold text-blue-400">
                        {formatCurrency(payload[0].value)}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export function ReportsCashFlow({ data }: ReportsCashFlowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card border border-border/50 rounded-xl p-6 h-full shadow-sm"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">Fluxo de Caixa Acumulado</h3>
                    <p className="text-xs text-muted-foreground">Saldo progressivo ao longo do tempo</p>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
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
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--blue-500)/0.5)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="Acumulado"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fill="url(#flowGradient)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
