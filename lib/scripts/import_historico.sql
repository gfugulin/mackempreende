
-- =============================================================================
-- MIGRATION: IMPORTAÇÃO DE HISTÓRICO MACKEMPREENDE (2023-2025)
-- Este script insere os dados fornecidos pela head para popular o sistema.
-- =============================================================================

DO $$
DECLARE
    v_pew_id uuid;
    v_speaker_id uuid;
BEGIN

-- 1. UPSERT DE PALESTRANTES (Garante que não haverá duplicatas se rodado mais de uma vez)
-- Note: Usamos o nome como chave para vinculação inicial.

-- 2025
INSERT INTO palestrantes (nome, empresa, cargo, status, squad_resp, tema)
VALUES 
    ('Luana Amy', 'La’s Clothing', 'Fundadora', 'confirmado', 'PEW', 'Empreendedorismo Feminino'),
    ('Dani Coelho', 'Café Zinn', 'Fundadora', 'confirmado', 'PEW', 'Empreendedorismo Feminino'),
    ('Isaac Azar', 'Paris 6', 'Fundador', 'confirmado', 'PEW', 'Semana do Empreendedorismo'),
    ('Ale Capella', 'Mais Mu', 'Sócio', 'confirmado', 'PEW', 'Wellness'),
    ('Bruno Rohlfs', 'Push&Pow', 'Fundador', 'confirmado', 'PEW', 'Wellness / Love Brand'),
    ('Juliano Marchesine', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('Fábio Arten', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('Augusto Pigini', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('Sérgio de Jesus', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('João Pedro Szpacenkopf', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('Bruno Katayama', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('Gabriel Lidera', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025'),
    ('Guilherme Gallina', 'MackEmpreende', 'Mentor', 'confirmado', 'PEW', 'Aulas 2025')
ON CONFLICT DO NOTHING;

-- 2024
INSERT INTO palestrantes (nome, empresa, cargo, status, squad_resp)
VALUES 
    ('Marcela Lahoz', 'Grupo Waffle', 'Head de Agências', 'confirmado', 'PEW'),
    ('Eduardo Kaloustian', 'Grupo Waffle', 'Head de Comunicação', 'confirmado', 'PEW'),
    ('Thiago Miranda', 'Forbes Under 30', 'Representante', 'confirmado', 'PEW'),
    ('Isadora Tega', 'Forbes', 'Editora Executiva', 'confirmado', 'PEW'),
    ('Bruno Karra', 'Baw Clothing', 'Representante', 'confirmado', 'PEW'),
    ('Vitor Baqueiro', 'Nobel Capital', 'Fundador', 'confirmado', 'PEW'),
    ('Isis Abreu', 'Brex', 'Recrutamento', 'confirmado', 'PEW'),
    ('Laura Dantas', 'Brex', 'Operações', 'confirmado', 'PEW'),
    ('Lucas Machado', 'Brex', 'Tecnologia', 'confirmado', 'PEW'),
    ('Felipe Foschini', 'Brex', 'Tecnologia', 'confirmado', 'PEW')
ON CONFLICT DO NOTHING;

-- 2023
INSERT INTO palestrantes (nome, empresa, cargo, status, squad_resp)
VALUES 
    ('Felipe Vieira', 'Sallve', 'Gerente de Marca', 'confirmado', 'PEW'),
    ('Gustavo Habib', 'BTC', 'Gerente Geral', 'confirmado', 'PEW'),
    ('Gabriel Bergo', 'The Cereal', 'Cofundador', 'confirmado', 'PEW'),
    ('João Lucas', 'The Cereal', 'Cofundador', 'confirmado', 'PEW'),
    ('Murilo Ambrogi', 'Food to Save', 'Cofundador', 'confirmado', 'PEW'),
    ('Fabiana Tchalian', 'Água na Caixa', 'Cofundadora', 'confirmado', 'PEW'),
    ('Letícia Meo', 'Central 12', 'Cofundadora', 'confirmado', 'PEW'),
    ('Rodrigo Maroja', 'Daki', 'Fundador', 'confirmado', 'PEW'),
    ('Mauro Calliari', 'Folha de São Paulo', 'Colunista', 'confirmado', 'PEW')
ON CONFLICT DO NOTHING;

-- 2. VINCULAÇÃO DE EVENTOS (Busca o ID do palestrante e insere o evento)

-- Exemplo: Empreendedorismo Feminino 2025
SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Luana Amy' LIMIT 1;
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado)
VALUES ('Empreendedorismo Feminino: Marca Forte', 'Painel com Luana Amy da La’s Clothing', '2025-05-10 18:30:00+00', 'palestra', 'PEW', v_speaker_id, true);

SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Dani Coelho' LIMIT 1;
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado)
VALUES ('Empreendedorismo Feminino: Café Zinn', 'Painel com Dani Coelho', '2025-05-10 19:30:00+00', 'palestra', 'PEW', v_speaker_id, true);

-- Exemplo: Wellness 2025
SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Bruno Rohlfs' LIMIT 1;
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado)
VALUES ('Wellness: O boom do mercado', 'Painel com Push&Pow e Mais Mu', '2025-09-15 19:00:00+00', 'palestra', 'PEW', v_speaker_id, true);

-- Exemplo: Forbes 2024
SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Isadora Tega' LIMIT 1;
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado)
VALUES (' Forbes Under 30', 'Editora Executiva da Forbes', '2024-08-20 19:00:00+00', 'palestra', 'PEW', v_speaker_id, true);

-- Exemplo: Daki 2023
SELECT id INTO v_speaker_id FROM palestrantes WHERE nome = 'Rodrigo Maroja' LIMIT 1;
INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, palestrante_id, confirmado)
VALUES ('A história da Daki: Unicórnio Brasileiro', 'Fundador da Daki', '2023-11-10 19:00:00+00', 'palestra', 'PEW', v_speaker_id, true);

END $$;
