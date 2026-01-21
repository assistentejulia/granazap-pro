-- Migration: Fix WhatsApp Account Linking (N8N)
-- Description: Adds a trigger to automatically assign a default bank account to transactions 
-- inserted without one (e.g., from WhatsApp/N8N) and backfills existing orphans.
-- FIX: Handles type mismatch between transacoes.usuario_id (INT) and contas_bancarias.usuario_id (UUID)

-- 1. Create function to find and assign default account
CREATE OR REPLACE FUNCTION public.ensure_default_account()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conta_id INTEGER;
    v_auth_uuid UUID;
BEGIN
    -- Only act if conta_id is missing or null
    IF NEW.conta_id IS NULL THEN
        -- Get the Auth UUID from the internal Integer ID
        SELECT auth_user INTO v_auth_uuid
        FROM public.usuarios
        WHERE id = NEW.usuario_id;

        IF v_auth_uuid IS NOT NULL THEN
            -- Find the first available account using the Auth UUID
            -- We assume contas_bancarias.usuario_id is UUID based on RLS policies
            SELECT id INTO v_conta_id 
            FROM public.contas_bancarias 
            WHERE usuario_id = v_auth_uuid -- UUID comparison
            ORDER BY id ASC 
            LIMIT 1;
            
            -- If an account was found, assign it
            IF v_conta_id IS NOT NULL THEN
                NEW.conta_id := v_conta_id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 2. Create Trigger (BEFORE INSERT)
DROP TRIGGER IF EXISTS trg_ensure_default_account ON public.transacoes;

CREATE TRIGGER trg_ensure_default_account
BEFORE INSERT ON public.transacoes
FOR EACH ROW
EXECUTE FUNCTION public.ensure_default_account();

-- 3. Backfill: Fix existing orphaned transactions
-- Assigns the first found account to any transaction that currently has NULL conta_id
DO $$
DECLARE
    r RECORD;
    v_conta_id INTEGER;
    v_auth_uuid UUID;
BEGIN
    FOR r IN 
        SELECT DISTINCT usuario_id 
        FROM public.transacoes 
        WHERE conta_id IS NULL
    LOOP
        -- Get Auth UUID
        SELECT auth_user INTO v_auth_uuid
        FROM public.usuarios
        WHERE id = r.usuario_id;
        
        IF v_auth_uuid IS NOT NULL THEN
            -- Find default account
            SELECT id INTO v_conta_id 
            FROM public.contas_bancarias 
            WHERE usuario_id = v_auth_uuid
            ORDER BY id ASC 
            LIMIT 1;
            
            IF v_conta_id IS NOT NULL THEN
                UPDATE public.transacoes
                SET conta_id = v_conta_id
                WHERE usuario_id = r.usuario_id AND conta_id IS NULL;
            END IF;
        END IF;
    END LOOP;
END $$;
