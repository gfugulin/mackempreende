import { getEventoById } from '@/app/actions/eventos'
import { getPalestrantes } from '@/app/actions/palestrantes'
import EventoForm from '@/components/agenda/EventoForm'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit3 } from 'lucide-react'

interface EditarEventoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarEventoPage({ params }: EditarEventoPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = ((user?.email ? getSquadFromEmail(user.email) : 'PEW') || 'PEW') as string
  const palestrantes = await getPalestrantes()
  const evento = await getEventoById(id)

  if (!evento) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header Fixo de Edição */}
      <div className="bg-white border-b border-gray-100 px-4 py-8 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/agenda"
              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Edit3 className="h-4 w-4 text-[#A32D2D]" />
                <span className="text-[10px] font-black text-[#A32D2D] uppercase tracking-[0.2em]">Modo Edição</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {(evento as any).titulo ?? 'Sem Título'}
              </h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Editando como</p>
            <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">Squad {(evento as any).squad ?? 'Indefinido'}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <EventoForm 
            initialData={evento as any} 
            currentSquad={currentSquad}
            palestrantes={palestrantes as any}
          />
        </div>
      </main>
    </div>
  )
}
