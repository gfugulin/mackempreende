import { Database } from '@/types/database'
import { Calendar, Clock, MapPin, Video, CheckCircle2, MoreVertical, Briefcase, ExternalLink, Edit2, Users, ShieldPlus, Building2, UserPlus, ListOrdered } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

type Evento = Database['public']['Tables']['eventos']['Row'] & {
  palestrantes?: {
    nome: string;
    empresa: string | null;
    cargo: string | null;
  } | null;
  sessoes?: any[];
}

interface EventoItemProps {
  evento: Evento
  isFirst?: boolean
  isLast?: boolean
}

const TIPO_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  'aula': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  'workshop': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  'palestra': { bg: 'bg-[#A32D2D]/5', text: 'text-[#A32D2D]', border: 'border-[#A32D2D]/10' },
  'podcast': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  'evento_externo': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  'reuniao_interna': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' },
  'feira': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
}

export default function EventoItem({ evento, isFirst, isLast }: EventoItemProps) {
  const date = new Date(evento.data_inicio)
  const colors = TIPO_COLORS[evento.tipo] || TIPO_COLORS['reuniao_interna']
  
  // Extração segura de metadados (compatível com formato novo e antigo)
  const meta = (evento.metadata as any) || {}
  
  // Novo formato unificado
  const allSpeakers = meta.palestrantes || []
  const mainSpeakers = allSpeakers.filter((p: any) => !p.is_backup)
  const backupSpeakers = allSpeakers.filter((p: any) => p.is_backup)
  
  // Retrocompatibilidade: formato antigo
  const legacyExtras = meta.palestrantes_extras || []
  const legacyBackups = meta.palestrantes_backup || []
  
  const partners = meta.parceiros || []
  const expositores = meta.expositores || []
  const documentos = meta.documentos_importantes || []
  const sessoes = (evento as any).sessoes || []

  return (
    <div className="flex gap-3 sm:gap-6 group animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Timeline Indicator */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center shadow-sm border border-gray-100 transition-all group-hover:shadow-lg ${evento.confirmado ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
          <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-0.5">{format(date, 'MMM', { locale: ptBR })}</span>
          <span className="text-sm sm:text-xl font-black text-gray-900 leading-none">{format(date, 'dd')}</span>
        </div>
        {!isLast && <div className="w-0.5 flex-grow bg-gray-100 my-3 group-hover:bg-[#A32D2D]/20 transition-colors" />}
      </div>

      {/* Content Card */}
      <div className={`flex-grow pb-8 sm:pb-12 transition-all ${!evento.confirmado && 'opacity-80'}`}>
        <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 p-5 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all relative overflow-hidden group-hover:border-[#A32D2D]/10">
          
          {/* Badge de Tipo e Ações */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${colors.bg} ${colors.text} ${colors.border}`}>
                {evento.tipo.replace('_', ' ')}
              </span>
              {evento.confirmado && (
                <span className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] font-black text-green-600 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-100">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse" /> CONFIRMADO
                </span>
              )}
              {sessoes.length > 0 && (
                <span className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-indigo-100">
                  <ListOrdered className="h-3 w-3" /> {sessoes.length} {sessoes.length === 1 ? 'SESSÃO' : 'SESSÕES'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Link 
                href={`/agenda/${evento.id}/editar`}
                className="p-2 sm:p-3 bg-gray-50 text-gray-400 hover:bg-[#A32D2D] hover:text-white rounded-xl sm:rounded-2xl transition-all shadow-sm"
                title="Editar Evento"
              >
                <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-gray-900 group-hover:text-[#A32D2D] transition-colors leading-tight tracking-tight">
            {evento.titulo}
          </h3>

          <p className="mt-2 sm:mt-3 text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
            {evento.descricao || 'Sem descrição detalhada disponível.'}
          </p>

          {/* Info Grid */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#A32D2D]/5 group-hover:text-[#A32D2D] transition-colors">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Horário</p>
                <p className="font-black text-gray-900 text-xs sm:text-sm">{format(date, "HH'h'mm", { locale: ptBR })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#A32D2D]/5 group-hover:text-[#A32D2D] transition-colors">
                {evento.local ? <MapPin className="h-4 w-4 sm:h-5 sm:w-5" /> : <Video className="h-4 w-4 sm:h-5 sm:w-5" />}
              </div>
              <div>
                <p className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Localização</p>
                <p className="font-black text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">
                  {evento.local || (evento.link_online ? 'Evento Online' : 'A definir')}
                </p>
              </div>
            </div>

            {/* Main Speaker */}
            {evento.palestrantes && (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg shadow-gray-200">
                  {evento.palestrantes.nome.charAt(0)}
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Principal</p>
                  <p className="font-black text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{evento.palestrantes.nome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Palestrantes Section (novo formato + retrocompatibilidade) */}
          {(mainSpeakers.length > 0 || backupSpeakers.length > 0 || legacyExtras.length > 0 || legacyBackups.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-4">
              {mainSpeakers.map((s: any, idx: number) => (
                <div key={`main-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  <UserPlus className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{s.nome}</span>
                </div>
              ))}
              {backupSpeakers.map((s: any, idx: number) => (
                <div key={`backup-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100">
                  <ShieldPlus className="h-3 w-3 text-orange-400" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">{s.nome} (Reserva)</span>
                </div>
              ))}
              {/* Retrocompatibilidade: formato antigo */}
              {legacyExtras.map((s: string, idx: number) => (
                <div key={`leg-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  <UserPlus className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{s}</span>
                </div>
              ))}
              {legacyBackups.map((s: string, idx: number) => (
                <div key={`legb-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100">
                  <ShieldPlus className="h-3 w-3 text-orange-400" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">{s} (Backup)</span>
                </div>
              ))}
            </div>
          )}

          {/* Partners Section (Logos) */}
          {partners.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Empresas & Ativações</p>
              <div className="flex flex-wrap gap-6 items-center">
                {partners.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 group/p">
                    {p.logo_url ? (
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden p-1.5 shadow-sm group-hover/p:border-[#A32D2D]/20 transition-all">
                        <img src={p.logo_url} alt={p.nome} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-50">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{p.nome}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{p.contribuicao || 'Apoio'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mini Cronograma (Sessões) */}
          {sessoes.length > 0 && (
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-50">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <ListOrdered className="h-3.5 w-3.5" /> Cronograma
              </p>
              <div className="space-y-1.5">
                {sessoes.map((s: any, idx: number) => {
                  const sDate = new Date(s.data_inicio)
                  const sMeta = s.metadata || {}
                  const sSpeakers = (sMeta.palestrantes || []).filter((p: any) => !p.is_backup)
                  return (
                    <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50/70 border border-gray-50 hover:border-indigo-100 transition-all">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-gray-800 truncate">{s.titulo}</p>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 shrink-0">
                        {format(sDate, "dd/MM HH'h'mm", { locale: ptBR })}
                      </span>
                      {sSpeakers.length > 0 && (
                        <span className="text-[9px] font-bold text-indigo-500 truncate max-w-[80px] sm:max-w-none shrink-0">
                          {sSpeakers.map((p: any) => p.nome).join(', ')}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Footer */}
          {evento.link_online && (
            <div className="mt-8">
              <a 
                href={evento.link_online} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
              >
                Acessar Transmissão <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
