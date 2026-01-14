-- Migration to add missing function get_usuario_id_from_auth and fix potential missing columns
-- This fixes the error "function get_usuario_id_from_auth() does not exist" called by AdjustBalanceModal

-- 1. Create the missing function expected by the frontend
CREATE OR REPLACE FUNCTION get_usuario_id_from_auth()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- Try to find direct user
    SELECT id INTO v_user_id
    FROM public.usuarios
    WHERE auth_user = auth.uid();
    
    -- If found, return it
    IF v_user_id IS NOT NULL THEN
        RETURN v_user_id;
    END IF;
    
    -- If not found (maybe it's a dependent?), try to find via usuarios_dependentes
    -- This part is optional but good for robustness
    SELECT usuario_principal_id INTO v_user_id
    FROM public.usuarios_dependentes
    WHERE auth_user_id = auth.uid() AND status = 'ativo';
    
    RETURN v_user_id;
END;
$$;

COMMENT ON FUNCTION get_usuario_id_from_auth() IS 'Returns the numeric user ID for the authenticated user (or their principal if dependent)';

-- 2. Add ultima_atualizacao to categoria_trasacoes if it doesn't exist
-- This prevents triggers from failing if they try to update this column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'categoria_trasacoes' 
        AND column_name = 'ultima_atualizacao'
    ) THEN
        ALTER TABLE categoria_trasacoes ADD COLUMN ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 3. Add ultima_atualizacao to metas_orcamento if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'metas_orcamento' 
        AND column_name = 'ultima_atualizacao'
    ) THEN
        ALTER TABLE metas_orcamento ADD COLUMN ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;
