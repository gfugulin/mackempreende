'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X, Calendar, MapPin, Clock, Video, Users, ExternalLink, ShieldPlus, UserPlus, Building2 } from 'lucide-react'
import { Database } from '@/types/database'

type Evento = Database['public']['Tables']['eventos']['Row'] & {
  palestrantes?: { nome: string; empresa: string; cargo: string } | null
}

interface EventDetailsModalProps {
  day: Date
  eventos: Evento[]
  isOpen: boolean
  onClose: () => void
}

export default function EventDetailsModal({ day, eventos, isOpen, onClose }: EventDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-all"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm shadow-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 capitalize tracking-tight">
              {format(day, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h3>
            <p className="text-xs font-bold text-[#A32D2D] uppercase tracking-widest mt-1">Atividades do dia</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all border border-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of Events */}
        <div className="max-h-[70vh] overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {eventos.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm text-gray-300">
                <Calendar className="h-8 w-8" />
              </div>
              <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Nenhuma atividade agendada.</p>
            </div>
          ) : (
            eventos.map(evento => {
              const meta = (evento.metadata as any) || {}
              const allSpeakers = meta.palestrantes || []
              const mainSpeakers = allSpeakers.filter((p: any) => !p.is_backup)
              const backupSpeakers = allSpeakers.filter((p: any) => p.is_backup)
              const legacyExtras = meta.palestrantes_extras || []
              const legacyBackups = meta.palestrantes_backup || []
              const partners = meta.parceiros || []

              return (
                <div 
                  key={evento.id}
                  className="group relative bg-white border border-gray-100 p-8 rounded-[40px] hover:border-[#A32D2D]/20 transition-all hover:shadow-2xl hover:shadow-gray-200/50"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#A32D2D]/5 text-[#A32D2D]">
                      {evento.tipo.replace('_', ' ')}
                    </span>
                    {evento.confirmado && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Confirmado
                      </span>
                    )}
                  </div>

                  <h4 className="text-2xl font-black text-gray-900 leading-tight mb-6 group-hover:text-[#A32D2D] transition-colors uppercase tracking-tight">
                    {evento.titulo}
                  </h4>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-50 font-bold">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Horário</p>
                        <p className="text-base font-black text-gray-900 uppercase">
                          {format(new Date(evento.data_inicio), 'HH:mm')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-50 font-bold">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Local</p>
                        <p className="text-base font-black text-gray-900 uppercase truncate max-w-[120px]">
                          {evento.local || 'A definir'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Palestrantes (novo formato + legado) */}
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    {/* Palestrante vinculado via FK antiga */}
                    {evento.palestrantes ? (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-gray-200">
                          {evento.palestrantes.nome.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Convidado Principal</p>
                          <p className="text-sm font-black text-gray-900">{evento.palestrantes.nome}</p>
                        </div>
                      </div>
                    ) : mainSpeakers.length === 0 && legacyExtras.length === 0 ? (
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sem palestrante definido</p>
                    ) : null}

                    {/* Palestrantes principais (novo formato) */}
                    {mainSpeakers.length > 0 && (
                      <div className="flex flex-wrap gap-3 pl-2 border-l-2 border-dashed border-gray-100 py-1">
                        {mainSpeakers.map((s: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                            <UserPlus className="h-3 w-3" /> {s.nome}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Retrocompatibilidade: extras antigos */}
                    {legacyExtras.length > 0 && (
                      <div className="flex flex-wrap gap-3 pl-2 border-l-2 border-dashed border-gray-100 py-1">
                        {legacyExtras.map((s: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                            <UserPlus className="h-3 w-3" /> {s}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reservas (novo formato) */}
                    {backupSpeakers.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldPlus className="h-3 w-3" /> Reservas
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {backupSpeakers.map((s: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black border border-orange-100">
                              {s.nome}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Retrocompatibilidade: backups antigos */}
                    {legacyBackups.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldPlus className="h-3 w-3" /> Reservas/Backups
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {legacyBackups.map((s: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black border border-orange-100">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Partners Section in Modal */}
                  {partners.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Marcas & Ativações</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {partners.map((p: any, i: number) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50/50 border border-gray-50">
                            {p.logo_url ? (
                              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                                <img src={p.logo_url} alt={p.nome} className="w-full h-full object-contain" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                                <Building2 className="h-6 w-6" />
                              </div>
                            )}
                            <div>
                              <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{p.nome}</p>
                              <p className="text-[9px] text-gray-500 font-bold leading-tight">{p.contribuicao || 'Apoio Institucional'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-4">
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-right hidden sm:block">
            MACKEMPREENDE © 2026<br />GESTÃO COM FOCO EM QUALIDADE
          </p>
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-gray-900 text-white rounded-[24px] font-black text-xs hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-gray-900/10 uppercase tracking-widest"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  )
}
