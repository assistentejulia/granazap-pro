-- Função para atualizar o saldo da conta
CREATE OR REPLACE FUNCTION public.update_saldo_conta()
RETURNS TRIGGER AS $$
BEGIN
    -- Operação INSERT
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.contas_bancarias
        SET saldo_atual = saldo_atual + (
            CASE 
                WHEN NEW.tipo = 'entrada' THEN NEW.valor 
                ELSE -NEW.valor 
            END
        )
        WHERE id = NEW.conta_id;
        RETURN NEW;
    
    -- Operação DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.contas_bancarias
        SET saldo_atual = saldo_atual - (
            CASE 
                WHEN OLD.tipo = 'entrada' THEN OLD.valor 
                ELSE -OLD.valor 
            END
        )
        WHERE id = OLD.conta_id;
        RETURN OLD;
    
    -- Operação UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Reverter o valor antigo
        UPDATE public.contas_bancarias
        SET saldo_atual = saldo_atual - (
            CASE 
                WHEN OLD.tipo = 'entrada' THEN OLD.valor 
                ELSE -OLD.valor 
            END
        )
        WHERE id = OLD.conta_id;

        -- Aplicar o novo valor (na nova conta, se mudou, ou na mesma)
        UPDATE public.contas_bancarias
        SET saldo_atual = saldo_atual + (
            CASE 
                WHEN NEW.tipo = 'entrada' THEN NEW.valor 
                ELSE -NEW.valor 
            END
        )
        WHERE id = NEW.conta_id;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualização automática
DROP TRIGGER IF EXISTS trg_update_saldo_conta ON public.transacoes;

CREATE TRIGGER trg_update_saldo_conta
AFTER INSERT OR UPDATE OR DELETE ON public.transacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_saldo_conta();

-- Garantir ON DELETE CASCADE na chave estrangeira conta_id
-- Primeiro removemos a constraint existente (precisamos saber o nome ou tentar descobrir, 
-- mas geralmente é transacoes_conta_id_fkey ou similar. Vamos usar uma abordagem segura com DO block)

DO $$
DECLARE
    CONSTRAINT_NAME text;
BEGIN
    SELECT conname INTO CONSTRAINT_NAME
    FROM pg_constraint
    WHERE conrelid = 'public.transacoes'::regclass
    AND confrelid = 'public.contas_bancarias'::regclass
    AND contype = 'f';

    IF CONSTRAINT_NAME IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.transacoes DROP CONSTRAINT ' || CONSTRAINT_NAME;
    END IF;

    -- Recriar com CASCADE
    ALTER TABLE public.transacoes
    ADD CONSTRAINT transacoes_conta_id_fkey
    FOREIGN KEY (conta_id)
    REFERENCES public.contas_bancarias(id)
    ON DELETE CASCADE;
END $$;
