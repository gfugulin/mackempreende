import { z } from 'zod'

export const StatusPalestranteEnum = z.enum([
  'a_contatar',
  'contatado',
  'aguardando_resposta',
  'confirmado',
  'recusado',
  'cancelado'
])

export const SquadTipoEnum = z.enum(['PEW', 'Podcast', 'Comunica', 'Culture'])

export const palestranteSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido').nullable().optional(),
  telefone: z.string().nullable().optional(),
  empresa: z.string().nullable().optional(),
  cargo: z.string().nullable().optional(),
  tema: z.string().nullable().optional(),
  bio: z.string().max(500, 'A bio deve ter no máximo 500 caracteres').nullable().optional(),
  linkedin: z.string().url('LinkedIn deve ser uma URL válida').nullable().optional().or(z.literal('')),
  instagram: z.string().nullable().optional(),
  status: StatusPalestranteEnum.default('a_contatar'),
  status_linkedin: StatusPalestranteEnum.default('a_contatar'),
  status_instagram: StatusPalestranteEnum.default('a_contatar'),
  squad_resp: SquadTipoEnum,
  observacoes: z.string().nullable().optional(),
})

export type PalestranteInput = z.infer<typeof palestranteSchema>
