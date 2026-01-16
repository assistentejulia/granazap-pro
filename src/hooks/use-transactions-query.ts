"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import { useAccountFilter } from "./use-account-filter";
import { useUserFilter } from "./use-user-filter";

interface Transaction {
  id: number;
  data: string;
  valor: number;
  descricao: string;
  tipo: 'entrada' | 'saida';
  categoria_id: number;
  tipo_conta: 'pessoal' | 'pj';
  mes: string;
  conta_id?: string;
  recebedor?: string;
  pagador?: string;
  categoria?: {
    descricao: string;
    icon_key?: string;
  };
}

interface TransactionStats {
  balance: number;
  income: number;
  incomeCount: number;
  expenses: number;
  expensesCount: number;
  savingsRate: number;
}

async function fetchTransactions(
  userId: number,
  accountFilter: 'pessoal' | 'pj',
  period: 'day' | 'week' | 'month' | 'year' | 'custom',
  customRange?: { start: string; end: string } | null,
  userFilter?: 'todos' | 'principal' | number | null,
  accountId?: string | 'all',
  categoryId?: string | 'all',
  excludeInitialBalance: boolean = false
): Promise<{ transactions: Transaction[]; stats: TransactionStats }> {
  const supabase = createClient();

  // Calcular período
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (period === 'custom' && customRange) {
    startDate = new Date(customRange.start);
    endDate = new Date(customRange.end);
  } else {
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        // Início da semana (domingo)
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        // Fim da semana (sábado)
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
    }
  }

  // Formatar datas localmente sem timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let startDateStr: string;
  let endDateStr: string;

  if (period === 'custom' && customRange) {
    // Usar strings diretamente para evitar problemas de timezone
    startDateStr = customRange.start;
    endDateStr = customRange.end;
  } else {
    startDateStr = formatLocalDate(startDate);
    endDateStr = formatLocalDate(endDate);
  }


  let query = supabase
    .from('transacoes')
    .select(`
      *,
      categoria:categoria_trasacoes(descricao, icon_key)
    `)
    .eq('usuario_id', userId)
    .eq('tipo_conta', accountFilter)
    .gte('data', startDateStr)
    .lte('data', endDateStr)
    .or('is_transferencia.is.null,is_transferencia.eq.false'); // Excluir transferências

  // Aplicar filtro de usuário se necessário
  if (userFilter === 'principal') {
    query = query.is('dependente_id', null);
  } else if (typeof userFilter === 'number' && userFilter > 0) {
    query = query.eq('dependente_id', userFilter);
  }

  // Aplicar filtro de conta bancária
  if (accountId && accountId !== 'all') {
    query = query.eq('conta_id', accountId);
  }

  // Aplicar filtro de categoria
  if (categoryId && categoryId !== 'all') {
    query = query.eq('categoria_id', categoryId);
  }

  const { data, error } = await query
    .order('data', { ascending: false })
    .limit(1000); // Limitar a 1000 transações


  if (error) throw error;

  const allTransactions = data || []; // Manter cópia completa
  let transactions = [...allTransactions]; // Cópia para filtrar

  // Filtrar Saldo Inicial se solicitado para os RETORNOS VISUAIS (Listas, Receitas, etc)
  if (excludeInitialBalance) {
    transactions = transactions.filter(t => t.categoria?.descricao !== 'Saldo Inicial');
  }

  // Calcular estatísticas

  // Balance: Deve considerar TODO o dinheiro (incluindo saldo inicial), a menos que
  // a lógica do sistema seja estritamente "Fluxo do Período".
  // Dado o pedido do usuário ("apresenta somente o saldo dessa conta"),
  // o Saldo Total deve incluir o Saldo Inicial.
  // Portanto, usamos allTransactions para o cálculo do balanço se excludeInitialBalance for true?
  // Mas cuidado: se 'stats' for usado para 'Resultado do Mês', isso pode confundir.
  // Porém, 'Saldo Total' geralmente é acumulativo.
  // Assumindo que o card "Saldo Total" deve mostrar o dinheiro real:

  const balanceIncome = allTransactions
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + Number(t.valor), 0);

  const balanceExpenses = allTransactions
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + Number(t.valor), 0);

  // Income/Expenses para EXIBIÇÃO (Charts, Cards de Receita/Despesa) devem respeitar o filtro
  const displayIncome = transactions
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + Number(t.valor), 0);

  const displayExpenses = transactions
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + Number(t.valor), 0);

  const stats: TransactionStats = {
    balance: balanceIncome - balanceExpenses, // Saldo Real (com Inicial)
    income: displayIncome, // Receita Visual (sem Inicial)
    incomeCount: transactions.filter(t => t.tipo === 'entrada').length,
    expenses: displayExpenses,
    expensesCount: transactions.filter(t => t.tipo === 'saida').length,
    savingsRate: displayIncome > 0 ? ((displayIncome - displayExpenses) / displayIncome) * 100 : 0,
  };

  return { transactions, stats };
}

export function useTransactionsQuery(
  period: 'day' | 'week' | 'month' | 'year' | 'custom' = 'month',
  customRange?: { start: string; end: string } | null,
  accountId?: string | 'all',
  categoryId?: string | 'all',
  excludeInitialBalance: boolean = false
) {
  const { profile } = useUser();
  const { filter: accountFilter } = useAccountFilter();
  const { filter: userFilter } = useUserFilter();
  const queryClient = useQueryClient();

  // Query key incluindo userFilter, customRange, accountId e categoryId para garantir refetch correto
  const queryKey = ['transactions', profile?.id, accountFilter, period, userFilter, period === 'custom' ? customRange : null, accountId, categoryId, excludeInitialBalance];

  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!profile) throw new Error('User not authenticated');
      return fetchTransactions(profile.id, accountFilter, period, customRange, userFilter, accountId, categoryId, excludeInitialBalance);
    },
    enabled: !!profile,
    placeholderData: (previousData) => previousData, // Mantém dados antigos enquanto busca novos
    initialData: () => {
      // Tentar pegar dados do cache
      return queryClient.getQueryData(queryKey);
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  return {
    transactions: query.data?.transactions || [],
    stats: query.data?.stats || {
      balance: 0,
      income: 0,
      incomeCount: 0,
      expenses: 0,
      expensesCount: 0,
      savingsRate: 0,
    },
    loading: query.isLoading && !query.data, // Só loading se não tem dados
    error: query.error,
    refetch: invalidateAll,
    isRefetching: query.isRefetching,
  };
}
