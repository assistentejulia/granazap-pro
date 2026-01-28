'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CreditCard, MessageCircle, Shield, Clock, Database, Calendar } from 'lucide-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { AccountFilterProvider } from '@/contexts/account-filter-context';
import { SidebarProvider } from '@/contexts/sidebar-context';
import dynamic from 'next/dynamic';

// Sidebar com SSR desabilitado
const DashboardSidebarDynamic = dynamic(
  () => import('@/components/dashboard/sidebar').then(m => ({
    default: m.DashboardSidebar
  })),
  {
    ssr: false,
    loading: () => (
      <div className="w-[260px] bg-[#111827] border-r border-white/5 animate-pulse flex-shrink-0" />
    )
  }
);

// Header com SSR desabilitado
const DashboardHeaderDynamic = dynamic(
  () => import('@/components/dashboard/header').then(m => ({
    default: m.DashboardHeader
  })),
  {
    ssr: false,
    loading: () => (
      <div className="h-16 bg-[#0A0F1C] border-b border-white/5 animate-pulse" />
    )
  }
);

// Bottom Navigation
const BottomNavDynamic = dynamic(
  () => import('@/components/dashboard/bottom-nav').then(m => ({
    default: m.BottomNav
  })),
  {
    ssr: false
  }
);

function BlockedPageContent() {
  const router = useRouter();
  const subscriptionStatus = useSubscriptionStatus();
  const systemSettings = useSystemSettings();

  const { daysExpired, planName, blockingLevel, loading } = subscriptionStatus;
  const dataFinalPlano = subscriptionStatus.dataFinalPlano;

  // SEGURANÇA: Redirecionar se não deveria estar bloqueado
  useEffect(() => {
    if (!loading && blockingLevel !== 'hard-block') {
      router.replace('/dashboard');
    }
  }, [loading, blockingLevel, router]);

  const handleUpgrade = () => {
    router.push('/planos');
  };

  const handleSupport = () => {
    // Priorizar e-mail conforme solicitado
    window.location.href = `mailto:contato@assistentejulia.com.br`;
  };

  const formatExpirationDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Data não disponível';
    }
  };

  if (loading || systemSettings.loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header com ícone */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-2">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Acesso Bloqueado
          </h1>
          <div className="space-y-1">
            <p className="text-lg text-gray-600">
              Seu plano expirou há <span className="font-semibold text-red-600">{daysExpired} dias</span>
            </p>
            {dataFinalPlano && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Data de expiração: {formatExpirationDate(dataFinalPlano)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card principal */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="text-center pb-4 border-b border-gray-100">
            <CardTitle className="text-2xl text-gray-900">Renove para Continuar</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Para voltar a usar a plataforma, escolha um plano que atenda suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Informações do plano anterior */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">
                Seu plano anterior:
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {planName || 'Plano Free'}
              </p>
            </div>

            {/* Benefícios de renovar */}
            <div className="space-y-4">
              <p className="font-medium text-gray-900 text-lg">
                Ao renovar, você terá:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Acesso Imediato aos Seus Dados
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Todos os seus dados estão seguros e serão restaurados instantaneamente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="bg-green-100 p-2 rounded-lg shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Recursos Completos
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Acesso total a todas as funcionalidades da plataforma
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Sem Perda de Histórico
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Mantenha todo o seu histórico financeiro intacto
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleUpgrade}
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Ver Planos e Renovar Agora
              </Button>

              <Button
                onClick={handleSupport}
                variant="outline"
                className="w-full h-12 text-base border-gray-200 hover:bg-gray-50 text-gray-700"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Suporte: contato@assistentejulia.com.br
              </Button>
            </div>

            {/* Aviso de dados */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 font-medium mb-1">
                ⏰ Atenção: Seus dados serão mantidos por 30 dias
              </p>
              <p className="text-xs text-amber-700/80">
                Após esse período, seus dados poderão ser removidos permanentemente.
                Renove agora para garantir a segurança das suas informações.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Dúvidas sobre planos ou pagamentos?{' '}
            <button
              onClick={handleSupport}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              Entre em contato: contato@assistentejulia.com.br
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function BlockedPage() {
  return (
    <AccountFilterProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
          {/* Sidebar - Visível e funcional (permite logout) */}
          <div className="filter grayscale opacity-50 pointer-events-none">
            <DashboardSidebarDynamic />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header - Bloqueado para interação */}
            <div className="pointer-events-none opacity-50 grayscale">
              <DashboardHeaderDynamic />
            </div>

            {/* Content */}
            <BlockedPageContent />
          </div>

          {/* Bottom Navigation - Bloqueado */}
          <div className="pointer-events-none opacity-50 grayscale">
            <BottomNavDynamic />
          </div>
        </div>
      </SidebarProvider>
    </AccountFilterProvider>
  );
}
