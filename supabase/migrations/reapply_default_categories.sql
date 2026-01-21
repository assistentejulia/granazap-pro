-- 1. Enable unaccent extension (Required for validation)
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;

-- 2. Create IMMUTABLE wrapper for unaccent (Required for indexes)
CREATE OR REPLACE FUNCTION public.unaccent_immutable(text)
RETURNS text
LANGUAGE sql
IMMUTABLE PARALLEL SAFE STRICT
AS $func$
SELECT public.unaccent($1)
$func$;

-- 3. Drop existing objects to ensure clean slate
DROP TRIGGER IF EXISTS on_auth_user_created_seed_categories ON public.usuarios;
DROP FUNCTION IF EXISTS public.seed_default_categories();
DROP INDEX IF EXISTS idx_unique_category_user;

-- 4. SMART DEDUPLICATION: Reassign FKs before deleting duplicates
-- This handles the "violates foreign key constraint" error
DO $$
DECLARE
    r RECORD;
    keep_id INT;
BEGIN
    -- Iterate over each group of duplicates
    FOR r IN 
        SELECT usuario_id, lower(public.unaccent_immutable(descricao)) as clean_desc
        FROM public.categoria_trasacoes
        GROUP BY usuario_id, lower(public.unaccent_immutable(descricao))
        HAVING count(*) > 1
    LOOP
        -- Find the ID to keep (the oldest one = smallest ID)
        SELECT MIN(id) INTO keep_id
        FROM public.categoria_trasacoes
        WHERE usuario_id = r.usuario_id 
        AND lower(public.unaccent_immutable(descricao)) = r.clean_desc;

        -- Update transactions to point to the kept category
        UPDATE public.transacoes
        SET categoria_id = keep_id
        WHERE categoria_id IN (
            SELECT id FROM public.categoria_trasacoes
            WHERE usuario_id = r.usuario_id 
            AND lower(public.unaccent_immutable(descricao)) = r.clean_desc
            AND id <> keep_id
        );

        -- Update scheduled transactions (lancamentos_futuros)
        UPDATE public.lancamentos_futuros
        SET categoria_id = keep_id
        WHERE categoria_id IN (
            SELECT id FROM public.categoria_trasacoes
            WHERE usuario_id = r.usuario_id 
            AND lower(public.unaccent_immutable(descricao)) = r.clean_desc
            AND id <> keep_id
        );
        
        -- Update goals (metas_orcamento)
        UPDATE public.metas_orcamento
        SET categoria_id = keep_id
        WHERE categoria_id IN (
            SELECT id FROM public.categoria_trasacoes
            WHERE usuario_id = r.usuario_id 
            AND lower(public.unaccent_immutable(descricao)) = r.clean_desc
            AND id <> keep_id
        );

        -- Now safe to delete the duplicates
        DELETE FROM public.categoria_trasacoes
        WHERE usuario_id = r.usuario_id 
        AND lower(public.unaccent_immutable(descricao)) = r.clean_desc
        AND id <> keep_id;
    END LOOP;
END $$;

-- 5. Create/Recreate the unique index with accent/case insensitivity
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_category_user 
ON public.categoria_trasacoes (usuario_id, lower(public.unaccent_immutable(descricao)));

