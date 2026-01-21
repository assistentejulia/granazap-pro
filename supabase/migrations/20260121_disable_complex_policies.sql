-- Migration: Disable Complex Policies
-- Description: Temporarily drops complex RLS policies on 'transacoes' to isolate Realtime connection issues.
--              Only 'rls_debug_realtime_37' will remain active for User 37.

BEGIN;

  -- Drop the complex policies that might be crashing
  DROP POLICY IF EXISTS "transacoes_select_segura" ON public.transacoes;
  DROP POLICY IF EXISTS "dependentes_veem_transacoes_tipo_conta_permitido" ON public.transacoes;
  
  -- Note: We are keeping the 'debug' policy created in the previous step:
  -- "rls_debug_realtime_37" (Simple check: usuario_id = 37)

COMMIT;
