'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/logo'
import {
  ArrowLeft, MapPin, Calendar, User, Building2,
  Camera, FileText, Clock, Loader2, ChevronRight,
  MessageCircle, Shield, AlertTriangle, CheckCircle2,
  Image as ImageIcon, Download, Eye, Zap, TrendingUp,
  Home, Wrench, Thermometer, Droplets, Box, Layers,
  Euro, BarChart3, Phone, ExternalLink, Play,
  ChevronDown, ChevronUp, Filter, Grid, List
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface ProjectDetail {
  id: string
  name: string
  description: string
  type: string
  status: string
  property: {
    id: string
    name: string
    address: string
    city: string
    postcode: string
    propertyType: string
    woonoppervlakte: number
    perceelOppervlakte: number
    energielabel: string
    owner: {
      name: string
      email: string
      phone: string
    }
  }
  phases: ProjectPhase[]
  documents: Document[]
  timeline: TimelineEvent[]
  materials: Material[]
  costs: CostItem[]
  messages: WhatsAppMessage[]
  stats: {
    totalPhotos: number
    totalDocuments: number
    qualityScore: number
    issueCount: number
    progress: number
  }
  plannedStart: string
  plannedEnd: string
  actualStart: string
  actualEnd: string | null
}

interface ProjectPhase {
  id: string
  name: string
  order: number
  status: string
  plannedStart: string
  plannedEnd: string
  actualStart: string | null
  actualEnd: string | null
}

interface Document {
  id: string
  name: string
  description: string
  type: string
  fileUrl: string
  documentDate: string
  verified: boolean
  source: string
  extractedData?: {
    aiClassification?: {
      phase: string
      category: string
      description: string
      confidence: number
      quality?: { score: number; notes: string[]; issues: string[] }
    }
  }
}

interface TimelineEvent {
  id: string
  type: string
  title: string
  description: string
  occurredAt: string
  verified: boolean
}

interface Material {
  id: string
  category: string
  name: string
  brand: string
  quantity: number
  unit: string
  location: string
}

interface CostItem {
  category: string
  description: string
  budgeted: number
  actual: number
}

interface WhatsAppMessage {
  id: string
  content: string
  mediaUrl: string | null
  createdAt: string
  direction: string
}

// ============================================
// Main Component
// ============================================

export default function BuilderProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'timeline' | 'materials' | 'costs'>('overview')
  const [photoFilter, setPhotoFilter] = useState<string>('all')
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchProjectDetail()
  }, [projectId])

  async function fetchProjectDetail() {
    try {
      setLoading(true)
      const response = await fetch(`/api/builder/projects/${projectId}`)
      
      if (!response.ok) {
        throw new Error('Project niet gevonden')
      }

      const data = await response.json()
      setProject(data)
      
      // Expand current phase by default
      const currentPhase = data.phases?.find((p: ProjectPhase) => p.status === 'IN_PROGRESS')
      if (currentPhase) {
        setExpandedPhases(new Set([currentPhase.id]))
      }
    } catch (err) {
      console.error('Error fetching project:', err)
      setError(err instanceof Error ? err.message : 'Laden mislukt')
    } finally {
      setLoading(false)
    }
  }

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases)
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId)
    } else {
      newExpanded.add(phaseId)
    }
    setExpandedPhases(newExpanded)
  }

  const filteredPhotos = project?.documents.filter(doc => {
    if (doc.type !== 'PHOTO') return false
    if (photoFilter === 'all') return true
    return doc.extractedData?.aiClassification?.phase === photoFilter
  }) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatEnergyLabel = (label: string | null | undefined) => {
    if (!label) return 'Onbekend'
    const labelMap: Record<string, string> = {
      'A_PLUS_PLUS_PLUS_PLUS': 'A++++',
      'A_PLUS_PLUS_PLUS': 'A+++',
      'A_PLUS_PLUS': 'A++',
      'A_PLUS': 'A+',
      'A': 'A',
      'B': 'B',
      'C': 'C',
      'D': 'D',
      'E': 'E',
      'F': 'F',
      'G': 'G',
    }
    return labelMap[label] || label
  }

  const getPhaseIcon = (phaseName: string) => {
    const name = phaseName.toLowerCase()
    if (name.includes('grond') || name.includes('funder')) return Layers
    if (name.includes('ruw')) return Building2
    if (name.includes('dak') || name.includes('gevel')) return Home
    if (name.includes('install')) return Zap
    if (name.includes('afbouw') || name.includes('afwerk')) return Wrench
    if (name.includes('oplever')) return CheckCircle2
    return Building2
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500'
      case 'IN_PROGRESS': return 'bg-amber-500'
      case 'PENDING': return 'bg-slate-300'
      default: return 'bg-slate-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600">{error || 'Project niet gevonden'}</p>
          <button
            onClick={() => router.push('/builder/dashboard')}
            className="mt-4 px-6 py-3 bg-slate-900 text-white font-bold"
          >
            Terug naar dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalBudget = project.costs.reduce((sum, c) => sum + Number(c.budgeted), 0)
  const totalActual = project.costs.reduce((sum, c) => sum + Number(c.actual), 0)
  const budgetVariance = totalActual - totalBudget

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 lg:px-8 h-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/builder/dashboard')}
              className="p-2 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Logo size="md" href="/builder/dashboard" />
            <div className="hidden sm:block px-3 py-1 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider">
              Builder
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard?propertyId=${project.property.id}`}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-bold"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Bekijk als eigenaar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Project Header */}
      <div className="bg-slate-900 text-white">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${
                  project.status === 'COMPLETED' ? 'bg-emerald-500' :
                  project.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`}>
                  {project.status === 'COMPLETED' ? 'Voltooid' :
                   project.status === 'IN_PROGRESS' ? 'In uitvoering' : 'Planning'}
                </span>
                {project.stats.issueCount > 0 && (
                  <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {project.stats.issueCount} issues
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight mb-2">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.property.address}, {project.property.city}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {project.property.owner.name}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-1">
              <div className="bg-white/10 px-6 py-4 text-center">
                <p className="text-3xl font-black">{project.stats.totalPhotos}</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Foto's</p>
              </div>
              <div className="bg-white/10 px-6 py-4 text-center">
                <p className="text-3xl font-black">{project.stats.qualityScore}%</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Kwaliteit</p>
              </div>
              <div className="bg-white/10 px-6 py-4 text-center">
                <p className="text-3xl font-black">{project.stats.progress}%</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Voortgang</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-2 bg-white/20 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${project.stats.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overzicht', icon: Grid },
            { id: 'photos', label: `Foto's (${project.stats.totalPhotos})`, icon: Camera },
            { id: 'timeline', label: 'Tijdlijn', icon: Clock },
            { id: 'materials', label: 'Materialen', icon: Box },
            { id: 'costs', label: 'Kosten', icon: Euro },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Phases */}
            <div className="lg:col-span-2 space-y-6">
              {/* Phases */}
              <div className="bg-white">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Bouwfases</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {project.phases.map((phase) => {
                    const PhaseIcon = getPhaseIcon(phase.name)
                    const isExpanded = expandedPhases.has(phase.id)
                    const phasePhotos = project.documents.filter(
                      d => d.type === 'PHOTO' && d.extractedData?.aiClassification?.phase?.includes(phase.name.split(' ')[0].toUpperCase())
                    )

                    return (
                      <div key={phase.id}>
                        <button
                          onClick={() => togglePhase(phase.id)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className={`w-10 h-10 flex items-center justify-center ${getStatusColor(phase.status)}`}>
                            <PhaseIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900">{phase.name}</p>
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                                phase.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                phase.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {phase.status === 'COMPLETED' ? 'Voltooid' :
                                 phase.status === 'IN_PROGRESS' ? 'Actief' : 'Gepland'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">
                              {formatDate(phase.plannedStart)} - {formatDate(phase.plannedEnd)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400">{phasePhotos.length} foto's</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && phasePhotos.length > 0 && (
                          <div className="px-4 pb-4">
                            <div className="grid grid-cols-4 gap-2">
                              {phasePhotos.slice(0, 8).map((photo) => (
                                <div
                                  key={photo.id}
                                  className="aspect-square bg-slate-100 relative group overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              ))}
                              {phasePhotos.length > 8 && (
                                <div className="aspect-square bg-slate-900 flex items-center justify-center">
                                  <span className="text-white font-black">+{phasePhotos.length - 8}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Recente Activiteit</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {project.timeline.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-4">
                      <div className={`w-8 h-8 flex items-center justify-center ${
                        event.verified ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        {event.type.includes('PHOTO') ? <Camera className="w-4 h-4 text-emerald-600" /> :
                         event.type.includes('INSPECTION') ? <Shield className="w-4 h-4 text-blue-600" /> :
                         <Zap className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{event.title}</p>
                        <p className="text-sm text-slate-500">{event.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(event.occurredAt)}</p>
                      </div>
                      {event.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Property Info */}
              <div className="bg-white">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Woninggegevens</h2>
                </div>
                <div className="p-4 space-y-3">
                  <InfoRow label="Type" value={project.property.propertyType} />
                  <InfoRow label="Woonoppervlakte" value={`${project.property.woonoppervlakte} m²`} />
                  <InfoRow label="Perceeloppervlakte" value={`${project.property.perceelOppervlakte} m²`} />
                  <InfoRow label="Energielabel" value={formatEnergyLabel(project.property.energielabel)} />
                </div>
              </div>

              {/* Owner Contact */}
              <div className="bg-white">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Opdrachtgever</h2>
                </div>
                <div className="p-4">
                  <p className="font-bold text-slate-900 mb-1">{project.property.owner.name}</p>
                  <p className="text-sm text-slate-500 mb-3">{project.property.owner.email}</p>
                  {project.property.owner.phone && (
                    <a
                      href={`tel:${project.property.owner.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-bold"
                    >
                      <Phone className="w-4 h-4" />
                      Bellen
                    </a>
                  )}
                </div>
              </div>

              {/* Budget Summary */}
              <div className="bg-white">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Budget</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-slate-500 shrink-0">Begroot</span>
                    <span className="font-bold text-right">{formatCurrency(totalBudget)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-slate-500 shrink-0">Werkelijk</span>
                    <span className="font-bold text-right">{formatCurrency(totalActual)}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center gap-4">
                    <span className="text-slate-500 shrink-0">Verschil</span>
                    <span className={`font-bold text-right ${budgetVariance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {budgetVariance > 0 ? '+' : ''}{formatCurrency(budgetVariance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Messages */}
              {project.messages.length > 0 && (
                <div className="bg-white">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-black text-slate-900 uppercase tracking-wider">WhatsApp</h2>
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {project.messages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="p-3">
                        <p className="text-sm text-slate-700">{msg.content}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(msg.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-500 uppercase">Filter op fase:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={photoFilter === 'all'}
                  onClick={() => setPhotoFilter('all')}
                  label={`Alle (${project.documents.filter(d => d.type === 'PHOTO').length})`}
                />
                {project.phases.map((phase) => {
                  const count = project.documents.filter(
                    d => d.type === 'PHOTO' && d.extractedData?.aiClassification?.phase?.includes(phase.name.split(' ')[0].toUpperCase())
                  ).length
                  return (
                    <FilterButton
                      key={phase.id}
                      active={photoFilter === phase.name.split(' ')[0].toUpperCase()}
                      onClick={() => setPhotoFilter(phase.name.split(' ')[0].toUpperCase())}
                      label={`${phase.name} (${count})`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-slate-100 relative group overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{photo.name}</p>
                      <p className="text-white/60 text-xs">{formatDate(photo.documentDate)}</p>
                    </div>
                  </div>
                  {photo.verified && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {photo.extractedData?.aiClassification?.quality && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs font-bold">
                      {photo.extractedData.aiClassification.quality.score}/10
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Geen foto's gevonden voor deze filter
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white">
            <div className="divide-y divide-slate-100">
              {project.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4 p-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      event.verified ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      {event.type.includes('START') ? <Play className="w-5 h-5 text-white" /> :
                       event.type.includes('COMPLETE') ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                       event.type.includes('INSPECTION') ? <Shield className="w-5 h-5 text-white" /> :
                       event.type.includes('HANDOVER') ? <Home className="w-5 h-5 text-white" /> :
                       <Zap className="w-5 h-5 text-white" />}
                    </div>
                    {index < project.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-900">{event.title}</p>
                      {event.verified && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
                          Geverifieerd
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(event.occurredAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            {Object.entries(
              project.materials.reduce((acc, mat) => {
                const cat = mat.category
                if (!acc[cat]) acc[cat] = []
                acc[cat].push(mat)
                return acc
              }, {} as Record<string, Material[]>)
            ).map(([category, materials]) => (
              <div key={category} className="bg-white">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">
                    {category.replace(/_/g, ' ')}
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {materials.map((mat) => (
                    <div key={mat.id} className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                        <Box className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{mat.name}</p>
                        <p className="text-sm text-slate-500">{mat.brand} • {mat.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{mat.quantity} {mat.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="bg-white p-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Begroot</p>
                <p className="text-3xl font-black text-slate-900">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="bg-white p-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Werkelijk</p>
                <p className="text-3xl font-black text-slate-900">{formatCurrency(totalActual)}</p>
              </div>
              <div className={`p-6 ${budgetVariance > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Verschil</p>
                <p className={`text-3xl font-black ${budgetVariance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {budgetVariance > 0 ? '+' : ''}{formatCurrency(budgetVariance)}
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-black text-slate-900 uppercase tracking-wider">Kostenspecificatie</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Categorie</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Begroot</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Werkelijk</th>
                      <th className="text-right p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Verschil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {project.costs.map((cost, index) => {
                      const budgeted = Number(cost.budgeted)
                      const actual = Number(cost.actual)
                      const diff = actual - budgeted
                      return (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="p-4">
                            <p className="font-medium text-slate-900">{cost.category.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-slate-500">{cost.description}</p>
                          </td>
                          <td className="p-4 text-right font-medium">{formatCurrency(budgeted)}</td>
                          <td className="p-4 text-right font-medium">{formatCurrency(actual)}</td>
                          <td className={`p-4 text-right font-bold ${diff > 0 ? 'text-red-600' : diff < 0 ? 'text-emerald-600' : ''}`}>
                            {diff !== 0 && (diff > 0 ? '+' : '')}{formatCurrency(diff)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white">
                    <tr>
                      <td className="p-4 font-black uppercase">Totaal</td>
                      <td className="p-4 text-right font-black">{formatCurrency(totalBudget)}</td>
                      <td className="p-4 text-right font-black">{formatCurrency(totalActual)}</td>
                      <td className={`p-4 text-right font-black ${budgetVariance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {budgetVariance > 0 ? '+' : ''}{formatCurrency(budgetVariance)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Helper Components
// ============================================

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-bold text-slate-900 text-right">{value}</span>
    </div>
  )
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        active
          ? 'bg-slate-900 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  )
}
