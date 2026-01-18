"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Receipt, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';

interface Transaction {
    id: number;
    descricao: string;
    valor: number | string;
    data_prevista: string;
    tipo: 'entrada' | 'saida';
    categoria?: {
        descricao: string;
    };
}

interface ForecastListProps {
    incomes: Transaction[];
    expenses: Transaction[];
}

export function ForecastList({ incomes, expenses }: ForecastListProps) {
    const renderList = (title: string, items: Transaction[], type: 'income' | 'expense') => (
        <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col h-[400px] shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {type === 'income' ? (
                            <ArrowUpRight className={`w-4 h-4 ${type === 'income' ? 'text-green-500' : 'text-red-500'}`} />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">{title}</h3>
                        <p className="text-xs text-muted-foreground">Próximos lançamentos</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${type === 'income'
                    ? 'bg-green-500/5 text-green-500 border-green-500/20'
                    : 'bg-red-500/5 text-red-500 border-red-500/20'
                    }`}>
                    {type === 'income' ? 'Receitas' : 'Despesas'}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {items.map((item) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        key={item.id}
                        className="p-3 rounded-lg bg-card/50 hover:bg-muted/50 transition-colors border border-border/50 flex justify-between items-center group"
                    >
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {item.descricao}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CalendarClock className="w-3 h-3" />
                                    {format(new Date(item.data_prevista), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded border ${type === 'income' ? 'bg-green-500/5 text-green-500 border-green-500/10' : 'bg-red-500/5 text-red-500 border-red-500/10'
                                    }`}>
                                    {item.categoria?.descricao || 'Geral'}
                                </span>
                            </div>
                        </div>
                        <span className={`text-sm font-mono font-bold whitespace-nowrap ${type === 'income' ? 'text-green-500' : 'text-red-500'
                            }`}>
                            {formatCurrency(Number(item.valor))}
                        </span>
                    </motion.div>
                ))}

                {items.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 opacity-50">
                        <Receipt className="w-8 h-8" />
                        <p className="text-xs">Nenhum lançamento previsto</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderList("Receitas Pendentes", incomes, 'income')}
            {renderList("Despesas Pendentes", expenses, 'expense')}
        </div>
    );
}
