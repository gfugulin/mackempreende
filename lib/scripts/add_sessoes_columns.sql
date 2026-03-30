-- =============================================================================
-- MIGRATION: Suporte a Sessões (Cronograma de Eventos)
--
-- Adiciona auto-referência à tabela eventos para que um evento possa
-- conter sessões (sub-eventos com horário e palestrante próprios).
--
-- Exemplo: "Semana do Empreendedorismo" → 5 sessões com palestrantes distintos.
--
-- INSTRUÇÕES: Rode no Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =============================================================================

-- 1. Coluna de referência ao evento-pai (NULL = evento raiz)
ALTER TABLE eventos
ADD COLUMN IF NOT EXISTS evento_pai_id UUID REFERENCES eventos(id) ON DELETE CASCADE;

-- 2. Coluna de ordenação das sessões dentro do cronograma
ALTER TABLE eventos
ADD COLUMN IF NOT EXISTS ordem INT DEFAULT 0;

-- 3. Índice para busca rápida de sessões por evento-pai
CREATE INDEX IF NOT EXISTS idx_eventos_pai 
ON eventos(evento_pai_id) 
WHERE evento_pai_id IS NOT NULL;
