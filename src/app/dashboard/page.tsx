'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Home, FileText, Clock, Package, Share2, Shield, ArrowRight,
  CheckCircle2, TrendingUp, Calendar, MapPin,
  Zap, Thermometer, Wind, Lock, ExternalLink,
  Sparkles, Building2, Eye
} from 'lucide-react'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, hasStarted])

  return { count, ref }
}

// Section label component - matches website style
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-2 h-2 bg-[#93b9e6]" />
      <span className="text-[#93b9e6] text-[10px] font-black uppercase tracking-[0.3em]">{children}</span>
    </div>
  )
}

const TIMELINE_PREVIEW = [
  { phase: 'FUNDERING', status: 'completed', date: 'Sep 2025' },
  { phase: 'RUWBOUW', status: 'completed', date: 'Nov 2025' },
  { phase: 'GEVEL & DAK', status: 'current', date: 'Jan 2026', progress: 60 },
  { phase: 'INSTALLATIES', status: 'upcoming', date: 'Mrt 2026' },
  { phase: 'AFBOUW', status: 'upcoming', date: 'Mei 2026' },
  { phase: 'OPLEVERING', status: 'upcoming', date: 'Jul 2026' },
]

const RECENT_DOCUMENTS = [
  { name: 'BENG Berekening definitief', type: 'PDF', date: '2 dagen geleden', verified: true },
  { name: 'Constructietekening fase 3', type: 'DWG', date: '4 dagen geleden', verified: true },
  { name: 'Materiaalspecificatie kozijnen', type: 'PDF', date: '1 week geleden', verified: false },
]

