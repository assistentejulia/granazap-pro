-- ==============================================================================
-- MIGRATION: Fix RLS Policies for Accounts and Cards (UUID Support)
-- Description: Extends RLS to Accounts and Cards, supporting UUID foreign keys.
-- ==============================================================================

-- 1. Create overloaded helper function for UUIDs
CREATE OR REPLACE FUNCTION public.verificar_acesso_usuario(target_usuario_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_auth_uid UUID;
BEGIN
    v_auth_uid := auth.uid();
    
    -- Case 1: Direct Access (The user IS the target)
    IF target_usuario_id = v_auth_uid THEN
        RETURN TRUE;
    END IF;

    -- Case 2: Dependent Access
    -- The user (v_auth_uid) is identifying as a dependent of the target_usuario_id (Owner)
    -- We need to check if v_auth_uid is an ACTIVE dependent of the user who has auth_user = target_usuario_id
    IF EXISTS (
        SELECT 1 FROM public.usuarios_dependentes dep
        JOIN public.usuarios owner ON owner.id = dep.usuario_principal_id
        WHERE owner.auth_user = target_usuario_id -- The target is the UUID of the owner
        AND dep.auth_user_id = v_auth_uid         -- The requestor is the dependent
        AND dep.status = 'ativo'
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

COMMENT ON FUNCTION public.verificar_acesso_usuario(UUID) IS 'Returns true if current user IS the target UUID OR is an active dependent of the user with that UUID.';

-- 2. Update RLS Policies for CONTAS_BANCARIAS
ALTER TABLE public.contas_bancarias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contas_select_segura" ON public.contas_bancarias;
DROP POLICY IF EXISTS "contas_insert_segura" ON public.contas_bancarias;
DROP POLICY IF EXISTS "contas_update_segura" ON public.contas_bancarias;
DROP POLICY IF EXISTS "contas_delete_segura" ON public.contas_bancarias;

CREATE POLICY "contas_select_segura" ON public.contas_bancarias
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

CREATE POLICY "contas_insert_segura" ON public.contas_bancarias
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "contas_update_segura" ON public.contas_bancarias
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "contas_delete_segura" ON public.contas_bancarias
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));


-- 3. Update RLS Policies for CARTOES_CREDITO
ALTER TABLE public.cartoes_credito ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cartoes_select_segura" ON public.cartoes_credito;
DROP POLICY IF EXISTS "cartoes_insert_segura" ON public.cartoes_credito;
DROP POLICY IF EXISTS "cartoes_update_segura" ON public.cartoes_credito;
DROP POLICY IF EXISTS "cartoes_delete_segura" ON public.cartoes_credito;

CREATE POLICY "cartoes_select_segura" ON public.cartoes_credito
    FOR SELECT USING (verificar_acesso_usuario(usuario_id));

CREATE POLICY "cartoes_insert_segura" ON public.cartoes_credito
    FOR INSERT WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "cartoes_update_segura" ON public.cartoes_credito
    FOR UPDATE USING (verificar_acesso_usuario(usuario_id))
    WITH CHECK (verificar_acesso_usuario(usuario_id));

CREATE POLICY "cartoes_delete_segura" ON public.cartoes_credito
    FOR DELETE USING (verificar_acesso_usuario(usuario_id));
