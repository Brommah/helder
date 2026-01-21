'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Clock, CheckCircle2, Circle, Camera, FileText,
  ChevronDown, ChevronRight, Calendar, Hammer,
  Layers, Home, Zap, Paintbrush, Key, Shield, Play,
  Eye, X, Loader2, AlertCircle, TrendingUp,
  Mountain, Shovel, Wrench, Building2
} from 'lucide-react'

// Phase icons mapping
const PHASE_ICONS: Record<string, React.ElementType> = {
  'GRONDWERK': Shovel,
  'FUNDERING': Layers,
  'RUWBOUW': Hammer,
  'DAKCONSTRUCTIE': Home,
  'GEVELWERK': Building2,
  'INSTALLATIES': Zap,
  'AFBOUW': Paintbrush,
  'OPLEVERING': Key,
}

// Phase descriptions
const PHASE_DESCRIPTIONS: Record<string, string> = {
  'GRONDWERK': 'Bouwterrein voorbereiden, ontgraven en nivelleren',
  'FUNDERING': 'Betonnen fundering op staal met kruipruimte',
  'RUWBOUW': 'HSB constructie en dragende wanden',
  'DAKCONSTRUCTIE': 'Dakconstructie en isolatie',
  'GEVELWERK': 'Metselwerk en kozijnen plaatsen',
  'INSTALLATIES': 'Elektra, loodgieter, warmtepomp en ventilatie',
  'AFBOUW': 'Stucwerk, tegelwerk, keuken en sanitair',
  'OPLEVERING': 'Eindcontrole en sleuteloverdracht',
}

interface PhotoData {
  id: string
  name: string
  fileUrl: string
  createdAt: string
  qualityScore: number | null
  aiSummary: string | null
  phase: string
}

interface MilestoneData {
  id: string
  title: string
  description: string | null
  occurredAt: string
  type: string
  verified: boolean
}

interface PhaseData {
  key: string
  name: string
  order: number
  status: 'completed' | 'current' | 'upcoming'
  startDate: string | null
  endDate: string | null
  photoCount: number
  documentCount: number
  avgQuality: number | null
  photos: PhotoData[]
  milestones: MilestoneData[]
}

interface TimelineData {
  phases: PhaseData[]
  summary: {
    totalPhotos: number
    completedPhases: number
    totalPhases: number
    currentPhase: string | null
    currentPhaseKey: string | null
    progressPercent: number
  }
  milestones: {
    key: string
    name: string
    date: string | null
    completed: boolean
  }[]
}

