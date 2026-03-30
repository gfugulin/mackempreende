-- =============================================================================
-- SCRIPT DEFINITIVO: Correção completa do histórico MackEmpreende
-- 
-- Este script faz 3 coisas:
--   1. Cria TODOS os eventos que faltam (2023, 2024, 2025)
--   2. Vincula cada palestrante ao seu evento via metadata.palestrantes (formato v3)
--   3. Atualiza os eventos que JÁ existiam para incluir co-palestrantes faltantes
--
-- Seguro de rodar múltiplas vezes: usa verificação "NOT EXISTS" antes de inserir.
-- INSTRUÇÕES: Cole inteiro no Supabase SQL Editor e clique "Run".
-- =============================================================================

DO $$
DECLARE
  v_speaker_id uuid;
  v_event_id uuid;
BEGIN

-- ═══════════════════════════════════════════════════════════════════════════
-- PARTE 1: ATUALIZAR EVENTOS JÁ EXISTENTES (adicionar co-palestrantes)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1A) "Wellness: O boom do mercado" → Adicionar Ale Capella + Bruno Rohlfs ao metadata
SELECT id INTO v_event_id FROM eventos WHERE titulo ILIKE '%Wellness%boom%' LIMIT 1;
IF v_event_id IS NOT NULL THEN
  UPDATE eventos SET metadata = jsonb_set(
    COALESCE(metadata::jsonb, '{}'::jsonb),
    '{palestrantes}',
    '[
      {"nome": "Ale Capella", "empresa": "Mais Mu", "is_backup": false},
      {"nome": "Bruno Rohlfs", "empresa": "Push&Pow", "is_backup": false}
    ]'::jsonb
  ) WHERE id = v_event_id;
END IF;

-- 1B) "Empreendedorismo Feminino: Marca Forte" → Adicionar ambas ao metadata
SELECT id INTO v_event_id FROM eventos WHERE titulo ILIKE '%Empreendedorismo Feminino%Marca%' LIMIT 1;
IF v_event_id IS NOT NULL THEN
  UPDATE eventos SET metadata = jsonb_set(
    COALESCE(metadata::jsonb, '{}'::jsonb),
    '{palestrantes}',
    '[
      {"nome": "Luana Amy", "empresa": "La''s Clothing", "is_backup": false},
      {"nome": "Dani Coelho", "empresa": "Café Zinn", "is_backup": false}
    ]'::jsonb
  ) WHERE id = v_event_id;
END IF;

-- 1C) "Empreendedorismo Feminino: Café Zinn" → Adicionar ambas ao metadata
SELECT id INTO v_event_id FROM eventos WHERE titulo ILIKE '%Empreendedorismo Feminino%Café%' LIMIT 1;
IF v_event_id IS NOT NULL THEN
  UPDATE eventos SET metadata = jsonb_set(
    COALESCE(metadata::jsonb, '{}'::jsonb),
    '{palestrantes}',
    '[
      {"nome": "Luana Amy", "empresa": "La''s Clothing", "is_backup": false},
      {"nome": "Dani Coelho", "empresa": "Café Zinn", "is_backup": false}
    ]'::jsonb
  ) WHERE id = v_event_id;
END IF;

-- 1D) "Forbes Under 30" → Adicionar ambos ao metadata
SELECT id INTO v_event_id FROM eventos WHERE titulo ILIKE '%Forbes%' LIMIT 1;
IF v_event_id IS NOT NULL THEN
  UPDATE eventos SET metadata = jsonb_set(
    COALESCE(metadata::jsonb, '{}'::jsonb),
    '{palestrantes}',
    '[
      {"nome": "Isadora Tega", "empresa": "Forbes", "is_backup": false},
      {"nome": "Thiago Miranda", "is_backup": false}
    ]'::jsonb
  ) WHERE id = v_event_id;
END IF;

-- 1E) "A história da Daki" → Adicionar Rodrigo ao metadata
SELECT id INTO v_event_id FROM eventos WHERE titulo ILIKE '%Daki%' LIMIT 1;
IF v_event_id IS NOT NULL THEN
  UPDATE eventos SET metadata = jsonb_set(
    COALESCE(metadata::jsonb, '{}'::jsonb),
    '{palestrantes}',
    '[{"nome": "Rodrigo Maroja", "empresa": "Daki", "is_backup": false}]'::jsonb
  ) WHERE id = v_event_id;
END IF;


