import PageHeader from '@/components/layout/PageHeader'
import EventoForm from '@/components/agenda/EventoForm'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import { getPalestrantes } from '@/app/actions/palestrantes'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NovoEventoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = user?.email ? getSquadFromEmail(user.email) : 'PEW'
  const palestrantes = await getPalestrantes()

  return (
    <>
      <PageHeader title="Agendar Atividade" squadName={currentSquad as any} />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <Link 
          href="/agenda"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#A32D2D] mb-8 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para Agenda
        </Link>

        <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-12 shadow-sm relative overflow-hidden group">
          {/* Decoração superior */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#A32D2D]" />
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-gray-900">Planejar Atividade</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Defina os detalhes, data e local para o próximo evento de seu squad.
            </p>
          </div>

          <EventoForm 
            currentSquad={currentSquad ?? 'Global'} 
            palestrantes={palestrantes as any}
          />
        </div>
      </div>
    </>
  )
}
