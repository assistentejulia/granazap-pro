-- =====================================================
-- FIX: REMOVE DUPLICATE CATEGORIES AND ADD CONSTRAINT
-- =====================================================

-- 1. Remover duplicatas mantendo a de menor ID (a mais antiga)
--    Isso deve limpar as categorias que se repetem 14x
DELETE FROM categoria_trasacoes a USING categoria_trasacoes b
WHERE a.id > b.id
AND a.usuario_id = b.usuario_id
AND a.descricao = b.descricao
AND a.tipo = b.tipo;

-- 2. Adicionar constraint UNIQUE para evitar que isso aconteça novamente
--    Combinação de usuário, descrição e tipo deve ser única
ALTER TABLE categoria_trasacoes
ADD CONSTRAINT unique_user_category_type UNIQUE (usuario_id, descricao, tipo);
