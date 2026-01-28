-- =====================================================
-- FIX: Allow access on the day of expiration (>= 0 instead of > 0)
-- =====================================================

CREATE OR REPLACE FUNCTION public.usuario_tem_acesso_ativo(p_usuario_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    usuario_record RECORD;
    dias_restantes INTEGER;
    config_bloquear BOOLEAN;
BEGIN
    -- Buscar dados do usuário
    SELECT status, plano, data_final_plano, is_admin 
    INTO usuario_record 
    FROM public.usuarios 
    WHERE id = p_usuario_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Verificar status do usuário
    IF usuario_record.status != 'ativo' THEN
        RETURN false;
    END IF;
    
    -- Admins sempre têm acesso
    IF usuario_record.is_admin = true THEN
        RETURN true;
    END IF;
    
    -- Se tem plano premium válido (case-insensitive)
    IF usuario_record.plano IS NOT NULL 
       AND LOWER(usuario_record.plano) != 'free' 
       AND (usuario_record.data_final_plano IS NULL OR usuario_record.data_final_plano >= CURRENT_DATE) THEN
        RETURN true;
    END IF;
    
    -- Verificar configuração de bloqueio
    SELECT bloquear_acesso_apos_vencimento 
    INTO config_bloquear 
    FROM public.configuracoes_sistema 
    WHERE id = 1;
    
    IF NOT FOUND THEN
        config_bloquear := true; -- Default
    END IF;
    
    -- Se não bloqueia após vencimento, libera acesso
    IF NOT config_bloquear THEN
        RETURN true;
    END IF;
    
    -- Para usuários Free, verificar dias restantes
    dias_restantes := calcular_dias_restantes_free(p_usuario_id);
    
    -- FIX: Usar >= 0 para permitir acesso no dia que expira (ou dia 0 de dias restantes)
    RETURN dias_restantes >= 0;
END;
$$;
