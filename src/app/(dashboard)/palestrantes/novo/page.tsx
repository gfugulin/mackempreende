import PageHeader from '@/components/layout/PageHeader'
import PalestranteForm from '@/components/palestrantes/PalestranteForm'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NovoPalestrantePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = (user?.email ? getSquadFromEmail(user.email) : 'PEW') ?? 'PEW'

  return (
    <>
      <PageHeader title="Novo Palestrante" squadName={currentSquad as any} />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <Link 
          href="/palestrantes"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#A32D2D] mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para o diretório
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Decoração superior */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#A32D2D]" />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Cadastrar Talento</h2>
            <p className="text-gray-500 mt-1">
              Adicione as informações do palestrante ou convidado para o seu squad.
            </p>
          </div>

          <PalestranteForm currentSquad={currentSquad} />
        </div>
      </div>
    </>
  )
}
