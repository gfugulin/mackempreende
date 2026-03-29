'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { palestranteSchema, type PalestranteInput, StatusPalestranteEnum, SquadTipoEnum } from '@/lib/validations/palestrantes'
import { createPalestrante, updatePalestrante } from '@/app/actions/palestrantes'
import { useState } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Database } from '@/types/database'

type Palestrante = Database['public']['Tables']['palestrantes']['Row']

interface PalestranteFormProps {
  initialData?: Palestrante
  currentSquad: string
  onSuccess?: () => void
}

export default function PalestranteForm({ initialData, currentSquad, onSuccess }: PalestranteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({ // Usando any temporariamente para desacoplar erro de união complexa do Zod vs RHG
    resolver: zodResolver(palestranteSchema),
    defaultValues: initialData ? {
      ...initialData,
      email: initialData.email ?? '',
      telefone: initialData.telefone ?? '',
      empresa: initialData.empresa ?? '',
      cargo: initialData.cargo ?? '',
      tema: initialData.tema ?? '',
      bio: initialData.bio ?? '',
      linkedin: initialData.linkedin ?? '',
      instagram: initialData.instagram ?? '',
      observacoes: initialData.observacoes ?? '',
    } : {
      status: 'a_contatar',
      squad_resp: currentSquad as any,
    }
  })

  const onSubmit = async (data: PalestranteInput) => {
    setIsSubmitting(true)
    setMessage(null)

    const response = initialData 
      ? await updatePalestrante(initialData.id, data)
      : await createPalestrante(data)

    setIsSubmitting(false)

    if (response.success) {
      setMessage({ type: 'success', text: `Palestrante ${initialData ? 'atualizado' : 'cadastrado'} com sucesso!` })
      if (!initialData) reset()
      if (onSuccess) setTimeout(onSuccess, 1500)
    } else {
      setMessage({ type: 'error', text: response.error || 'Erro ao processar solicitação.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informações Básicas */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Identidade</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
              <input 
                {...register('nome')} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all"
                placeholder="Ex: João Silva"
              />
              {errors.nome?.message && <p className="text-xs text-red-500 font-medium">{String(errors.nome.message)}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Squad Responsável *</label>
              <select 
                {...register('squad_resp')} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none bg-white transition-all"
              >
                {SquadTipoEnum.options.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contato Pro */}
        <div className="space-y-4 md:col-span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contatos e Profissional</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <input 
                {...register('email')} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all"
                placeholder="email@empresa.com"
              />
              {errors.email?.message && <p className="text-xs text-red-500 font-medium">{String(errors.email.message)}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
              <input 
                {...register('telefone')} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Empresa</label>
              <input 
                {...register('empresa')} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Cargo</label>
              <input 
                {...register('cargo')} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-4 md:col-span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Perfil e Conteúdo</h4>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Tema da Palestra / Possibilidade</label>
            <input 
              {...register('tema')} 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea 
              {...register('bio')} 
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A32D2D]/20 focus:border-[#A32D2D] outline-none transition-all resize-none"
              placeholder="Fale brevemente sobre o palestrante..."
            />
            {errors.bio?.message && <p className="text-xs text-red-500 font-medium">{String(errors.bio.message)}</p>}
          </div>
        </div>

        {/* Canais de Contato e Status Individuais */}
        <div className="space-y-4 md:col-span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Canais e Status de Abordagem</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
            {/* Bloco LinkedIn */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0077B5]" /> LinkedIn (URL)
                </label>
                <input 
                  {...register('linkedin')} 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#0077B5]/20 focus:border-[#0077B5] outline-none transition-all"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Status no LinkedIn</label>
                <select 
                  {...register('status_linkedin')} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0077B5]/20 focus:border-[#0077B5] outline-none bg-white transition-all text-sm font-medium"
                >
                  {StatusPalestranteEnum.options.map(s => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bloco Instagram */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E4405F]" /> Instagram (@)
                </label>
                <input 
                  {...register('instagram')} 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#E4405F]/20 focus:border-[#E4405F] outline-none transition-all"
                  placeholder="@usuario"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Status no Instagram</label>
                <select 
                  {...register('status_instagram')} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E4405F]/20 focus:border-[#E4405F] outline-none bg-white transition-all text-sm font-medium"
                >
                  {StatusPalestranteEnum.options.map(s => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Status Geral / Decisão Final */}
        <div className="md:col-span-2 p-6 rounded-3xl border border-[#A32D2D]/10 bg-[#A32D2D]/[0.02]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-[#A32D2D] uppercase tracking-wider">Status Geral do Palestrante</h4>
              <p className="text-xs text-gray-400 mt-1">Este status reflete a decisão final independente do canal de contato.</p>
            </div>
            <select 
              {...register('status')} 
              className="px-6 py-3 rounded-2xl border border-[#A32D2D]/20 focus:ring-4 focus:ring-[#A32D2D]/10 outline-none bg-white transition-all font-black text-[#A32D2D] uppercase tracking-tight text-sm min-w-[240px]"
            >
              {StatusPalestranteEnum.options.map(s => (
                <option key={s} value={s}>
                  {s.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 bg-[#A32D2D] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:bg-[#8B2626] active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            'Salvar Palestrante'
          )}
        </button>
      </div>
    </form>
  )
}
