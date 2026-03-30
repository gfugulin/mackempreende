/**
 * Calcula o status visual de exibição do palestrante com base nos eventos vinculados.
 * Esta é uma função pura (sem side-effects) que pode ser usada tanto no server quanto no client.
 * 
 * Lógica:
 * - Se o palestrante tem eventos confirmados no futuro → "confirmado"
 * - Se o palestrante tem eventos confirmados no passado → "ja_participou"
 * - Caso contrário → Status manual do banco
 */
export function computeDisplayStatus(
  manualStatus: string,
  eventos?: { data_inicio: string; confirmado: boolean; tipo?: string }[]
): { key: string; label: string; color: string; count: number; participacoes?: { icon: string; count: number; label: string; color: string }[] } {
  const STATUS_MAP: Record<string, { label: string; color: string }> = {
    a_contatar: { label: 'A Contatar', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    contatado: { label: 'Contatado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    aguardando_resposta: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    confirmado: { label: 'Confirmado', color: 'bg-green-100 text-green-700 border-green-200' },
    recusado: { label: 'Recusado', color: 'bg-red-100 text-red-700 border-red-200' },
    cancelado: { label: 'Cancelado', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    ja_participou: { label: 'Já Participou', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  }

  if (!eventos || eventos.length === 0) {
    const s = STATUS_MAP[manualStatus] || STATUS_MAP.a_contatar
    return { key: manualStatus, ...s, count: 0 }
  }

  const now = new Date()
  const confirmedEvents = eventos.filter(e => e.confirmado)
  const podcastEvents = confirmedEvents.filter(e => e.tipo === 'podcast')
  const coreEvents = confirmedEvents.filter(e => e.tipo !== 'podcast')

  const pastConfirmed = coreEvents.filter(e => new Date(e.data_inicio) < now)
  const futureConfirmed = coreEvents.filter(e => new Date(e.data_inicio) >= now)

  let mainKey = manualStatus
  let mainStatus = STATUS_MAP[manualStatus] || STATUS_MAP.a_contatar
  let count = 0

  if (futureConfirmed.length > 0) {
    mainKey = 'confirmado'
    mainStatus = STATUS_MAP.confirmado
    count = coreEvents.length
  } else if (pastConfirmed.length > 0) {
    mainKey = 'ja_participou'
    mainStatus = STATUS_MAP.ja_participou
    count = pastConfirmed.length
  }

  const participacoes = []
  
  if (podcastEvents.length > 0) {
    participacoes.push({
      icon: '🎙️',
      count: podcastEvents.length,
      label: podcastEvents.length === 1 ? 'Podcast' : 'Podcasts',
      color: 'bg-[#ffeedd] text-[#e67e22] border-[#f2d0a9]'
    })

    // Lógica Dinâmica (Opção 3): Substituir o status cinza por uma tag de funil de Prospect (Lead)
    if (mainKey === 'a_contatar') {
      mainStatus = { 
        ...mainStatus, 
        label: 'Lead PEW', 
        color: 'bg-indigo-50 text-indigo-700 border-indigo-100' 
      }
    }
  }

  return { key: mainKey, ...mainStatus, count, participacoes }
}
