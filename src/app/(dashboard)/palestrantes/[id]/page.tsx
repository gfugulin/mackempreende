
import { getPalestranteById } from '@/app/actions/palestrantes'
import PageHeader from '@/components/layout/PageHeader'
import { createClient } from '@/lib/supabase/server'
import { computeDisplayStatus } from '@/lib/utils/status'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import { 
  Link2, 
  AtSign, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  ChevronLeft, 
  ExternalLink,
  MessageSquare,
  History,
  Award,
  Users,
  Edit2
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PalestranteDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentSquad = user?.email ? getSquadFromEmail(user.email) : null

  const palestrante = await getPalestranteById(id)

  if (!palestrante) {
    notFound()
  }

  const displayStatus = computeDisplayStatus(palestrante.status, palestrante.eventos as any)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <PageHeader title="Perfil do Palestrante" squadName={currentSquad} />
      
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link 
          href="/palestrantes"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#A32D2D] mb-8 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para Diretório
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Lateral: Perfil e Contato */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#A32D2D]" />
               
               <div className="h-24 w-24 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-[#A32D2D]">
                  <Users className="h-10 w-10" />
               </div>

               <h2 className="text-2xl font-black text-gray-900 leading-tight">
                 {palestrante.nome}
               </h2>
               <p className="text-gray-500 font-medium mt-1">
                 {palestrante.cargo} @ {palestrante.empresa}
               </p>

               <div className="mt-6 flex flex-wrap justify-center gap-2">
                 <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${displayStatus.color}`}>
                   {displayStatus.key === 'ja_participou' && <Award className="inline-block h-3 w-3 mr-1" />}
                   {displayStatus.label}
                 </span>
                 <span className="px-3 py-1 rounded-full bg-red-50 text-[#A32D2D] text-[10px] font-black uppercase tracking-wider">
                   Squad {palestrante.squad_resp}
                 </span>
               </div>
               
               {displayStatus.participacoes && displayStatus.participacoes.length > 0 && (
                 <div className="mt-3 flex flex-wrap justify-center gap-2">
                   {displayStatus.participacoes.map((part, idx) => (
                     <span key={idx} className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${part.color}`}>
                       {part.icon} {part.count} {part.label}
                     </span>
                   ))}
                 </div>
               )}

               <div className="mt-8">
                 <Link 
                   href={`/palestrantes/${palestrante.id}/editar`}
                   className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#A32D2D] text-white text-xs font-black uppercase tracking-widest hover:bg-[#8B2626] transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
                 >
                   <Edit2 className="h-4 w-4" />
                   Editar Perfil
                 </Link>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                 {palestrante.linkedin && (
                   <a 
                     href={palestrante.linkedin} 
                     target="_blank" 
                     className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition-all border border-transparent hover:border-blue-100"
                   >
                     <div className="flex items-center gap-3">
                       <Link2 className="h-5 w-5" />
                       <span className="text-sm font-bold">LinkedIn</span>
                     </div>
                     <ExternalLink className="h-4 w-4 opacity-50" />
                   </a>
                 )}

                 {palestrante.instagram && (
                   <a 
                     href={`https://instagram.com/${palestrante.instagram.replace('@', '')}`}
                     target="_blank" 
                     className="flex items-center justify-between p-4 rounded-2xl bg-pink-50/50 hover:bg-pink-50 text-pink-700 transition-all border border-transparent hover:border-pink-100"
                   >
                     <div className="flex items-center gap-3">
                       <AtSign className="h-5 w-5" />
                       <span className="text-sm font-bold">Instagram</span>
                     </div>
                     <ExternalLink className="h-4 w-4 opacity-50" />
                   </a>
                 )}
               </div>
            </div>

            {/* Dados de Contato Direto */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Informações de Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#A32D2D]/5 group-hover:text-[#A32D2D] transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider leading-none">E-mail</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{palestrante.email || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#A32D2D]/5 group-hover:text-[#A32D2D] transition-all">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider leading-none">Telefone</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{palestrante.telefone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Coluna Principal: Bio e Histórico */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bio e Especialidade */}
            <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-50 text-[#A32D2D] rounded-xl">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Especialidade e Bio</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 py-1.5 px-3 rounded-full inline-block">Tema Principal</h4>
                  <p className="text-lg font-bold text-gray-800 mt-3 pl-1">
                    {palestrante.tema || 'Temas diversos de empreendedorismo'}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 py-1.5 px-3 rounded-full inline-block">Biografia</h4>
                  <p className="text-gray-600 mt-4 leading-relaxed text-base pl-1">
                    {palestrante.bio || 'Nenhuma biografia cadastrada no momento.'}
                  </p>
                </div>

                {palestrante.observacoes && (
                  <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-800 font-black text-[10px] uppercase tracking-widest mb-2">
                      <MessageSquare className="h-3.5 w-3.5" /> Notas Internas
                    </div>
                    <p className="text-amber-900/80 text-sm leading-relaxed">
                      {palestrante.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Histórico na Liga (O "Pulo do Gato" da Integração) */}
            <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 text-[#A32D2D] rounded-xl">
                    <History className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Histórico na Liga</h3>
                </div>
                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {palestrante.eventos?.length || 0} Atividades
                </span>
              </div>

              <div className="space-y-4">
                {palestrante.eventos && palestrante.eventos.length > 0 ? (
                  palestrante.eventos.map((evento: any) => (
                    <div key={evento.id} className="group relative flex items-start gap-5 p-6 rounded-3xl border border-gray-50 bg-gray-50/20 hover:bg-white hover:shadow-md hover:border-red-100 transition-all">
                      <div className="flex flex-col items-center pt-1">
                        <div className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[#A32D2D] shadow-sm">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="w-px h-full bg-gray-100 absolute -bottom-4 left-[43px] group-last:hidden" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-[#A32D2D] uppercase tracking-widest">
                            {format(new Date(evento.data_inicio), "d 'de' MMMM, yyyy", { locale: ptBR })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {evento.tipo}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-gray-900 group-hover:text-[#A32D2D] transition-colors">
                          {evento.titulo}
                        </h4>
                        <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase">
                          Squad Responsável: <span className="text-gray-600">{evento.squad}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                         <ChevronLeft className="h-5 w-5 text-gray-300 rotate-180" />
                      </div>

                      <Link href={`/agenda/${evento.id}`} className="absolute inset-0" title="Ver Evento" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-sm font-bold text-gray-400">Nenhum evento passado registrado para este perfil.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
