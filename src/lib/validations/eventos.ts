import { z } from 'zod'
import { Database } from '@/types/database'

export const TipoEventoEnum = z.enum([
  'aula',
  'workshop',
  'palestra',
  'podcast',
  'evento_externo',
  'reuniao_interna'
])

export const SquadTipoEnum = z.enum([
  'PEW',
  'Podcast',
  'Comunica',
  'Culture'
])

export const parceiroSchema = z.object({
  nome: z.string().min(1, 'Nome da empresa obrigatório'),
  contribuicao: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable().or(z.literal('')),
  tipo: z.enum(['parceiro', 'apoio']).default('apoio'),
})

export const eventoSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  descricao: z.string().optional().nullable(),
  data_inicio: z.string().min(1, 'Início obrigatório').transform(v => new Date(v).toISOString()),
  data_fim: z.string().optional().nullable().or(z.literal('')).transform(v => v ? new Date(v).toISOString() : null),
  local: z.string().optional().nullable(),
  link_online: z.preprocess((v) => v === '' ? null : v, z.string().url('URL inválida').nullable().optional()),
  tipo: TipoEventoEnum,
  squad: SquadTipoEnum,
  palestrante_id: z.string().uuid().optional().nullable(),
  vagas: z.number().int().positive().optional().nullable(),
  confirmado: z.boolean().default(false),
  metadata: z.object({
    palestrantes_extras: z.array(z.string()).default([]),
    palestrantes_backup: z.array(z.string()).default([]),
    parceiros: z.array(parceiroSchema).default([]),
  }).default({
    palestrantes_extras: [],
    palestrantes_backup: [],
    parceiros: [],
  }),
})

export type EventoInput = z.infer<typeof eventoSchema>
