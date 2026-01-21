'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useProperty } from './layout'
import { 
  Home, FileText, Clock, Package, Share2, Shield, ArrowRight,
  CheckCircle2, TrendingUp, Calendar, MapPin,
  Zap, Thermometer, Wind, Lock, ExternalLink,
  Sparkles, Building2, Eye, Brain, Bell, HardHat, AlertTriangle
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

// Timeline data for completed home
const COMPLETED_TIMELINE = [
  { phase: 'FUNDERING', status: 'completed', date: 'Sep 2024' },
  { phase: 'RUWBOUW', status: 'completed', date: 'Nov 2024' },
  { phase: 'GEVEL & DAK', status: 'completed', date: 'Jan 2025' },
  { phase: 'INSTALLATIES', status: 'completed', date: 'Mrt 2025' },
  { phase: 'AFBOUW', status: 'completed', date: 'Mei 2025' },
  { phase: 'OPLEVERING', status: 'completed', date: 'Jul 2025' },
]

// Timeline data for building home
const BUILDING_TIMELINE = [
  { phase: 'FUNDERING', status: 'completed', date: 'Jul 2025' },
  { phase: 'RUWBOUW', status: 'completed', date: 'Sep 2025' },
  { phase: 'GEVEL & DAK', status: 'current', date: 'Jan 2026', progress: 65 },
  { phase: 'INSTALLATIES', status: 'upcoming', date: 'Mrt 2026' },
  { phase: 'AFBOUW', status: 'upcoming', date: 'Mei 2026' },
  { phase: 'OPLEVERING', status: 'upcoming', date: 'Aug 2026' },
]

const RECENT_DOCUMENTS = [
  { name: 'BENG Berekening definitief', type: 'PDF', date: '2 dagen geleden', verified: true },
  { name: 'Constructietekening fase 3', type: 'DWG', date: '4 dagen geleden', verified: true },
  { name: 'Materiaalspecificatie kozijnen', type: 'PDF', date: '1 week geleden', verified: false },
]

export default function DashboardPage() {
  const property = useProperty()
  const isCompleted = property?.isCompleted ?? false
  
  const { count: docCount, ref: docRef } = useCounter(isCompleted ? 156 : 24, 1500)
  const { count: materialCount, ref: materialRef } = useCounter(isCompleted ? 847 : 89, 2000)
  const { count: verifyCount, ref: verifyRef } = useCounter(isCompleted ? 156 : 18, 1800)

  const timeline = isCompleted ? COMPLETED_TIMELINE : BUILDING_TIMELINE

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Property Card */}
        <div data-tour="dashboard-hero" className="relative overflow-hidden bg-slate-900">
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
          
          <div className="relative p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <Image 
                      src="/images/projects/zonneweide.jpg"
                      alt={property?.name || 'Property'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <HardHat className="w-12 h-12 text-[#93b9e6]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {isCompleted ? (
                      <>
                        <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                          Opgeleverd
                        </span>
                        <span className="px-3 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          AI Actief
                        </span>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <HardHat className="w-3 h-3" />
                        In Aanbouw
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3 uppercase">
                    {property?.name || 'Laden...'}
                  </h1>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{property?.city}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10">
                      <Building2 className="w-4 h-4 text-white/50" />
                      <span className="text-white/80 text-sm font-bold">{isCompleted ? '210' : '175'} m²</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10">
                      <Calendar className="w-4 h-4 text-white/50" />
                      <span className="text-white/80 text-sm font-bold">
                        {isCompleted ? 'Opgeleverd Jul 2025' : 'Verwacht Aug 2026'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start lg:items-end gap-4">
                {isCompleted && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#93b9e6]">
                    <Lock className="w-4 h-4 text-slate-900" />
                    <span className="text-slate-900 font-black text-xs uppercase tracking-wider">Blockchain Verified</span>
                    <Sparkles className="w-4 h-4 text-slate-900" />
                  </div>
                )}
                <Link 
                  href="/share/demo"
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group text-sm font-bold uppercase tracking-wider"
                >
                  <span>Publiek profiel</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bottom section - different for completed vs building */}
            <div className="mt-8 pt-6 border-t border-white/10">
              {isCompleted ? (
                // AI Savings Summary for completed homes
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/dashboard/ai" className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">AI Besparing dit jaar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-emerald-400">€2.840</span>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Actie vereist</span>
                    </div>
                    <span className="text-3xl font-black text-white">1</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-[#93b9e6]" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Woningwaarde</span>
                    </div>
                    <span className="text-3xl font-black text-white">€685.000</span>
                  </div>
                </div>
              ) : (
                // Progress bar for building homes
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Bouwvoortgang</span>
                    <span className="text-white font-black text-2xl">{property?.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-[#93b9e6] transition-all duration-1000"
                      style={{ width: `${property?.progress || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#93b9e6] text-sm font-bold">{property?.currentPhase}</span>
                    <span className="text-white/40 text-sm">Verwacht: Augustus 2026</span>
                  </div>
                </div>
              )}
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
                  <p className="text-xs text-slate-400">
                    {isCompleted ? 'Volledige bouwhistorie' : 'Volg de voortgang van uw project'}
                  </p>
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
                  {timeline.map((item) => (
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
                        
                        {item.status === 'current' && 'progress' in item && (
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1 bg-slate-100 overflow-hidden">
                              <div 
                                className="h-full bg-[#93b9e6] transition-all duration-1000"
                                style={{ width: `${(item as { progress: number }).progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-[#93b9e6]">{(item as { progress: number }).progress}%</span>
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

          {/* Right side - Energy or AI Coming Soon */}
          <div className="bg-white">
            {isCompleted ? (
              // Energy Performance for completed homes
              <>
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
              </>
            ) : (
              // AI Coming Soon for building homes
              <>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <Brain className="w-6 h-6 text-slate-300" />
                    <div>
                      <h2 className="font-black text-slate-400 uppercase tracking-wider text-sm">AI Intelligence</h2>
                      <p className="text-xs text-slate-300">Beschikbaar na oplevering</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-center py-12 px-6">
                    <div className="w-20 h-20 bg-slate-100 mx-auto mb-6 flex items-center justify-center">
                      <Lock className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="font-black text-slate-400 uppercase tracking-wider text-sm mb-3">
                      AI na oplevering
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                      Na oplevering van uw woning activeert het AI-systeem automatisch. 
                      U ontvangt dan voorspellend onderhoud, energietips en slimme meldingen.
                    </p>
                    <div className="space-y-2 text-left">
                      {[
                        'Voorspellend onderhoud',
                        'Energie optimalisatie',
                        'Slimme meldingen',
                        '€5.640 besparing/jaar',
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm text-slate-400">
                          <div className="w-4 h-4 bg-slate-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-slate-300" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
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
