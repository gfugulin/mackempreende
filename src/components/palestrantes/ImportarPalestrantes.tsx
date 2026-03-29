'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Check, Loader2, X, AlertCircle } from 'lucide-react'
import { importPalestrantesBulk } from '@/app/actions/palestrantes'

interface ImportarPalestrantesProps {
  currentSquad: string
}

export default function ImportarPalestrantes({ currentSquad }: ImportarPalestrantesProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setError(null)
    setResults(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      // Assumindo CSV Simples: nome,empresa,cargo,linkedin
      const headers = lines[0].toLowerCase().split(',')
      const data = lines.slice(1).map(line => {
        const values = line.split(',')
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header.trim()] = values[i]?.trim()
        })
        return obj
      })

      const response = await importPalestrantesBulk(data, currentSquad)
      
      if (response.success) {
        setResults(response.results)
      } else {
        setError('Erro ao processar o arquivo. Verifique o formato CSV.')
      }
    } catch (err) {
      console.error(err)
      setError('Erro crítico ao ler o arquivo.')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-all"
      >
        <FileText className="h-4 w-4" />
        Importar CSV
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-none">Importar Dados</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 px-1 border-l-2 border-[#A32D2D]">Planilha Lote</p>
              </div>
              <button 
                onClick={() => { setShowModal(false); setResults(null); setError(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {!results && !error ? (
                <div className="space-y-4">
                  <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100/50">
                    <h4 className="text-xs font-black text-[#A32D2D] uppercase tracking-widest mb-3">Instruções Técnicas</h4>
                    <ul className="text-[11px] text-gray-600 space-y-2 font-medium">
                      <li className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#A32D2D] mt-1 shrink-0" />
                        O arquivo deve ser formatado em <strong>CSV</strong> (separado por vírgula).
                      </li>
                      <li className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#A32D2D] mt-1 shrink-0" />
                        Primeira linha (Cabeçalho): <strong>nome,empresa,cargo,linkedin</strong>.
                      </li>
                      <li className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#A32D2D] mt-1 shrink-0" />
                        O sistema atualizará palestrantes já existentes pelo nome.
                      </li>
                    </ul>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="w-full flex items-center justify-center gap-3 bg-[#A32D2D] text-white py-5 rounded-[24px] font-black text-sm tracking-widest uppercase shadow-xl shadow-[#A32D2D]/20 hover:bg-[#8B2626] transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        PROCESSANDO...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        SELECIONAR ARQUIVO
                      </>
                    )}
                  </button>
                </div>
              ) : results ? (
                <div className="space-y-6 animate-in zoom-in fade-in duration-500">
                  <div className="h-20 w-20 bg-green-50 rounded-[28px] flex items-center justify-center mx-auto text-green-500 shadow-sm">
                    <Check className="h-10 w-10" />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-lg font-black text-gray-900 leading-none">Importação Concluída</h4>
                    <p className="text-xs text-gray-400 mt-2">Os dados foram integrados com sucesso.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-4">
                    <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Importados</p>
                      <p className="text-2xl font-black text-gray-900">{results.imported}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pulados/Erro</p>
                      <p className="text-2xl font-black text-gray-900">{results.skipped + results.errors}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowModal(false); setResults(null); }}
                    className="w-full py-4 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                  >
                    FECHAR PAINEL
                  </button>
                </div>
              ) : error ? (
                <div className="space-y-6 text-center py-4">
                  <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-bold text-red-600 px-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest underline"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
