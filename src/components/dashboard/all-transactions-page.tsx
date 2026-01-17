"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Wallet, X, Upload } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAllTransactions } from "@/hooks/use-all-transactions";
import { useAccountFilter } from "@/hooks/use-account-filter";
import { useAccounts } from "@/hooks/use-accounts";
import { useTransactionsExport } from "@/hooks/use-transactions-export";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { InfoCard } from "@/components/ui/info-card";
import { EmptyStateEducational } from "@/components/ui/empty-state-educational";
import { ExportDropdown } from "./export-dropdown";
import { TransactionFilters, TransactionType } from "@/components/dashboard/transaction-filters";
import { OFXReconciliationModal } from "@/components/dashboard/ofx-reconciliation-modal";
import { usePermissions } from "@/hooks/use-permissions";

export function AllTransactionsPage() {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { exportTransactionsToPDF, exportTransactionsToExcel } = useTransactionsExport();
  const { canCreate } = usePermissions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contaIdParam = searchParams.get('conta_id');

  const { filter: accountType } = useAccountFilter();
  const { accounts } = useAccounts(accountType);

  // Initialize filters with defaults
  const currentYear = new Date().getFullYear();
  const [accountId, setAccountId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [startDate, setStartDate] = useState<string | null>(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState<string | null>(`${currentYear}-12-31`);
  const [transactionType, setTransactionType] = useState<TransactionType>('all');

  // Sync with URL param for account filter if present
  useEffect(() => {
    if (contaIdParam) {
      setAccountId(contaIdParam);
    }
  }, [contaIdParam]);

  // Data fetching
  // Force 'custom' period when using start/end date logic
  const customRange = (startDate && endDate) ? { start: startDate, end: endDate } : null;
  // If dates are invalid, fallback to 'year' (though UI enforces dates)
  const period = customRange ? 'custom' : 'year';

  const { transactions, loading } = useAllTransactions(period as any, customRange);

  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOFXModalOpen, setIsOFXModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const locales = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES'
  };

  // Encontrar nome da conta filtrada (se usarmos o state accountId)
  const activeAccountName = accountId !== 'all' ? accounts.find(a => a.id.toString() === accountId)?.nome : null;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Search
      const matchesSearch = t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.categoria?.descricao || "").toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Account Filter
      const matchesAccount = accountId === 'all' ? true : t.conta_id === accountId;

      // 3. Category Filter
      const matchesCategory = categoryId === 'all' ? true : t.categoria_id.toString() === categoryId;

      // 4. Transaction Type Filter
      let matchesType = true;
      if (transactionType === 'all') {
        matchesType = true;
      } else if (transactionType === 'receita') {
        matchesType = t.tipo === 'entrada' && !t.is_transferencia;
      } else if (transactionType === 'despesa') {
        matchesType = t.tipo === 'saida' && !t.is_transferencia;
      } else if (transactionType === 'transferencia') {
        matchesType = t.is_transferencia === true;
      }

      return matchesSearch && matchesAccount && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, accountId, categoryId, transactionType]);

  const clearAccountFilter = () => {
    setAccountId('all');
    router.push('/dashboard/transacoes');
  };

  const totalIncome = filteredTransactions.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + Number(t.valor), 0);
  const totalExpense = filteredTransactions.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + Number(t.valor), 0);
  const balance = totalIncome - totalExpense;

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleExportPDF = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Yield to UI
    exportTransactionsToPDF(filteredTransactions, formatCurrency);
    setIsExporting(false);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Yield to UI
    exportTransactionsToExcel(filteredTransactions, formatCurrency);
    setIsExporting(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{t('sidebar.transactions')}</h1>
            <span className={cn(
              "px-2 md:px-3 py-1 rounded-full text-xs font-semibold",
              accountType === 'pessoal'
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
            )}>
              {accountType === 'pessoal' ? `👤 ${t('sidebar.personal')}` : `🏢 ${t('sidebar.pj')}`}
            </span>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            {t('transactions.manageIncome')} & {t('transactions.manageExpenses')}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {canCreate() && (
            <button
              onClick={() => setIsOFXModalOpen(true)}
              className="px-3 md:px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg font-medium hover:bg-blue-500/20 transition-colors text-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar OFX</span>
            </button>
          )}
          <ExportDropdown
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('transactions.income')}</p>
          <p className="text-xl md:text-2xl font-bold font-mono text-primary">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('transactions.expenses')}</p>
          <p className="text-xl md:text-2xl font-bold font-mono text-destructive">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('dashboard.stats.balance')}</p>
          <p className={cn(
            "text-xl md:text-2xl font-bold font-mono",
            balance >= 0 ? "text-primary" : "text-destructive"
          )}>
            {formatCurrency(Math.abs(balance))}
          </p>
        </div>
      </div>

      {/* Active Filters Badges */}
      {activeAccountName && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrando por:</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">{activeAccountName}</span>
            <button
              onClick={clearAccountFilter}
              className="ml-1 text-blue-400/60 hover:text-blue-400 transition-colors"
              aria-label="Remover filtro"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search - NEW IMPLEMENTATION */}
      <div className="space-y-4">
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
          showTypeFilter={true}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
        />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('common.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Info Card */}
      {transactions.length > 0 && accountId === 'all' && (
        <InfoCard
          title={t('allTransactions.infoCardTitle')}
          description={t('allTransactions.infoCardDescription')}
          tips={[
            t('allTransactions.infoCardTip1'),
            t('allTransactions.infoCardTip2'),
            t('allTransactions.infoCardTip3'),
            t('allTransactions.infoCardTip4'),
          ]}
          storageKey="transactions-tip"
        />
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('form.type')}</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.description')}</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.category')}</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.date')}</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.amount')}</th>
                <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-muted rounded w-16" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-muted rounded w-24" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-muted rounded w-24" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-muted rounded w-20 ml-auto" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-muted rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    {searchTerm || accountId !== 'all' || transactionType !== 'all' ? (
                      <div className="text-center text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p>{t('common.noTransactions')}</p>
                      </div>
                    ) : (
                      <EmptyStateEducational
                        icon={Wallet}
                        title="Nenhuma Transação Registrada"
                        description="Comece a registrar suas receitas e despesas para ter controle total das suas finanças!"
                        whatIs="Transações são todas as movimentações financeiras que já aconteceram: dinheiro que entrou (receitas) ou saiu (despesas). Cada transação afeta o saldo da sua conta automaticamente."
                        howToUse={[
                          { step: 1, text: 'Vá para a página de Receitas ou Despesas' },
                          { step: 2, text: 'Escolha o tipo: Receita (dinheiro que entrou) ou Despesa (dinheiro que saiu)' },
                          { step: 3, text: 'Preencha descrição, valor, categoria e data' },
                          { step: 4, text: 'Selecione a conta bancária afetada' },
                          { step: 5, text: 'O saldo da conta é atualizado automaticamente!' }
                        ]}
                        example='Exemplo: Você recebeu salário de R$ 3.000 dia 05/01. Crie uma Receita "Salário", valor R$ 3.000, categoria "Salário", conta "Nubank". O saldo da conta Nubank aumenta R$ 3.000 automaticamente!'
                      />
                    )}
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        transaction.tipo === 'entrada'
                          ? "bg-[#22C55E]/10 text-[#22C55E]"
                          : "bg-red-500/10 text-red-500"
                      )}>
                        {transaction.tipo === 'entrada' ? t('transactions.income') : t('transactions.expenses')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-foreground font-medium">
                      {transaction.descricao}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                        {transaction.categoria?.descricao || t('dashboard.recent.noCategory')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {(() => {
                        const dateStr = transaction.data.split('T')[0];
                        const [year, month, day] = dateStr.split('-');
                        const date = new Date(Number(year), Number(month) - 1, Number(day));
                        return date.toLocaleDateString(locales[language]);
                      })()}
                    </td>
                    <td className={cn(
                      "py-4 px-6 text-sm font-medium font-mono text-right",
                      transaction.tipo === 'entrada' ? "text-[#22C55E]" : "text-red-500"
                    )}>
                      {formatCurrency(transaction.valor)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        transaction.tipo === 'entrada'
                          ? "bg-[#22C55E]/10 text-[#22C55E]"
                          : "bg-red-500/10 text-red-500"
                      )}>
                        {transaction.tipo === 'entrada' ? t('status.received') : t('status.paid')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {t('pagination.showing')} {startIndex + 1} {t('pagination.to')} {Math.min(endIndex, filteredTransactions.length)} {t('pagination.of')} {filteredTransactions.length} {t('pagination.transactions')}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                  currentPage === 1
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                {t('pagination.previous')}
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        )}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                  currentPage === totalPages
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                {t('pagination.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OFX Reconciliation Modal */}
      <OFXReconciliationModal
        isOpen={isOFXModalOpen}
        onClose={() => setIsOFXModalOpen(false)}
        onSuccess={() => {
          // Refresh transactions after successful import
          window.location.reload();
        }}
      />
    </div>
  );
}
