import PageHeader from '@/components/layout/PageHeader'
import FileCard from '@/components/arquivos/FileCard'
import { getArquivos } from '@/app/actions/arquivos'
import { FolderOpen, Search, UploadCloud, Grid, List as ListIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import FileUploadZone from '@/components/arquivos/FileUploadZone'
import Link from 'next/link'

export default async function ArquivosPage({
  searchParams,
}: {
  searchParams: Promise<{ squad?: string; q?: string; upload?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = user?.email ? getSquadFromEmail(user.email) : 'PEW'
  
  const squadFilter = params.squad || currentSquad || undefined
  const query = params.q || ''
  const isUploading = params.upload === 'true'

  // @ts-ignore - Ignore type error temporarily
  const arquivos = await getArquivos({ 
    squad: params.squad === 'all' ? undefined : (squadFilter as any),
    search: query
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <PageHeader 
        title="Arquivos" 
        squadName={(params.squad || currentSquad || 'Global') as any} 
      />

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Toolbar Superior */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#A32D2D]/10 p-2.5 rounded-2xl">
              <FolderOpen className="h-5 w-5 text-[#A32D2D]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-none">Biblioteca</h2>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Documentos e Ativos</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-grow max-w-2xl lg:justify-end">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#A32D2D] transition-colors" />
              <input 
                type="text"
                placeholder="Buscar arquivos..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all text-sm"
              />
            </div>
            
            <Link 
              href="?upload=true"
              className="flex items-center gap-2 bg-[#A32D2D] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="h-5 w-5" /> Enviar
            </Link>
          </div>
        </div>

        {/* Modal de Upload */}
        {isUploading && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200">
              <Link href="?" className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </Link>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Novo Arquivo</h3>
              <p className="text-sm text-gray-500 mb-8">O arquivo ficará disponível para todos do squad {currentSquad}.</p>
              <FileUploadZone currentSquad={currentSquad ?? 'Global'} />
            </div>
          </div>
        )}

        {/* Grid de Arquivos */}
        {arquivos && arquivos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {arquivos.map((arquivo: any) => (
              <FileCard key={arquivo.id} arquivo={arquivo} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-6 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="relative">
              <div className="absolute inset-0 bg-[#A32D2D]/5 blur-2xl rounded-full" />
              <div className="relative w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FolderOpen className="h-12 w-12 text-gray-200" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Nenhum arquivo encontrado</h3>
            <p className="text-gray-500 text-center max-w-sm mt-2">
              Sua biblioteca está vazia. Comece a organizar seus documentos agora mesmo.
            </p>
            <Link 
              href="?upload=true"
              className="mt-8 px-10 py-3.5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all text-center"
            >
              Fazer Upload agora
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
