-- =============================================================================
-- CORREÇÃO DE DADOS: PALESTRANTES MACKEMPREENDE
-- Corrige campos que foram importados erroneamente na migração inicial.
-- 
-- Problemas identificados:
--   1. Palestrantes de "Aulas 2025" tinham empresa="MackEmpreende" e cargo="Mentor"
--      quando na verdade são convidados externos que deram aulas sobre temas específicos
--   2. Campo `tema` continha o nome do evento ("Aulas 2025", "Semana do Empreendedorismo")
--      em vez do tema real da palestra/aula
--   3. Vários palestrantes de 2023/2024 sem tema definido
--   4. Thiago Miranda com empresa = "Forbes Under 30" (que era o tema do evento)
--
-- INSTRUÇÕES: Rode este script no Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- É seguro rodar múltiplas vezes — cada UPDATE é idempotente.
-- =============================================================================

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- BLOCO 1: CORREÇÃO DOS PROFESSORES CONVIDADOS "AULAS 2025"
-- Problema: Todos tinham empresa="MackEmpreende", cargo="Mentor", tema="Aulas 2025"
-- Realidade: São convidados externos, cada um com seu tema de aula
-- ═══════════════════════════════════════════════════════════════

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Como criar um negócio do 0 ao 1'
WHERE nome = 'Juliano Marchesine';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Estratégias e Métricas'
WHERE nome = 'Fábio Arten';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Marketing'
WHERE nome = 'Augusto Pigini';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Finanças'
WHERE nome = 'Sérgio de Jesus';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Vendas'
WHERE nome = 'João Pedro Szpacenkopf';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Tecnologia'
WHERE nome = 'Bruno Katayama';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Storytelling'
WHERE nome = 'Gabriel Lidera';

UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Professor Convidado',
  tema = 'Tendências do Empreendedorismo'
WHERE nome = 'Guilherme Gallina';


-- ═══════════════════════════════════════════════════════════════
-- BLOCO 2: CORREÇÃO DE TEMAS DOS PALESTRANTES 2025
-- Problema: Alguns tinham o nome do evento no lugar do tema real
-- ═══════════════════════════════════════════════════════════════

-- Ale Capella palestrou em 2023 (Love Brand) e 2025 (Wellness)
UPDATE palestrantes SET
  tema = 'Wellness / Love Brand'
WHERE nome = 'Ale Capella';

-- Isaac Azar: tema era "Semana do Empreendedorismo" (nome do evento), não o tema real
UPDATE palestrantes SET
  tema = 'Influencers e o Crescimento dos Negócios'
WHERE nome = 'Isaac Azar';

-- Luana Amy e Dani Coelho: tema correto é o subtítulo do painel
UPDATE palestrantes SET
  tema = 'Como Construir uma Marca Forte'
WHERE nome = 'Luana Amy';

UPDATE palestrantes SET
  tema = 'Como Construir uma Marca Forte'
WHERE nome = 'Dani Coelho';


-- ═══════════════════════════════════════════════════════════════
-- BLOCO 3: PREENCHIMENTO DE TEMAS VAZIOS (2024)
-- Problema: Importados sem o campo tema
-- ═══════════════════════════════════════════════════════════════

UPDATE palestrantes SET
  tema = 'Jornalismo e Mídias Digitais'
WHERE nome = 'Marcela Lahoz' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Jornalismo e Mídias Digitais'
WHERE nome = 'Eduardo Kaloustian' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Forbes Under 30 / Empreendedorismo Jovem'
WHERE nome = 'Isadora Tega' AND tema IS NULL;

-- Thiago Miranda: empresa era "Forbes Under 30" (tema do evento, não empresa real)
UPDATE palestrantes SET
  empresa = NULL,
  cargo = 'Convidado',
  tema = 'Forbes Under 30 / Empreendedorismo Jovem'
WHERE nome = 'Thiago Miranda';

-- Bruno Karra: cargo "Representante" muito genérico
UPDATE palestrantes SET
  cargo = 'Fundador',
  tema = 'Moda e Empreendedorismo'
WHERE nome = 'Bruno Karra';

UPDATE palestrantes SET
  tema = 'Mercado Financeiro'
WHERE nome = 'Vitor Baqueiro' AND tema IS NULL;

-- Equipe Brex: cargo continha área de atuação, não cargo real
UPDATE palestrantes SET
  tema = 'Recrutamento e Cultura Corporativa'
WHERE nome = 'Isis Abreu' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Operações em Startups'
WHERE nome = 'Laura Dantas' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Tecnologia em Startups'
WHERE nome = 'Lucas Machado' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Tecnologia em Startups'
WHERE nome = 'Felipe Foschini' AND tema IS NULL;


-- ═══════════════════════════════════════════════════════════════
-- BLOCO 4: PREENCHIMENTO DE TEMAS VAZIOS (2023)
-- Problema: Importados sem o campo tema
-- ═══════════════════════════════════════════════════════════════

UPDATE palestrantes SET
  tema = 'Construção de Marca'
WHERE nome = 'Felipe Vieira' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Gestão de Conflitos'
WHERE nome = 'Gustavo Habib' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Criação de Love Brand'
WHERE nome = 'Gabriel Bergo' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Criação de Love Brand'
WHERE nome = 'João Lucas' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Sustentabilidade como Modelo de Negócio'
WHERE nome = 'Murilo Ambrogi' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Sustentabilidade como Modelo de Negócio'
WHERE nome = 'Fabiana Tchalian' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Sustentabilidade como Modelo de Negócio'
WHERE nome = 'Letícia Meo' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Startups Unicórnio'
WHERE nome = 'Rodrigo Maroja' AND tema IS NULL;

UPDATE palestrantes SET
  tema = 'Mudanças Profissionais e Pessoais'
WHERE nome = 'Mauro Calliari' AND tema IS NULL;


-- ═══════════════════════════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- Rode esta query depois para conferir os dados corrigidos
-- ═══════════════════════════════════════════════════════════════

-- SELECT nome, empresa, cargo, tema, status FROM palestrantes ORDER BY nome;

COMMIT;
