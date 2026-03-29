export type Squad = 'PEW' | 'Podcast' | 'Comunica' | 'Culture'

const EMAIL_SQUAD_MAP: Record<string, Squad> = {
  'pew@mackempreende.com.br': 'PEW',
  'podcast@mackempreende.com.br': 'Podcast',
  'comunica@mackempreende.com.br': 'Comunica',
  'culture@mackempreende.com.br': 'Culture',
}

export function getSquadFromEmail(email: string): Squad | null {
  return EMAIL_SQUAD_MAP[email] ?? null
}
