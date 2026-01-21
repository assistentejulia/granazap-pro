-- Migration: Revert Realtime Setup
-- Description: Reverses all changes related to Realtime implementation.

BEGIN;

  -- 1. Helper to safely remove tables from publication or just reset it
  -- Since ALTER PUBLICATION DROP TABLE does not support IF EXISTS, and we want a clean slate:
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

  -- 2. Drop the Debug Table
  DROP TABLE IF EXISTS public.debug_live;

  -- 3. Reset Replica Identity for 'transacoes' (Default)
  ALTER TABLE public.transacoes REPLICA IDENTITY DEFAULT;

  -- 4. Drop the special Debug Policy for User 37
  DROP POLICY IF EXISTS "rls_debug_realtime_37" ON public.transacoes;

  -- 5. Restore Original Complex Policies (transacoes_select_segura)
  -- Based on 20260117000000_fix_rls_policies.sql
  
  -- Drop first to be safe
  DROP POLICY IF EXISTS "transacoes_select_segura" ON public.transacoes;
  
  -- Re-create
  CREATE POLICY "transacoes_select_segura" ON public.transacoes
      FOR SELECT USING (verificar_acesso_usuario(usuario_id));

  -- NOTE: "dependentes_veem_transacoes_tipo_conta_permitido" was mentioned as dropped
  -- but it was NOT present in 20260117000000_fix_rls_policies.sql (that file used access function).
  -- If it existed before, it was likely an older policy that was replaced by "transacoes_select_segura".
  -- Since "transacoes_select_segura" covers dependent access via function, restoring it is sufficient.

COMMIT;
