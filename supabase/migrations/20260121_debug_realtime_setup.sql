-- Migration: Debug Realtime Setup
-- Description: Refreshes publication and adds a simplified policy for debugging.

BEGIN;

  -- 1. Refresh Publication (Force remove and add)
  -- This ensures no stale configuration exists
  ALTER PUBLICATION supabase_realtime DROP TABLE public.transacoes;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transacoes;

  -- 2. Add Temporary Debug Policy
  -- This allows User 37 to see their transactions WITHOUT using the complex helper function.
  -- This tests if the function 'verificar_acesso_usuario' is the cause of the Realtime failure.
  
  -- Drop if exists to avoid errors on re-run
  DROP POLICY IF EXISTS "rls_debug_realtime_37" ON public.transacoes;

  CREATE POLICY "rls_debug_realtime_37"
  ON public.transacoes
  FOR SELECT
  TO authenticated
  USING (
    usuario_id = 37  -- Hardcoded for debugging User 37
  );

COMMIT;
