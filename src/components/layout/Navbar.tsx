'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Users, FileText } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Palestrantes', href: '/palestrantes', icon: Users },
    { name: 'Arquivos', href: '/arquivos', icon: FileText },
  ]

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-80 md:w-64 max-w-md h-16 md:h-screen bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[32px] md:rounded-none md:border-t-0 md:border-r md:left-0 md:top-0 md:translate-x-0 md:bg-white shadow-2xl shadow-gray-900/10 md:shadow-none transition-all duration-500 flex flex-col font-sans">
      
      {/* MackEmpreende Logo (Desktop Only) */}
      <div className="hidden md:flex flex-col items-start px-8 pt-12 pb-8">
        <div className="relative w-full h-12 group transition-transform duration-500 hover:scale-105 active:scale-95">
          <Image 
            src="/images/Logo.jpg" 
            alt="MackEmpreende" 
            fill
            sizes="(max-width: 768px) 100vw, 256px"
            className="object-contain object-left drop-shadow-sm" 
            priority
          />
        </div>
      </div>

      <div className="flex h-full md:h-auto flex-1 items-center justify-around px-2 md:flex-col md:justify-start md:space-y-2 md:px-4 md:mt-4 w-full relative">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-1 md:flex-none flex-col items-center justify-center space-y-1 rounded-[20px] md:rounded-2xl px-3 py-2 md:py-3.5 md:px-4 transition-all duration-300 transform active:scale-95 md:w-full md:flex-row md:justify-start md:space-x-4 md:space-y-0 ${
                isActive
                  ? 'text-[#A32D2D] bg-[#A32D2D] md:bg-red-50/60 shadow-md shadow-[#A32D2D]/20 md:shadow-none'
                  : 'text-gray-400 hover:bg-gray-50/80 hover:text-gray-900'
              }`}
            >
              {/* Desktop Active Line Indicator */}
              {isActive && (
                <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#A32D2D] rounded-r-md shadow-[0_0_10px_rgba(163,45,45,0.4)]" />
              )}

              <Icon 
                className={`h-5 w-5 md:h-[22px] md:w-[22px] transition-colors ${
                  isActive 
                    ? 'text-white md:text-[#A32D2D] md:animate-bounce-slow' 
                    : 'text-gray-400 group-hover:text-gray-600'
                }`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span 
                className={`text-[10px] font-black uppercase tracking-widest md:text-xs md:tracking-wider transition-colors ${
                  isActive 
                    ? 'text-white md:text-[#A32D2D]' 
                    : 'text-gray-400 group-hover:text-gray-700'
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

