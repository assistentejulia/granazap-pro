-- Migration to add ultima_atualizacao to transaction tables to fix trigger error
-- The error 'record "new" has no field "ultima_atualizacao"' indicates that
-- the handle_updated_at trigger is applied to tables that don't have this column.

-- Add ultima_atualizacao to transacoes if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'transacoes' 
        AND column_name = 'ultima_atualizacao'
    ) THEN
        ALTER TABLE transacoes ADD COLUMN ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add ultima_atualizacao to contas_bancarias if it doesn't exist (just in case)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'contas_bancarias' 
        AND column_name = 'ultima_atualizacao'
    ) THEN
        ALTER TABLE contas_bancarias ADD COLUMN ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add ultima_atualizacao to cartoes_credito if it doesn't exist (just in case)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cartoes_credito' 
        AND column_name = 'ultima_atualizacao'
    ) THEN
        ALTER TABLE cartoes_credito ADD COLUMN ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;