export default function DashboardPage() {
  const { count: docCount, ref: docRef } = useCounter(24, 1500)
  const { count: materialCount, ref: materialRef } = useCounter(156, 2000)
  const { count: verifyCount, ref: verifyRef } = useCounter(18, 1800)

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Property Card */}
        <div className="relative overflow-hidden bg-slate-900">
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
          
          <div className="relative p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 overflow-hidden flex-shrink-0">
                  <Image 
                    src="/images/projects/zonneweide.jpg"
                    alt="Villa Zonneweide"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider">
                      Nieuwbouw
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
                    VILLA ZONNEWEIDE
                  </h1>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Kavel 12, Woonwijk De Buitenplaats, Almere</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10">
                      <Building2 className="w-4 h-4 text-white/50" />
                      <span className="text-white/80 text-sm font-bold">210 m²</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10">
                      <Calendar className="w-4 h-4 text-white/50" />
                      <span className="text-white/80 text-sm font-bold">2025-2026</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start lg:items-end gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-[#93b9e6]">
                  <Lock className="w-4 h-4 text-slate-900" />
                  <span className="text-slate-900 font-black text-xs uppercase tracking-wider">Blockchain Verified</span>
                  <Sparkles className="w-4 h-4 text-slate-900" />
                </div>
                <Link 
                  href="/share/demo"
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group text-sm font-bold uppercase tracking-wider"
                >
                  <span>Publiek profiel</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Bouwvoortgang</span>
                <span className="text-white font-black text-2xl">75%</span>
              </div>
              <div className="h-2 bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-[#93b9e6] transition-all duration-1000"
                  style={{ width: '75%' }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[#93b9e6] text-sm font-bold">Gevel & Dak (60%)</span>
                <span className="text-white/40 text-sm">Verwacht: Juli 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200">
          {[
            { label: 'DOCUMENTEN', value: docCount, ref: docRef, icon: FileText, href: '/dashboard/documents' as const },
            { label: 'MATERIALEN', value: materialCount, ref: materialRef, icon: Package, href: '/dashboard/materials' as const },
            { label: 'VERIFICATIES', value: verifyCount, ref: verifyRef, icon: Shield, href: '/dashboard/documents' as const },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group bg-white p-8 hover:bg-slate-50 transition-all duration-300"
            >
              <div ref={stat.ref as React.RefObject<HTMLDivElement>}>
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-[#93b9e6]" />
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#93b9e6] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-200">
          {/* Timeline Preview */}
          <div className="lg:col-span-2 bg-white">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-[#93b9e6]" />
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Bouwtijdlijn</h2>
                  <p className="text-xs text-slate-400">Volg de voortgang van uw project</p>
                </div>
              </div>
              <Link 
                href="/dashboard/timeline"
                className="flex items-center gap-2 text-xs font-black text-[#93b9e6] hover:text-slate-900 uppercase tracking-wider group"
              >
                Bekijk alles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="p-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
                
                <div className="space-y-4">
                  {TIMELINE_PREVIEW.map((item) => (
                    <div 
                      key={item.phase}
                      className={`relative flex items-center gap-4 transition-all duration-300 ${
                        item.status === 'upcoming' ? 'opacity-40' : ''
                      }`}
                    >
                      {/* Status indicator */}
                      <div className={`relative z-10 w-8 h-8 flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-slate-900' :
                        item.status === 'current' ? 'bg-[#93b9e6]' :
                        'bg-slate-200'
                      }`}>
                        {item.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : item.status === 'current' ? (
                          <div className="w-2 h-2 bg-slate-900" />
                        ) : (
                          <div className="w-2 h-2 bg-slate-400" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 flex items-center justify-between py-2">
                        <div>
                          <p className={`font-black text-sm tracking-wider ${
                            item.status === 'current' ? 'text-[#93b9e6]' : 'text-slate-900'
                          }`}>{item.phase}</p>
                          <p className="text-xs text-slate-400">{item.date}</p>
                        </div>
                        
                        {item.status === 'current' && item.progress && (
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1 bg-slate-100 overflow-hidden">
                              <div 
                                className="h-full bg-[#93b9e6] transition-all duration-1000"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-[#93b9e6]">{item.progress}%</span>
                          </div>
                        )}
                        
                        {item.status === 'completed' && (
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Voltooid</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Energy Performance */}
          <div className="bg-white">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <Zap className="w-6 h-6 text-[#93b9e6]" />
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Energieprestatie</h2>
                  <p className="text-xs text-slate-400">BENG-compliant woning</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Energy Label */}
              <div className="text-center p-6 bg-[#93b9e6]">
                <div className="text-4xl font-black text-slate-900 mb-2">A++++</div>
                <p className="text-[10px] font-black text-slate-900/50 uppercase tracking-[0.2em]">Bijna Energieneutraal</p>
                <p className="text-xs text-slate-900/40 mt-1">Top 5% in Nederland</p>
              </div>
              
              {/* Stats */}
              <div className="space-y-px bg-slate-100">
                <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-[#93b9e6]" />
                    <span className="text-slate-500 text-sm">Isolatiewaarde</span>
                  </div>
                  <span className="font-black text-slate-900">Rc 8.0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#93b9e6]" />
                    <span className="text-slate-500 text-sm">Zonnepanelen</span>
                  </div>
                  <span className="font-black text-slate-900">9.6 kWp</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-[#93b9e6]" />
                    <span className="text-slate-500 text-sm">Ventilatie</span>
                  </div>
                  <span className="font-black text-slate-900">WTW C+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#93b9e6]" />
              <div>
                <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Recente documenten</h2>
                <p className="text-xs text-slate-400">Laatst toegevoegd aan uw paspoort</p>
              </div>
            </div>
            <Link 
              href="/dashboard/documents"
              className="flex items-center gap-2 text-xs font-black text-[#93b9e6] hover:text-slate-900 uppercase tracking-wider group"
            >
              Alle documenten
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="divide-y divide-slate-100">
            {RECENT_DOCUMENTS.map((doc) => (
              <div 
                key={doc.name}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 bg-slate-100 flex items-center justify-center group-hover:bg-[#93b9e6]/20 transition-colors">
                  <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#93b9e6] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 truncate text-sm">{doc.name}</p>
                    {doc.verified && (
                      <Lock className="w-4 h-4 text-[#93b9e6] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{doc.type} • {doc.date}</p>
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all">
                  <Eye className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
          {[
            { label: 'DOCUMENT UPLOADEN', icon: FileText, href: '/dashboard/documents' as const },
            { label: 'DEEL PASPOORT', icon: Share2, href: '/dashboard/share' as const },
            { label: 'MATERIALEN', icon: Package, href: '/dashboard/materials' as const },
            { label: 'TIJDLIJN', icon: Clock, href: '/dashboard/timeline' as const },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center p-8 bg-white hover:bg-slate-50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-[#93b9e6] transition-colors">
                <action.icon className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-[0.15em] text-center transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
