'use client'

import { useState } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import { Database } from '@/types/database'

type Evento = Database['public']['Tables']['eventos']['Row'] & {
  palestrantes?: { nome: string; empresa: string; cargo: string } | null
}

interface CalendarViewProps {
  eventos: Evento[]
  onEventClick?: (evento: Evento) => void
  onDayClick?: (day: Date, dayEvents: Evento[]) => void
}

export default function CalendarView({ eventos, onEventClick, onDayClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Agrupa eventos por dia para facilitar o acesso
  const getEventsForDay = (day: Date) => {
    return eventos.filter(event => isSameDay(new Date(event.data_inicio), day))
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
      {/* Header do Calendário */}
      <div className="p-4 sm:p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 font-sans">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 capitalize tracking-tight">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <p className="text-[10px] font-black text-[#A32D2D] uppercase tracking-widest mt-0.5 sm:mt-1">Visão Mensal</p>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-[#A32D2D]"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-2 sm:px-4 py-2 text-[10px] sm:text-xs font-black text-gray-500 hover:text-[#A32D2D] uppercase tracking-tighter transition-colors"
          >
            Hoje
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-[#A32D2D]"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
        {weekDays.map(day => (
          <div key={day} className="py-3 sm:py-4 text-center text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day)
          const isSelectedMonth = isSameMonth(day, monthStart)
          const today = isToday(day)

          return (
            <div 
              key={day.toString()}
              onClick={() => onDayClick?.(day, dayEvents)}
              className={`
                min-h-[70px] sm:min-h-[120px] p-1.5 sm:p-2 border-r border-b border-gray-50 transition-all cursor-pointer group
                ${!isSelectedMonth ? 'bg-gray-50/20 opacity-30 shadow-inner' : 'hover:bg-gray-100/30'}
                ${idx % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <span className={`
                  inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black transition-all
                  ${today ? 'bg-[#A32D2D] text-white shadow-lg shadow-[#A32D2D]/30 scale-110' : 'text-gray-400 group-hover:text-gray-900'}
                `}>
                  {format(day, 'd')}
                </span>
              </div>

              {/* Eventos no Dia (Mobile: Dots | Desktop: Text) */}
              <div className="flex flex-wrap gap-1 sm:block sm:space-y-1">
                {/* Desktop View (Text) */}
                <div className="hidden sm:block space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div 
                      key={event.id}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold truncate transition-all bg-white border border-gray-100 shadow-sm text-gray-700 hover:border-[#A32D2D]/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A32D2D] inline-block mr-1" />
                      {event.titulo}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] font-black text-[#A32D2D] px-2 uppercase tracking-tighter">
                      + {dayEvents.length - 2}
                    </div>
                  )}
                </div>

                {/* Mobile View (Dots) */}
                <div className="flex sm:hidden gap-0.5 flex-wrap">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`w-1.5 h-1.5 rounded-full ${event.confirmado ? 'bg-[#A32D2D]' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
