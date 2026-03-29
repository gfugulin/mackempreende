'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventoSchema, type EventoInput, TipoEventoEnum } from '@/lib/validations/eventos'
import { createEvento, updateEvento } from '@/app/actions/eventos'
import { uploadArquivoAction } from '@/app/actions/arquivos'
import { useState, useRef, useEffect } from 'react'
import { Loader2, Calendar, MapPin, Video, Users, CheckCircle2, Plus, Trash2, Building2, UserPlus, ShieldPlus, Upload, ExternalLink } from 'lucide-react'
import { Database } from '@/types/database'
import Link from 'next/link'
import { getSpeakerEventCount } from '@/app/actions/palestrantes'

type Evento = Database['public']['Tables']['eventos']['Row']

interface EventoFormProps {
  initialData?: Evento
  currentSquad: string
  palestrantes: any[]
  onSuccess?: () => void
}

export default function EventoForm({ initialData, currentSquad, palestrantes, onSuccess }: EventoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadingLogos, setUploadingLogos] = useState<Record<number, boolean>>({})
  const [speakerHistory, setSpeakerHistory] = useState<number>(0)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<any>({ 
    resolver: zodResolver(eventoSchema),
    defaultValues: initialData ? {
      ...initialData,
      data_inicio: new Date(initialData.data_inicio).toISOString().slice(0, 16),
      data_fim: initialData.data_fim ? new Date(initialData.data_fim).toISOString().slice(0, 16) : null,
      metadata: initialData.metadata || { palestrantes_extras: [], palestrantes_backup: [], parceiros: [] }
    } : {
      tipo: 'palestra',
      squad: currentSquad as any,
      confirmado: false,
      metadata: { palestrantes_extras: [], palestrantes_backup: [], parceiros: [] }
    }
  })

  // Field Arrays for dynamic fields
  const { fields: extraSpeakers, append: appendSpeaker, remove: removeSpeaker } = useFieldArray({
    control,
    name: "metadata.palestrantes_extras" as any
  })

  const { fields: backupSpeakers, append: appendBackup, remove: removeBackup } = useFieldArray({
    control,
    name: "metadata.palestrantes_backup" as any
  })

  const { fields: partners, append: appendPartner, remove: removePartner } = useFieldArray({
    control,
    name: "metadata.parceiros" as any
  })

  const handleLogoUpload = async (index: number, file: File) => {
    setUploadingLogos(prev => ({ ...prev, [index]: true }))
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Reutilizamos a lógica de upload para a pasta logos
      const result = await uploadArquivoAction(file, 'logos')
      if (typeof result === 'string') {
        setValue(`metadata.parceiros.${index}.logo_url`, result)
      } else {
        alert('Erro ao subir logotipo')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingLogos(prev => ({ ...prev, [index]: false }))
    }
  }
  const selectedSpeakerId = watch('palestrante_id')

  useEffect(() => {
    async function checkHistory() {
      if (!selectedSpeakerId) {
        setSpeakerHistory(0)
        return
      }
      setIsLoadingHistory(true)
      const count = await getSpeakerEventCount(selectedSpeakerId)
      setSpeakerHistory(count)
      setIsLoadingHistory(false)
    }
    checkHistory()
  }, [selectedSpeakerId])

  const onSubmit = async (data: EventoInput) => {
    setIsSubmitting(true)
    setMessage(null)

    // Os metadados já estão formatados pelo hook-form
    const response = initialData 
      ? await updateEvento(initialData.id, data)
      : await createEvento(data)

    setIsSubmitting(false)

    if (response.success) {
      const syncMsg = (response as any).syncedExtras 
        ? ` · ${(response as any).syncedExtras.length} palestrante(s) registrado(s) automaticamente no diretório: ${(response as any).syncedExtras.join(', ')}`
        : ''
      setMessage({ type: 'success', text: `Evento ${initialData ? 'atualizado' : 'agendado'} com sucesso!${syncMsg}` })
      if (!initialData) reset()
      if (onSuccess) setTimeout(onSuccess, 2500)
    } else {
      setMessage({ type: 'error', text: response.error || 'Erro ao processar atividade.' })
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Dados Básicos */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#A32D2D]/10 flex items-center justify-center text-[#A32D2D]">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">O que vamos realizar?</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center justify-between">
                  <span>Palestrante Principal</span>
                  {isLoadingHistory ? (
                    <Loader2 className="h-3 w-3 animate-spin text-[#A32D2D]" />
                  ) : speakerHistory > 0 ? (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] animate-pulse">
                      ⚠️ JÁ PARTICIPOU DE {speakerHistory} ATIVIDADES
                    </span>
                  ) : selectedSpeakerId ? (
                    <span className="text-green-500 text-[9px]">NOVO PERFIL</span>
                  ) : null}
                </label>
                <select 
                  {...register('palestrante_id')}
                  className="w-full px-6 py-4 rounded-3xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#A32D2D]/10 outline-none transition-all font-bold text-gray-700"
                >
                  <option value="">Selecione um palestrante cadastrado (Opcional)</option>
                  {palestrantes?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.empresa})</option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-400 uppercase tracking-tight pl-2">
                  Não encontrou? <Link href="/palestrantes/novo" target="_blank" className="text-[#A32D2D] font-black underline">CADASTRE O PERFIL PRIMEIRO</Link>
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Título do Evento *</label>
                <input 
                  {...register('titulo')} 
                  className="w-full px-6 py-4 rounded-3xl border border-gray-100 bg-gray-50/50 focus:ring-4 focus:ring-[#A32D2D]/10 focus:border-[#A32D2D] focus:bg-white outline-none transition-all text-xl font-black text-gray-900"
                  placeholder="Ex: Workshop de Design System"
                />
                {errors.titulo && <p className="text-xs text-red-500 font-medium pl-2">{String(errors.titulo.message)}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Descrição / Pauta</label>
                <textarea 
                  {...register('descricao')} 
                  rows={4}
                  className="w-full px-6 py-4 rounded-3xl border border-gray-100 bg-gray-50/50 focus:ring-4 focus:ring-[#A32D2D]/10 focus:border-[#A32D2D] focus:bg-white outline-none transition-all resize-none text-gray-700 leading-relaxed"
                  placeholder="Descreva os objetivos, tópicos e detalhes importantes..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tipo de Evento</label>
                <select 
                  {...register('tipo')} 
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#A32D2D]/10 outline-none transition-all font-bold"
                >
                  {TipoEventoEnum.options.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Local / Google Meet</label>
                <input 
                  {...register('local')} 
                  placeholder="Sala 204 ou Link Online"
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#A32D2D]/10 outline-none transition-all font-bold"
                />
              </div>
            </div>
          </section>

          {/* Seção de Palestrantes Extras e Backups */}
          <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Equipe e Convidados</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Extras */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Palestrantes Extras</label>
                  <button 
                    type="button" 
                    onClick={() => appendSpeaker("")}
                    className="p-1.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {extraSpeakers.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input 
                        {...register(`metadata.palestrantes_extras.${index}`)}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none"
                        placeholder="Nome do palestrante auxiliar"
                      />
                      <button onClick={() => removeSpeaker(index)} className="p-2 text-gray-300 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {extraSpeakers.length > 0 && (
                  <p className="text-[9px] text-blue-500 font-bold uppercase tracking-tight px-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Palestrantes extras serão registrados automaticamente no Diretório ao salvar
                  </p>
                )}
              </div>

              {/* Backups */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldPlus className="h-3 w-3" /> Reservas (Backup)
                  </label>
                  <button 
                    type="button" 
                    onClick={() => appendBackup("")}
                    className="p-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {backupSpeakers.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input 
                        {...register(`metadata.palestrantes_backup.${index}`)}
                        className="flex-1 px-4 py-2 rounded-xl border border-orange-50 bg-orange-50/30 text-sm font-bold outline-none"
                        placeholder="Nome do palestrante reserva"
                      />
                      <button onClick={() => removeBackup(index)} className="p-2 text-orange-200 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Empresas e Parceiros */}
          <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Empresas e Ativações</h3>
              </div>
              <button 
                type="button"
                onClick={() => appendPartner({ nome: '', contribuicao: '', logo_url: '', tipo: 'apoio' })}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="h-4 w-4" /> ADICIONAR MARCA
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.map((field, index) => (
                <div key={field.id} className="relative p-6 rounded-[32px] border border-gray-100 bg-gray-50/50 space-y-4 group">
                  <button onClick={() => removePartner(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nome da Empresa</label>
                      <input 
                        {...register(`metadata.parceiros.${index}.nome`)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-black outline-none"
                        placeholder="Ex: Itaú, Sebrae..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">O que irá contribuir?</label>
                      <textarea 
                        {...register(`metadata.parceiros.${index}.contribuicao`)}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-xs font-bold outline-none resize-none"
                        placeholder="Ex: Catering, Brindes, Palestrante..."
                      />
                    </div>

                    <div className="flex items-end gap-4">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Logotipo</label>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 bg-white hover:border-blue-400 transition-all text-[10px] font-black text-gray-400 uppercase">
                              {uploadingLogos[index] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                              Upload Logo
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleLogoUpload(index, e.target.files[0])
                                }}
                              />
                            </div>
                          </label>
                          {watch(`metadata.parceiros.${index}.logo_url`) && (
                            <a href={watch(`metadata.parceiros.${index}.logo_url`)} target="_blank" className="p-2.5 bg-white border border-gray-100 rounded-xl text-blue-600">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <select 
                        {...register(`metadata.parceiros.${index}.tipo`)}
                        className="px-3 py-2.5 rounded-xl border border-gray-100 bg-white text-[10px] font-black uppercase outline-none"
                      >
                        <option value="apoio">APOIO</option>
                        <option value="parceiro">PARCEIRO</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {partners.length === 0 && (
                <div className="md:col-span-2 py-10 text-center text-gray-300 font-bold border-2 border-dashed border-gray-50 rounded-3xl">
                  Nenhuma empresa parceira adicionada.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Coluna Direita: Datas e Ação */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 sticky top-8">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Data e Horário Início *
              </label>
              <input 
                type="datetime-local"
                {...register('data_inicio')} 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-900 text-white focus:ring-4 focus:ring-[#A32D2D]/20 outline-none transition-all font-black text-sm"
              />
              {errors.data_inicio && <p className="text-xs text-red-500 font-medium pl-2">{String(errors.data_inicio.message)}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Data e Horário Término
              </label>
              <input 
                type="datetime-local"
                {...register('data_fim')} 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#A32D2D]/10 outline-none transition-all font-black text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Users className="h-3 w-3" /> Limite de Vagas
              </label>
              <input 
                type="number"
                {...register('vagas', { valueAsNumber: true })} 
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#A32D2D]/10 outline-none transition-all font-bold"
              />
            </div>

            <hr className="border-gray-50" />

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white transition-all cursor-pointer group">
                <input 
                  type="checkbox"
                  {...register('confirmado')}
                  className="w-5 h-5 rounded border-gray-300 text-[#A32D2D] focus:ring-[#A32D2D] transition-all"
                />
                <div>
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight group-hover:text-[#A32D2D]">Atividade Confirmada?</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Eventos confirmados aparecem na Agenda</p>
                </div>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-[#A32D2D] text-white px-8 py-5 rounded-2xl font-black transition-all shadow-xl shadow-[#A32D2D]/20 hover:bg-[#8B2626] active:scale-[0.98] disabled:opacity-50 text-sm tracking-widest uppercase"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                {initialData ? 'SALVAR ALTERAÇÕES' : 'CONFIRMAR E AGENDAR'}
              </button>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
                <p className="text-xs font-bold tracking-tight">{message.text}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </form>
  )
}
