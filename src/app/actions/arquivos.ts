'use server'

import { createClient } from '@/lib/supabase/server'
import { arquivoSchema, type ArquivoInput } from '@/lib/validations/arquivos'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Registra um arquivo no Database após upload bem-sucedido no Storage.
 */
export async function registerArquivo(data: ArquivoInput & { 
  url: string; 
  nome_arquivo: string; 
  tamanho_bytes: number; 
  tipo_mime: string; 
}) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const result = arquivoSchema.safeParse({
    nome: data.nome,
    descricao: data.descricao,
    squad: data.squad,
    evento_id: data.evento_id
  })

  if (!result.success) {
    return { error: 'Dados inválidos para o registro do arquivo.' }
  }

  const { error } = await (supabase as any)
    .from('arquivos')
    .insert([{
      ...result.data,
      url: data.url,
      nome_arquivo: data.nome_arquivo,
      tamanho_bytes: data.tamanho_bytes,
      tipo_mime: data.tipo_mime
    }] as any)

  if (error) {
    console.error('Error registering file:', error)
    return { error: 'Erro ao registrar arquivo no banco de dados.' }
  }

  revalidatePath('/arquivos')
  return { success: true }
}

function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

/**
 * Faz upload de um arquivo físico para o Supabase Storage.
 * Retorna a URL pública ou erro.
 */
export async function uploadArquivoAction(file: File, folder: string = 'geral') {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  const fileExt = file.name.split('.').pop()
  const cleanBaseName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""))
  const fileName = `${Math.random().toString(36).substring(2)}-${cleanBaseName}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  // @ts-ignore - Supabase type conflict with Browser File
  const { data, error } = await supabase.storage
    .from('mackempreende-arquivos')
    .upload(filePath, file)

  if (error) {
    console.error('Error uploading file:', error)
    return { error: 'Erro no upload' }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('mackempreende-arquivos')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Busca arquivos com filtros de Squad e busca textual.
 */
export async function getArquivos(filters?: { squad?: string; search?: string }) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  let query = supabase.from('arquivos').select('*, eventos(titulo)').order('criado_em', { ascending: false })

  if (filters?.squad) {
    query = query.eq('squad', filters.squad)
  }

  if (filters?.search) {
    query = query.ilike('nome', `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching files:', error)
    return []
  }

  return data
}

/**
 * Exclui arquivo do Storage e do Database.
 */
export async function deleteArquivo(id: string, path: string) {
  const supabase = (await createClient()) as SupabaseClient<Database>
  
  // 1. Remover do Storage
  const { error: storageError } = await supabase.storage.from('mackempreende-arquivos').remove([path])
  if (storageError) {
    return { error: 'Erro ao excluir arquivo físico.' }
  }

  // 2. Remover do Database
  const { error: dbError } = await supabase.from('arquivos').delete().eq('id', id)
  if (dbError) {
    return { error: 'Erro ao remover registro do arquivo.' }
  }

  revalidatePath('/arquivos')
  return { success: true }
}
