-- =============================================================================
-- ORGANIZAÇÃO DA AGENDA 1° SEMESTRE 2026
-- 
-- Este script:
--   1. Remove os 2 eventos de teste
--   2. Remove o palestrante de teste (Paulo Plínio)
--   3. Cria os 8 eventos do calendário definido pela head
--
-- Fonte: Datas.md (reunião com a head)
-- INSTRUÇÕES: Cole inteiro no Supabase SQL Editor e clique "Run"
-- =============================================================================

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- PARTE 1: LIMPAR EVENTOS DE TESTE
-- ═══════════════════════════════════════════════════════════════

DELETE FROM eventos WHERE titulo ILIKE '%Otimização de API de Similaridade%';
DELETE FROM eventos WHERE titulo ILIKE '%Autoatendimento com maquininha%';

-- Remover palestrante de teste (criado durante testes do formulário)
DELETE FROM palestrantes WHERE nome = 'Paulo Plínio';


-- ═══════════════════════════════════════════════════════════════
-- PARTE 2: INSERIR EVENTOS DO 1° SEMESTRE 2026
-- Datas conforme definido pela head da liga
-- ═══════════════════════════════════════════════════════════════

-- 1. 28/03 - Confraternização (já aconteceu)
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'Confraternização MackEmpreende',
  'Encontro de confraternização e integração dos membros da liga.',
  '2026-03-28 19:00:00-03',
  'reuniao_interna',
  'Culture',
  true,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 2. 11/04 - Dinâmica da Red Bull no escritório da Red Bull
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, local, confirmado, metadata)
VALUES (
  'Dinâmica Red Bull',
  'Atividade especial no escritório da Red Bull com dinâmica voltada para empreendedorismo e inovação.',
  '2026-04-11 19:00:00-03',
  'workshop',
  'PEW',
  'Escritório Red Bull (São Paulo)',
  true,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 3. 15/04 - Ativação
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'Ativação MackEmpreende',
  'Ativação da liga no campus. Detalhes a definir.',
  '2026-04-15 12:00:00-03',
  'evento_externo',
  'PEW',
  true,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 4. 25/04 - Z Summit
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'Z Summit 2026',
  'Participação da liga no Z Summit, maior evento de empreendedorismo jovem do Brasil. Mais info: https://www.zsummit.com.br/',
  '2026-04-25 09:00:00-03',
  'evento_externo',
  'PEW',
  true,
  '{"links": ["https://www.zsummit.com.br/"]}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 5. 09/05 - RG rápida + Garagem de Startups
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'RG + Garagem de Startups',
  'Reunião geral rápida seguida de visita/parceria com o projeto Garagem de Startups. Mais info: https://garagemdestartups.com/',
  '2026-05-09 19:00:00-03',
  'reuniao_interna',
  'Culture',
  true,
  '{"links": ["https://garagemdestartups.com/", "https://www.instagram.com/garagemdestartups/"]}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 6. 13/05 - Empreendedorismo Feminino
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'Empreendedorismo Feminino 2026',
  'Segunda edição do painel de Empreendedorismo Feminino. Convidadas e tema a definir.',
  '2026-05-13 19:00:00-03',
  'palestra',
  'PEW',
  false,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 7. 23/05 - RG com dinâmica (A definir)
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'RG com Dinâmica',
  'Reunião geral com dinâmica especial. Formato a ser definido.',
  '2026-05-23 19:00:00-03',
  'reuniao_interna',
  'Culture',
  false,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 8. 30/05 - RG / Confraternização de encerramento
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata)
VALUES (
  'RG + Confraternização de Encerramento',
  'Reunião geral e confraternização de encerramento do 1° semestre de 2026.',
  '2026-05-30 19:00:00-03',
  'reuniao_interna',
  'Culture',
  false,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;



COMMIT;
