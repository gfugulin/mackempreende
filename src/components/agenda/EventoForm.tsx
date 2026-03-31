'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventoSchema, type EventoInput, TipoEventoEnum, type PalestranteVinculado } from '@/lib/validations/eventos'
import { createEvento, updateEvento, deleteEvento, createSessao, deleteSessao } from '@/app/actions/eventos'
import { uploadArquivoAction } from '@/app/actions/arquivos'
import { searchPalestrantesByName } from '@/app/actions/palestrantes'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Loader2, Calendar, MapPin, Users, CheckCircle2, Plus, Trash2, Building2, UserPlus, ShieldPlus, Upload, ExternalLink, Search, X, FileText, Store, AlertTriangle, ListOrdered, Clock } from 'lucide-react'
import { Database } from '@/types/database'
import { useRouter } from 'next/navigation'

type Evento = Database['public']['Tables']['eventos']['Row']

interface EventoFormProps {
  initialData?: Evento
  currentSquad: string
  palestrantes?: any[] // mantido para retrocompatibilidade na page
  onSuccess?: () => void
}

type SearchResult = {
  id: string
  nome: string
  empresa: string | null
  cargo: string | null
  eventCount: number
}

export default function EventoForm({ initialData, currentSquad, onSuccess }: EventoFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadingLogos, setUploadingLogos] = useState<Record<number, boolean>>({})

  // Cronograma (sessões) state
  const [sessoes, setSessoes] = useState<any[]>((initialData as any)?.sessoes || [])
  const [showSessaoForm, setShowSessaoForm] = useState(false)
  const [sessaoData, setSessaoData] = useState({ titulo: '', data_inicio: '', local: '', descricao: '' })
  const [isSavingSessao, setIsSavingSessao] = useState(false)
  const [isDeletingSessao, setIsDeletingSessao] = useState<string | null>(null)
  const isEditMode = !!initialData
  const isSessao = !!(initialData as any)?.evento_pai_id

  // Search state for speaker autocomplete
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Parse initial metadata for backwards compatibility
  const parseInitialMetadata = () => {
    if (!initialData?.metadata) return { palestrantes: [], parceiros: [], documentos_importantes: [], expositores: [] }
    const meta = initialData.metadata as any
    
    // Retrocompatibilidade: converte formato antigo para novo
    const palestrantes: PalestranteVinculado[] = meta.palestrantes || []
    
    // Se existirem extras/backups do formato antigo, converte
    if (meta.palestrantes_extras?.length) {
      for (const nome of meta.palestrantes_extras) {
        if (nome && typeof nome === 'string') {
          palestrantes.push({ nome, is_backup: false })
        }
      }
    }
    if (meta.palestrantes_backup?.length) {
      for (const nome of meta.palestrantes_backup) {
        if (nome && typeof nome === 'string') {
          palestrantes.push({ nome, is_backup: true })
        }
      }
    }

    return {
      palestrantes,
      parceiros: meta.parceiros || [],
      documentos_importantes: meta.documentos_importantes || [],
      expositores: meta.expositores || [],
    }
  }

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
      metadata: parseInitialMetadata()
    } : {
      tipo: 'palestra',
      squad: currentSquad as any,
      confirmado: false,
      metadata: { palestrantes: [], parceiros: [], documentos_importantes: [], expositores: [] }
    }
  })

  const tipoAtual = watch('tipo')
  const isFeira = tipoAtual === 'feira'

  // Field arrays
  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker } = useFieldArray({
    control, name: "metadata.palestrantes" as any
  })

  const { fields: partners, append: appendPartner, remove: removePartner } = useFieldArray({
    control, name: "metadata.parceiros" as any
  })

  const { fields: documents, append: appendDoc, remove: removeDoc } = useFieldArray({
    control, name: "metadata.documentos_importantes" as any
  })

  const { fields: expositores, append: appendExpositor, remove: removeExpositor } = useFieldArray({
    control, name: "metadata.expositores" as any
  })

  // Debounced speaker search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (value.trim().length < 2) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchPalestrantesByName(value)
      setSearchResults(results)
      setShowSearchDropdown(true)
      setIsSearching(false)
    }, 300)
  }, [])

  // Select existing speaker
  const handleSelectSpeaker = (speaker: SearchResult) => {
    appendSpeaker({
      id: speaker.id,
      nome: speaker.nome,
      empresa: speaker.empresa || '',
      is_backup: false,
    })
    setSearchQuery('')
    setSearchResults([])
    setShowSearchDropdown(false)
  }

  // Create new speaker inline
  const handleCreateNewSpeaker = () => {
    if (searchQuery.trim().length < 2) return
    appendSpeaker({
      id: null,
      nome: searchQuery.trim(),
      empresa: '',
      is_backup: false,
    })
    setSearchQuery('')
    setSearchResults([])
    setShowSearchDropdown(false)
  }

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogoUpload = async (index: number, file: File) => {
    setUploadingLogos(prev => ({ ...prev, [index]: true }))
    try {
      const result = await uploadArquivoAction(file, 'logos')
      if (typeof result === 'string') {
        setValue(`metadata.parceiros.${index}.logo_url`, result)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingLogos(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleDelete = async () => {
    if (!initialData) return
    setIsDeleting(true)
    const response = await deleteEvento(initialData.id)
    setIsDeleting(false)
    if (response.success) {
      router.push('/agenda')
    } else {
      setMessage({ type: 'error', text: response.error || 'Erro ao excluir evento.' })
    }
  }

  const onSubmit = async (data: EventoInput) => {
    setIsSubmitting(true)
    setMessage(null)

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

          {/* Seção de Palestrantes (escondida para feiras) */}
          {!isFeira && (
            <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Palestrantes</h3>
                </div>
              </div>

              {/* Search Autocomplete */}
              <div ref={searchRef} className="relative">
                <div className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 transition-all focus-within:ring-4 focus-within:ring-[#A32D2D]/10 focus-within:border-[#A32D2D]/30 focus-within:bg-white">
                  {isSearching ? <Loader2 className="h-4 w-4 text-gray-400 animate-spin" /> : <Search className="h-4 w-4 text-gray-400" />}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    className="flex-1 bg-transparent outline-none text-sm font-bold placeholder:text-gray-300"
                    placeholder="Buscar palestrante por nome..."
                  />
                </div>

                {/* Dropdown de Resultados */}
                {showSearchDropdown && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                    {searchResults.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectSpeaker(r)}
                        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-all text-left border-b border-gray-50 last:border-none"
                      >
                        <div>
                          <span className="font-black text-sm text-gray-900">{r.nome}</span>
                          {r.empresa && <span className="text-xs text-gray-400 ml-2">— {r.empresa}</span>}
                        </div>
                        {r.eventCount > 0 && (
                          <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[9px] font-black uppercase">
                            <AlertTriangle className="h-3 w-3" />
                            {r.eventCount} {r.eventCount === 1 ? 'evento' : 'eventos'}
                          </span>
                        )}
                      </button>
                    ))}

                    {/* Opção de criar novo */}
                    {searchQuery.trim().length >= 2 && (
                      <button
                        type="button"
                        onClick={handleCreateNewSpeaker}
                        className="w-full flex items-center gap-3 px-5 py-3 bg-green-50 hover:bg-green-100 transition-all text-left"
                      >
                        <Plus className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-black text-green-700">
                          Cadastrar &ldquo;{searchQuery.trim()}&rdquo; como novo palestrante
                        </span>
                      </button>
                    )}

                    {searchResults.length === 0 && searchQuery.trim().length >= 2 && !isSearching && (
                      <div className="px-5 py-3 text-xs text-gray-400 font-bold text-center">
                        Nenhum palestrante encontrado no diretório.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Lista de palestrantes adicionados */}
              {speakerFields.length > 0 && (
                <div className="space-y-2">
                  {speakerFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 group transition-all hover:border-[#A32D2D]/10">
                      <div className="flex-1 min-w-0">
                        <input
                          {...register(`metadata.palestrantes.${index}.nome`)}
                          className="font-black text-sm text-gray-900 bg-transparent outline-none w-full"
                          readOnly={!!(field as any).id}
                        />
                        {(field as any).id && (
                          <span className="text-[9px] text-green-500 font-black uppercase">✓ Do Diretório</span>
                        )}
                        {!(field as any).id && (
                          <span className="text-[9px] text-blue-500 font-black uppercase">🆕 Novo — será cadastrado ao salvar</span>
                        )}
                      </div>
                      <select
                        {...register(`metadata.palestrantes.${index}.is_backup`)}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-100 bg-white text-[10px] font-black uppercase outline-none"
                      >
                        <option value="false">Principal</option>
                        <option value="true">Reserva</option>
                      </select>
                      <button type="button" onClick={() => removeSpeaker(index)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {speakerFields.length > 0 && (
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-tight px-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Novos palestrantes serão registrados automaticamente no Diretório ao salvar
                </p>
              )}
            </section>
          )}

          {/* Seção de Expositores (apenas para feiras) */}
          {isFeira && (
            <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Store className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight break-words leading-tight">Expositores / Empresas</h3>
                </div>
                <button
                  type="button"
                  onClick={() => appendExpositor({ nome: '', stand: '', ativacao: '', contato: '' })}
                  className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-emerald-600 text-white rounded-2xl text-[11px] font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest"
                >
                  <Plus className="h-4 w-4" /> Empresa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expositores.map((field, index) => (
                  <div key={field.id} className="relative p-5 rounded-[28px] border border-emerald-100 bg-emerald-50/30 space-y-3">
                    <button type="button" onClick={() => removeExpositor(index)} className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Empresa</label>
                      <input
                        {...register(`metadata.expositores.${index}.nome`)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-black outline-none"
                        placeholder="Ex: Itaú, Sebrae..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Stand / Local</label>
                        <input
                          {...register(`metadata.expositores.${index}.stand`)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-100 bg-white text-xs font-bold outline-none"
                          placeholder="Ex: A12"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contato</label>
                        <input
                          {...register(`metadata.expositores.${index}.contato`)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-100 bg-white text-xs font-bold outline-none"
                          placeholder="email ou tel"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Tipo de Ativação</label>
                      <input
                        {...register(`metadata.expositores.${index}.ativacao`)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-100 bg-white text-xs font-bold outline-none"
                        placeholder="Ex: Workshop ao vivo, Degustação, Stand de vendas..."
                      />
                    </div>
                  </div>
                ))}
                {expositores.length === 0 && (
                  <div className="md:col-span-2 py-10 text-center text-gray-300 font-bold border-2 border-dashed border-emerald-100 rounded-3xl">
                    Nenhum expositor adicionado. Clique em &ldquo;+ EMPRESA&rdquo; acima.
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Seção de Empresas e Parceiros */}
          <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight break-words leading-tight">Empresas e Ativações</h3>
              </div>
              <button 
                type="button"
                onClick={() => appendPartner({ nome: '', contribuicao: '', logo_url: '', tipo: 'apoio' })}
                className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-blue-600 text-white rounded-2xl text-[11px] font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest"
              >
                <Plus className="h-4 w-4" /> Adicionar Marca
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

          {/* Seção de Documentos Importantes */}
          <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight break-words leading-tight">Documentos Importantes</h3>
              </div>
              <button
                type="button"
                onClick={() => appendDoc("")}
                className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-violet-600 text-white rounded-2xl text-[11px] font-black hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 uppercase tracking-widest"
              >
                <Plus className="h-4 w-4" /> Documento
              </button>
            </div>

            <div className="space-y-2">
              {documents.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`metadata.documentos_importantes.${index}`)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-100"
                    placeholder="Link ou nome do documento (ex: briefing, planilha de inscritos...)"
                  />
                  <button type="button" onClick={() => removeDoc(index)} className="p-2 text-gray-300 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="py-6 text-center text-gray-300 font-bold border-2 border-dashed border-gray-50 rounded-2xl text-sm">
                  Nenhum documento vinculado.
                </div>
              )}
            </div>
          </section>

          {/* Seção de Cronograma (Sessões) — apenas para edição de eventos-pai */}
          {isEditMode && !isSessao && (
            <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ListOrdered className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight break-words leading-tight">Cronograma</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">Sessões, palestras e atividades internas</p>
                  </div>
                </div>
                {!showSessaoForm && (
                  <button
                    type="button"
                    onClick={() => setShowSessaoForm(true)}
                    className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-indigo-600 text-white rounded-2xl text-[11px] font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
                  >
                    <Plus className="h-4 w-4" /> Adicionar Sessão
                  </button>
                )}
              </div>

              {/* Form inline para nova sessão */}
              {showSessaoForm && (
                <div className="p-5 rounded-[28px] border-2 border-dashed border-indigo-200 bg-indigo-50/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Título da Sessão *</label>
                      <input
                        value={sessaoData.titulo}
                        onChange={e => setSessaoData(s => ({ ...s, titulo: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white text-sm font-black outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="Ex: Influencers e Negócios"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Data e Horário *</label>
                      <input
                        type="datetime-local"
                        value={sessaoData.data_inicio}
                        onChange={e => setSessaoData(s => ({ ...s, data_inicio: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white text-sm font-black outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Local</label>
                      <input
                        value={sessaoData.local}
                        onChange={e => setSessaoData(s => ({ ...s, local: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-xs font-bold outline-none"
                        placeholder="Ex: Auditório Principal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Descrição</label>
                      <input
                        value={sessaoData.descricao}
                        onChange={e => setSessaoData(s => ({ ...s, descricao: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-xs font-bold outline-none"
                        placeholder="Breve descrição da sessão"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      disabled={isSavingSessao}
                      onClick={async () => {
                        if (!sessaoData.titulo || !sessaoData.data_inicio) return
                        setIsSavingSessao(true)
                        const res = await createSessao(initialData!.id, {
                          titulo: sessaoData.titulo,
                          data_inicio: sessaoData.data_inicio,
                          local: sessaoData.local || null,
                          descricao: sessaoData.descricao || null,
                          ordem: sessoes.length,
                          metadata: { palestrantes: [] },
                        } as any)
                        setIsSavingSessao(false)
                        if (res.success) {
                          setSessaoData({ titulo: '', data_inicio: '', local: '', descricao: '' })
                          setShowSessaoForm(false)
                          // Reload page to refresh sessoes
                          window.location.reload()
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 disabled:opacity-50 transition-all"
                    >
                      {isSavingSessao ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      Salvar Sessão
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSessaoForm(false)
                        setSessaoData({ titulo: '', data_inicio: '', local: '', descricao: '' })
                      }}
                      className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de sessões existentes */}
              {sessoes.length > 0 ? (
                <div className="space-y-2">
                  {sessoes.map((s: any, idx: number) => {
                    const sDate = new Date(s.data_inicio)
                    const sMeta = s.metadata || {}
                    const sSpeakers = sMeta.palestrantes || []
                    return (
                      <div key={s.id} className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 group hover:border-indigo-200 transition-all">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-black shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-gray-900 truncate">{s.titulo}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {sDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} {sDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {s.local && (
                              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {s.local}
                              </span>
                            )}
                            {sSpeakers.length > 0 && (
                              <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                                <Users className="h-3 w-3" /> {sSpeakers.map((p: any) => p.nome).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={isDeletingSessao === s.id}
                          onClick={async () => {
                            setIsDeletingSessao(s.id)
                            const res = await deleteSessao(s.id)
                            if (res.success) {
                              setSessoes(prev => prev.filter(x => x.id !== s.id))
                            }
                            setIsDeletingSessao(null)
                          }}
                          className="p-1.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {isDeletingSessao === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : !showSessaoForm ? (
                <div className="py-8 text-center text-gray-300 font-bold border-2 border-dashed border-indigo-100 rounded-3xl text-sm">
                  Nenhuma sessão no cronograma. Clique em "+ SESSÃO" para adicionar.
                </div>
              ) : null}
            </section>
          )}
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

              {/* Botão de Excluir (apenas edição) */}
              {initialData && (
                <>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-red-100 text-red-400 text-xs font-black uppercase hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-4 w-4" /> Excluir Evento
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                      <p className="text-xs font-black text-red-700 uppercase text-center">Tem certeza? Isso não pode ser desfeito.</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-gray-500 hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {message && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <p className="text-xs font-bold tracking-tight">{message.text}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </form>
  )
}
