"use client";

import { useTransactionsQuery } from "@/hooks/use-transactions-query";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { usePeriodFilter } from "@/hooks/use-period-filter";
import { useDashboardFilter } from "@/contexts/dashboard-filter-context";
import { CashFlowChart } from "./charts/cash-flow-chart";
import { ExpensesDonutChart } from "./charts/expenses-donut-chart";
import { MonthlyComparisonChart } from "./charts/monthly-comparison-chart";
import { SavingsTrendChart } from "./charts/savings-trend-chart";

export function EnhancedChartsSection() {
    const { t, language } = useLanguage();
    const { period } = usePeriodFilter();
    const { accountId, startDate, endDate } = useDashboardFilter();

    const effectivePeriod = (startDate && endDate) ? 'custom' : period;
    const customRange = (startDate && endDate) ? { start: startDate, end: endDate } : null;

    const { transactions, loading } = useTransactionsQuery(effectivePeriod, customRange, accountId, 'all', true);

    // Process data for Cash Flow Chart (last 12 months)
    const cashFlowData = useMemo(() => {
        const last12Months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            return date;
        });

        const locales = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES'
        };

        return last12Months.map(date => {
            const monthName = date.toLocaleDateString(locales[language], { month: 'short' });
            const year = date.getFullYear();
            const month = date.getMonth();

            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.data);
                return tDate.getFullYear() === year && tDate.getMonth() === month;
            });

            const income = monthTransactions
                .filter(t => t.tipo === 'entrada')
                .reduce((sum, t) => sum + Number(t.valor), 0);

            const expenses = monthTransactions
                .filter(t => t.tipo === 'saida')
                .reduce((sum, t) => sum + Number(t.valor), 0);

            return {
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                income,
                expenses,
            };
        });
    }, [transactions, language]);

    // Process data for Expenses Donut Chart
    const expensesDonutData = useMemo(() => {
        const categoryMap = new Map<string, number>();

        transactions
            .filter(transaction => transaction.tipo === 'saida')
            .forEach(transaction => {
                const categoryName = transaction.categoria?.descricao || t('dashboard.recent.noCategory');
                const current = categoryMap.get(categoryName) || 0;
                categoryMap.set(categoryName, current + Number(transaction.valor));
            });

        const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#EC4899'];

        return Array.from(categoryMap.entries())
            .map(([name, value], index) => ({
                name,
                value,
                color: colors[index % colors.length],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Top 6 categories
    }, [transactions, t]);

    // Process data for Monthly Comparison (last 6 months)
    const monthlyComparisonData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - i));
            return date;
        });

        const locales = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES'
        };

        return last6Months.map(date => {
            const monthName = date.toLocaleDateString(locales[language], { month: 'short' });
            const year = date.getFullYear();
            const month = date.getMonth();

            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.data);
                return tDate.getFullYear() === year && tDate.getMonth() === month;
            });

            const income = monthTransactions
                .filter(t => t.tipo === 'entrada')
                .reduce((sum, t) => sum + Number(t.valor), 0);

            const expenses = monthTransactions
                .filter(t => t.tipo === 'saida')
                .reduce((sum, t) => sum + Number(t.valor), 0);

            return {
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                income,
                expenses,
            };
        });
    }, [transactions, language]);

    // Process data for Savings Trend
    const savingsTrendData = useMemo(() => {
        const last12Months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            return date;
        });

        const locales = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES'
        };

        let cumulativeSavings = 0;

        return last12Months.map(date => {
            const monthName = date.toLocaleDateString(locales[language], { month: 'short' });
            const year = date.getFullYear();
            const month = date.getMonth();

            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.data);
                return tDate.getFullYear() === year && tDate.getMonth() === month;
            });

            const income = monthTransactions
                .filter(t => t.tipo === 'entrada')
                .reduce((sum, t) => sum + Number(t.valor), 0);

            const expenses = monthTransactions
                .filter(t => t.tipo === 'saida')
                .reduce((sum, t) => sum + Number(t.valor), 0);

            cumulativeSavings += (income - expenses);

            return {
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                savings: Math.max(0, cumulativeSavings),
            };
        });
    }, [transactions, language]);

    if (loading) {
        return (
            <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 h-80 animate-pulse" />
                    <div className="bg-card border border-border rounded-xl p-6 h-80 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 h-80 animate-pulse" />
                    <div className="bg-card border border-border rounded-xl p-6 h-80 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Top Row: Cash Flow (60%) + Expenses Donut (40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
                <div className="lg:col-span-3">
                    <CashFlowChart data={cashFlowData} />
                </div>
                <div className="lg:col-span-2">
                    <ExpensesDonutChart data={expensesDonutData} />
                </div>
            </div>

            {/* Bottom Row: Monthly Comparison + Savings Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <MonthlyComparisonChart data={monthlyComparisonData} />
                <SavingsTrendChart data={savingsTrendData} target={50000} />
            </div>
        </div>
    );
}
