'use client'

import { useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import CalendarView from './CalendarView'
import EventoItem from './EventoItem'
import EventDetailsModal from './EventDetailsModal'
import { Database } from '@/types/database'

type Evento = Database['public']['Tables']['eventos']['Row'] & {
  palestrantes?: { nome: string; empresa: string; cargo: string } | null
}

interface AgendaContainerProps {
  initialEvents: Evento[]
}
export default function AgendaContainer({ initialEvents }: AgendaContainerProps) {
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState<Evento[]>([])
  const [selectedMobileEvents, setSelectedMobileEvents] = useState<Evento[]>([])

  const handleDayClick = (day: Date, dayEvents: Evento[]) => {
    setSelectedDay(day)
    setSelectedDayEvents(dayEvents)
    setSelectedMobileEvents(dayEvents)
    // No desktop continuamos com o modal se hover eventos, no mobile usamos a lista abaixo
    if (window.innerWidth > 768) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 font-sans">
      {/* Controles da Agenda (Filtros e Toggle) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row w-full items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/10">
          <div className="flex bg-gray-100/50 rounded-[24px] p-1 w-full sm:w-auto">
            <button 
              onClick={() => {
                setView('calendar')
                setSelectedMobileEvents([])
              }}
              className={`
                flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-[20px] transition-all duration-500
                ${view === 'calendar' 
                  ? 'bg-white text-[#A32D2D] shadow-sm font-black' 
                  : 'text-gray-400 font-bold hover:text-gray-700'}
              `}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs uppercase tracking-tighter">Calendário</span>
            </button>
            <button 
              onClick={() => setView('timeline')}
              className={`
                flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-[20px] transition-all duration-500
                ${view === 'timeline' 
                  ? 'bg-white text-[#A32D2D] shadow-sm font-black' 
                  : 'text-gray-400 font-bold hover:text-gray-700'}
              `}
            >
              <List className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs uppercase tracking-tighter">Timeline</span>
            </button>
          </div>

          <Link href="/agenda/novo" className="w-full sm:w-auto sm:ml-auto">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-[24px] font-black text-xs hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10 uppercase tracking-widest leading-none">
              <Plus className="h-4 w-4" />
              Novo Evento
            </button>
          </Link>
        </div>
      </div>

      {/* Renderização Condicional da Visão */}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        {view === 'calendar' ? (
          <div className="space-y-8">
            <CalendarView 
              eventos={initialEvents} 
              onDayClick={handleDayClick}
            />
            
            {/* Lista de Eventos do Dia Selecionado (Exclusivo Mobile/Tablet) */}
            {selectedMobileEvents.length > 0 ? (
              <div className="md:hidden space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 px-4">
                  <div className="w-1 h-4 bg-[#A32D2D] rounded-full" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                    Eventos em {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
                  </h3>
                </div>
                <div className="space-y-4">
                  {selectedMobileEvents.map(evento => (
                    <EventoItem key={evento.id} evento={evento} isLast={true} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="md:hidden text-center py-10 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Toque em um dia para ver os detalhes</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 pl-4 py-8">
            <div className="relative border-l-4 border-gray-100 space-y-12">
              {initialEvents.length === 0 ? (
                <div className="pl-12 py-10">
                  <p className="text-gray-400 font-bold">Nenhum evento agendado na timeline.</p>
                </div>
              ) : (
                initialEvents.map((evento) => (
                  <EventoItem key={evento.id} evento={evento} />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <EventDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        day={selectedDay}
        eventos={selectedDayEvents}
      />
    </div>
  )
}
