import { z } from 'zod'
import { Database } from '@/types/database'

export const TipoEventoEnum = z.enum([
  'aula',
  'workshop',
  'palestra',
  'podcast',
  'evento_externo',
  'reuniao_interna',
  'feira'
])

export const SquadTipoEnum = z.enum([
  'PEW',
  'Podcast',
  'Comunica',
  'Culture'
])

/**
 * Palestrante vinculado a um evento.
 * - Se `id` estiver preenchido → palestrante existente do diretório
 * - Se `id` for null → palestrante novo (será criado automaticamente ao salvar)
 * - `is_backup` distingue Principal de Reserva numa lista única
 */
export const palestranteVinculadoSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  nome: z.string().min(2, 'Nome obrigatório'),
  empresa: z.string().optional().nullable(),
  is_backup: z.boolean().default(false),
})

export type PalestranteVinculado = z.infer<typeof palestranteVinculadoSchema>

export const parceiroSchema = z.object({
  nome: z.string().min(1, 'Nome da empresa obrigatório'),
  contribuicao: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable().or(z.literal('')),
  tipo: z.enum(['parceiro', 'apoio']).default('apoio'),
})

/**
 * Expositor de feira — empresa que monta stand/ativação.
 * Separado de "parceiros" por ter dados operacionais (stand, tipo de ativação).
 */
export const expositorSchema = z.object({
  nome: z.string().min(1, 'Nome da empresa obrigatório'),
  stand: z.string().optional().nullable(),
  ativacao: z.string().optional().nullable(),
  contato: z.string().optional().nullable(),
})

export type Expositor = z.infer<typeof expositorSchema>

export const eventoSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  descricao: z.string().optional().nullable(),
  data_inicio: z.string().min(1, 'Início obrigatório').transform(v => new Date(v).toISOString()),
  data_fim: z.string().optional().nullable().or(z.literal('')).transform(v => v ? new Date(v).toISOString() : null),
  local: z.string().optional().nullable(),
  link_online: z.preprocess((v) => v === '' ? null : v, z.string().url('URL inválida').nullable().optional()),
  tipo: TipoEventoEnum,
  squad: SquadTipoEnum,
  vagas: z.number().int().positive().optional().nullable(),
  confirmado: z.boolean().default(false),
  metadata: z.object({
    palestrantes: z.array(palestranteVinculadoSchema).default([]),
    parceiros: z.array(parceiroSchema).default([]),
    documentos_importantes: z.array(z.string()).default([]),
    expositores: z.array(expositorSchema).default([]),
  }).default({
    palestrantes: [],
    parceiros: [],
    documentos_importantes: [],
    expositores: [],
  }),
})

export type EventoInput = z.infer<typeof eventoSchema>
