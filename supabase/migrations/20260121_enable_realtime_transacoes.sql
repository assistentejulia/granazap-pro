-- Migration: Enable Realtime for transacoes table
-- Description: Adds the transacoes table to the supabase_realtime publication to allow listening for changes.

BEGIN;
  -- Add table to publication if it exists
  -- Using a DO block to avoid errors if already added (though standard SQL might just work or warn)
  -- Actually, standard Postgres allows adding if not present, but let's be simple.
  
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transacoes;
  
COMMIT;
