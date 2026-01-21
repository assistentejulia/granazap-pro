-- Migration: Get or Create Category Function
-- Description: Helper function to simplify N8N/WhatsApp integrations.
-- It allows the external system to request a category by NAME.
-- If it exists, it returns the ID. If not, it creates it and returns the new ID.

CREATE OR REPLACE FUNCTION public.get_or_create_category(
    p_usuario_id UUID,          -- Auth ID (UUID)
    p_descricao TEXT,           -- Category Name (e.g., 'Uber')
    p_tipo TEXT DEFAULT 'saida' -- Type (saida/entrada/ambos)
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id BIGINT;
    v_internal_user_id INTEGER;
BEGIN
    -- 1. Convert UUID to Internal Integer ID
    SELECT id INTO v_internal_user_id
    FROM public.usuarios
    WHERE auth_user = p_usuario_id;

    IF v_internal_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found for UUID %', p_usuario_id;
    END IF;

    -- 2. Try to find existing category (Case/Accent Insensitive)
    SELECT id INTO v_id
    FROM public.categoria_trasacoes
    WHERE usuario_id = v_internal_user_id
    AND lower(public.unaccent_immutable(descricao)) = lower(public.unaccent_immutable(p_descricao));

    -- 3. If found, return ID
    IF v_id IS NOT NULL THEN
        RETURN v_id;
    END IF;

    -- 4. If not found, create it
    INSERT INTO public.categoria_trasacoes (usuario_id, descricao, tipo, icon_key)
    VALUES (v_internal_user_id, p_descricao, p_tipo, 'HelpCircle') -- Default icon
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.get_or_create_category IS 'Helper for N8N: Finds category by name or creates it. Call with: SELECT public.get_or_create_category(auth.uid(), ''Name'', ''saida'')';
