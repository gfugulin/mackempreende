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
 * Busca palestrantes por nome (fuzzy) para autocomplete no formulário de eventos.
 * Retorna dados essenciais + contagem de eventos para feedback de histórico.
 */
export async function searchPalestrantesByName(query: string) {
  if (!query || query.trim().length < 2) return []
  
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const safeSearch = query.trim().replace(/,/g, ' ')
  const { data, error } = await supabase
    .from('palestrantes')
    .select('id, nome, empresa, cargo, eventos(id)')
    .or(`nome.ilike.%${safeSearch}%,empresa.ilike.%${safeSearch}%`)
    .order('nome')
    .limit(8)

  if (error) {
    console.error('Error searching speakers:', error)
    return []
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    nome: p.nome,
    empresa: p.empresa,
    cargo: p.cargo,
    eventCount: p.eventos?.length || 0,
  }))
}

/**
 * Busca palestrantes com filtros e eventos vinculados.
 * Combina eventos via FK (palestrante_id) com participações via metadata (formato v3)
 * para que co-palestrantes também exibam o badge "Já Participou" corretamente.
 */
export async function getPalestrantes(filters?: { squad?: string; search?: string }) {
  const supabase = (await createClient()) as SupabaseClient<Database>

  // 1. Busca palestrantes com eventos vinculados via FK
  let query = supabase
    .from('palestrantes')
    .select('*, eventos(id, data_inicio, confirmado, tipo)')
    .order('nome')

  if (filters?.squad) {
    query = query.eq('squad_resp', filters.squad)
  }

  if (filters?.search) {
    // Remover vírgulas para evitar problemas de sintaxe no .or() do PostgREST
    const safeSearch = filters.search.replace(/,/g, ' ')
    query = query.or(`nome.ilike.%${safeSearch}%,empresa.ilike.%${safeSearch}%`)
  }

  const { data: palestrantes, error } = await query
  
  if (error) {
    console.error('Error fetching speakers:', error)
    return []
  }

  // 2. Busca TODOS os eventos para cruzar com metadata (co-palestrantes)
  const { data: todosEventos } = await supabase
    .from('eventos')
    .select('id, data_inicio, confirmado, metadata, palestrante_id, tipo')

  if (!todosEventos || todosEventos.length === 0) {
    return palestrantes as any[]
  }

  // 3. Para cada palestrante, verifica se ele aparece no metadata de algum evento
  //    que NÃO está vinculado a ele via FK (evita contagem dupla)
  const enriched = (palestrantes as any[]).map((p: any) => {
    const fkEventIds = new Set((p.eventos || []).map((e: any) => e.id))
    
    const metadataEvents = todosEventos.filter((evt: any) => {
      // Já está na lista de FK? Pula para não contar 2x
      if (fkEventIds.has(evt.id)) return false
      // Já é o palestrante_id deste evento? Pula (deveria estar no FK)
      if (evt.palestrante_id === p.id) return false
      
      // Verifica se o nome aparece no metadata
      const metaStr = JSON.stringify(evt.metadata || {})
      return metaStr.includes(p.nome)
    })

    // Mescla os eventos: FK + metadata
    const allEvents = [
      ...(p.eventos || []),
      ...metadataEvents.map((e: any) => ({
        id: e.id,
        data_inicio: e.data_inicio,
        confirmado: e.confirmado,
        tipo: e.tipo
      }))
    ]

    return { ...p, eventos: allEvents }
  })

  return enriched
}


/**
 * Busca detalhe de um palestrante e seu histórico de eventos completo.
 * Integra dados da v3 (metadata) com o formato legado (palestrante_id).
 */
export async function getPalestranteById(id: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  // 1. Busca os dados básicos do palestrante
  const { data: palestrante, error: pError } = await (supabase.from('palestrantes') as any)
    .select('*')
    .eq('id', id)
    .single()

  if (pError || !palestrante) {
    console.error('Error fetching speaker:', pError)
    return null
  }

  // 2. Busca eventos onde ele participou (Principais, Extras ou via Metadata v3)
  // Buscamos eventos confirmados para o histórico
  const { data: eventos, error: eError } = await supabase
    .from('eventos')
    .select('id, titulo, data_inicio, tipo, squad, metadata, confirmado, palestrante_id')
    .order('data_inicio', { ascending: false })

  if (eError) {
    console.error('Error fetching speaker history:', eError)
    return { ...palestrante, eventos: [] }
  }

  // 3. Filtragem Inteligente: Verifica se o ID ou o Nome do palestrante consta no evento
  const historicoFiltrado = (eventos || []).filter((evt: any) => {
    // Caso 1: Formato Legado (FK)
    if (evt.palestrante_id === id) return true

    // Caso 2: Formato v3 (Lista no Metadata)
    const metaStr = JSON.stringify(evt.metadata || {})
    // Busca rápida: se o nome ou o ID aparece no JSON do metadata
    // (Mais eficiente do que parsear recursivamente para cada linha se a base crescer moderadamente)
    return metaStr.includes(id) || metaStr.includes(palestrante.nome)
  })

  return { 
    ...palestrante, 
    eventos: historicoFiltrado 
  }
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
