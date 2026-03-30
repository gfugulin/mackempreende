import { getEventos } from '@/app/actions/eventos'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import PageHeader from '@/components/layout/PageHeader'
import AgendaContainer from '@/components/agenda/AgendaContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agenda | MackEmpreende',
  description: 'Cronograma de atividades, workshops e aulas da MackEmpreende.',
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ squad?: string; hidePast?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = user?.email ? getSquadFromEmail(user.email) : 'PEW'
  
  const squadFilter = params.squad || undefined
  const hidePast = params.hidePast !== 'false'

  // Buscamos os eventos para injetar no container client-side
  // @ts-ignore
  const eventosRaw = await getEventos({ 
    squad: squadFilter as any,
    hidePast 
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <PageHeader title="Agenda Mack" squadName={squadFilter as any} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <AgendaContainer initialEvents={eventosRaw as any} />
      </main>
    </div>
  )
}
