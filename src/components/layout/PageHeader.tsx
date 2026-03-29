'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Layout } from 'lucide-react'
import { Squad } from '@/lib/auth/get-squad'
import Image from 'next/image'

interface PageHeaderProps {
  title: string
  squadName?: Squad | null
}

const SQUAD_BANNERS: Record<string, string> = {
  'PEW': '/images/banner_pew.png',
  'Podcast': '/images/banner_podcast.png',
  'Comunica': '/images/banner_comunica.png',
  'Culture': '/images/banner_culture.png',
}

export default function PageHeader({ title, squadName }: PageHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  const bannerImg = squadName ? (SQUAD_BANNERS[squadName] || '/images/ligamackempreende_banner.jpg') : '/images/ligamackempreende_banner.jpg'

  return (
    <div className="flex flex-col">
      {/* Barra de Topo */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 shrink-0">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 relative overflow-hidden rounded-lg brightness-110">
                <Image src="/images/Logo.jpg" alt="Logo" fill className="object-cover" />
             </div>
             <div className="w-px h-6 bg-gray-100 mx-2" />
             <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {squadName && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-[#A32D2D] uppercase tracking-wider border border-red-100">
                Squad {squadName}
              </span>
            )}
            
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-gray-400 hover:bg-red-50 hover:text-[#A32D2D] transition-all border border-transparent hover:border-red-100"
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section (Engenharia de Proporção Perfeita - Mobile Optimized) */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative h-20 sm:h-36 md:h-44 w-full overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100 bg-white group flex items-center justify-center">
          
          {/* Fundo de Textura Diagonal */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)' , backgroundSize: '4px 4px' }} />
          
          {/* Semicírculos Laterais (Padrão MackEmpreende) */}
          <div className="absolute -left-10 sm:-left-16 top-1/2 -translate-y-1/2 w-20 sm:w-32 h-20 sm:h-32 bg-[#A32D2D] rounded-full" />
          <div className="absolute -right-10 sm:-right-16 top-1/2 -translate-y-1/2 w-20 sm:w-32 h-20 sm:h-32 bg-[#A32D2D] rounded-full" />

          {/* Conteúdo Tipográfico Dinâmico (Sem cortes) */}
          <div className="relative z-10 text-center px-6 sm:px-12">
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-black text-[#A32D2D] uppercase tracking-tighter leading-none mb-1 italic">
              {squadName ? (squadName === 'Podcast' ? 'MackCast' : `Squad ${squadName}`) : 'MackEmpreende'}
            </h2>
            <div className="h-0.5 w-8 bg-gray-900 mx-auto mb-1 opactiy-20" />
            <p className="text-[8px] sm:text-xs font-black text-gray-900 uppercase tracking-[0.2em] sm:tracking-[0.4em] opacity-40">
              {squadName === 'PEW' && 'Projetos, Eventos e Workshops'}
              {squadName === 'Podcast' && 'Inovação em Áudio & Vídeo'}
              {squadName === 'Comunica' && 'Marketing e Relacionamento'}
              {squadName === 'Culture' && 'Gente e Cultura Interna'}
              {!squadName && 'Liga de Empreendedorismo Mackenzie'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
