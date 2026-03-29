import { getPalestrantes } from '@/app/actions/palestrantes'
import PageHeader from '@/components/layout/PageHeader'
import PalestranteCard from '@/components/palestrantes/PalestranteCard'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import { Search, Plus, Filter, Users, FileText } from 'lucide-react'
import Link from 'next/link'
import ImportarPalestrantes from '@/components/palestrantes/ImportarPalestrantes'

export default async function PalestrantesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; squad?: string }>
}) {
  const { q, squad: squadFilter } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = user?.email ? getSquadFromEmail(user.email) : null

  // Busca real no banco com os filtros da URL
  const palestrantes = await getPalestrantes({
    search: q,
    squad: squadFilter,
  })

  return (
    <>
      <PageHeader title="Diretório de Palestrantes" squadName={currentSquad} />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Toolbar de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
          <form action="/palestrantes" className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por nome ou empresa..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] transition-all"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link 
              href="/palestrantes" 
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${!squadFilter ? 'bg-[#A32D2D] text-white border-[#A32D2D]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              Todos
            </Link>
            <Link 
              href={`/palestrantes?squad=${currentSquad}`} 
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${squadFilter === currentSquad ? 'bg-[#A32D2D] text-white border-[#A32D2D]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              Meu Squad
            </Link>
            
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <ImportarPalestrantes currentSquad={currentSquad || 'PEW'} />

              <Link 
                href="/palestrantes/novo"
                className="flex items-center justify-center gap-2 bg-[#A32D2D] hover:bg-[#8B2626] text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Novo</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Listagem */}
        {palestrantes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(palestrantes as any).map((p: any) => (
              <PalestranteCard key={p.id} palestrante={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white border border-dashed border-gray-200 overflow-hidden relative">
            {/* Background pattern decorativo */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
              <div className="grid grid-cols-12 gap-4 h-full w-full p-4">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded-full bg-red-900" />
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-[#A32D2D]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum palestrante encontrado
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                {q || squadFilter 
                  ? "Tente ajustar seus filtros ou busca para encontrar o que procura." 
                  : "Seu diretório está vazio. Comece adicionando palestrantes importantes para o MackEmpreende."}
              </p>
              { (q || squadFilter) && (
                <Link 
                  href="/palestrantes"
                  className="text-sm font-semibold text-[#A32D2D] hover:underline"
                >
                  Limpar todos os filtros
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
