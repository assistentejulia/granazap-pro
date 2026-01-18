"use client";

import { useMemo, useState } from "react";
import { useExportPDFNew } from "@/hooks/use-export-pdf-new";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { useTransactionsQuery } from "@/hooks/use-transactions-query";
import { ExportDropdown } from "@/components/dashboard/export-dropdown";
import * as XLSX from 'xlsx';
import { useFutureTransactionsQuery } from "@/hooks/use-future-transactions-query";
import { useAccounts } from "@/hooks/use-accounts";
import { useAccountFilter } from "@/hooks/use-account-filter";
import { cn } from "@/lib/utils";
import { TransactionFilters } from "@/components/dashboard/transaction-filters";

// New Components
import { ReportsStats } from "./reports-stats";
import { EvolutionChart } from "./evolution-chart";
import { ReportsCashFlow } from "./cash-flow-chart";
import { CategoryAnalysis } from "./category-breakdown";
import { ForecastSummary } from "./forecast-summary";
import { ForecastList } from "./forecast-list";

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function ReportsView() {
    const { t } = useLanguage();
    const { formatCurrency } = useCurrency();
    const { filter: accountType } = useAccountFilter();

    const [accountId, setAccountId] = useState("all");
    const [categoryId, setCategoryId] = useState("all");
    // Default to current year
    const currentYear = new Date().getFullYear();
    const [startDate, setStartDate] = useState<string | null>(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState<string | null>(`${currentYear}-12-31`);

    const period: 'day' | 'week' | 'month' | 'year' | 'custom' = 'custom';
    const customRange = { start: startDate!, end: endDate! };

    const { transactions, loading, stats } = useTransactionsQuery(
        period,
        customRange,
        accountId,
        categoryId
    );

    const { transactions: futureTransactions } = useFutureTransactionsQuery(period);
    const { accounts } = useAccounts(accountType);
    const [isExporting, setIsExporting] = useState(false);
    const { exportReportToPDF } = useExportPDFNew();

    // --- Data Processing Logic (Reused) ---

    const dateRange = useMemo(() => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        if (period === 'custom' && customRange) {
            start = new Date(customRange.start);
            end = new Date(customRange.end);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        } else {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        }
        return { start, end };
    }, [period, customRange]);

    const forecastData = useMemo(() => {
        const startStr = dateRange.start.toISOString().split('T')[0];
        const endStr = dateRange.end.toISOString().split('T')[0];

        const filtered = futureTransactions.filter(t => {
            if (t.status !== 'pendente') return false;
            return t.data_prevista >= startStr && t.data_prevista <= endStr;
        });

        const pendingIncome = filtered
            .filter(t => t.tipo === 'entrada')
            .reduce((sum, t) => sum + Number(t.valor), 0);

        const pendingExpense = filtered
            .filter(t => t.tipo === 'saida')
            .reduce((sum, t) => sum + Number(t.valor), 0);

        const currentBalance = accounts.reduce((sum, acc) => {
            if (accountId !== 'all' && acc.id.toString() !== accountId) return sum;
            return sum + acc.saldo_atual
        }, 0);

        const projectedBalance = currentBalance + pendingIncome - pendingExpense;

        return {
            pendingIncome,
            pendingExpense,
            projectedBalance,
            currentBalance,
            incomes: filtered.filter(t => t.tipo === 'entrada'),
            expenses: filtered.filter(t => t.tipo === 'saida')
        };
    }, [futureTransactions, dateRange, accounts, accountId]);

    const evolutionData = useMemo(() => {
        const grouped = new Map();
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        sortedTransactions.forEach(t => {
            const date = new Date(t.data);
            let key = t.data.split('T')[0];
            let label = format(date, 'dd/MM', { locale: ptBR });

            if (!grouped.has(key)) {
                grouped.set(key, { name: label, fullDate: key, Receitas: 0, Despesas: 0, Saldo: 0 });
            }

            const item = grouped.get(key);
            if (t.tipo === 'entrada') {
                item.Receitas += Number(t.valor);
            } else {
                item.Despesas += Number(t.valor);
            }
            item.Saldo = item.Receitas - item.Despesas;
        });

        return Array.from(grouped.values());
    }, [transactions, period]);

    const cumulativeData = useMemo(() => {
        let accumulated = 0;
        return evolutionData.map(item => {
            accumulated += item.Saldo;
            return {
                ...item,
                Acumulado: accumulated
            };
        });
    }, [evolutionData]);

    const topExpenses = useMemo(() => {
        return transactions
            .filter(t => t.tipo === 'saida')
            .sort((a, b) => Number(b.valor) - Number(a.valor))
            .slice(0, 5);
    }, [transactions]);

    const getCategoryData = (type: 'entrada' | 'saida') => {
        const categoryMap = new Map();
        transactions.filter(t => t.tipo === type).forEach(t => {
            const name = t.categoria?.descricao || 'Outros';
            const current = categoryMap.get(name) || 0;
            categoryMap.set(name, current + Number(t.valor));
        });
        return Array.from(categoryMap.entries())
            .map(([name, value], index) => ({ name, value, color: COLORS[index % COLORS.length] }))
            .sort((a, b) => b.value - a.value);
    };

    const incomeCategories = useMemo(() => getCategoryData('entrada'), [transactions]);
    const expenseCategories = useMemo(() => getCategoryData('saida'), [transactions]);

    // --- Export Functions ---

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const periodLabel = period === 'custom' && customRange
                ? `${format(new Date(customRange.start), 'dd-MM-yyyy')}_${format(new Date(customRange.end), 'dd-MM-yyyy')}`
                : format(new Date(), 'MM-yyyy');

            const accountLabel = accountType === 'pessoal' ? 'Pessoal' : 'PJ';
            const filename = `Relatorio_${accountLabel}_${periodLabel}.pdf`;

            const reportData = {
                stats,
                forecastData,
                incomeCategories,
                expenseCategories,
                topExpenses,
                evolutionData,
                period,
                customRange: customRange || undefined,
                accountFilter: accountType,
                formatCurrency
            };
            await exportReportToPDF(reportData, filename);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            alert('Erro ao exportar PDF.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const resumoData = [
                ['Resumo Financeiro', ''],
                ['Período', period === 'custom' && customRange ? `${format(new Date(customRange.start), 'dd/MM/yyyy')} - ${format(new Date(customRange.end), 'dd/MM/yyyy')}` : period],
                ['Receitas', stats.income],
                ['Despesas', stats.expenses],
                ['Saldo', stats.balance]
            ];
            const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
            XLSX.writeFile(wb, `Relatorio_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-foreground bg-clip-text">
                                {t('reports.title')}
                            </h1>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md shadow-sm",
                                accountType === 'pessoal'
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            )}>
                                {accountType === 'pessoal' ? '👤 Pessoal' : '🏢 PJ'}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                            Visão geral detalhada das suas movimentações
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <ExportDropdown
                            onExportPDF={handleExportPDF}
                            onExportExcel={handleExportExcel}
                            isExporting={isExporting}
                        />
                    </div>
                </div>

                <TransactionFilters
                    accountId={accountId}
                    setAccountId={setAccountId}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    type="all"
                    showTypeFilter={false}
                />
            </div>

            {/* Main Stats Cards */}
            <ReportsStats stats={stats} loading={loading} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[400px]">
                <EvolutionChart data={evolutionData} />
                <ReportsCashFlow data={cumulativeData} />
            </div>

            {/* Category Analysis */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    Análise de Categorias
                </h2>
                <CategoryAnalysis
                    incomeCategories={incomeCategories}
                    expenseCategories={expenseCategories}
                />
            </div>

            {/* Forecast Section */}
            <div className="pt-8 border-t border-border/50">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <CalendarClock className="w-6 h-6 text-blue-500" />
                    Previsão Financeira
                </h2>
                <ForecastSummary data={forecastData} />

                <ForecastList
                    incomes={forecastData.incomes}
                    expenses={forecastData.expenses}
                />
            </div>
        </div>
    );
}
