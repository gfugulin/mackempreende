'use server'

import { createClient } from '@/lib/supabase/server'
import { palestranteSchema, type PalestranteInput } from '@/lib/validations/palestrantes'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cria um novo palestrante após validação rigorosa.
 */
export async function createPalestrante(data: PalestranteInput) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  // 1. Validação de Esquema
  const result = palestranteSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Dados inválidos para o palestrante.' }
  }

  // 2. Persistência no Supabase
  const { error } = await (supabase as any)
    .from('palestrantes')
    .insert([result.data])

  if (error) {
    console.error('Error creating speaker:', error)
    return { error: 'Erro ao salvar palestrante no banco de dados.' }
  }

  revalidatePath('/palestrantes')
  return { success: true }
}

/**
 * Atualiza dados de um palestrante existente.
 */
export async function updatePalestrante(id: string, data: Partial<PalestranteInput>) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  // 1. Validação Parcial
  const result = palestranteSchema.partial().safeParse(data)
  if (!result.success) {
    return { error: 'Dados parciais inválidos.' }
  }

  // 2. Update
  const { error } = await (supabase as any)
    .from('palestrantes')
    .update(result.data)
    .eq('id', id)

  if (error) {
    return { error: 'Erro ao atualizar palestrante.' }
  }

  revalidatePath('/palestrantes')
  return { success: true }
}

/**
 * Deleta um palestrante (sustentabilidade: controle de integridade automática no DB).
 */
export async function deletePalestrante(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const { error } = await (supabase as any)
    .from('palestrantes')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: 'Erro ao excluir palestrante. Ele pode estar vinculado a eventos.' }
  }

  revalidatePath('/palestrantes')
  return { success: true }
}

/**
 * Busca palestrantes com filtros e eventos vinculados (Server Component Ready)
 */
export async function getPalestrantes(filters?: { squad?: string; search?: string }) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  let query = supabase
    .from('palestrantes')
    .select('*, eventos(id, data_inicio, confirmado)')
    .order('nome')

  if (filters?.squad) {
    query = query.eq('squad_resp', filters.squad)
  }

  if (filters?.search) {
    query = query.ilike('nome', `%${filters.search}%`)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching speakers:', error)
    return []
  }

  return data as any[]
}


/**
 * Busca detalhe de um palestrante e seu histórico de eventos (Cruzamento de dados).
 */
export async function getPalestranteById(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const { data, error } = await supabase
    .from('palestrantes')
    .select(`
      *,
      eventos (
        id,
        titulo,
        data_inicio,
        tipo,
        squad
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching speaker detail:', error)
    return null
  }

  return data as any
}

/**
 * Importação em massa de palestrantes (sustentabilidade para grandes volumes).
 * Realiza um upsert manual (confirma se existe pelo nome antes de inserir).
 */
export async function importPalestrantesBulk(items: any[], currentSquad: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const results = { imported: 0, skipped: 0, errors: 0 }

  for (const item of items) {
    try {
      // 1. Validar mínimo necessário (nome)
      if (!item.nome) {
        results.skipped++
        continue
      }

      // 2. Verificar se já existe (pra não duplicar histórico)
      const { data: existing } = await (supabase as any)
        .from('palestrantes')
        .select('id')
        .ilike('nome', item.nome)
        .single()

      if (existing) {
        // Opcionalmente atualizamos os dados
        await (supabase as any)
          .from('palestrantes')
          .update({
            empresa: item.empresa || undefined,
            cargo: item.cargo || undefined,
            linkedin: item.linkedin || undefined,
            status: 'a_contatar'
          })
          .eq('id', existing.id)
        results.imported++
      } else {
        // Inserir novo
        await (supabase as any)
          .from('palestrantes')
          .insert([{
            nome: item.nome,
            empresa: item.empresa || null,
            cargo: item.cargo || null,
            linkedin: item.linkedin || null,
            squad_resp: (currentSquad as any) || 'PEW',
            status: 'a_contatar'
          }])
        results.imported++
      }
    } catch (err) {
      console.error('Error importing bulk row:', err)
      results.errors++
    }
  }

  revalidatePath('/palestrantes')
  return { success: true, results }
}

/**
 * Verifica quantas vezes um palestrante já participou (Smart Alert).
 */
export async function getSpeakerEventCount(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const { count, error } = await supabase
    .from('eventos')
    .select('*', { count: 'exact', head: true })
    .eq('palestrante_id', id)
    .eq('confirmado', true)

  if (error) return 0
  return count || 0
}
