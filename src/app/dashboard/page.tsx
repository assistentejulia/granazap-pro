"use client";

import dynamic from 'next/dynamic';

// Componentes com SSR desabilitado para evitar hydration mismatch
const StatsCardsDynamic = dynamic(
  () => import('@/components/dashboard/stats-cards').then(m => ({ default: m.StatsCards })),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="h-20" />
          </div>
        ))}
      </div>
    )
  }
);

const ChartsSectionDynamic = dynamic(
  () => import('@/components/dashboard/enhanced-charts-section').then(m => ({ default: m.EnhancedChartsSection })),
  { ssr: false }
);

const CategoryAnalyticsDynamic = dynamic(
  () => import('@/components/dashboard/category-analytics').then(m => ({ default: m.CategoryAnalytics })),
  { ssr: false }
);

const RecentTransactionsDynamic = dynamic(
  () => import('@/components/dashboard/recent-transactions').then(m => ({ default: m.RecentTransactions })),
  { ssr: false }
);

const UpcomingPaymentsDynamic = dynamic(
  () => import('@/components/dashboard/upcoming-payments').then(m => ({ default: m.UpcomingPayments })),
  { ssr: false }
);

const GoalsProgressDynamic = dynamic(
  () => import('@/components/dashboard/goals-progress').then(m => ({ default: m.GoalsProgress })),
  { ssr: false }
);


import { DashboardFilterProvider } from "@/contexts/dashboard-filter-context";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";

export default function DashboardPage() {
  return (
    <DashboardFilterProvider>
      <div className="space-y-4 md:space-y-6">
        <DashboardFilters />

        {/* Stats Cards */}
        <StatsCardsDynamic />

        {/* Charts Row */}
        <ChartsSectionDynamic />

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <RecentTransactionsDynamic />
          <UpcomingPaymentsDynamic />
        </div>

        {/* Goals Progress */}
        <GoalsProgressDynamic />
      </div>
    </DashboardFilterProvider>
  );
}
