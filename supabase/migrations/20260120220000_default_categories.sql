-- Enable unaccent extension for case/accent insensitive comparison
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;

-- Function to seed default categories for new users
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert default categories
    INSERT INTO public.categoria_trasacoes (usuario_id, descricao, tipo, icon_key)
    VALUES
    -- DESPESAS
    (NEW.id, 'Moradia', 'saida', 'Home'),
    (NEW.id, 'Energia elétrica', 'saida', 'Zap'),
    (NEW.id, 'Água e esgoto', 'saida', 'Droplet'),
    (NEW.id, 'Internet e telefone', 'saida', 'Wifi'),
    (NEW.id, 'Transporte', 'saida', 'Car'),
    (NEW.id, 'Alimentação', 'saida', 'ShoppingCart'),     -- 🛒
    (NEW.id, 'Saúde', 'saida', 'Pill'),
    (NEW.id, 'Educação', 'saida', 'GraduationCap'),
    (NEW.id, 'Lazer', 'saida', 'Film'),
    (NEW.id, 'Alimentação fora', 'saida', 'Utensils'),    -- 🍽️
    (NEW.id, 'Compras', 'saida', 'ShoppingBag'),
    (NEW.id, 'Assinaturas e apps', 'saida', 'Smartphone'),
    (NEW.id, 'Pets', 'saida', 'Dog'),   -- Assuming Dog/PawPrint is available
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
    
    -- TRANSFERÊNCIAS (Mapped to 'ambos')
    (NEW.id, 'Transferência entre contas', 'ambos', 'ArrowRight'), -- Fallback icon
    (NEW.id, 'Pagamento de cartão', 'ambos', 'CreditCard'),
    (NEW.id, 'Saque em dinheiro', 'ambos', 'Banknote'),
    (NEW.id, 'Depósito em espécie', 'ambos', 'Banknote'),

    -- INVESTIMENTOS (Mapped to 'ambos' to appear in both flows)
    (NEW.id, 'Aportes', 'ambos', 'TrendingUp'),
    (NEW.id, 'Resgates', 'ambos', 'TrendingUp'),
    (NEW.id, 'Rendimentos recebidos', 'ambos', 'TrendingUp'),
    (NEW.id, 'Corretagens e taxas', 'ambos', 'TrendingUp'),

    -- METAS (Usually outgoing for saving)
    (NEW.id, 'Reserva de emergência', 'saida', 'PiggyBank'),
    (NEW.id, 'Viagem', 'saida', 'Plane'),
    (NEW.id, 'Compra de imóvel', 'saida', 'Home'),
    (NEW.id, 'Troca de carro', 'saida', 'Car'),
    (NEW.id, 'Reformas', 'saida', 'Hammer'),
    (NEW.id, 'Casamento', 'saida', 'Heart'),  -- ❤️
    (NEW.id, 'Aposentadoria', 'saida', 'User')
    
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$;

-- Create trigger to run after new user insertion
DROP TRIGGER IF EXISTS on_auth_user_created_seed_categories ON public.usuarios;
CREATE TRIGGER on_auth_user_created_seed_categories
AFTER INSERT ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.seed_default_categories();

-- Add UNIQUE INDEX for case/accent insensitive validation
-- This prevents 'alimentação' and 'Alimentacao' from co-existing for the same user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_category_user 
ON public.categoria_trasacoes (usuario_id, lower(public.unaccent(descricao)));
