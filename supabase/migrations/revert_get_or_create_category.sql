-- Revert Migration: Drop Get or Create Category Function
-- Description: Drops the helper function 'get_or_create_category' created by 20260121_get_or_create_category_func.sql

DROP FUNCTION IF EXISTS public.get_or_create_category(UUID, TEXT, TEXT);

-- Note: The trigger for transaction linking (20260121_fix_whatsapp_transaction_link.sql) is separate and remains active unless you want to revert that too.