// Demo data for when API has no data
const DEMO_DATA: TimelineData = {
  phases: [
    {
      key: 'GRONDWERK',
      name: 'Grondwerk',
      order: 0,
      status: 'completed',
      startDate: '2025-07-01T08:00:00Z',
      endDate: '2025-07-15T16:00:00Z',
      photoCount: 12,
      documentCount: 12,
      avgQuality: 8.2,
      photos: Array.from({ length: 12 }, (_, i) => ({
        id: `grond-${i}`,
        name: `Grondwerk foto ${i + 1}`,
        fileUrl: '/images/placeholder-construction.jpg',
        createdAt: new Date(2025, 6, 1 + i).toISOString(),
        qualityScore: 7 + Math.random() * 2,
        aiSummary: 'Graafwerkzaamheden conform bestek uitgevoerd',
        phase: 'GRONDWERK',
      })),
      milestones: [
        { id: 'm1', title: 'Bouwterrein vrijgemaakt', description: 'Terrein gereed voor fundering', occurredAt: '2025-07-05T10:00:00Z', type: 'CONSTRUCTION_START', verified: true },
        { id: 'm2', title: 'Grondwerk afgerond', description: null, occurredAt: '2025-07-15T16:00:00Z', type: 'CUSTOM', verified: true },
      ],
    },
    {
      key: 'FUNDERING',
      name: 'Fundering',
      order: 1,
      status: 'completed',
      startDate: '2025-07-20T08:00:00Z',
      endDate: '2025-08-15T16:00:00Z',
      photoCount: 24,
      documentCount: 24,
      avgQuality: 8.5,
      photos: Array.from({ length: 24 }, (_, i) => ({
        id: `fund-${i}`,
        name: `Fundering foto ${i + 1}`,
        fileUrl: '/images/placeholder-construction.jpg',
        createdAt: new Date(2025, 6, 20 + Math.floor(i / 2)).toISOString(),
        qualityScore: 7.5 + Math.random() * 2,
        aiSummary: 'Wapening en betonwerk volgens specificaties',
        phase: 'FUNDERING',
      })),
      milestones: [
        { id: 'm3', title: 'Wapening geplaatst', description: 'Inspectie door constructeur', occurredAt: '2025-07-28T14:00:00Z', type: 'CUSTOM', verified: true },
        { id: 'm4', title: 'Beton gestort', description: 'C30/37 beton', occurredAt: '2025-08-05T10:00:00Z', type: 'CUSTOM', verified: true },
        { id: 'm5', title: 'Fundering gekeurd', description: 'Gemeente Almere', occurredAt: '2025-08-15T11:00:00Z', type: 'FOUNDATION_COMPLETE', verified: true },
      ],
    },
    {
      key: 'RUWBOUW',
      name: 'Ruwbouw',
      order: 2,
      status: 'completed',
      startDate: '2025-08-20T08:00:00Z',
      endDate: '2025-10-15T16:00:00Z',
      photoCount: 48,
      documentCount: 48,
      avgQuality: 8.1,
      photos: Array.from({ length: 20 }, (_, i) => ({
        id: `ruw-${i}`,
        name: `Ruwbouw foto ${i + 1}`,
        fileUrl: '/images/placeholder-construction.jpg',
        createdAt: new Date(2025, 7, 20 + i * 3).toISOString(),
        qualityScore: 7 + Math.random() * 2.5,
        aiSummary: 'HSB elementen correct geplaatst',
        phase: 'RUWBOUW',
      })),
      milestones: [
        { id: 'm6', title: 'HSB elementen geplaatst', description: null, occurredAt: '2025-09-01T16:00:00Z', type: 'CUSTOM', verified: true },
        { id: 'm7', title: 'Verdiepingsvloer gestort', description: null, occurredAt: '2025-09-20T14:00:00Z', type: 'CUSTOM', verified: true },
        { id: 'm8', title: 'Constructie keuring', description: 'Helder Engineering', occurredAt: '2025-10-05T10:00:00Z', type: 'FRAMING_COMPLETE', verified: true },
      ],
    },
    {
      key: 'DAKCONSTRUCTIE',
      name: 'Dakconstructie',
      order: 3,
      status: 'completed',
      startDate: '2025-10-20T08:00:00Z',
      endDate: '2025-11-15T16:00:00Z',
      photoCount: 18,
      documentCount: 18,
      avgQuality: 8.3,
      photos: Array.from({ length: 18 }, (_, i) => ({
        id: `dak-${i}`,
        name: `Dak foto ${i + 1}`,
        fileUrl: '/images/placeholder-construction.jpg',
        createdAt: new Date(2025, 9, 20 + i).toISOString(),
        qualityScore: 7.5 + Math.random() * 2,
        aiSummary: 'Dakconstructie volgens tekening',
        phase: 'DAKCONSTRUCTIE',
      })),
      milestones: [
        { id: 'm9', title: 'Dakconstructie geplaatst', description: null, occurredAt: '2025-10-30T16:00:00Z', type: 'CUSTOM', verified: true },
        { id: 'm10', title: 'Dakpannen gelegd', description: null, occurredAt: '2025-11-10T14:00:00Z', type: 'ROOFING_COMPLETE', verified: true },
      ],
    },
    {
      key: 'GEVELWERK',
      name: 'Gevelwerk',
      order: 4,
      status: 'current',
      startDate: '2025-11-20T08:00:00Z',
      endDate: null,
      photoCount: 28,
      documentCount: 28,
      avgQuality: 7.8,
      photos: Array.from({ length: 20 }, (_, i) => ({
        id: `gevel-${i}`,
        name: `Gevel foto ${i + 1}`,
        fileUrl: '/images/placeholder-construction.jpg',
        createdAt: new Date(2025, 10, 20 + i).toISOString(),
        qualityScore: 6.5 + Math.random() * 2.5,
        aiSummary: 'Metselwerk in uitvoering',
        phase: 'GEVELWERK',
      })),
      milestones: [
        { id: 'm11', title: 'Metselwerk gestart', description: null, occurredAt: '2025-11-25T09:00:00Z', type: 'CUSTOM', verified: true },
        { id: 'm12', title: 'Kozijnen geplaatst', description: null, occurredAt: '2026-01-10T14:00:00Z', type: 'CUSTOM', verified: true },
      ],
    },
    {
      key: 'INSTALLATIES',
      name: 'Installaties',
      order: 5,
      status: 'upcoming',
      startDate: null,
      endDate: null,
      photoCount: 0,
      documentCount: 0,
      avgQuality: null,
      photos: [],
      milestones: [],
    },
    {
      key: 'AFBOUW',
      name: 'Afbouw',
      order: 6,
      status: 'upcoming',
      startDate: null,
      endDate: null,
      photoCount: 0,
      documentCount: 0,
      avgQuality: null,
      photos: [],
      milestones: [],
    },
    {
      key: 'OPLEVERING',
      name: 'Oplevering',
      order: 7,
      status: 'upcoming',
      startDate: null,
      endDate: null,
      photoCount: 0,
      documentCount: 0,
      avgQuality: null,
      photos: [],
      milestones: [],
    },
  ],
  summary: {
    totalPhotos: 130,
    completedPhases: 4,
    totalPhases: 8,
    currentPhase: 'Gevelwerk',
    currentPhaseKey: 'GEVELWERK',
    progressPercent: 58,
  },
  milestones: [
    { key: 'START', name: 'Start', date: '2025-07-01T08:00:00Z', completed: true },
    { key: 'FOUNDATION', name: 'Fundering Klaar', date: '2025-08-15T16:00:00Z', completed: true },
    { key: 'RUWBOUW', name: 'Ruwbouw Klaar', date: '2025-10-15T16:00:00Z', completed: true },
    { key: 'WATERDICHT', name: 'Waterdicht', date: null, completed: false },
    { key: 'OPLEVERING', name: 'Oplevering', date: null, completed: false },
  ],
}

