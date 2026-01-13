-- =====================================================
-- CONFIGURAÇÃO DE CRON JOBS - GRANAZAP V5
-- =====================================================
-- Este arquivo configura os Cron Jobs para atualização automática
-- de preços de investimentos (ações, FIIs, criptomoedas).
-- 
-- ⚠️ IMPORTANTE: Execute este arquivo SEPARADAMENTE após o setup_differential_COMPLETO.sql
-- 
-- 📋 PRÉ-REQUISITOS:
-- 1. ✅ Extensão pg_cron habilitada (já incluída no setup_differential_COMPLETO.sql)
-- 2. ✅ Extensão pg_net habilitada (já incluída no setup_differential_COMPLETO.sql)
-- 3. ✅ Edge Functions deployadas (update-investment-prices)
-- 
-- Data: 12/01/2026
-- Projeto: GranaZap V5
-- =====================================================

-- =====================================================
-- PASSO 1: SUBSTITUA SUAS CREDENCIAIS ABAIXO
-- =====================================================

-- 🔑 SUAS CREDENCIAIS DO SUPABASE:
-- ⚠️ IMPORTANTE: Os valores já estão configurados abaixo!
-- Os comandos \set não funcionam no Supabase SQL Editor (apenas no psql)

-- 1️⃣ PROJECT URL: https://lxmwsnfzwoqzqorxdwdu.supabase.co
-- 2️⃣ ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bXdzbmZzendvcXpvcnhkd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTI2MTQsImV4cCI6MjA4MDI4ODYxNH0.hVj48hB14UXaCw6BCMaR8FffYxFhxg-SDAad0nzMnC0

-- =====================================================
-- PASSO 1.5: HABILITAR EXTENSÕES NECESSÁRIAS
-- =====================================================

-- Habilitar extensão pg_cron (necessária para criar cron jobs)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Habilitar extensão pg_net (necessária para fazer chamadas HTTP)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- =====================================================
-- PASSO 2: VERIFICAR SE EDGE FUNCTION EXISTE
-- =====================================================

-- 📝 NOTA: Antes de criar os Cron Jobs, certifique-se que a Edge Function
-- 'update-investment-prices' está deployada no seu projeto.
-- 
-- Para verificar:
-- SELECT * FROM pg_catalog.pg_extension WHERE extname = 'pg_net';
-- 
-- Para deployar a Edge Function (via Supabase CLI):
-- supabase functions deploy update-investment-prices

-- =====================================================
-- PASSO 3: CRIAR CRON JOBS
-- =====================================================

-- 🔄 CRON JOB 1: Atualizar preços de investimentos (Mercado)
-- Executa: Segunda a Sexta, às 12h, 15h e 21h (horário UTC)
-- Atualiza: Ações, FIIs, ETFs, BDRs
SELECT cron.schedule(
    'update-investment-prices-market',
    '0 12,15,21 * * 1-5',
    $$
    SELECT net.http_post(
        url := 'https://lxmwsnfzwoqzqorxdwdu.supabase.co/functions/v1/update-investment-prices',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bXdzbmZzendvcXpvcnhkd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTI2MTQsImV4cCI6MjA4MDI4ODYxNH0.hVj48hB14UXaCw6BCMaR8FffYxFhxg-SDAad0nzMnC0'
        ),
        body := '{}'::jsonb
    ) as request_id;
    $$
);

-- 🔄 CRON JOB 2: Atualizar preços de criptomoedas
-- Executa: A cada 4 horas, todos os dias
-- Atualiza: Bitcoin, Ethereum, e outras criptomoedas
SELECT cron.schedule(
    'update-investment-prices-crypto',
    '0 */4 * * *',
    $$
    SELECT net.http_post(
        url := 'https://lxmwsnfzwoqzqorxdwdu.supabase.co/functions/v1/update-investment-prices',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bXdzbmZzendvcXpvcnhkd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTI2MTQsImV4cCI6MjA4MDI4ODYxNH0.hVj48hB14UXaCw6BCMaR8FffYxFhxg-SDAad0nzMnC0'
        ),
        body := '{}'::jsonb
    ) as request_id;
    $$
);

-- =====================================================
-- PASSO 4: VERIFICAR SE OS JOBS FORAM CRIADOS
-- =====================================================

-- Execute esta query para verificar:
SELECT 
    jobid,
    jobname,
    schedule,
    active,
    command
FROM cron.job
ORDER BY jobname;

-- ✅ Resultado esperado:
-- Você deve ver 2 jobs:
-- - update-investment-prices-market (active: true)
-- - update-investment-prices-crypto (active: true)

-- =====================================================
-- COMANDOS ÚTEIS
-- =====================================================

-- 📊 Ver histórico de execuções:
-- SELECT * FROM cron.job_run_details 
-- WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname LIKE 'update-investment%')
-- ORDER BY start_time DESC 
-- LIMIT 10;

-- ⏸️ Desabilitar um job:
-- UPDATE cron.job SET active = false WHERE jobname = 'update-investment-prices-market';

-- ▶️ Habilitar um job:
-- UPDATE cron.job SET active = true WHERE jobname = 'update-investment-prices-market';

-- 🗑️ Remover um job:
-- SELECT cron.unschedule('update-investment-prices-market');

-- 🔄 Executar um job manualmente (para testar):
-- SELECT net.http_post(
--     url := 'YOUR_PROJECT_URL/functions/v1/update-investment-prices',
--     headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
--     body := '{}'::jsonb
-- );

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- ❌ Problema: "relation cron.job does not exist"
-- Solução: A extensão pg_cron não está habilitada. Execute:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ❌ Problema: "function net.http_post does not exist"
-- Solução: A extensão pg_net não está habilitada. Execute:
-- CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ❌ Problema: Jobs criados mas não executam
-- Solução: Verifique se:
-- 1. A Edge Function 'update-investment-prices' está deployada
-- 2. As credenciais (PROJECT_URL e ANON_KEY) estão corretas
-- 3. O job está ativo: SELECT * FROM cron.job WHERE jobname = 'nome-do-job';

-- ❌ Problema: Erro 401 Unauthorized
-- Solução: A ANON_KEY está incorreta. Verifique em Settings > API

-- ❌ Problema: Erro 404 Not Found
-- Solução: A PROJECT_URL está incorreta ou a Edge Function não foi deployada

-- =====================================================
-- INFORMAÇÕES ADICIONAIS
-- =====================================================

-- 📅 Horários dos Cron Jobs (UTC):
-- - Mercado: 12h, 15h, 21h (Segunda a Sexta)
--   * 12h UTC = 09h BRT (Brasília)
--   * 15h UTC = 12h BRT (Brasília)
--   * 21h UTC = 18h BRT (Brasília)
-- 
-- - Crypto: A cada 4 horas (Todos os dias)
--   * 00h, 04h, 08h, 12h, 16h, 20h UTC

-- 🔐 Segurança:
-- - A ANON_KEY é segura para uso em Cron Jobs
-- - A Edge Function valida as requisições internamente
-- - verify_jwt está desabilitado para permitir chamadas do sistema

-- 📊 Performance:
-- - Cada execução atualiza TODOS os ativos de uma vez
-- - Usa cache para evitar chamadas desnecessárias às APIs externas
-- - Registra logs na tabela api_usage_log

-- =====================================================
-- FIM DO ARQUIVO
-- =====================================================
