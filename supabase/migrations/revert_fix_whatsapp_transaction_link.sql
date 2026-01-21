-- Revert Migration: Drop Default Account Trigger and Function
-- Description: Reverts changes made by 20260121_fix_whatsapp_transaction_link.sql

-- 1. Drop the trigger first
DROP TRIGGER IF EXISTS trg_ensure_default_account ON public.transacoes;

-- 2. Drop the function
DROP FUNCTION IF EXISTS public.ensure_default_account();
