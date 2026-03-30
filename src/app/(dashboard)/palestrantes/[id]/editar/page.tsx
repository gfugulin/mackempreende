import { getPalestranteById } from '@/app/actions/palestrantes'
import PalestranteForm from '@/components/palestrantes/PalestranteForm'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, UserCog } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarPalestrantePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = user?.email ? getSquadFromEmail(user.email) : 'PEW'

  const palestrante = await getPalestranteById(id)

  if (!palestrante) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link 
          href={`/palestrantes/${id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#A32D2D] mb-8 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para Perfil
        </Link>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          {/* Header de Edição */}
          <div className="bg-gray-900 p-8 sm:p-12 text-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#A32D2D]" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#A32D2D]">
                <UserCog className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#A32D2D] uppercase tracking-widest">Ajustar Informações</span>
                <h2 className="text-3xl font-black uppercase tracking-tight">Editar Palestrante</h2>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Atualize contatos, bio e observações do convidado <strong>{palestrante.nome}</strong>.
            </p>
          </div>

          <div className="p-8 sm:p-12">
            <PalestranteForm 
              initialData={palestrante as any} 
              currentSquad={currentSquad as string} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
