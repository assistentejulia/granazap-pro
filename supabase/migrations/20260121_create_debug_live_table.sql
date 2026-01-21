-- Migration: Create Debug Live Table
-- Description: Creates a simple table with no RLS to test Realtime connectivity.

BEGIN;

  CREATE TABLE IF NOT EXISTS public.debug_live (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    message TEXT
  );

  -- Enable Realtime
  ALTER PUBLICATION supabase_realtime ADD TABLE public.debug_live;

  -- Ensure NO RLS (Open to public for this test only, or just authenticated)
  ALTER TABLE public.debug_live DISABLE ROW LEVEL SECURITY;

  -- Grant access
  GRANT ALL ON public.debug_live TO postgres, anon, authenticated, service_role;

COMMIT;
