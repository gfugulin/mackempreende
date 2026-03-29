import { Database } from '@/types/database'
import { Link2, AtSign, Mail, Phone, Building2, Briefcase, MessageSquare, ExternalLink, Award } from 'lucide-react'
import Link from 'next/link'
import { computeDisplayStatus } from '@/lib/utils/status'

type Palestrante = Database['public']['Tables']['palestrantes']['Row'] & {
  eventos?: { id: string; data_inicio: string; confirmado: boolean }[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  a_contatar: { label: 'A Contatar', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  contatado: { label: 'Contatado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  aguardando_resposta: { label: 'Aguardando Resposta', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmado: { label: 'Confirmado', color: 'bg-green-100 text-green-700 border-green-200' },
  recusado: { label: 'Recusado', color: 'bg-red-100 text-red-700 border-red-200' },
  cancelado: { label: 'Cancelado', color: 'bg-orange-100 text-orange-700 border-orange-200' },
}

export default function PalestranteCard({ palestrante }: { palestrante: Palestrante }) {
  const displayStatus = computeDisplayStatus(palestrante.status, palestrante.eventos)


  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#A32D2D]/30">
      {/* Decoração sutil de background com a cor da liga */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-red-50/50 transition-all group-hover:bg-red-100/50" />
      
      <div className="relative flex flex-col h-full">
        {/* Header: Nome e Badge de Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <Link href={`/palestrantes/${palestrante.id}`} className="block group/title">
              <h3 className="text-xl font-bold text-gray-900 truncate group-hover/title:text-[#A32D2D] transition-colors">
                {palestrante.nome}
              </h3>
            </Link>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{palestrante.empresa || 'Empresa não informada'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${displayStatus.color}`}>
              {displayStatus.key === 'ja_participou' && <Award className="h-3 w-3" />}
              {displayStatus.label}
            </span>
            {displayStatus.count > 0 && (
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">
                {displayStatus.count} {displayStatus.count === 1 ? 'evento' : 'eventos'}
              </span>
            )}
          </div>
        </div>

        {/* Informações Profissionais */}
        {(palestrante.cargo || palestrante.tema) && (
          <div className="mb-5 space-y-2">
            {palestrante.cargo && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                <span>{palestrante.cargo}</span>
              </div>
            )}
            {palestrante.tema && (
              <div className="flex items-start text-sm text-gray-600">
                <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
                <span className="italic">"{palestrante.tema}"</span>
              </div>
            )}
          </div>
        )}

        {/* Bio Curta */}
        {palestrante.bio && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow italic">
            {palestrante.bio}
          </p>
        )}

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Redes Sociais com Status Independente */}
            <div className="flex items-center space-x-4">
              {palestrante.linkedin && (
                <div className="relative group/s">
                  <a 
                    href={palestrante.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#0077B5]/10 hover:text-[#0077B5] transition-all border border-transparent hover:border-[#0077B5]/20 block"
                    aria-label="LinkedIn"
                  >
                    <Link2 className="h-4 w-4" />
                  </a>
                  {/* Indicador de Status LinkedIn */}
                  <div 
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${STATUS_CONFIG[palestrante.status_linkedin || 'a_contatar']?.color.split(' ')[0]}`}
                    title={`LinkedIn: ${STATUS_CONFIG[palestrante.status_linkedin || 'a_contatar']?.label}`}
                  />
                </div>
              )}
              {palestrante.instagram && (
                <div className="relative group/s">
                  <a 
                    href={`https://instagram.com/${palestrante.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#E4405F]/10 hover:text-[#E4405F] transition-all border border-transparent hover:border-[#E4405F]/20 block"
                    aria-label="Instagram"
                  >
                    <AtSign className="h-4 w-4" />
                  </a>
                  {/* Indicador de Status Instagram */}
                  <div 
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${STATUS_CONFIG[palestrante.status_instagram || 'a_contatar']?.color.split(' ')[0]}`}
                    title={`Instagram: ${STATUS_CONFIG[palestrante.status_instagram || 'a_contatar']?.label}`}
                  />
                </div>
              )}
            </div>

            {/* Contato Direto */}
            <div className="flex items-center space-x-2">
              {palestrante.email && (
                <a 
                  href={`mailto:${palestrante.email}`}
                  className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-[#A32D2D]/10 hover:text-[#A32D2D] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {palestrante.telefone && (
                <a 
                  href={`tel:${palestrante.telefone}`}
                  className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-[#A32D2D]/10 hover:text-[#A32D2D] transition-colors"
                  aria-label="Telefone"
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
