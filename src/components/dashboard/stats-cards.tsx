"use client";

import { Wallet, TrendingUp, TrendingDown, PiggyBank, CalendarClock, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactionsQuery } from "@/hooks/use-transactions-query";
import { useFutureTransactionsQuery } from "@/hooks/use-future-transactions-query";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { usePeriodFilter } from "@/hooks/use-period-filter";
import { useDashboardFilter } from "@/contexts/dashboard-filter-context";
import { useUserFilter } from "@/hooks/use-user-filter";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkline } from "@/components/dashboard/ui/sparkline";
import { generateSparklineData } from "@/lib/dashboard-utils";
import { HelpTooltip } from "@/components/ui/help-tooltip";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  iconColor: string;
  count?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  tooltip?: string;
}

export function StatsCards() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { period } = usePeriodFilter();
  const {
    accountId,
    startDate,
    endDate,
    setStartDate,
    setEndDate
  } = useDashboardFilter();
  const { filter: userFilter } = useUserFilter();
  const queryClient = useQueryClient();

  // Force Refresh on Mount
  useEffect(() => {
    console.log("🔄 Force Refreshing Dashboard Stats...");
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  }, [queryClient]);
  const effectivePeriod = (startDate && endDate) ? 'custom' : period;
  const customRange = (startDate && endDate) ? { start: startDate, end: endDate } : null;

  const { stats, loading } = useTransactionsQuery(effectivePeriod, customRange, accountId, 'all', true);
  const { transactions: futureTransactions, loading: loadingFuture } = useFutureTransactionsQuery();

  // Calcular intervalo de datas
  const dateRange = useMemo(() => {
    // Se tiver datas personalizadas no contexto, usar elas
    if (startDate && endDate) {
      // startDate e endDate do contexto já são strings YYYY-MM-DD
      return { startStr: startDate, endStr: endDate };
    }

    const now = new Date();
    let start = new Date();
    let end = new Date();

    // Calcular intervalo baseado no período apenas se não tiver custom range
    switch (period) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(now.getDate() - now.getDay()); // Início da semana
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6); // Fim da semana
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        // Para custom ou outros, usar próximos 30 dias
        start = now;
        end.setDate(now.getDate() + 30);
    }

    return { startStr: start.toISOString().split('T')[0], endStr: end.toISOString().split('T')[0] };
  }, [period, startDate, endDate]);

  const payableReceivable = useMemo(() => {
    const { startStr, endStr } = dateRange;

    const pending = futureTransactions.filter(t => {
      const tDate = t.data_prevista.split('T')[0];
      return t.status === 'pendente' && tDate >= startStr && tDate <= endStr;
    });

    const payable = pending
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const receivable = pending
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const payableCount = pending.filter(t => t.tipo === 'saida').length;
    const receivableCount = pending.filter(t => t.tipo === 'entrada').length;

    return { payable, receivable, payableCount, receivableCount };
  }, [futureTransactions, dateRange]);

  if (loading || loadingFuture) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="h-20" />
          </div>
        ))}
      </div>
    );
  }



  const mainStatsCards: StatCard[] = [
    {
      title: t('dashboard.stats.balance'),
      value: formatCurrency(stats.balance),
      change: stats.balance >= 0 ? "+100%" : "-100%",
      changeType: stats.balance >= 0 ? "positive" : "negative",
      icon: Wallet,
      iconColor: "text-blue-400",
      sparklineData: generateSparklineData(12, stats.balance >= 0 ? 'up' : 'down'),
      sparklineColor: "#3B82F6",
      tooltip: t('dashboard.tooltips.balance'),
    },
    {
      title: t('dashboard.stats.income'),
      value: formatCurrency(stats.income),
      change: "+100%",
      changeType: "positive",
      icon: TrendingUp,
      iconColor: "text-[#22C55E]",
      count: `${stats.incomeCount} ${t('dashboard.stats.transactions')}`,
      sparklineData: generateSparklineData(12, 'up'),
      sparklineColor: "#22C55E",
      tooltip: t('dashboard.tooltips.income'),
    },
    {
      title: t('dashboard.stats.expenses'),
      value: formatCurrency(stats.expenses),
      change: "-100%",
      changeType: "negative",
      icon: TrendingDown,
      iconColor: "text-[#EF4444]",
      count: `${stats.expensesCount} ${t('dashboard.stats.transactions')}`,
      sparklineData: generateSparklineData(12, 'flat'),
      sparklineColor: "#EF4444",
      tooltip: t('dashboard.tooltips.expenses'),
    },
    {
      title: t('dashboard.stats.toReceive'),
      value: formatCurrency(payableReceivable.receivable),
      change: "+100%",
      changeType: "positive",
      icon: CalendarCheck,
      iconColor: "text-[#22C55E]",
      count: `${payableReceivable.receivableCount} ${t('dashboard.stats.pending')}`,
      sparklineData: generateSparklineData(12, 'up'),
      sparklineColor: "#A855F7",
      tooltip: t('dashboard.tooltips.toReceive'),
    },
    {
      title: t('dashboard.stats.toPay'),
      value: formatCurrency(payableReceivable.payable),
      change: "-100%",
      changeType: "negative",
      icon: CalendarClock,
      iconColor: "text-[#EF4444]",
      count: `${payableReceivable.payableCount} ${t('dashboard.stats.pending')}`,
      sparklineData: generateSparklineData(12, 'flat'),
      sparklineColor: "#FBBF24",
      tooltip: t('dashboard.tooltips.toPay'),
    },
  ];

  const savingsCard: StatCard = {
    title: t('dashboard.stats.savings'),
    value: `${stats.savingsRate.toFixed(1)}%`,
    change: "+100%",
    changeType: "positive",
    icon: PiggyBank,
    iconColor: "text-[#F59E0B]",
    sparklineData: generateSparklineData(12, stats.savingsRate > 0 ? 'up' : 'flat'),
    sparklineColor: "#F59E0B",
    tooltip: t('dashboard.tooltips.savings'),
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Main Stats Cards - 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        {mainStatsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-foreground/10 transition-all hover:shadow-lg"
          >
            {/* Icon & Change */}
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className={cn("p-2 rounded-lg bg-foreground/5", stat.iconColor)}>
                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span
                className={cn(
                  "text-xs md:text-sm font-medium",
                  stat.changeType === "positive" ? "text-[#22C55E]" : "text-[#EF4444]"
                )}
              >
                {stat.change}
              </span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{stat.title}</p>
              {stat.tooltip && <HelpTooltip content={stat.tooltip} />}
            </div>

            {/* Value */}
            <p className="text-base md:text-lg xl:text-xl font-bold font-mono mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{stat.value}</p>

            {/* Sparkline */}
            {stat.sparklineData && stat.sparklineColor && (
              <div className="mb-2">
                <Sparkline
                  data={stat.sparklineData}
                  color={stat.sparklineColor}
                  height={32}
                  width={120}
                  showArea={true}
                  animate={true}
                />
              </div>
            )}

            {/* Count */}
            {stat.count && (
              <p className="text-[10px] md:text-xs text-muted-foreground">{stat.count}</p>
            )}

          </motion.div>
        ))}
      </div>

      {/* Savings Card - Full width horizontal banner */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-foreground/10 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left side - Icon, Title, Value */}
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-lg bg-foreground/5", savingsCard.iconColor)}>
              <savingsCard.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs md:text-sm text-muted-foreground">{savingsCard.title}</p>
                {savingsCard.tooltip && <HelpTooltip content={savingsCard.tooltip} />}
              </div>
              <p className="text-xl md:text-2xl font-bold font-mono">{savingsCard.value}</p>
            </div>
          </div>

          {/* Right side - Progress bar */}
          <div className="flex-1 sm:max-w-md w-full">
            <div className="flex items-center justify-end mb-2">
              <span
                className={cn(
                  "text-xs md:text-sm font-medium",
                  savingsCard.changeType === "positive" ? "text-[#22C55E]" : "text-[#EF4444]"
                )}
              >
                {savingsCard.change}
              </span>
            </div>
            <div className="h-3 md:h-4 bg-foreground/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full transition-all duration-500"
                style={{ width: savingsCard.value }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
