-- Migration: Sync Dependent Plan Dates
-- Description: Ensures that dependent users inherit the 'data_final_plano' from their principal user.

-- 1. Function to sync plan date from Principal to Dependents (Downstream sync)
CREATE OR REPLACE FUNCTION public.sync_dependents_plan_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run if data_final_plano has changed
    IF NEW.data_final_plano IS DISTINCT FROM OLD.data_final_plano THEN
        UPDATE public.usuarios
        SET data_final_plano = NEW.data_final_plano
        WHERE auth_user IN (
            SELECT auth_user_id
            FROM public.usuarios_dependentes
            WHERE usuario_principal_id = NEW.id
            -- We sync for all linked dependents to ensure consistency, 
            -- even if they are pending, so if they become active they have the correct date.
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on public.usuarios
DROP TRIGGER IF EXISTS trigger_sync_dependents_plan_date ON public.usuarios;
CREATE TRIGGER trigger_sync_dependents_plan_date
AFTER UPDATE OF data_final_plano ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.sync_dependents_plan_date();


-- 2. Function to sync plan date when Dependent is linked/updated (Upstream/Association sync)
CREATE OR REPLACE FUNCTION public.sync_new_dependent_date()
RETURNS TRIGGER AS $$
DECLARE
    v_data_final_plano timestamp with time zone;
BEGIN
    -- fetch principal's date. using dynamic type matching is hard directly in declare without querying information_schema, 
    -- so we rely on the variable type being compatible or casting.
    -- Assuming data_final_plano is timestamp or date.
    
    SELECT data_final_plano INTO v_data_final_plano
    FROM public.usuarios
    WHERE id = NEW.usuario_principal_id;

    -- Update dependent's user record if we found a principal date and we have a linked auth user
    IF v_data_final_plano IS NOT NULL AND NEW.auth_user_id IS NOT NULL THEN
        UPDATE public.usuarios
        SET data_final_plano = v_data_final_plano
        WHERE auth_user = NEW.auth_user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on public.usuarios_dependentes
DROP TRIGGER IF EXISTS trigger_sync_new_dependent_date ON public.usuarios_dependentes;
CREATE TRIGGER trigger_sync_new_dependent_date
AFTER INSERT OR UPDATE OF usuario_principal_id, auth_user_id, status ON public.usuarios_dependentes
FOR EACH ROW
EXECUTE FUNCTION public.sync_new_dependent_date();