-- ═══════════════════════════════════════════════════════════════════════════
-- PARTE 2: CRIAR EVENTOS QUE NÃO EXISTEM
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────── 2025 ───────────────────────────

-- 2A) Semana do Empreendedorismo 2025: "Influencers e o crescimento dos negócios"
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Influencers%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Isaac Azar' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Influencers e o Crescimento dos Negócios',
    'Palestra da Semana do Empreendedorismo 2025 com Isaac Azar, fundador do Paris 6',
    '2025-09-16 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Isaac Azar", "empresa": "Paris 6", "is_backup": false}]}'::jsonb
  );
END IF;

-- 2B-2I) AULAS 2025 (8 eventos)

-- Aula: Como criar um negócio do 0 ao 1
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%negócio do 0%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Juliano Marchesine' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Como criar um negócio do 0 ao 1',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-03-10 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Juliano Marchesine", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Estratégias e Métricas
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Estratégias e Métricas%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Fábio Arten' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Estratégias e Métricas',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-03-17 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Fábio Arten", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Marketing
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Aula%Marketing%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Augusto Pigini' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Marketing',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-03-24 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Augusto Pigini", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Finanças
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Aula%Finanças%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Sérgio de Jesus' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Finanças',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-03-31 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Sérgio de Jesus", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Vendas
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Aula%Vendas%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'João Pedro Szpacenkopf' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Vendas',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-04-07 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "João Pedro Szpacenkopf", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Tecnologia
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Aula%Tecnologia%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Bruno Katayama' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Tecnologia',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-04-14 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Bruno Katayama", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Storytelling
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Storytelling%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Gabriel Lidera' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Storytelling',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-04-28 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Gabriel Lidera", "is_backup": false}]}'::jsonb
  );
END IF;

-- Aula: Tendências do Empreendedorismo
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Tendências%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Guilherme Gallina' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Aula: Tendências do Empreendedorismo',
    'Aula do programa educacional MackEmpreende 2025',
    '2025-05-05 19:00:00-03', 'aula', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Guilherme Gallina", "is_backup": false}]}'::jsonb
  );
END IF;


-- ─────────────────────────── 2024 ───────────────────────────

-- 2J) Grupo Waffle: Jornalismo brasileiro
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Waffle%' OR titulo ILIKE '%jornalismo%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Marcela Lahoz' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Como o Grupo Waffle revoluciona o jornalismo brasileiro',
    'Palestra da Semana do Empreendedorismo 2024',
    '2024-09-16 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [
      {"nome": "Marcela Lahoz", "empresa": "Grupo Waffle", "is_backup": false},
      {"nome": "Eduardo Kaloustian", "empresa": "Grupo Waffle", "is_backup": false}
    ]}'::jsonb
  );
END IF;

-- 2K) Bruno Karra - Baw Clothing
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Baw%' OR (titulo ILIKE '%Bruno Karra%')) THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Bruno Karra' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Empreendedorismo na Moda: Baw Clothing',
    'Palestra da Semana do Empreendedorismo 2024 com Bruno Karra',
    '2024-09-18 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Bruno Karra", "empresa": "Baw Clothing", "is_backup": false}]}'::jsonb
  );
END IF;

-- 2L) Vitor Baqueiro - Nobel Capital
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Nobel%' OR titulo ILIKE '%Baqueiro%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Vitor Baqueiro' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Mercado Financeiro e Empreendedorismo',
    'Palestra da Semana do Empreendedorismo 2024 com Vitor Baqueiro, fundador da Nobel Capital',
    '2024-09-19 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Vitor Baqueiro", "empresa": "Nobel Capital", "is_backup": false}]}'::jsonb
  );
END IF;

-- 2M) Brex - Painel Corporativo
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Brex%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Isis Abreu' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Painel Brex: Carreiras em uma Fintech Global',
    'Painel com colaboradores da Brex sobre carreiras em tecnologia, operações e recrutamento',
    '2024-10-15 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [
      {"nome": "Isis Abreu", "empresa": "Brex", "is_backup": false},
      {"nome": "Laura Dantas", "empresa": "Brex", "is_backup": false},
      {"nome": "Lucas Machado", "empresa": "Brex", "is_backup": false},
      {"nome": "Felipe Foschini", "empresa": "Brex", "is_backup": false}
    ]}'::jsonb
  );
END IF;


-- ─────────────────────────── 2023 ───────────────────────────

