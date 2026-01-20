'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/logo'
import { 
  Building2, Plus, Search, Filter, LayoutGrid, List as ListIcon,
  MapPin, Calendar, Users, ArrowRight, CheckCircle2, Clock,
  AlertTriangle, TrendingUp, FileText, Camera, ChevronRight,
  Home, Package, Shield, Zap, Settings, Bell, User,
  BarChart3, PieChart, Target, Hammer
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
  { label: 'Actieve projecten', value: 4, icon: Building2, trend: '+2 deze maand', color: 'blue' },
  { label: 'Documenten geverifieerd', value: 130, icon: Shield, trend: '98% compliant', color: 'emerald' },
  { label: 'Foto\'s geüpload', value: 714, icon: Camera, trend: '+48 deze week', color: 'violet' },
  { label: 'Mijlpalen bereikt', value: 28, icon: Target, trend: '4 deze week', color: 'amber' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 lg:px-8 h-20">
          <div className="flex items-center gap-4">
            <Link href="/builder/dashboard" className="flex items-center gap-3">
              <Logo size="md" href="/builder/dashboard" showSubtitle subtitle="Builder" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-px h-8 bg-slate-200" />
            <button className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-medium text-sm">
                HE
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-[#1a1a2e]">Helder Engineering</p>
                <p className="text-xs text-slate-500">Bouwbedrijf</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden lg:block" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Goedemiddag, Helder Engineering 👋
              </h1>
              <p className="text-white/70 max-w-lg">
                U heeft 4 actieve projecten met 3 openstaande acties. Villa Zonneweide 
                nadert een belangrijke mijlpaal.
              </p>
            </div>
            <button className="group flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a2e] font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              <span>Nieuw project</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'violet' ? 'bg-violet-50 text-violet-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#1a1a2e] mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
              <p className={`text-xs font-medium ${
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'emerald' ? 'text-emerald-600' :
                stat.color === 'violet' ? 'text-violet-600' :
                'text-amber-600'
              }`}>
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#1a1a2e]">Projecten</h2>
            
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Zoek project of klant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#1a1a2e] focus:ring-4 focus:ring-[#1a1a2e]/5 outline-none transition-all"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#1a1a2e] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">Alle statussen</option>
                <option value="planning">Planning</option>
                <option value="construction">Bouw</option>
                <option value="finishing">Afwerking</option>
                <option value="handover">Oplevering</option>
              </select>

              {/* View toggle */}
              <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-[#1a1a2e] text-white' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-[#1a1a2e] text-white' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {filteredProjects.map((project, index) => (
                <ProjectRow key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Upload documenten', icon: FileText },
            { label: 'Foto\'s toevoegen', icon: Camera },
            { label: 'Mijlpaal markeren', icon: Target },
            { label: 'Rapport genereren', icon: BarChart3 },
          ].map((action) => (
            <button
              key={action.label}
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <action.icon className="w-5 h-5 text-slate-600" />
              </div>
              <span className="font-medium text-[#1a1a2e]">{action.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </button>
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const getStatusColor = () => {
    switch (project.status) {
      case 'planning': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'construction': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'finishing': return 'bg-violet-50 text-violet-700 border-violet-200'
      case 'handover': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'completed': return 'bg-slate-50 text-slate-700 border-slate-200'
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
    <div
      className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-[#1a1a2e] group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4" />
            {project.address}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Client */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
          <Users className="w-4 h-4 text-slate-500" />
        </div>
        <span className="text-sm text-slate-600">{project.client}</span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500">{project.phase}</span>
          <span className="font-bold text-[#1a1a2e]">{project.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              project.progress >= 90 ? 'bg-emerald-500' :
              project.progress >= 50 ? 'bg-blue-500' :
              'bg-amber-500'
            }`}
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
            <span className="text-sm font-medium">{project.alerts}</span>
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
      className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <div className={`w-2 h-12 rounded-full ${getStatusColor()}`} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1a1a2e]">{project.name}</p>
        <p className="text-sm text-slate-500">{project.client}</p>
      </div>

      <div className="hidden md:block text-sm text-slate-500 w-48">
        {project.phase}
      </div>

      <div className="w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getStatusColor()}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[#1a1a2e] w-10 text-right">{project.progress}%</span>
        </div>
      </div>

      {project.alerts > 0 && (
        <div className="w-10 flex items-center justify-center">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
        </div>
      )}

      <ChevronRight className="w-5 h-5 text-slate-400" />
    </div>
  )
}