-- 6. Create the seeding function
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.categoria_trasacoes (usuario_id, descricao, tipo, icon_key)
    VALUES
    -- DESPESAS
    (NEW.id, 'Moradia', 'saida', 'Home'),
    (NEW.id, 'Energia elétrica', 'saida', 'Zap'),
    (NEW.id, 'Água e esgoto', 'saida', 'Droplet'),
    (NEW.id, 'Internet e telefone', 'saida', 'Wifi'),
    (NEW.id, 'Transporte', 'saida', 'Car'),
    (NEW.id, 'Alimentação', 'saida', 'ShoppingCart'),
    (NEW.id, 'Saúde', 'saida', 'Pill'),
    (NEW.id, 'Educação', 'saida', 'GraduationCap'),
    (NEW.id, 'Lazer', 'saida', 'Film'),
    (NEW.id, 'Alimentação fora', 'saida', 'Utensils'),
    (NEW.id, 'Compras', 'saida', 'ShoppingBag'),
    (NEW.id, 'Assinaturas e apps', 'saida', 'Smartphone'),
    (NEW.id, 'Pets', 'saida', 'Dog'),
    (NEW.id, 'Juros e multas', 'saida', 'Percent'),
    (NEW.id, 'Tarifas bancárias', 'saida', 'Landmark'),
    (NEW.id, 'Pagamentos de empréstimos', 'saida', 'Banknote'),
    (NEW.id, 'Cartão de crédito', 'saida', 'CreditCard'),
    (NEW.id, 'Anuidade', 'saida', 'CreditCard'),
    (NEW.id, 'Empregada doméstica', 'saida', 'User'),
    (NEW.id, 'Reparos e manutenção', 'saida', 'Wrench'),
    (NEW.id, 'Produtos de limpeza', 'saida', 'Droplet'),
    (NEW.id, 'Doações', 'saida', 'Gift'),
    (NEW.id, 'Seguros', 'saida', 'Shield'),
    
    -- RECEITAS
    (NEW.id, 'Salário', 'entrada', 'Briefcase'),
    (NEW.id, 'Renda extra', 'entrada', 'Receipt'),
    (NEW.id, 'Vendas', 'entrada', 'Package'),
    (NEW.id, 'Dividendos', 'entrada', 'DollarSign'),
    (NEW.id, 'Restituição IR', 'entrada', 'FileText'),
    (NEW.id, 'Empréstimos recebidos', 'entrada', 'Banknote'),
    (NEW.id, 'Cashback', 'entrada', 'CreditCard'),
    (NEW.id, 'Prêmios / Reembolsos', 'entrada', 'Award'),
    (NEW.id, 'Aluguel recebido', 'entrada', 'Home'),
    
    -- TRANSFERÊNCIAS
    (NEW.id, 'Transferência entre contas', 'ambos', 'ArrowRight'),
    (NEW.id, 'Pagamento de cartão', 'ambos', 'CreditCard'),
    (NEW.id, 'Saque em dinheiro', 'ambos', 'Banknote'),
    (NEW.id, 'Depósito em espécie', 'ambos', 'Banknote'),

    -- INVESTIMENTOS
    (NEW.id, 'Aportes', 'ambos', 'TrendingUp'),
    (NEW.id, 'Resgates', 'ambos', 'TrendingUp'),
    (NEW.id, 'Rendimentos recebidos', 'ambos', 'TrendingUp'),
    (NEW.id, 'Corretagens e taxas', 'ambos', 'TrendingUp'),

    -- METAS
    (NEW.id, 'Reserva de emergência', 'saida', 'PiggyBank'),
    (NEW.id, 'Viagem', 'saida', 'Plane'),
    (NEW.id, 'Compra de imóvel', 'saida', 'Home'),
    (NEW.id, 'Troca de carro', 'saida', 'Car'),
    (NEW.id, 'Reformas', 'saida', 'Hammer'),
    (NEW.id, 'Casamento', 'saida', 'Heart'),
    (NEW.id, 'Aposentadoria', 'saida', 'User')
    
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$;

-- 7. Create Trigger
CREATE TRIGGER on_auth_user_created_seed_categories
AFTER INSERT ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.seed_default_categories();

-- 8. BACKFILL: Seed categories for EXISTING users who have 0 categories
DO $$
DECLARE
    user_rec record; -- Renamed from u to avoid shadowing