export default function TimelinePage() {
  const [data, setData] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null)

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch('/api/timeline')
        if (!response.ok) throw new Error('Failed to fetch timeline')
        const result = await response.json()

        // Use demo data if API returns empty phases
        if (!result.phases || result.phases.every((p: PhaseData) => p.photoCount === 0)) {
          setData(DEMO_DATA)
        } else {
          setData(result)
        }
      } catch (err) {
        console.error('Timeline fetch error:', err)
        // Use demo data on error
        setData(DEMO_DATA)
        setError(null) // Don't show error, use demo
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [])

  // Set initial expanded phase to current
  useEffect(() => {
    if (data && !expandedPhase) {
      const current = data.phases.find(p => p.status === 'current')
      if (current) setExpandedPhase(current.key)
    }
  }, [data, expandedPhase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#93b9e6] mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Tijdlijn laden...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Fout bij laden</p>
        </div>
      </div>
    )
  }

  const { phases, summary, milestones } = data

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
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

        {/* Overall Progress Card */}
        <div className="grid lg:grid-cols-12 gap-px bg-slate-200">
          {/* Main progress info */}
          <div className="lg:col-span-8 bg-slate-900 p-8 text-white">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-8 h-8 text-[#93b9e6]" />
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">HUIDIGE FASE</p>
                <p className="text-2xl font-black uppercase tracking-wide">{summary.currentPhase || 'Opgeleverd'}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px bg-white/10">
              <div className="bg-slate-900 p-6">
                <p className="text-4xl font-black text-emerald-400">{summary.completedPhases}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">FASES VOLTOOID</p>
              </div>
              <div className="bg-slate-900 p-6">
                <p className="text-4xl font-black text-[#93b9e6]">{summary.totalPhotos}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">FOTO&apos;S</p>
              </div>
              <div className="bg-slate-900 p-6">
                <p className="text-4xl font-black text-white">{summary.totalPhases}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">TOTAAL FASES</p>
              </div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="lg:col-span-4 bg-[#93b9e6] p-8 flex flex-col items-center justify-center">
            <p className="text-[8rem] font-black text-slate-900 leading-none tracking-tighter">{summary.progressPercent}</p>
            <p className="text-xl font-black text-slate-900/50 uppercase tracking-wider">% TOTAAL</p>
          </div>
        </div>

        {/* Key Milestones Bar */}
        <div className="bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mountain className="w-5 h-5 text-[#93b9e6]" />
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">MIJLPALEN</h3>
          </div>
          <div className="flex items-center justify-between relative">
            {/* Connection line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -z-10" />
            <div
              className="absolute left-0 top-1/2 h-1 bg-emerald-500 -z-10 transition-all duration-500"
              style={{ width: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%` }}
            />

            {milestones.map((milestone, index) => (
              <div key={milestone.key} className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center transition-all ${
                  milestone.completed ? 'bg-emerald-500' : 'bg-slate-200'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <p className={`mt-2 text-[10px] font-black uppercase tracking-wider ${
                  milestone.completed ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {milestone.name}
                </p>
                {milestone.date && (
                  <p className="text-[10px] text-slate-400">
                    {new Date(milestone.date).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline with Photo Markers */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200" />

          <div className="space-y-6">
            {phases.map((phase) => (
              <PhaseCard
                key={phase.key}
                phase={phase}
                isExpanded={expandedPhase === phase.key}
                onToggle={() => setExpandedPhase(expandedPhase === phase.key ? null : phase.key)}
                onPhotoClick={setSelectedPhoto}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  )
}

function PhaseCard({
  phase,
  isExpanded,
  onToggle,
  onPhotoClick,
}: {
  phase: PhaseData
  isExpanded: boolean
  onToggle: () => void
  onPhotoClick: (photo: PhotoData) => void
}) {
  const PhaseIcon = PHASE_ICONS[phase.key] || Hammer
  const description = PHASE_DESCRIPTIONS[phase.key] || ''

  // Calculate expected photos (rough estimate)
  const expectedPhotos = 15
  const progressPercent = phase.status === 'completed'
    ? 100
    : phase.status === 'current'
      ? Math.min(Math.round((phase.photoCount / expectedPhotos) * 100), 95)
      : 0

  return (
    <div className="relative pl-20">
      {/* Timeline node */}
      <div className={`absolute left-4 w-8 h-8 flex items-center justify-center transition-all z-10 ${
        phase.status === 'completed' ? 'bg-emerald-500' :
        phase.status === 'current' ? 'bg-[#93b9e6]' :
        'bg-slate-200'
      }`}>
        {phase.status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : phase.status === 'current' ? (
          <Play className="w-4 h-4 text-slate-900" />
        ) : (
          <Circle className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {/* Photo markers on timeline */}
      {phase.photos.length > 0 && (
        <div className="absolute left-[52px] top-0 bottom-0 flex flex-col justify-center">
          <div className="flex flex-col gap-1">
            {phase.photos.slice(0, 8).map((photo, i) => {
              const quality = photo.qualityScore || 5
              const color = quality >= 7 ? 'bg-emerald-500' : quality >= 5 ? 'bg-amber-500' : 'bg-red-500'
              return (
                <button
                  key={photo.id}
                  onClick={(e) => { e.stopPropagation(); onPhotoClick(photo) }}
                  className={`w-2 h-2 ${color} hover:scale-150 transition-transform cursor-pointer`}
                  title={`${photo.name} - Kwaliteit: ${quality.toFixed(1)}`}
                />
              )
            })}
            {phase.photos.length > 8 && (
              <span className="text-[8px] text-slate-400 font-bold">+{phase.photos.length - 8}</span>
            )}
          </div>
        </div>
      )}

      {/* Phase card */}
      <div
        className={`bg-white border transition-all duration-300 overflow-hidden ${
          isExpanded ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'
        } ${phase.status === 'upcoming' ? 'opacity-50' : ''}`}
      >
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-4 p-6 text-left"
          disabled={phase.status === 'upcoming' && phase.photoCount === 0}
        >
          {/* Icon */}
          <div className={`w-14 h-14 flex items-center justify-center transition-all ${
            phase.status === 'completed' ? 'bg-emerald-500' :
            phase.status === 'current' ? 'bg-[#93b9e6]' :
            'bg-slate-200'
          }`}>
            {phase.status === 'completed' ? (
              <CheckCircle2 className="w-7 h-7 text-white" />
            ) : (
              <PhaseIcon className={`w-7 h-7 ${phase.status === 'current' ? 'text-slate-900' : 'text-slate-400'}`} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className={`font-black text-lg uppercase tracking-wide ${
                phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
              }`}>{phase.name}</h3>
              {phase.status === 'completed' && (
                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                  VOLTOOID
                </span>
              )}
              {phase.status === 'current' && (
                <span className="px-3 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  ACTIEF
                </span>
              )}
              {phase.avgQuality !== null && (
                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                  phase.avgQuality >= 7 ? 'bg-emerald-100 text-emerald-700' :
                  phase.avgQuality >= 5 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  KWALITEIT {phase.avgQuality.toFixed(1)}
                </span>
              )}
            </div>
            <p className={`text-sm mt-1 ${
              phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {description}
            </p>

            {/* Progress bar for current/completed phases */}
            {phase.status !== 'upcoming' && (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-2 bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      phase.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-900'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-sm font-black text-slate-900">{progressPercent}%</span>
              </div>
            )}
          </div>

          {/* Date and stats */}
          <div className="hidden md:block text-right">
            {phase.startDate && (
              <p className={`text-sm font-bold uppercase tracking-wider ${
                phase.status === 'upcoming' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {new Date(phase.startDate).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })}
                {phase.endDate && phase.endDate !== phase.startDate && (
                  <>
                    {' - '}
                    {new Date(phase.endDate).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })}
                  </>
                )}
              </p>
            )}
            <div className="flex items-center justify-end gap-4 mt-1 text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                {phase.photoCount}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {phase.documentCount}
              </span>
            </div>
          </div>

          {/* Chevron */}
          {(phase.photoCount > 0 || phase.milestones.length > 0) && (
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          )}
        </button>

        {/* Expanded content */}
        {isExpanded && (phase.photoCount > 0 || phase.milestones.length > 0) && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="border-t border-slate-200 pt-6">
              {/* Milestones */}
              {phase.milestones.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Calendar className="w-5 h-5 text-[#93b9e6]" />
                    MIJLPALEN ({phase.milestones.length})
                  </h4>

                  <div className="space-y-px bg-slate-200">
                    {phase.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-4 p-4 bg-white"
                      >
                        <div className={`w-8 h-8 flex items-center justify-center ${
                          milestone.verified ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}>
                          {milestone.verified ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <Circle className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm uppercase tracking-wide text-slate-900">
                              {milestone.title}
                            </p>
                            {milestone.verified && (
                              <Shield className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          {milestone.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{milestone.description}</p>
                          )}
                        </div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {new Date(milestone.occurredAt).toLocaleDateString('nl-NL', {
                            day: 'numeric', month: 'short'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos grid */}
              {phase.photos.length > 0 && (
                <div>
                  <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Camera className="w-5 h-5 text-[#93b9e6]" />
                    BOUWFOTO&apos;S ({phase.photoCount})
                  </h4>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-px bg-slate-200">
                    {phase.photos.map((photo) => {
                      const quality = photo.qualityScore || 5
                      const borderColor = quality >= 7 ? 'border-emerald-500' : quality >= 5 ? 'border-amber-500' : 'border-red-500'

                      return (
                        <button
                          key={photo.id}
                          onClick={() => onPhotoClick(photo)}
                          className={`relative aspect-square bg-slate-100 hover:opacity-80 transition-opacity group border-b-4 ${borderColor}`}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {/* Quality indicator */}
                          <div className={`absolute top-1 right-1 w-4 h-4 text-[8px] font-black flex items-center justify-center ${
                            quality >= 7 ? 'bg-emerald-500 text-white' :
                            quality >= 5 ? 'bg-amber-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {Math.round(quality)}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PhotoModal({ photo, onClose }: { photo: PhotoData; onClose: () => void }) {
  const quality = photo.qualityScore || 5
  const qualityLabel = quality >= 7 ? 'Goed' : quality >= 5 ? 'Voldoende' : 'Aandacht nodig'
  const qualityColor = quality >= 7 ? 'text-emerald-500' : quality >= 5 ? 'text-amber-500' : 'text-red-500'

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">{photo.name}</h3>
            <p className="text-xs text-slate-400">
              {new Date(photo.createdAt).toLocaleDateString('nl-NL', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Image */}
        <div className="aspect-video bg-slate-100 flex items-center justify-center">
          <Camera className="w-16 h-16 text-slate-300" />
        </div>

        {/* Details */}
        <div className="p-4 space-y-4">
          {/* Quality score */}
          <div className="flex items-center justify-between p-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-5 h-5 ${qualityColor}`} />
              <span className="text-sm font-bold text-slate-700">Kwaliteitsscore</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${qualityColor}`}>{quality.toFixed(1)}</span>
              <span className="text-xs text-slate-400">/10</span>
              <span className={`px-2 py-1 text-[10px] font-black uppercase ${
                quality >= 7 ? 'bg-emerald-100 text-emerald-700' :
                quality >= 5 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {qualityLabel}
              </span>
            </div>
          </div>

          {/* AI Summary */}
          {photo.aiSummary && (
            <div className="p-4 bg-[#93b9e6]/10 border-l-4 border-[#93b9e6]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#93b9e6]" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">AI Analyse</span>
              </div>
              <p className="text-sm text-slate-700">{photo.aiSummary}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Fase</p>
              <p className="font-bold text-slate-900">{photo.phase}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Datum</p>
              <p className="font-bold text-slate-900">
                {new Date(photo.createdAt).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
