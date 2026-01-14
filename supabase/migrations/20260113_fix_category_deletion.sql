-- Migration to fix category deletion constraint
-- Makes categoria_id nullable to allow deleting categories without deleting transactions

-- Alter transacoes table
ALTER TABLE transacoes ALTER COLUMN categoria_id DROP NOT NULL;

-- Alter lancamentos_futuros table
ALTER TABLE lancamentos_futuros ALTER COLUMN categoria_id DROP NOT NULL;
