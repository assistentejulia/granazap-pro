-- ==============================================================================
-- MIGRATION: Fix RLS Policies for Dependent Access
-- Description: Allows dependent users to access and modify data of their Principal.
-- ==============================================================================

-- 1. Create helper function to check access (Owner OR Dependent)
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
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

COMMENT ON FUNCTION public.verificar_acesso_usuario(INTEGER) IS 'Returns true if current user is the owner of target_id OR an active dependent of it.';

-- 2. Update RLS Policies for TRANSACOES
-- We drop existing policies to ensure clean state and avoid conflicts if names differ slightly
DROP POLICY IF EXISTS "transacoes_select_segura" ON public.transacoes;
DROP POLICY IF EXISTS "transacoes_insert_segura" ON public.transacoes;
DROP POLICY IF EXISTS "transacoes_update_segura" ON public.transacoes;
DROP POLICY IF EXISTS "transacoes_delete_segura" ON public.transacoes;

CREATE POLICY "transacoes_select_segura" ON public.transacoes
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

CREATE POLICY "transacoes_insert_segura" ON public.transacoes
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "transacoes_update_segura" ON public.transacoes
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "transacoes_delete_segura" ON public.transacoes
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));


-- 3. Update RLS Policies for LANCAMENTOS_FUTUROS
DROP POLICY IF EXISTS "lancamentos_select_segura" ON public.lancamentos_futuros;
DROP POLICY IF EXISTS "lancamentos_insert_segura" ON public.lancamentos_futuros;
DROP POLICY IF EXISTS "lancamentos_update_segura" ON public.lancamentos_futuros;
DROP POLICY IF EXISTS "lancamentos_delete_segura" ON public.lancamentos_futuros;

CREATE POLICY "lancamentos_select_segura" ON public.lancamentos_futuros
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

CREATE POLICY "lancamentos_insert_segura" ON public.lancamentos_futuros
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "lancamentos_update_segura" ON public.lancamentos_futuros
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "lancamentos_delete_segura" ON public.lancamentos_futuros
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));


-- 4. Update RLS Policies for CATEGORIA_TRANSACOES
DROP POLICY IF EXISTS "categoria_select_segura" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categoria_insert_segura" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categoria_update_segura" ON public.categoria_trasacoes;
DROP POLICY IF EXISTS "categoria_delete_segura" ON public.categoria_trasacoes;

CREATE POLICY "categoria_select_segura" ON public.categoria_trasacoes
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

-- Typically dependents shouldn't create categories for main user, but if allowed:
CREATE POLICY "categoria_insert_segura" ON public.categoria_trasacoes
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "categoria_update_segura" ON public.categoria_trasacoes
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "categoria_delete_segura" ON public.categoria_trasacoes
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));


-- 5. Update RLS Policies for METAS_ORCAMENTO
DROP POLICY IF EXISTS "metas_select_segura" ON public.metas_orcamento;
DROP POLICY IF EXISTS "metas_insert_segura" ON public.metas_orcamento;
DROP POLICY IF EXISTS "metas_update_segura" ON public.metas_orcamento;
DROP POLICY IF EXISTS "metas_delete_segura" ON public.metas_orcamento;

CREATE POLICY "metas_select_segura" ON public.metas_orcamento
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

CREATE POLICY "metas_insert_segura" ON public.metas_orcamento
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "metas_update_segura" ON public.metas_orcamento
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "metas_delete_segura" ON public.metas_orcamento
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));
