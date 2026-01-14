-- Migration to fix plan name synchronization
-- 1. Update existing users: Sync 'plano' text column with 'planos_sistema.nome' based on 'plano_id'
UPDATE public.usuarios u
SET plano = p.nome
FROM public.planos_sistema p
WHERE u.plano_id = p.id
AND u.plano <> p.nome;

-- 2. Create a trigger to KEEP them in sync automatically
-- This ensures that any update to plano_id (via admin panel, API, etc.) automatically updates the plano text

CREATE OR REPLACE FUNCTION public.sync_plano_name()
RETURNS TRIGGER AS $$
BEGIN
    -- If plano_id changes or is new, update plano text
    IF (TG_OP = 'INSERT' AND NEW.plano_id IS NOT NULL) OR 
       (TG_OP = 'UPDATE' AND NEW.plano_id IS DISTINCT FROM OLD.plano_id AND NEW.plano_id IS NOT NULL) THEN
           
        SELECT nome INTO NEW.plano
        FROM public.planos_sistema
        WHERE id = NEW.plano_id;
        
        -- If plan not found (should not happen due to FK), keep existing or default
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid duplication
DROP TRIGGER IF EXISTS trigger_sync_plano_name ON public.usuarios;

-- Create trigger
CREATE TRIGGER trigger_sync_plano_name
BEFORE INSERT OR UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.sync_plano_name();
