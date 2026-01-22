-- Migration to add admin_get_system_stats RPC function
-- Created: 2026-01-22

CREATE OR REPLACE FUNCTION public.admin_get_system_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_users BIGINT;
    active_users BIGINT;
    inactive_users BIGINT;
    password_users BIGINT;
    total_plans BIGINT;
    active_plans BIGINT;
    estimated_revenue NUMERIC;
    users_by_plan JSON;
    is_admin BOOLEAN;
BEGIN
    -- Check admin permission
    -- Note: auth.uid() returns the current user's ID from Supabase Auth
    SELECT u.is_admin INTO is_admin 
    FROM public.usuarios u 
    WHERE u.auth_user = auth.uid();
    
    IF is_admin IS NULL OR NOT is_admin THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores podem acessar estatísticas.';
    END IF;

    -- Calculate stats
    SELECT count(*) INTO total_users FROM public.usuarios;
    SELECT count(*) INTO active_users FROM public.usuarios WHERE status = 'ativo';
    -- Consider anything not 'ativo' as inactive for this general stat
    SELECT count(*) INTO inactive_users FROM public.usuarios WHERE status != 'ativo';
    SELECT count(*) INTO password_users FROM public.usuarios WHERE has_password = true;

    SELECT count(*) INTO total_plans FROM public.planos_sistema;
    SELECT count(*) INTO active_plans FROM public.planos_sistema WHERE ativo = true;

    -- Calculate revenue: sum of plan values for active users
    -- Users with no plan (plano_id is null) or free plan (value 0) count as 0
    SELECT COALESCE(SUM(p.valor), 0)
    INTO estimated_revenue
    FROM public.usuarios u
    JOIN public.planos_sistema p ON u.plano_id = p.id
    WHERE u.status = 'ativo';

    -- Users by plan breakdown
    SELECT json_agg(t) INTO users_by_plan
    FROM (
        SELECT
            COALESCE(p.nome, 'Sem Plano') as plano,
            count(*) as count
        FROM public.usuarios u
        LEFT JOIN public.planos_sistema p ON u.plano_id = p.id
        GROUP BY p.nome
        ORDER BY count(*) DESC
    ) t;

    RETURN json_build_object(
        'total_usuarios', total_users,
        'usuarios_ativos', active_users,
        'usuarios_inativos', inactive_users,
        'usuarios_com_senha', password_users,
        'total_planos', total_plans,
        'planos_ativos', active_plans,
        'receita_mensal_estimada', estimated_revenue,
        'usuarios_por_plano', COALESCE(users_by_plan, '[]'::json)
    );
END;
$$;
