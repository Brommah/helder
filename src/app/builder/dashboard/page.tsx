'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { 
  Building2, Plus, Search, LayoutGrid, List as ListIcon,
  MapPin, Users, ArrowRight, Clock,
  AlertTriangle, FileText, Camera, ChevronRight,
  Shield, Settings, Bell, Target, BarChart3
} from 'lucide-react'

interface Project {
  id: string
  name: string
  address: string
  client: string
  status: 'planning' | 'construction' | 'finishing' | 'handover' | 'completed'
  progress: number
  startDate: string
  endDate: string
  phase: string
  alerts: number
  documentsCount: number
  photosCount: number
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Villa Zonneweide',
    address: 'Kavel 12, De Buitenplaats, Almere',
    client: 'Familie Van der Berg',
    status: 'construction',
    progress: 75,
    startDate: '2025-08-01',
    endDate: '2026-07-15',
    phase: 'Gevel & Dak',
    alerts: 2,
    documentsCount: 24,
    photosCount: 156
  },
  {
    id: '2',
    name: 'Woning De Tuin',
    address: 'Kavel 8, Groene Hart, Utrecht',
    client: 'Familie Jansen-Smit',
    status: 'planning',
    progress: 15,
    startDate: '2026-02-01',
    endDate: '2026-11-30',
    phase: 'Ontwerp & Vergunning',
    alerts: 0,
    documentsCount: 8,
    photosCount: 12
  },
  {
    id: '3',
    name: 'Villa Het Landhuis',
    address: 'Kavel 23, Landgoed Noord, Amersfoort',
    client: 'Familie De Groot',
    status: 'finishing',
    progress: 90,
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    phase: 'Afwerking',
    alerts: 1,
    documentsCount: 42,
    photosCount: 234
  },
  {
    id: '4',
    name: 'Modern Cube',
    address: 'Kavel 5, Nieuw West, Amsterdam',
    client: 'Familie Bakker',
    status: 'handover',
    progress: 98,
    startDate: '2024-09-01',
    endDate: '2026-01-30',
    phase: 'Oplevering',
    alerts: 0,
    documentsCount: 56,
    photosCount: 312
  },
]

const STATS = [
  { label: 'ACTIEVE PROJECTEN', value: 4, icon: Building2, color: 'bg-[#93b9e6]' },
  { label: 'GEVERIFIEERD', value: 130, icon: Shield, color: 'bg-emerald-500' },
  { label: 'FOTO\'S', value: 714, icon: Camera, color: 'bg-slate-900' },
  { label: 'MIJLPALEN', value: 28, icon: Target, color: 'bg-amber-500' },
]

export default function BuilderDashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 lg:px-8 h-20">
          <div className="flex items-center gap-4">
            <Logo size="md" href="/builder/dashboard" />
            <div className="hidden sm:block px-3 py-1 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider">
              Builder
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-slate-100 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500" />
            </button>
            <button className="p-2.5 hover:bg-slate-100 transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-px h-8 bg-slate-200" />
            <button className="flex items-center gap-3 p-2 hover:bg-slate-100 transition-colors">
              <div className="w-9 h-9 bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                HE
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold text-slate-900">Helder Engineering</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Bouwbedrijf</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden lg:block" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-slate-900 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-2">
                BUILDER DASHBOARD
              </h1>
              <p className="text-white/50">
                U heeft 4 actieve projecten met 3 openstaande acties.
              </p>
            </div>
            <button className="group flex items-center gap-2 px-6 py-4 bg-[#93b9e6] text-slate-900 font-black uppercase tracking-wider text-sm hover:bg-white transition-colors">
              <Plus className="w-5 h-5" />
              <span>Nieuw project</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 hover:bg-slate-50 transition-colors"
            >
              <div className={`w-12 h-12 ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Projecten</h2>
            
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Zoek project of klant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-64 pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-[#93b9e6] outline-none transition-all font-medium"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-200 focus:border-[#93b9e6] outline-none transition-all font-bold text-sm uppercase tracking-wider"
              >
                <option value="all">Alle statussen</option>
                <option value="planning">Planning</option>
                <option value="construction">Bouw</option>
                <option value="finishing">Afwerking</option>
                <option value="handover">Oplevering</option>
              </select>

              {/* View toggle */}
              <div className="flex bg-white border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all ${
                    viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all ${
                    viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200">
              {filteredProjects.map((project, index) => (
                <ProjectRow key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {[
            { label: 'Upload documenten', icon: FileText },
            { label: 'Foto\'s toevoegen', icon: Camera },
            { label: 'Mijlpaal markeren', icon: Target },
            { label: 'Rapport genereren', icon: BarChart3 },
          ].map((action) => (
            <button
              key={action.label}
              className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-left"
            >
              <div className="w-10 h-10 bg-slate-100 flex items-center justify-center group-hover:bg-[#93b9e6] transition-colors">
                <action.icon className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
              </div>
              <span className="font-bold text-slate-900 text-sm uppercase tracking-wider">{action.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = () => {
    switch (project.status) {
      case 'planning': return 'bg-blue-500'
      case 'construction': return 'bg-amber-500'
      case 'finishing': return 'bg-violet-500'
      case 'handover': return 'bg-emerald-500'
      case 'completed': return 'bg-slate-400'
    }
  }

  const getStatusLabel = () => {
    switch (project.status) {
      case 'planning': return 'Planning'
      case 'construction': return 'In bouw'
      case 'finishing': return 'Afwerking'
      case 'handover': return 'Oplevering'
      case 'completed': return 'Voltooid'
    }
  }

  return (
    <div className="group bg-white border border-slate-200 p-6 hover:bg-slate-50 transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-wider group-hover:text-[#93b9e6] transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4" />
            {project.address}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-black text-white uppercase tracking-wider ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Client */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-slate-100 flex items-center justify-center">
          <Users className="w-4 h-4 text-slate-500" />
        </div>
        <span className="text-sm text-slate-600 font-medium">{project.client}</span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500 text-xs uppercase tracking-wider">{project.phase}</span>
          <span className="font-black text-slate-900">{project.progress}%</span>
        </div>
        <div className="h-1 bg-slate-200 overflow-hidden">
          <div 
            className={`h-full transition-all ${getStatusColor()}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            {project.documentsCount}
          </span>
          <span className="flex items-center gap-1.5">
            <Camera className="w-4 h-4" />
            {project.photosCount}
          </span>
        </div>
        {project.alerts > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-black">{project.alerts}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const getStatusColor = () => {
    switch (project.status) {
      case 'planning': return 'bg-blue-500'
      case 'construction': return 'bg-amber-500'
      case 'finishing': return 'bg-violet-500'
      case 'handover': return 'bg-emerald-500'
      case 'completed': return 'bg-slate-400'
    }
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
        index > 0 ? 'border-t border-slate-100' : ''
      }`}
    >
      <div className={`w-1 h-12 ${getStatusColor()}`} />

      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-900 uppercase tracking-wider text-sm">{project.name}</p>
        <p className="text-sm text-slate-500">{project.client}</p>
      </div>

      <div className="hidden md:block text-sm text-slate-500 w-48 uppercase tracking-wider">
        {project.phase}
      </div>

      <div className="w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-200 overflow-hidden">
            <div
              className={`h-full ${getStatusColor()}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-black text-slate-900 w-10 text-right">{project.progress}%</span>
        </div>
      </div>

      {project.alerts > 0 && (
        <div className="w-10 flex items-center justify-center">
          <div className="w-6 h-6 bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
        </div>
      )}

      <ChevronRight className="w-5 h-5 text-slate-400" />
    </div>
  )
}
