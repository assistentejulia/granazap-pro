import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from './use-user';

export type BlockingLevel = 'none' | 'warning' | 'soft-block' | 'hard-block';

export interface SubscriptionStatus {
  isExpired: boolean;
  daysExpired: number;
  daysUntilExpiration: number;
  blockingLevel: BlockingLevel;
  canAccess: boolean;
  planName: string | null;
  dataFinalPlano: string | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useSubscriptionStatus() {
  const { profile } = useUser();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isExpired: false,
    daysExpired: 0,
    daysUntilExpiration: 0,
    blockingLevel: 'none',
    canAccess: true,
    planName: null,
    dataFinalPlano: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!profile) {
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const supabase = createClient();

        // SEGURANÇA: Buscar status diretamente do backend via RPC
        // Não confiar em dados do cliente
        const { data: accessInfo, error } = await supabase.rpc('verificar_meu_acesso');

        if (error) {
          console.error('Erro ao verificar acesso:', error);
          setStatus(prev => ({ ...prev, loading: false }));
          return;
        }
        
        // FALLBACK: Se RPC não retornar dataFinalPlano, usar do profile
        const dataFinalPlano = accessInfo?.dataFinalPlano || profile.data_fim_plano || null;

        // Admin nunca é bloqueado
        if (accessInfo.isAdmin) {
          setStatus({
            isExpired: false,
            daysExpired: 0,
            daysUntilExpiration: -1,
            blockingLevel: 'none',
            canAccess: true,
            planName: accessInfo.planName,
            dataFinalPlano: dataFinalPlano,
            isAdmin: true,
            loading: false,
          });
          return;
        }

        // Calcular dias até expiração ou dias expirado
        let daysUntilExpiration = 0;
        let daysExpired = 0;
        let isExpired = false;

        if (dataFinalPlano) {
          const expirationDate = new Date(dataFinalPlano);
          const now = new Date();
          const diffTime = expirationDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays < 0) {
            // Expirado
            isExpired = true;
            daysExpired = Math.abs(diffDays);
            daysUntilExpiration = 0;
          } else {
            // Ainda ativo
            isExpired = false;
            daysExpired = 0;
            daysUntilExpiration = diffDays;
          }
        } else {
          // Sem data final (plano vitalício ou erro)
          daysUntilExpiration = -1;
        }

        // Determinar nível de bloqueio
        let blockingLevel: BlockingLevel = 'none';
        let canAccess = true;

        if (isExpired) {
          if (daysExpired >= 14) {
            // Bloqueio total após 14 dias
            blockingLevel = 'hard-block';
            canAccess = false;
          } else if (daysExpired >= 1) {
            // Bloqueio suave (0-13 dias)
            blockingLevel = 'soft-block';
            canAccess = true; // Permite visualizar mas com modal
          }
        } else if (daysUntilExpiration >= 0 && daysUntilExpiration <= 3) {
          // Aviso 3 dias antes
          blockingLevel = 'warning';
          canAccess = true;
        }

        // SEGURANÇA: Validar com backend se realmente tem acesso
        // Não confiar apenas no cálculo do cliente
        if (!accessInfo.hasAccess && !accessInfo.isAdmin) {
          blockingLevel = 'hard-block';
          canAccess = false;
        }

        setStatus({
          isExpired,
          daysExpired,
          daysUntilExpiration,
          blockingLevel,
          canAccess,
          planName: accessInfo.planName || profile.plano || 'Free',
          dataFinalPlano: dataFinalPlano,
          isAdmin: accessInfo.isAdmin || false,
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao verificar status da assinatura:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    checkSubscriptionStatus();

    // Revalidar a cada 5 minutos (segurança contra manipulação)
    const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [profile]);

  return status;
}