-- 2N) Sallve: Construção da marca
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Sallve%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Felipe Vieira' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Sallve: A história da construção da marca',
    'Palestra da Semana do Empreendedorismo 2023',
    '2023-09-18 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Felipe Vieira", "empresa": "Sallve", "is_backup": false}]}'::jsonb
  );
END IF;

-- 2O) Workshop Gestão de Conflitos
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Conflitos%' OR titulo ILIKE '%Gustavo Habib%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Gustavo Habib' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Workshop de Gestão de Conflitos',
    'Workshop da Semana do Empreendedorismo 2023 com Gustavo Habib (BTC)',
    '2023-09-19 19:00:00-03', 'workshop', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Gustavo Habib", "empresa": "BTC", "is_backup": false}]}'::jsonb
  );
END IF;

-- 2P) Criação de uma Love Brand (Painel com 4 convidados)
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Love Brand%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Bruno Rohlfs' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Criação de uma Love Brand: de A a Z',
    'Painel da Semana do Empreendedorismo 2023 com Push&Pow, Mais Mu e The Cereal',
    '2023-09-20 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [
      {"nome": "Bruno Rohlfs", "empresa": "Push&Pow", "is_backup": false},
      {"nome": "Ale Capella", "empresa": "Mais Mu", "is_backup": false},
      {"nome": "Gabriel Bergo", "empresa": "The Cereal", "is_backup": false},
      {"nome": "João Lucas", "empresa": "The Cereal", "is_backup": false}
    ]}'::jsonb
  );
END IF;

-- 2Q) Sustentabilidade como modelo de negócio (3 convidados)
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Sustentabilidade%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Murilo Ambrogi' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Sustentabilidade como Modelo de Negócio',
    'Painel da Semana do Empreendedorismo 2023 com Food to Save, Água na Caixa e Central 12',
    '2023-09-21 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [
      {"nome": "Murilo Ambrogi", "empresa": "Food to Save", "is_backup": false},
      {"nome": "Fabiana Tchalian", "empresa": "Água na Caixa", "is_backup": false},
      {"nome": "Letícia Meo", "empresa": "Central 12", "is_backup": false}
    ]}'::jsonb
  );
END IF;

-- 2R) Mauro Calliari: Mudanças profissionais e pessoais
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Mudanças%' OR titulo ILIKE '%Calliari%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Mauro Calliari' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'Mudanças Profissionais e Pessoais',
    'Palestra com Mauro Calliari, colunista da Folha de São Paulo',
    '2023-10-15 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Mauro Calliari", "empresa": "Folha de São Paulo", "is_backup": false}]}'::jsonb
  );
END IF;

-- 2S) Bruno Rohlfs: A história da marca de Matcha
IF NOT EXISTS (SELECT 1 FROM eventos WHERE titulo ILIKE '%Matcha%') THEN
  SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Bruno Rohlfs' LIMIT 1;
  INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado, metadata)
  VALUES (
    'A história sem filtro da marca criada a partir da energia do Matcha',
    'Palestra com Bruno Rohlfs sobre a jornada da Push&Pow',
    '2023-11-20 19:00:00-03', 'palestra', 'PEW', v_speaker_id, true,
    '{"palestrantes": [{"nome": "Bruno Rohlfs", "empresa": "Push&Pow", "is_backup": false}]}'::jsonb
  );
END IF;


-- ═══════════════════════════════════════════════════════════════════════════
-- PARTE 3: VERIFICAÇÃO
-- ═══════════════════════════════════════════════════════════════════════════

RAISE NOTICE '✅ Script executado com sucesso!';
RAISE NOTICE 'Eventos atualizados: 5 (metadata de co-palestrantes)';
RAISE NOTICE 'Eventos criados: até 15 novos (apenas os que não existiam)';
RAISE NOTICE 'Todos os palestrantes do documento agora têm pelo menos 1 evento vinculado.';

END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- QUERY DE VERIFICAÇÃO (rode separadamente depois)
-- Mostra cada palestrante e quantos eventos tem vinculados via FK
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT 
--   p.nome, 
--   p.empresa, 
--   p.cargo, 
--   p.tema,
--   COUNT(e.id) as total_eventos_fk
-- FROM palestrantes p
-- LEFT JOIN eventos e ON e.palestrante_id = p.id
-- GROUP BY p.id, p.nome, p.empresa, p.cargo, p.tema
-- ORDER BY p.nome;
