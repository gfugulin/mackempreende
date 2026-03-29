import { z } from 'zod'

export const arquivoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional().nullable(),
  squad: z.enum(['PEW', 'Podcast', 'Comunica', 'Culture']),
  evento_id: z.string().uuid().optional().nullable(),
})

export type ArquivoInput = z.infer<typeof arquivoSchema>
