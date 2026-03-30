'use server'

import { createClient } from '@/lib/supabase/server'
import { eventoSchema, sessaoSchema, type EventoInput, type SessaoInput } from '@/lib/validations/eventos'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cria um novo evento e sincroniza automaticamente os palestrantes vinculados.
 * - Palestrantes com `id` existente: atualiza status se evento confirmado
 * - Palestrantes sem `id` (novo nome): cria registro no diretório via upsert
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

  // === AUTO-SYNC: Palestrantes vinculados → Diretório ===
  const palestrantes = result.data.metadata?.palestrantes || []
  const syncedNew: string[] = []

  for (const p of palestrantes) {
    if (p.is_backup) continue // Reservas não alteram status

    if (p.id) {
      // Palestrante existente: atualizar status se confirmado
      if (result.data.confirmado) {
        await (supabase as any)
          .from('palestrantes')
          .update({ status: 'confirmado' })
          .eq('id', p.id)
      }
    } else if (p.nome && p.nome.trim().length >= 2) {
      // Palestrante novo: buscar por nome (case-insensitive) para evitar duplicatas
      const nomeLimpo = p.nome.trim()
      const { data: existing } = await (supabase as any)
        .from('palestrantes')
        .select('id, nome')
        .ilike('nome', nomeLimpo)
        .single()

      if (!existing) {
        await (supabase as any)
          .from('palestrantes')
          .insert([{
            nome: nomeLimpo,
            empresa: p.empresa || null,
            squad_resp: result.data.squad,
            status: result.data.confirmado ? 'confirmado' : 'a_contatar',
          }])
        syncedNew.push(nomeLimpo)
      }
    }
  }

  revalidatePath('/agenda')
  revalidatePath('/palestrantes')
  return { 
    success: true, 
    syncedExtras: syncedNew.length > 0 ? syncedNew : undefined 
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
    .is('evento_pai_id', null) // Sessões ficam escondidas da timeline
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

  // Enriquece eventos-pai com contagem de sessões
  const eventIds = (data || []).map((e: any) => e.id)
  if (eventIds.length > 0) {
    const { data: sessoes } = await supabase
      .from('eventos')
      .select('evento_pai_id, id, titulo, data_inicio, local, metadata')
      .in('evento_pai_id', eventIds)
      .order('ordem', { ascending: true })
      .order('data_inicio', { ascending: true })

    // Agrupa sessões por pai
    const sessoesMap: Record<string, any[]> = {}
    for (const s of (sessoes || [])) {
      const paiId = (s as any).evento_pai_id
      if (!sessoesMap[paiId]) sessoesMap[paiId] = []
      sessoesMap[paiId].push(s)
    }

    return (data || []).map((e: any) => ({
      ...e,
      sessoes: sessoesMap[e.id] || [],
    }))
  }

  return (data || []).map((e: any) => ({ ...e, sessoes: [] }))
}

/**
 * Busca um único evento por ID.
 */
export async function getEventoById(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  // Busca o evento principal
  const { data, error } = await supabase
    .from('eventos')
    .select('*, palestrantes(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching event by ID:', error)
    return null
  }

  // Busca sessões filhas (cronograma)
  const { data: sessoes } = await supabase
    .from('eventos')
    .select('*, palestrantes(nome, empresa, cargo)')
    .eq('evento_pai_id', id)
    .order('ordem', { ascending: true })
    .order('data_inicio', { ascending: true })

  return { ...(data as any), sessoes: sessoes || [] }
}

/**
 * Atualiza um evento existente e sincroniza palestrantes novos.
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

  // Sincronizar palestrantes novos no update também
  const palestrantes = result.data.metadata?.palestrantes || []
  for (const p of palestrantes) {
    if (!p.id && p.nome && p.nome.trim().length >= 2) {
      const nomeLimpo = p.nome.trim()
      const { data: existing } = await (supabase as any)
        .from('palestrantes')
        .select('id')
        .ilike('nome', nomeLimpo)
        .single()

      if (!existing) {
        await (supabase as any)
          .from('palestrantes')
          .insert([{
            nome: nomeLimpo,
            empresa: p.empresa || null,
            squad_resp: result.data.squad,
            status: result.data.confirmado ? 'confirmado' : 'a_contatar',
          }])
      }
    }
  }

  revalidatePath('/agenda')
  revalidatePath('/palestrantes')
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
 * Exclui um evento da agenda (sessões filhas são deletadas via CASCADE).
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


// ═══════════════════════════════════════════════════════════════
// CRUD DE SESSÕES (Cronograma)
// ═══════════════════════════════════════════════════════════════

/**
 * Cria uma sessão dentro de um evento-pai.
 * Herda squad e tipo do pai automaticamente.
 */
export async function createSessao(eventoPaiId: string, data: SessaoInput) {
  const supabase = (await createClient()) as SupabaseClient<Database>

  const result = sessaoSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Dados inválidos para a sessão.' }
  }

  // Busca dados do pai para herdar squad/tipo
  const { data: pai } = await supabase
    .from('eventos')
    .select('squad, tipo')
    .eq('id', eventoPaiId)
    .single()

  const paiData = pai as any
  if (!paiData) return { error: 'Evento-pai não encontrado.' }

  const { error } = await (supabase.from('eventos') as any)
    .insert([{
      ...result.data,
      evento_pai_id: eventoPaiId,
      squad: paiData.squad,
      tipo: paiData.tipo,
      confirmado: true,
    }])

  if (error) {
    console.error('Error creating session:', error)
    return { error: 'Erro ao criar sessão.' }
  }

  // Sincronizar palestrantes novos
  const palestrantes = result.data.metadata?.palestrantes || []
  for (const p of palestrantes) {
    if (!p.id && p.nome && p.nome.trim().length >= 2) {
      const nomeLimpo = p.nome.trim()
      const { data: existing } = await (supabase as any)
        .from('palestrantes')
        .select('id')
        .ilike('nome', nomeLimpo)
        .single()
      if (!existing) {
        await (supabase as any)
          .from('palestrantes')
          .insert([{ nome: nomeLimpo, empresa: p.empresa || null, squad_resp: paiData.squad, status: 'confirmado' }])
      }
    }
  }

  revalidatePath('/agenda')
  revalidatePath(`/agenda/${eventoPaiId}/editar`)
  return { success: true }
}

/**
 * Exclui uma sessão individual.
 */
export async function deleteSessao(sessaoId: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>

  // Buscar pai para revalidar
  const { data: sessao } = await supabase
    .from('eventos')
    .select('evento_pai_id')
    .eq('id', sessaoId)
    .single()

  const { error } = await supabase
    .from('eventos')
    .delete()
    .eq('id', sessaoId)

  if (error) return { error: 'Erro ao excluir sessão.' }

  revalidatePath('/agenda')
  const sessaoData = sessao as any
  if (sessaoData?.evento_pai_id) {
    revalidatePath(`/agenda/${sessaoData.evento_pai_id}/editar`)
  }
  return { success: true }
}
