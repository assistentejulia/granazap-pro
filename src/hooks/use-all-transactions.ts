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
  is_transferencia?: boolean;
  categoria?: {
    descricao: string;
    icon_key?: string;
  };
}

async function fetchAllTransactions(
  userId: number,
  accountFilter: 'pessoal' | 'pj',
  period: 'day' | 'week' | 'month' | 'year' | 'custom',
  customRange?: { start: string; end: string } | null,
  userFilter?: 'todos' | 'principal' | number | null
): Promise<Transaction[]> {
  const supabase = createClient();

  // Calcular período
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (period === 'custom' && customRange) {
    const [startYear, startMonth, startDay] = customRange.start.split('-').map(Number);
    startDate = new Date(startYear, startMonth - 1, startDay);

    const [endYear, endMonth, endDay] = customRange.end.split('-').map(Number);
    endDate = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
  } else {
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
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

  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();


  let query = supabase
    .from('transacoes')
    .select(`
      *,
      categoria:categoria_trasacoes(descricao, icon_key)
    `)
    .eq('usuario_id', userId)
    .eq('tipo_conta', accountFilter)
    .gte('data', startDateStr)
    .lte('data', endDateStr);
  // NÃO filtra is_transferencia aqui - busca TUDO

  // Aplicar filtro de usuário se necessário
  if (userFilter === 'principal') {
    query = query.is('dependente_id', null);
  } else if (typeof userFilter === 'number' && userFilter > 0) {
    query = query.eq('dependente_id', userFilter);
  }

  const { data, error } = await query
    .order('data', { ascending: false })
    .limit(1000);


  if (error) throw error;

  return data || [];
}

export function useAllTransactions(
  period: 'day' | 'week' | 'month' | 'year' | 'custom' = 'month',
  customRange?: { start: string; end: string } | null
) {
  const { profile } = useUser();
  const { filter: accountFilter } = useAccountFilter();
  const userFilterHook = useUserFilter();
  const userFilter = userFilterHook.filter;
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['all-transactions', profile?.id, accountFilter, period, customRange, userFilter],
    queryFn: () => {
      if (!profile?.id) throw new Error('Usuário não autenticado');
      return fetchAllTransactions(profile.id, accountFilter, period, customRange, userFilter);
    },
    enabled: !!profile?.id,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Minimize cache retention
    refetchOnMount: 'always', // Verify fresh data on mount
    refetchOnWindowFocus: true, // Verify fresh data on focus
  });

  return {
    transactions,
    loading: isLoading,
    refetch,
  };
}
