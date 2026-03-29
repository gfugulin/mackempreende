'use server'

import { createClient } from '@/lib/supabase/server'
import { eventoSchema, type EventoInput } from '@/lib/validations/eventos'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cria um novo evento e sincroniza automaticamente os palestrantes vinculados.
 * - Palestrante principal: atualiza status conforme confirmação do evento
 * - Palestrantes extras (metadata): registra automaticamente na tabela palestrantes
 */
export async function createEvento(data: EventoInput) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const result = eventoSchema.safeParse(data)
  if (!result.success) {
    console.error('Validation Error:', result.error)
    return { error: 'Dados inválidos para o evento.' }
  }

  const { error, data: createdEvento } = await (supabase.from('eventos') as any)
    .insert([result.data])
    .select('id')
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return { error: 'Erro ao salvar evento na agenda.' }
  }

  // === AUTO-SYNC: Palestrante Principal ===
  if (result.data.palestrante_id && result.data.confirmado) {
    await (supabase as any)
      .from('palestrantes')
      .update({ status: 'confirmado' })
      .eq('id', result.data.palestrante_id)
  }

  // === AUTO-SYNC: Palestrantes Extras → Registros reais ===
  const extras = result.data.metadata?.palestrantes_extras || []
  const syncedExtras: string[] = []

  for (const nomeExtra of extras) {
    if (!nomeExtra || typeof nomeExtra !== 'string' || nomeExtra.trim().length < 2) continue
    const nomeLimpo = nomeExtra.trim()

    // Busca por nome (case-insensitive) para evitar duplicatas
    const { data: existing } = await (supabase as any)
      .from('palestrantes')
      .select('id, nome')
      .ilike('nome', nomeLimpo)
      .single()

    if (!existing) {
      // Criar novo palestrante com status baseado na confirmação do evento
      await (supabase as any)
        .from('palestrantes')
        .insert([{
          nome: nomeLimpo,
          squad_resp: result.data.squad,
          status: result.data.confirmado ? 'confirmado' : 'a_contatar',
        }])
      syncedExtras.push(nomeLimpo)
    }
  }

  revalidatePath('/agenda')
  revalidatePath('/palestrantes')
  return { 
    success: true, 
    syncedExtras: syncedExtras.length > 0 ? syncedExtras : undefined 
  }
}


/**
 * Busca eventos ordenados por data (Timeline Ready)
 */
export async function getEventos(filters?: { squad?: string; hidePast?: boolean }) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  let query = supabase
    .from('eventos')
    .select('*, palestrantes(nome, empresa, cargo)')
    .order('data_inicio', { ascending: true })

  if (filters?.squad) {
    query = query.eq('squad', filters.squad)
  }

  if (filters?.hidePast) {
    query = query.gte('data_inicio', new Date().toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data
}

/**
 * Busca um único evento por ID.
 */
export async function getEventoById(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const { data, error } = await supabase
    .from('eventos')
    .select('*, palestrantes(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching event by ID:', error)
    return null
  }

  return data
}

/**
 * Atualiza um evento existente.
 */
export async function updateEvento(id: string, data: EventoInput) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const result = eventoSchema.safeParse(data)
  if (!result.success) {
    console.error('Validation Error update:', result.error)
    return { error: 'Dados parciais inválidos.' }
  }

  const { error } = await (supabase.from('eventos') as any)
    .update(result.data)
    .eq('id', id)

  if (error) {
    console.error('Error updating event:', error)
    return { error: 'Erro ao atualizar evento.' }
  }

  revalidatePath('/agenda')
  revalidatePath(`/agenda/${id}/editar`)
  return { success: true }
}

/**
 * Alterna status de confirmação do evento.
 */
export async function toggleConfirmacao(id: string, currentStatus: boolean) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const { error } = await (supabase as any)
    .from('eventos')
    .update({ confirmado: !currentStatus })
    .eq('id', id)

  if (error) return { error: 'Falha ao confirmar evento.' }
  
  revalidatePath('/agenda')
  return { success: true }
}

/**
 * Exclui um evento da agenda.
 */
export async function deleteEvento(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const { error } = await supabase
    .from('eventos')
    .delete()
    .eq('id', id)

  if (error) return { error: 'Erro ao excluir evento.' }

  revalidatePath('/agenda')
  return { success: true }
}
