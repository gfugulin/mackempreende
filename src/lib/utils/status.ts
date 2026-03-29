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
  eventos?: { data_inicio: string; confirmado: boolean }[]
): { key: string; label: string; color: string; count: number } {
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
  const pastConfirmed = confirmedEvents.filter(e => new Date(e.data_inicio) < now)
  const futureConfirmed = confirmedEvents.filter(e => new Date(e.data_inicio) >= now)

  if (futureConfirmed.length > 0) {
    return { key: 'confirmado', ...STATUS_MAP.confirmado, count: confirmedEvents.length }
  }

  if (pastConfirmed.length > 0) {
    return { key: 'ja_participou', ...STATUS_MAP.ja_participou, count: pastConfirmed.length }
  }

  const s = STATUS_MAP[manualStatus] || STATUS_MAP.a_contatar
  return { key: manualStatus, ...s, count: 0 }
}
