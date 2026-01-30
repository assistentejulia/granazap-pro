-- ==============================================================================
-- MIGRATION: Fix RLS Policies for Category Transactions (Strict)
-- Description: Unifies RLS policies for categoria_trasacoes to use verifying_acesso_usuario
--              This fixes the "new row violates RLS" error for dependents.
-- ==============================================================================

-- 1. Ensure the helper function exists and is correct
-- This function checks if the auth user is the owner OR a valid dependent
CREATE OR REPLACE FUNCTION public.verificar_acesso_usuario(target_usuario_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_auth_uid UUID;
BEGIN
    v_auth_uid := auth.uid();
    
    -- Case 1: Direct Access (The user is the owner)
    IF EXISTS (
        SELECT 1 FROM public.usuarios 
        WHERE id = target_usuario_id 
        AND auth_user = v_auth_uid
    ) THEN
        RETURN TRUE;
    END IF;

    -- Case 2: Dependent Access (The user is an active dependent of the owner)
    IF EXISTS (
        SELECT 1 FROM public.usuarios_dependentes
        WHERE usuario_principal_id = target_usuario_id
        AND auth_user_id = v_auth_uid
        AND status = 'ativo'
        -- Optional: Check permissions if needed, but for now we trust active dependents
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

COMMENT ON FUNCTION public.verificar_acesso_usuario(INTEGER) IS 'Returns true if current user is the owner of target_id OR an active dependent of it.';

-- 2. Update RLS Policies for CATEGORIA_TRANSACOES
-- We explicitly drop the restrictive policies and recreate them using the flexible check

DROP POLICY IF EXISTS "categoria_select_segura" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categoria_insert_segura" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categoria_update_segura" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categoria_delete_segura" ON public.categoria_trasacoes;

-- Also drop any other potential policies that might complicate things
DROP POLICY IF EXISTS "dependentes_veem_categorias_sempre" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "dependentes_veem_categorias_tipo_conta_permitido" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categorias_insert_dependentes" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categorias_update_dependentes" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categorias_delete_dependentes" ON public.categoria_trasacoes;


CREATE POLICY "categoria_select_segura" ON public.categoria_trasacoes
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

CREATE POLICY "categoria_insert_segura" ON public.categoria_trasacoes
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "categoria_update_segura" ON public.categoria_trasacoes
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "categoria_delete_segura" ON public.categoria_trasacoes
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));
