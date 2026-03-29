'use client'
import { Database } from '@/types/database'
import { FileText, Image as ImageIcon, FileCode, FileArchive, Download, Trash2, MoreVertical, File, ExternalLink } from 'lucide-react'
import { deleteArquivo } from '@/app/actions/arquivos'

type Arquivo = Database['public']['Tables']['arquivos']['Row'] & {
  eventos?: { titulo: string } | null
}

interface FileCardProps {
  arquivo: Arquivo
}

const getFileIcon = (mime: string | null) => {
  if (!mime) return <File className="h-6 w-6" />
  if (mime.includes('image')) return <ImageIcon className="h-6 w-6" />
  if (mime.includes('pdf')) return <FileText className="h-6 w-6" />
  if (mime.includes('zip') || mime.includes('rar')) return <FileArchive className="h-6 w-6" />
  return <FileCode className="h-6 w-6" />
}

export default function FileCard({ arquivo }: FileCardProps) {
  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      await deleteArquivo(arquivo.id, arquivo.nome_arquivo)
    }
  }

  const fileSize = arquivo.tamanho_bytes 
    ? (arquivo.tamanho_bytes / (1024 * 1024)).toFixed(2) + ' MB'
    : 'Desconhecido'

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:border-[#A32D2D]/20">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-[#A32D2D]/5 group-hover:text-[#A32D2D] transition-colors`}>
          {getFileIcon(arquivo.tipo_mime)}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a 
            href={arquivo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 truncate" title={arquivo.nome}>
        {arquivo.nome}
      </h3>
      
      <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <span>{fileSize}</span>
        <span className="w-1 h-1 rounded-full bg-gray-200" />
        <span className="truncate max-w-[100px]">{arquivo.tipo_mime?.split('/')[1] || 'Arquivo'}</span>
      </div>

      {arquivo.eventos && (
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-400 line-clamp-1">
          <ExternalLink className="h-3 w-3" />
          Vínculo: <span className="font-bold text-gray-600">{arquivo.eventos.titulo}</span>
        </div>
      )}

      {arquivo.descricao && (
        <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed italic">
          "{arquivo.descricao}"
        </p>
      )}
    </div>
  )
}
