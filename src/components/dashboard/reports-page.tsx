"use client";

import { useMemo, useState, useEffect } from "react";
import { useExportPDFNew } from "@/hooks/use-export-pdf-new";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon,
  Receipt,
  CalendarClock
} from "lucide-react";
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

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function ReportsPage() {
  const { t } = useLanguage();
  const { formatCurrency, getCurrencySymbol } = useCurrency();
  const { filter: accountType } = useAccountFilter();

  // Estados dos filtros
  const [accountId, setAccountId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [transactionType, setTransactionType] = useState<any>('all');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Se tiver data inicial e final, usamos período 'custom'
  // Se não, usamos 'month' (mês atual) como padrão
  const period: 'day' | 'week' | 'month' | 'year' | 'custom' = (startDate && endDate) ? 'custom' : 'month';

  //range para passar pro hook
  const customRange = (startDate && endDate) ? { start: startDate, end: endDate } : null;

  const { transactions, loading, stats } = useTransactionsQuery(
    period,
    customRange,
    accountId,
    categoryId
  );

  // Hooks para previsão financeira
  const { transactions: futureTransactions, loading: loadingFuture } = useFutureTransactionsQuery(
    period
  );

  const { accounts } = useAccounts(accountType);

  const [isExporting, setIsExporting] = useState(false);

  const { exportReportToPDF } = useExportPDFNew();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const periodLabel = period === 'custom' && customRange
        ? `${format(new Date(customRange.start), 'dd-MM-yyyy')}_${format(new Date(customRange.end), 'dd-MM-yyyy')}`
        : format(new Date(), 'MM-yyyy'); // period is always 'month' if not 'custom'


      const accountLabel = accountType === 'pessoal' ? 'Pessoal' : 'PJ';
      const filename = `Relatorio_${accountLabel}_${periodLabel}.pdf`;

      // Preparar dados para o novo hook
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

      console.log('Iniciando exportação do PDF...', { period, accountFilter: accountType });
      const success = await exportReportToPDF(reportData, filename);

      if (success) {
        console.log('PDF exportado com sucesso!');
      } else {
        console.error('Falha na exportação do PDF (retornou false)');
        alert('Erro ao gerar o arquivo PDF. Verifique o console do navegador para mais detalhes.');
      }
    } catch (error) {
      console.error('Erro inesperado ao exportar:', error);
      alert('Ocorreu um erro inesperado ao tentar exportar.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // 1. Sheet: Resumo
      const resumoData = [
        ['Resumo Financeiro', ''],
        ['Período', period === 'custom' && customRange ? `${format(new Date(customRange.start), 'dd/MM/yyyy')} - ${format(new Date(customRange.end), 'dd/MM/yyyy')}` : period],
        ['Tipo de Conta', accountType === 'pessoal' ? 'Pessoal' : 'PJ'],
        [''],
        ['Receitas Totais', stats.income],
        ['Despesas Totais', stats.expenses],
        ['Saldo do Período', stats.balance],
        ['Taxa de Economia', `${stats.savingsRate.toFixed(2)}%`]
      ];
      const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);

      // 2. Sheet: Evolução Mensal/Diária
      const evolucaoData = evolutionData.map(item => ({
        'Data/Período': item.name,
        'Receitas': item.Receitas,
        'Despesas': item.Despesas,
        'Saldo': item.Saldo
      }));
      const wsEvolucao = XLSX.utils.json_to_sheet(evolucaoData);

      // 3. Sheet: Categorias Receitas
      const wsRecCat = XLSX.utils.json_to_sheet(incomeCategories.map(c => ({ 'Categoria': c.name, 'Valor': c.value })));

      // 4. Sheet: Categorias Despesas
      const wsDespCat = XLSX.utils.json_to_sheet(expenseCategories.map(c => ({ 'Categoria': c.name, 'Valor': c.value })));

      // 5. Sheet: Previsões (Pendentes)
      const pendingData = [
        ...forecastData.incomes.map(i => ({
          'Tipo': 'Receita',
          'Descrição': i.descricao,
          'Data Prevista': format(new Date(i.data_prevista), 'dd/MM/yyyy'),
          'Valor': Number(i.valor),
          'Categoria': i.categoria?.descricao
        })),
        ...forecastData.expenses.map(i => ({
          'Tipo': 'Despesa',
          'Descrição': i.descricao,
          'Data Prevista': format(new Date(i.data_prevista), 'dd/MM/yyyy'),
          'Valor': Number(i.valor),
          'Categoria': i.categoria?.descricao
        }))
      ];
      const wsPendentes = XLSX.utils.json_to_sheet(pendingData);

      // Criar Workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
      XLSX.utils.book_append_sheet(wb, wsEvolucao, "Evolução");
      XLSX.utils.book_append_sheet(wb, wsRecCat, "Categ. Receitas");
      XLSX.utils.book_append_sheet(wb, wsDespCat, "Categ. Despesas");
      XLSX.utils.book_append_sheet(wb, wsPendentes, "Pendentes");

      const periodLabel = period === 'custom' && customRange
        ? `${format(new Date(customRange.start), 'dd-MM-yyyy')}_${format(new Date(customRange.end), 'dd-MM-yyyy')}`
        : format(new Date(), 'dd-MM-yyyy');

      XLSX.writeFile(wb, `Relatorio_Financeiro_${periodLabel}.xlsx`);

    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao gerar Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  // Calcular intervalo de datas selecionado (para filtrar lançamentos futuros)
  const dateRange = useMemo(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (period === 'custom' && customRange) {
      start = new Date(customRange.start);
      end = new Date(customRange.end);
      // Ajustar fuso/hora para garantir cobertura completa
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      // period can only be 'month' here (not 'custom')
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    return { start, end };
  }, [period, customRange]);

  // Filtrar e calcular dados de previsão
  const forecastData = useMemo(() => {
    const startStr = dateRange.start.toISOString().split('T')[0];
    const endStr = dateRange.end.toISOString().split('T')[0];

    // O hook futureTransactions retorna TODOS (limit 1000). Precisamos filtrar por data AQUI.
    // Usando string comparison (YYYY-MM-DD) que é seguro para colunas DATE.
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
      // Se estiver filtrando por conta específica, considerar apenas saldo dessa conta
      if (accountId !== 'all' && acc.id.toString() !== accountId) return sum;
      return sum + acc.saldo_atual
    }, 0);

    // Saldo Previsto = Saldo Atual + (Receitas Pendentes - Despesas Pendentes)
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

  // Agrupar dados por mês/dia para o gráfico de evolução
  const evolutionData = useMemo(() => {
    const grouped = new Map();

    // Ordenar transações por data (antiga para nova)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    sortedTransactions.forEach(t => {
      // Se o período for 'day' ou 'week', agrupar por dia. Senão, por mês.
      const date = new Date(t.data);
      let key = "";
      let label = "";

      // period can only be 'month' or 'custom', so we always use daily format
      key = t.data.split('T')[0];
      label = format(date, 'dd/MM', { locale: ptBR });


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

  // Dados acumulados para o gráfico de linha (Fluxo de Caixa)
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

  // Top 5 maiores despesas
  const topExpenses = useMemo(() => {
    return transactions
      .filter(t => t.tipo === 'saida')
      .sort((a, b) => Number(b.valor) - Number(a.valor))
      .slice(0, 5);
  }, [transactions]);

  // Agrupar dados por categoria
  const getCategoryData = (type: 'entrada' | 'saida') => {
    const categoryMap = new Map();

    transactions
      .filter(t => t.tipo === type)
      .forEach(t => {
        const name = t.categoria?.descricao || 'Outros';
        const current = categoryMap.get(name) || 0;
        categoryMap.set(name, current + Number(t.valor));
      });

    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  const incomeCategories = useMemo(() => getCategoryData('entrada'), [transactions]);
  const expenseCategories = useMemo(() => getCategoryData('saida'), [transactions]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{t('reports.title')}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                accountType === 'pessoal'
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
              )}>
                {accountType === 'pessoal' ? '👤 Pessoal' : '🏢 PJ'}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {t('reports.description')}
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

        {/* Filters */}
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
          showTypeFilter={false} // Relatórios geralmente mostram geral, mas se quiser pode ativar
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16 md:w-24 md:h-24 text-[#22C55E]" />
          </div>
          <div className="relative z-10">
            <div className="text-xs md:text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-[#22C55E]/10 rounded-lg">
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-[#22C55E]" />
              </div>
              {t('reports.totalIncome')}
            </div>
            <p className="text-2xl md:text-3xl font-bold font-mono text-foreground">
              {formatCurrency(stats.income)}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
              {stats.incomeCount} {t('reports.transactionsRegistered')}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-16 h-16 md:w-24 md:h-24 text-[#EF4444]" />
          </div>
          <div className="relative z-10">
            <div className="text-xs md:text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-[#EF4444]/10 rounded-lg">
                <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 text-[#EF4444]" />
              </div>
              {t('reports.totalExpenses')}
            </div>
            <p className="text-2xl md:text-3xl font-bold font-mono text-foreground">
              {formatCurrency(stats.expenses)}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
              {stats.expensesCount} {t('reports.transactionsRegistered')}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-16 h-16 md:w-24 md:h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="text-xs md:text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Wallet className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              </div>
              {t('reports.periodBalance')}
            </div>
            <p className={cn(
              "text-2xl md:text-3xl font-bold font-mono",
              stats.balance >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"
            )}>
              {formatCurrency(stats.balance)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] md:text-xs text-muted-foreground">
                {t('reports.savings')}:
              </span>
              <span className={cn(
                "text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full",
                stats.savingsRate >= 0 ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
              )}>
                {stats.savingsRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Evolution Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            {t('reports.incomeVsExpenses')}
          </h3>
          <div className="w-full" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717A', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717A', fontSize: 12 }}
                  tickFormatter={(val) => `${getCurrencySymbol()}${val / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | undefined, name: string | undefined) => {
                    const translatedName = name === 'Receitas' ? t('reports.income') : t('reports.expenses');
                    return [formatCurrency(value || 0), translatedName];
                  }}
                />
                <Legend
                  formatter={(value: string) => value === 'Receitas' ? t('reports.income') : t('reports.expenses')}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar dataKey="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Flow Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-muted-foreground" />
            {t('reports.cumulativeCashFlow')}
          </h3>
          <div className="w-full" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717A', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717A', fontSize: 12 }}
                  tickFormatter={(val) => `${getCurrencySymbol()}${val / 1000}k`}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | undefined) => formatCurrency(value || 0)}
                />
                <Area
                  type="monotone"
                  dataKey="Acumulado"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAcumulado)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-blue-500" />
          {t('reports.forecast')} ({t('reports.noPending').replace('Nenhum lançamento pendente', 'Pendentes')})
        </h2>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total a Receber */}
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <div className="p-1.5 bg-[#22C55E]/10 rounded-lg">
                  <ArrowUpRight className="w-4 h-4 text-[#22C55E]" />
                </div>
                {t('reports.toReceive')}
              </div>
              <p className="text-3xl font-bold font-mono text-[#22C55E]">
                {formatCurrency(forecastData.pendingIncome)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(dateRange.start, 'dd/MM/yyyy')} - {format(dateRange.end, 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          {/* Total a Pagar */}
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <div className="p-1.5 bg-[#EF4444]/10 rounded-lg">
                  <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />
                </div>
                {t('reports.toPay')}
              </div>
              <p className="text-3xl font-bold font-mono text-[#EF4444]">
                {formatCurrency(forecastData.pendingExpense)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(dateRange.start, 'dd/MM/yyyy')} - {format(dateRange.end, 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          {/* Saldo Previsto */}
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Wallet className="w-4 h-4 text-blue-500" />
                </div>
                {t('reports.projectedBalance')}
              </div>
              <p className={cn(
                "text-3xl font-bold font-mono",
                forecastData.projectedBalance >= 0 ? "text-blue-500" : "text-[#EF4444]"
              )}>
                {formatCurrency(forecastData.projectedBalance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('reports.projectedFormula')}
              </p>
            </div>
          </div>
        </div>

        {/* Forecast Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receitas Pendentes */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{t('reports.pendingIncomeTitle')}</h3>
                <p className="text-sm text-muted-foreground">{t('reports.toReceiveLabel')}</p>
              </div>
              <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded border border-[#22C55E]/20">
                {t('reports.incomeLabel')}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {forecastData.incomes.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors border border-border flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground line-clamp-1">{item.descricao}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{format(new Date(item.data_prevista), "dd/MM/yyyy", { locale: ptBR })}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                        {item.categoria?.descricao || 'Outros'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#22C55E] whitespace-nowrap">
                    {formatCurrency(item.valor)}
                  </span>
                </div>
              ))}

              {forecastData.incomes.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Receipt className="w-8 h-8 opacity-50" />
                  <p className="text-sm">{t('reports.noPendingIncome')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Despesas Pendentes */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{t('reports.pendingExpensesTitle')}</h3>
                <p className="text-sm text-muted-foreground">{t('reports.toPayLabel')}</p>
              </div>
              <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs rounded border border-[#EF4444]/20">
                {t('reports.expenseLabel')}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {forecastData.expenses.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors border border-border flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground line-clamp-1">{item.descricao}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{format(new Date(item.data_prevista), "dd/MM/yyyy", { locale: ptBR })}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                        {item.categoria?.descricao || 'Outros'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#EF4444] whitespace-nowrap">
                    {formatCurrency(item.valor)}
                  </span>
                </div>
              ))}

              {forecastData.expenses.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Receipt className="w-8 h-8 opacity-50" />
                  <p className="text-sm">{t('reports.noPendingExpense')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Categories */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-muted-foreground" />
            {t('reports.incomeOrigin')}
          </h3>

          <div className="w-full relative" style={{ height: '256px' }}>
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={incomeCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {incomeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | undefined) => formatCurrency(value || 0)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground font-bold text-xl">{stats.income > 0 ? '100%' : '0%'}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-60 custom-scrollbar pr-2">
            {incomeCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-foreground font-medium">{cat.name}</span>
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {formatCurrency(cat.value)}
                </span>
              </div>
            ))}
            {incomeCategories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma receita registrada
              </div>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-muted-foreground" />
            {t('reports.expenseOrigin')}
          </h3>

          <div className="w-full relative" style={{ height: '256px' }}>
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | undefined) => formatCurrency(value || 0)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground font-bold text-xl">{stats.expenses > 0 ? '100%' : '0%'}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-60 custom-scrollbar pr-2">
            {expenseCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-foreground font-medium">{cat.name}</span>
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {formatCurrency(cat.value)}
                </span>
              </div>
            ))}
            {expenseCategories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma despesa registrada
              </div>
            )}
          </div>
        </div>

        {/* Top 5 Expenses */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            {t('reports.topExpenses')}
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {topExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors border border-border">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground line-clamp-1">{expense.descricao}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(expense.data), "dd/MM", { locale: ptBR })}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                      {expense.categoria?.descricao || 'Outros'}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-red-500 whitespace-nowrap">
                  {formatCurrency(Number(expense.valor))}
                </span>
              </div>
            ))}
            {topExpenses.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Wallet className="w-8 h-8 opacity-50" />
                <p className="text-sm">Nenhuma despesa no período</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
