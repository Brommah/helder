'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Clock, CheckCircle2, Circle, AlertCircle, Camera, FileText,
  ChevronDown, ChevronRight, Calendar, Users, MapPin, Hammer,
  Layers, Home, Zap, Paintbrush, Key, Shield, Play, Pause,
  Eye, Download, ExternalLink, Plus
} from 'lucide-react'

interface TimelinePhase {
  id: string
  name: string
  icon: React.ElementType
  status: 'completed' | 'current' | 'upcoming'
  startDate: string
  endDate: string
  progress: number
  description: string
  milestones: Milestone[]
  photos: number
  documents: number
}

interface Milestone {
  id: string
  name: string
  date: string
  status: 'completed' | 'current' | 'upcoming'
  description?: string
  inspector?: string
  verified?: boolean
}

const PHASES: TimelinePhase[] = [
  {
    id: 'foundation',
    name: 'Fundering',
    icon: Layers,
    status: 'completed',
    startDate: '2025-08-01',
    endDate: '2025-09-15',
    progress: 100,
    description: 'Betonnen fundering op staal met kruipruimte ventilatie',
    photos: 24,
    documents: 8,
    milestones: [
      { id: '1', name: 'Grondwerk afgerond', date: '2025-08-10', status: 'completed', verified: true },
      { id: '2', name: 'Wapening geplaatst', date: '2025-08-25', status: 'completed', inspector: 'J. de Vries', verified: true },
      { id: '3', name: 'Beton gestort', date: '2025-09-05', status: 'completed', verified: true },
      { id: '4', name: 'Keuring fundering', date: '2025-09-15', status: 'completed', inspector: 'Gemeente Almere', verified: true },
    ]
  },
  {
    id: 'shell',
    name: 'Ruwbouw',
    icon: Hammer,
    status: 'completed',
    startDate: '2025-09-20',
    endDate: '2025-11-30',
    progress: 100,
    description: 'HSB constructie met steenachtige buitengevel',
    photos: 48,
    documents: 12,
    milestones: [
      { id: '5', name: 'HSB elementen geplaatst', date: '2025-10-01', status: 'completed', verified: true },
      { id: '6', name: 'Verdiepingsvloer gestort', date: '2025-10-15', status: 'completed', verified: true },
      { id: '7', name: 'Constructie keuring', date: '2025-10-20', status: 'completed', inspector: 'Helder Engineering', verified: true },
      { id: '8', name: 'Ruwbouw waterdicht', date: '2025-11-30', status: 'completed', verified: true },
    ]
  },
  {
    id: 'facade',
    name: 'Gevel & Dak',
    icon: Home,
    status: 'current',
    startDate: '2025-12-01',
    endDate: '2026-02-15',
    progress: 60,
    description: 'Metselwerk, dakpannen en aluminium kozijnen',
    photos: 36,
    documents: 9,
    milestones: [
      { id: '9', name: 'Metselwerk begonnen', date: '2025-12-05', status: 'completed', verified: true },
      { id: '10', name: 'Dakconstructie geplaatst', date: '2025-12-20', status: 'completed', verified: true },
      { id: '11', name: 'Kozijnen geplaatst', date: '2026-01-10', status: 'current' },
      { id: '12', name: 'Dakpannen + isolatie', date: '2026-01-25', status: 'upcoming' },
      { id: '13', name: 'Gevel afgewerkt', date: '2026-02-15', status: 'upcoming' },
    ]
  },
  {
    id: 'installations',
    name: 'Installaties',
    icon: Zap,
    status: 'upcoming',
    startDate: '2026-02-20',
    endDate: '2026-04-15',
    progress: 0,
    description: 'Elektra, loodgieter, warmtepomp en ventilatie',
    photos: 0,
    documents: 6,
    milestones: [
      { id: '14', name: 'Leidingwerk aangelegd', date: '2026-03-01', status: 'upcoming' },
      { id: '15', name: 'Warmtepomp geïnstalleerd', date: '2026-03-15', status: 'upcoming' },
      { id: '16', name: 'Elektra afgewerkt', date: '2026-04-01', status: 'upcoming' },
      { id: '17', name: 'WTW systeem operationeel', date: '2026-04-15', status: 'upcoming' },
    ]
  },
  {
    id: 'finishing',
    name: 'Afbouw',
    icon: Paintbrush,
    status: 'upcoming',
    startDate: '2026-04-20',
    endDate: '2026-06-30',
    progress: 0,
    description: 'Stucwerk, tegelwerk, keuken en sanitair',
    photos: 0,
    documents: 4,
    milestones: [
      { id: '18', name: 'Stucwerk wanden', date: '2026-04-30', status: 'upcoming' },
      { id: '19', name: 'Tegelwerk badkamers', date: '2026-05-15', status: 'upcoming' },
      { id: '20', name: 'Keuken geplaatst', date: '2026-06-01', status: 'upcoming' },
      { id: '21', name: 'Schilderwerk', date: '2026-06-20', status: 'upcoming' },
    ]
  },
  {
    id: 'handover',
    name: 'Oplevering',
    icon: Key,
    status: 'upcoming',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    progress: 0,
    description: 'Eindcontrole, sleuteloverdracht en Wkb certificering',
    photos: 0,
    documents: 3,
    milestones: [
      { id: '22', name: 'Vooroplevering', date: '2026-07-01', status: 'upcoming' },
      { id: '23', name: 'Eindkeuring Wkb', date: '2026-07-10', status: 'upcoming' },
      { id: '24', name: 'Sleuteloverdracht', date: '2026-07-15', status: 'upcoming' },
    ]
  },
]

