'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { registerArquivo } from '@/app/actions/arquivos'
import { UploadCloud, X, Loader2, CheckCircle2 } from 'lucide-react'

interface FileUploadZoneProps {
  currentSquad: string
  onSuccess?: () => void
}

export default function FileUploadZone({ currentSquad, onSuccess }: FileUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  
  const sanitizeFileName = (name: string) => {
    return name
      .normalize('NFD') // Decompõe caracteres (ex: ã -> a + ~)
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
      .replace(/[^a-zA-Z0-9.-]/g, '-') // Troca tudo que não for alfanumérico, ponto ou hífem por hífem
      .replace(/-+/g, '-') // Evita múltiplos hífens seguidos
      .toLowerCase()
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setStatus(null)

    try {
      // 1. Upload para o Storage
      const cleanName = sanitizeFileName(file.name)
      const fileName = `${Date.now()}-${cleanName}`
      const { data, error } = await supabase.storage
        .from('mackempreende-arquivos')
        .upload(fileName, file)

      if (error) throw error

      // 2. Criar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('mackempreende-arquivos')
        .getPublicUrl(fileName)

      // 3. Registrar no Database
      const response = await registerArquivo({
        nome: file.name.split('.')[0] || 'Arquivo',
        nome_arquivo: fileName,
        url: publicUrl,
        tamanho_bytes: file.size,
        tipo_mime: file.type,
        squad: currentSquad as any,
      })

      if (response.error) throw new Error(response.error)

      setStatus({ type: 'success', text: 'Arquivo enviado com sucesso!' })
      if (onSuccess) onSuccess()
    } catch (err: any) {
      console.error(err)
      setStatus({ type: 'error', text: err.message || 'Falha no upload.' })
    } finally {
      setIsUploading(false)
    }
  }

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="w-full">
      <div 
        className={`relative p-10 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
          dragActive ? 'border-[#A32D2D] bg-[#A32D2D]/5' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#A32D2D]/30'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />

        {isUploading ? (
          <div className="py-4">
            <Loader2 className="h-12 w-12 text-[#A32D2D] animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-900">Enviando seu arquivo...</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Não feche esta página</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-8 w-8 text-[#A32D2D]" />
            </div>
            <h4 className="text-lg font-black text-gray-900 leading-none">Clique ou Arraste</h4>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              Selecione manuais, pautas, fotos ou ativos do squad para arquivar.
            </p>
            <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Máx: 50MB</p>
          </>
        )}
      </div>

      {status && (
        <div className={`mt-4 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <p className="text-sm font-bold">{status.text}</p>
        </div>
      )}
    </div>
  )
}
