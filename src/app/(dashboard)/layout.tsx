import { createClient } from '@/lib/supabase/server'
import { getSquadFromEmail } from '@/lib/auth/get-squad'
import Navbar from '@/components/layout/Navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Como o proxy já validou, user com certeza existe aqui
  const squad = user?.email ? getSquadFromEmail(user.email) : null

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <Navbar />
      
      {/* 
        A margem inferior (pb-20) acomoda a navbar mobile fixa no bottom.
        A margem esquerda (md:ml-64) acomoda a sidebar fixa no desktop.
      */}
      <main className="flex-1 pb-32 md:ml-64 md:pb-0">
        {children}
      </main>
    </div>
  )
}