export default function TimelinePage() {
  const [expandedPhase, setExpandedPhase] = useState<string>('facade')
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')

  const currentPhase = PHASES.find(p => p.status === 'current')
  const completedCount = PHASES.filter(p => p.status === 'completed').length
  const totalProgress = Math.round((completedCount / PHASES.length) * 100 + 
    (currentPhase ? (currentPhase.progress / PHASES.length) : 0))

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header - Brutalist */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-[#93b9e6]" />
              <span className="text-[#93b9e6] text-[10px] font-black uppercase tracking-[0.3em]">VOORTGANG</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Bouwtijdlijn
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Volg de complete voortgang van uw nieuwbouwproject
            </p>
          </div>
          <div className="flex items-center gap-px bg-slate-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === 'timeline' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-500 hover:text-slate-900'
              }`}
            >
              Tijdlijn
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === 'list' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-500 hover:text-slate-900'
              }`}
            >
              Lijst
            </button>
          </div>
        </div>

        {/* Overall Progress Card - Brutalist */}
        <div className="grid lg:grid-cols-12 gap-px bg-slate-200">
          {/* Main progress info */}
          <div className="lg:col-span-8 bg-slate-900 p-8 text-white">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-8 h-8 text-[#93b9e6]" />
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">HUIDIGE FASE</p>
                <p className="text-2xl font-black uppercase tracking-wide">{currentPhase?.name || 'Oplevering'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-px bg-white/10">
              <div className="bg-slate-900 p-6">
                <p className="text-4xl font-black text-emerald-400">{completedCount}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">FASES VOLTOOID</p>
              </div>
              <div className="bg-slate-900 p-6">
                <p className="text-4xl font-black text-[#93b9e6]">{currentPhase?.progress || 0}%</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">HUIDIGE FASE</p>
              </div>
              <div className="bg-slate-900 p-6">
                <p className="text-4xl font-black text-white">JUL</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">OPLEVERING 2026</p>
              </div>
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="lg:col-span-4 bg-[#93b9e6] p-8 flex flex-col items-center justify-center">
            <p className="text-[8rem] font-black text-slate-900 leading-none tracking-tighter">{totalProgress}</p>
            <p className="text-xl font-black text-slate-900/50 uppercase tracking-wider">% TOTAAL</p>
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="space-y-4">
          {PHASES.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              isExpanded={expandedPhase === phase.id}
              onToggle={() => setExpandedPhase(expandedPhase === phase.id ? '' : phase.id)}
              isLast={index === PHASES.length - 1}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

function PhaseCard({ 
  phase, 
  index, 
  isExpanded, 
  onToggle,
  isLast 
}: { 
  phase: TimelinePhase
  index: number
  isExpanded: boolean
  onToggle: () => void
  isLast: boolean
}) {
  const PhaseIcon = phase.icon

  return (
    <div 
      className={`bg-white border transition-all duration-300 overflow-hidden ${
        isExpanded ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      {/* Header - Brutalist */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-6 text-left"
      >
        {/* Status indicator */}
        <div className={`relative w-14 h-14 flex items-center justify-center transition-all ${
          phase.status === 'completed' ? 'bg-emerald-500' :
          phase.status === 'current' ? 'bg-[#93b9e6]' :
          'bg-slate-200'
        }`}>
          {phase.status === 'completed' ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : phase.status === 'current' ? (
            <PhaseIcon className="w-7 h-7 text-slate-900" />
          ) : (
            <PhaseIcon className="w-7 h-7 text-slate-400" />
          )}
          
          {phase.status === 'current' && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className={`font-black text-lg uppercase tracking-wide ${
              phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
            }`}>{phase.name}</h3>
            {phase.status === 'completed' && (
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                VOLTOOID
              </span>
            )}
            {phase.status === 'current' && (
              <span className="px-3 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider">
                ACTIEF
              </span>
            )}
          </div>
          <p className={`text-sm mt-1 ${
            phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {phase.description}
          </p>
          
          {/* Progress bar for current phase - Brutalist */}
          {phase.status === 'current' && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-2 bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-slate-900 transition-all duration-1000"
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
              <span className="text-sm font-black text-slate-900">{phase.progress}%</span>
            </div>
          )}
        </div>

        {/* Date range */}
        <div className="hidden md:block text-right">
          <p className={`text-sm font-bold uppercase tracking-wider ${
            phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {new Date(phase.startDate).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })}
            {' - '}
            {new Date(phase.endDate).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center justify-end gap-4 mt-1 text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              {phase.photos}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {phase.documents}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Expanded content - Brutalist */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Calendar className="w-5 h-5 text-[#93b9e6]" />
              MIJLPALEN
            </h4>
            
            <div className="space-y-px bg-slate-200">
              {phase.milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`flex items-center gap-4 p-4 transition-all ${
                    milestone.status === 'completed' ? 'bg-emerald-50' :
                    milestone.status === 'current' ? 'bg-[#93b9e6]/20' :
                    'bg-white'
                  }`}
                >
                  {/* Status */}
                  <div className={`w-8 h-8 flex items-center justify-center ${
                    milestone.status === 'completed' ? 'bg-emerald-500' :
                    milestone.status === 'current' ? 'bg-[#93b9e6]' :
                    'bg-slate-300'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : milestone.status === 'current' ? (
                      <Play className="w-4 h-4 text-slate-900" />
                    ) : (
                      <Circle className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm uppercase tracking-wide ${
                        milestone.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
                      }`}>{milestone.name}</p>
                      {milestone.verified && (
                        <Shield className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    {milestone.inspector && (
                      <p className="text-xs text-slate-500 mt-0.5">Inspecteur: {milestone.inspector}</p>
                    )}
                  </div>

                  {/* Date */}
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    milestone.status === 'upcoming' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {new Date(milestone.date).toLocaleDateString('nl-NL', { 
                      day: 'numeric', month: 'short' 
                    })}
                  </p>

                  {/* Actions */}
                  {milestone.status === 'completed' && (
                    <button className="p-2 hover:bg-white transition-colors">
                      <Eye className="w-4 h-4 text-slate-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Media section - Brutalist */}
            {phase.photos > 0 && (
              <div className="mt-6">
                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Camera className="w-5 h-5 text-[#93b9e6]" />
                  BOUWFOTO&apos;S ({phase.photos})
                </h4>
                <div className="flex gap-px overflow-x-auto pb-2 bg-slate-200">
                  {Array.from({ length: Math.min(5, phase.photos) }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-24 h-24 flex-shrink-0 bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-slate-400" />
                    </div>
                  ))}
                  {phase.photos > 5 && (
                    <button className="w-24 h-24 flex-shrink-0 bg-slate-900 flex flex-col items-center justify-center hover:bg-slate-800 transition-colors">
                      <Plus className="w-5 h-5 text-white mb-1" />
                      <span className="text-[10px] text-white/70 font-bold">+{phase.photos - 5}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