BEGIN
    FOR user_rec IN (
        SELECT id FROM public.usuarios u
        WHERE NOT EXISTS (SELECT 1 FROM public.categoria_trasacoes ct WHERE ct.usuario_id = u.id)
    ) LOOP
        INSERT INTO public.categoria_trasacoes (usuario_id, descricao, tipo, icon_key) VALUES
        (user_rec.id, 'Moradia', 'saida', 'Home'),
        (user_rec.id, 'Energia elétrica', 'saida', 'Zap'),
        (user_rec.id, 'Água e esgoto', 'saida', 'Droplet'),
        (user_rec.id, 'Internet e telefone', 'saida', 'Wifi'),
        (user_rec.id, 'Transporte', 'saida', 'Car'),
        (user_rec.id, 'Alimentação', 'saida', 'ShoppingCart'),
        (user_rec.id, 'Saúde', 'saida', 'Pill'),
        (user_rec.id, 'Educação', 'saida', 'GraduationCap'),
        (user_rec.id, 'Lazer', 'saida', 'Film'),
        (user_rec.id, 'Alimentação fora', 'saida', 'Utensils'),
        (user_rec.id, 'Compras', 'saida', 'ShoppingBag'),
        (user_rec.id, 'Assinaturas e apps', 'saida', 'Smartphone'),
        (user_rec.id, 'Pets', 'saida', 'Dog'),
        (user_rec.id, 'Juros e multas', 'saida', 'Percent'),
        (user_rec.id, 'Tarifas bancárias', 'saida', 'Landmark'),
        (user_rec.id, 'Pagamentos de empréstimos', 'saida', 'Banknote'),
        (user_rec.id, 'Cartão de crédito', 'saida', 'CreditCard'),
        (user_rec.id, 'Anuidade', 'saida', 'CreditCard'),
        (user_rec.id, 'Empregada doméstica', 'saida', 'User'),
        (user_rec.id, 'Reparos e manutenção', 'saida', 'Wrench'),
        (user_rec.id, 'Produtos de limpeza', 'saida', 'Droplet'),
        (user_rec.id, 'Doações', 'saida', 'Gift'),
        (user_rec.id, 'Seguros', 'saida', 'Shield'),
        (user_rec.id, 'Salário', 'entrada', 'Briefcase'),
        (user_rec.id, 'Renda extra', 'entrada', 'Receipt'),
        (user_rec.id, 'Vendas', 'entrada', 'Package'),
        (user_rec.id, 'Dividendos', 'entrada', 'DollarSign'),
        (user_rec.id, 'Restituição IR', 'entrada', 'FileText'),
        (user_rec.id, 'Empréstimos recebidos', 'entrada', 'Banknote'),
        (user_rec.id, 'Cashback', 'entrada', 'CreditCard'),
        (user_rec.id, 'Prêmios / Reembolsos', 'entrada', 'Award'),
        (user_rec.id, 'Aluguel recebido', 'entrada', 'Home'),
        (user_rec.id, 'Transferência entre contas', 'ambos', 'ArrowRight'),
        (user_rec.id, 'Pagamento de cartão', 'ambos', 'CreditCard'),
        (user_rec.id, 'Saque em dinheiro', 'ambos', 'Banknote'),
        (user_rec.id, 'Depósito em espécie', 'ambos', 'Banknote'),
        (user_rec.id, 'Aportes', 'ambos', 'TrendingUp'),
        (user_rec.id, 'Resgates', 'ambos', 'TrendingUp'),
        (user_rec.id, 'Rendimentos recebidos', 'ambos', 'TrendingUp'),
        (user_rec.id, 'Corretagens e taxas', 'ambos', 'TrendingUp'),
        (user_rec.id, 'Reserva de emergência', 'saida', 'PiggyBank'),
        (user_rec.id, 'Viagem', 'saida', 'Plane'),
        (user_rec.id, 'Compra de imóvel', 'saida', 'Home'),
        (user_rec.id, 'Troca de carro', 'saida', 'Car'),
        (user_rec.id, 'Reformas', 'saida', 'Hammer'),
        (user_rec.id, 'Casamento', 'saida', 'Heart'),
        (user_rec.id, 'Aposentadoria', 'saida', 'User')
        ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$;
