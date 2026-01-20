"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, CreditCard, DollarSign, TrendingUp, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  total_usuarios: number;
  usuarios_ativos: number;
  usuarios_inativos: number;
  usuarios_com_senha: number;
  total_planos: number;
  planos_ativos: number;
  receita_mensal_estimada: number;
  usuarios_por_plano: { plano: string; count: number }[];
}

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Usar RPC para buscar estatísticas (bypassa RLS com SECURITY DEFINER)
      const { data: statsRpc, error: statsError } = await supabase.rpc('admin_get_system_stats');

      if (statsError) {
        console.error('Erro ao buscar estatísticas:', statsError);
        return;
      }

      if (statsRpc) {
        setStats(statsRpc);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-foreground">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Estatísticas do Sistema</h1>
        </div>
        <p className="text-muted-foreground">Visão geral dos dados da plataforma</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Usuários */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="text-3xl font-bold text-foreground">{stats?.total_usuarios || 0}</div>
          </div>
          <div className="text-sm text-muted-foreground">Total de Usuários</div>
        </div>

        {/* Usuários Ativos */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="text-3xl font-bold text-foreground">{stats?.usuarios_ativos || 0}</div>
          </div>
          <div className="text-sm text-muted-foreground">Usuários Ativos</div>
        </div>

        {/* Total de Planos */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="text-3xl font-bold text-foreground">{stats?.total_planos || 0}</div>
          </div>
          <div className="text-sm text-muted-foreground">Planos Cadastrados</div>
        </div>

        {/* Receita Estimada */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(stats?.receita_mensal_estimada || 0)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Receita Mensal Estimada</div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários por Status */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Usuários por Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                <span className="text-muted-foreground">Ativos</span>
              </div>
              <span className="text-foreground font-bold">{stats?.usuarios_ativos || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 dark:bg-red-500"></div>
                <span className="text-muted-foreground">Inativos</span>
              </div>
              <span className="text-foreground font-bold">{stats?.usuarios_inativos || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                <span className="text-muted-foreground">Com Senha</span>
              </div>
              <span className="text-foreground font-bold">{stats?.usuarios_com_senha || 0}</span>
            </div>
          </div>
        </div>

        {/* Usuários por Plano */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Usuários por Plano</h2>
          <div className="space-y-4">
            {stats?.usuarios_por_plano.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.plano}</span>
                <span className="text-foreground font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
