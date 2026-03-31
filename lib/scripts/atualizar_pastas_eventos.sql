BEGIN;

-- 1. ADD NEW MACRO-EVENT FOLDERS AS ENUMS
ALTER TYPE evento_tipo ADD VALUE IF NOT EXISTS 'semana_empreendedorismo';
ALTER TYPE evento_tipo ADD VALUE IF NOT EXISTS 'empreendedorismo_feminino';
ALTER TYPE evento_tipo ADD VALUE IF NOT EXISTS 'mentoria';
ALTER TYPE evento_tipo ADD VALUE IF NOT EXISTS 'evento_avulso';

-- 2. DEDUPLICATION (Limpeza de Lixo Fantasma)
DELETE FROM eventos
WHERE id IN (
    SELECT id
    FROM (
        SELECT id, ROW_NUMBER() OVER( PARTITION BY titulo ORDER BY id ASC ) AS row_num
        FROM eventos
    ) t
    WHERE t.row_num > 1
);

-- 3. MAPPING HISTORY TO THE NEW FOLDERS (Fiel ao palestrantesJP.md)

-- Aulas 2025 (Ficam como "aula")
UPDATE eventos e
SET tipo = 'aula'
FROM palestrantes p
WHERE e.palestrante_id = p.id AND p.nome IN (
  'Juliano Marchesine', 'Fábio Arten', 'Augusto Pigini', 'Sérgio de Jesus',
  'João Pedro Szpacenkopf', 'Bruno Katayama', 'Gabriel Lidera', 'Guilherme Gallina'
);

-- Empreendedorismo Feminino
UPDATE eventos e
SET tipo = 'empreendedorismo_feminino'
FROM palestrantes p
WHERE (e.palestrante_id = p.id AND p.nome IN ('Luana Amy', 'Dani Coelho'))
   OR e.titulo ILIKE '%Empreendedorismo Feminino%';

-- Semana do Empreendedorismo (Rigoroso contra todos os convidados listados no .md para 2023, 2024 e 2025)
UPDATE eventos e
SET tipo = 'semana_empreendedorismo'
FROM palestrantes p
WHERE e.palestrante_id = p.id AND p.nome IN (
  'Isaac Azar', 'Ale Capella', 'Bruno Rohlfs', 
  'Marcela Lahoz', 'Eduardo Kaloustian', 'Thiago Miranda', 'Isadora Tega',
  'Felipe Vieira', 'Gustavo Habib', 'Gabriel Bergo', 'João Lucas',
  'Murilo Ambrogi', 'Fabiana Tchalian', 'Letícia Meo', 'Rodrigo Maroja'
);

-- Note: Bruno Rohlfs tem o evento "Sustentabilidade" e o avulso do Matcha. 
-- Forçamos que qualquer evento "Matcha" dele seja Avulso.
UPDATE eventos SET tipo = 'evento_avulso' WHERE titulo ILIKE '%Matcha%';

-- Mentoria
UPDATE eventos
SET tipo = 'mentoria'
WHERE titulo ILIKE '%Mentoria%' OR titulo ILIKE '%Blank School%';

-- Outros / Evento Externo (Brex, Baw, Nobel, Folha)
UPDATE eventos e
SET tipo = 'evento_externo'
FROM palestrantes p
WHERE e.palestrante_id = p.id AND (
  p.empresa ILIKE '%Brex%' OR p.nome IN ('Isis Abreu', 'Laura Dantas', 'Lucas Machado', 'Felipe Foschini')
);

UPDATE eventos e
SET tipo = 'evento_avulso'
FROM palestrantes p
WHERE e.palestrante_id = p.id AND p.nome IN (
  'Bruno Karra', 'Vitor Baqueiro', 'Mauro Calliari'
);

-- 4. PADRONIZAR o resto
UPDATE eventos SET tipo = 'evento_avulso' 
WHERE tipo = 'palestra' AND titulo NOT ILIKE '%podcast%';

COMMIT;
