-- =====================================================
-- MIGRATION: Adicionar Filtros Avançados na Gestão de Usuários
-- Data: 12/01/2026
-- Descrição: Cria nova função admin_list_users_v2 com múltiplos filtros
--            mantendo compatibilidade total com função existente
-- =====================================================

-- 1. Criar nova função com filtros avançados
CREATE OR REPLACE FUNCTION admin_list_users_v2(
    p_search text DEFAULT NULL,
    p_plano_ids integer[] DEFAULT NULL,
    p_status text[] DEFAULT NULL,
    p_is_admin boolean DEFAULT NULL,
    p_has_password boolean DEFAULT NULL,
    p_data_cadastro_inicio date DEFAULT NULL,
    p_data_cadastro_fim date DEFAULT NULL,
    p_plano_valido boolean DEFAULT NULL,
    p_ultimo_acesso_dias integer DEFAULT NULL,
    p_limit integer DEFAULT 25,
    p_offset integer DEFAULT 0
)
RETURNS TABLE(
    id integer,
    nome text,
    email text,
    celular text,
    plano text,
    plano_id integer,
    status text,
    is_admin boolean,
    data_compra timestamp with time zone,
    data_final_plano timestamp with time zone,
    data_ultimo_acesso timestamp with time zone,
    has_password boolean,
    created_at timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Verificar se é admin
    IF NOT is_user_admin() THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores.';
    END IF;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.nome,
        u.email,
        u.celular,
        COALESCE(p.nome::text, u.plano, 'Free') as plano,
        u.plano_id,
        u.status,
        u.is_admin,
        u.data_compra,
        u.data_final_plano,
        u.data_ultimo_acesso,
        u.has_password,
        u.created_at
    FROM usuarios u
    LEFT JOIN planos_sistema p ON u.plano_id = p.id
    WHERE 
        -- Filtro de busca por texto (nome ou email)
        (p_search IS NULL OR u.nome ILIKE '%' || p_search || '%' OR u.email ILIKE '%' || p_search || '%')
        
        -- Filtro por plano_id (array de IDs)
        AND (p_plano_ids IS NULL OR u.plano_id = ANY(p_plano_ids))
        
        -- Filtro por status (array de status)
        AND (p_status IS NULL OR u.status = ANY(p_status))
        
        -- Filtro por tipo de usuário (admin ou não)
        AND (p_is_admin IS NULL OR u.is_admin = p_is_admin)
        
        -- Filtro por ter senha/login
        AND (p_has_password IS NULL OR u.has_password = p_has_password)
        
        -- Filtro por data de cadastro (início)
        AND (p_data_cadastro_inicio IS NULL OR u.created_at::date >= p_data_cadastro_inicio)
        
        -- Filtro por data de cadastro (fim)
        AND (p_data_cadastro_fim IS NULL OR u.created_at::date <= p_data_cadastro_fim)
        
        -- Filtro por validade do plano
        AND (
            p_plano_valido IS NULL 
            OR (p_plano_valido = true AND (u.data_final_plano IS NULL OR u.data_final_plano >= NOW()))
            OR (p_plano_valido = false AND u.data_final_plano IS NOT NULL AND u.data_final_plano < NOW())
        )
        
        -- Filtro por último acesso (dias atrás)
        AND (
            p_ultimo_acesso_dias IS NULL 
            OR u.data_ultimo_acesso >= NOW() - (p_ultimo_acesso_dias || ' days')::interval
        )
    ORDER BY u.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- 2. Adicionar comentário na função
COMMENT ON FUNCTION admin_list_users_v2 IS 'Lista usuários com filtros avançados: plano, status, admin, login, datas, validade. Mantém compatibilidade com admin_list_users.';

-- 3. Criar índices para otimizar performance dos filtros
CREATE INDEX IF NOT EXISTS idx_usuarios_plano_id ON usuarios(plano_id) WHERE plano_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_is_admin ON usuarios(is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_usuarios_has_password ON usuarios(has_password);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usuarios_data_final_plano ON usuarios(data_final_plano) WHERE data_final_plano IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_data_ultimo_acesso ON usuarios(data_ultimo_acesso DESC);

-- 4. Criar índice composto para busca por nome/email
CREATE INDEX IF NOT EXISTS idx_usuarios_nome_email_search ON usuarios USING gin(to_tsvector('portuguese', nome || ' ' || email));

COMMENT ON INDEX idx_usuarios_plano_id IS 'Otimiza filtro por plano';
COMMENT ON INDEX idx_usuarios_status IS 'Otimiza filtro por status';
COMMENT ON INDEX idx_usuarios_is_admin IS 'Otimiza filtro por admin (apenas true)';
COMMENT ON INDEX idx_usuarios_has_password IS 'Otimiza filtro por login';
COMMENT ON INDEX idx_usuarios_created_at IS 'Otimiza ordenação e filtro por data de cadastro';
COMMENT ON INDEX idx_usuarios_data_final_plano IS 'Otimiza filtro por validade do plano';
COMMENT ON INDEX idx_usuarios_data_ultimo_acesso IS 'Otimiza filtro por último acesso';
COMMENT ON INDEX idx_usuarios_nome_email_search IS 'Otimiza busca full-text por nome/email';
