'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import {
  Building2, Plus, Search, LayoutGrid, List as ListIcon,
  MapPin, ArrowRight, Clock,
  AlertTriangle, FileText, Camera, ChevronRight,
  Shield, Settings, Bell, Target, BarChart3,
  MessageCircle, Phone, Check, Loader2, X,
  TrendingUp, CheckCircle2, AlertCircle, Image as ImageIcon,
  Zap, Eye, ExternalLink
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface DashboardStats {
  activeProjects: number
  photosThisWeek: number
  avgQualityScore: number | null
  openIssues: number
}

interface ProjectOverview {
  id: string
  name: string
  address: string
  client: string
  phase: string
  photoCount: number
  qualityScore: number | null
  issueCount: number
  statusIndicator: 'on-track' | 'attention-needed' | 'issues'
  progress: number
  status: 'planning' | 'construction' | 'finishing' | 'handover' | 'completed'
  hasWhatsApp: boolean
}

interface ActivityItem {
  type: 'photo' | 'issue' | 'phase_change'
  timestamp: string
  projectId?: string
  projectName?: string
  name?: string
  documentId?: string
  fileUrl?: string
  issue?: string
  eventType?: string
  title?: string
}

interface RecentIssue {
  projectId: string
  projectName: string
  issue: string
  documentId: string
  createdAt: string
}

interface WhatsAppNumber {
  id: string
  phoneNumber: string
  verified: boolean
}

interface LegacyProject {
  id: string
  name: string
  address: string
  client: string
  status: 'planning' | 'construction' | 'finishing' | 'handover' | 'completed'
  progress: number
  startDate: string | null
  endDate: string | null
  phase: string
  alerts: number
  documentsCount: number
  photosCount: number
  messagesCount: number
  whatsappNumbers: WhatsAppNumber[]
}

// ============================================
// Main Component
// ============================================

export default function BuilderDashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Dashboard data state
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    photosThisWeek: 0,
    avgQualityScore: null,
    openIssues: 0,
  })
  const [projects, setProjects] = useState<ProjectOverview[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([])
  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // WhatsApp linking modal state
  const [linkingModal, setLinkingModal] = useState<{ open: boolean; projectId: string | null }>({
    open: false,
    projectId: null,
  })
  const [linkingPhone, setLinkingPhone] = useState('')
  const [linkingStep, setLinkingStep] = useState<'phone' | 'verify'>('phone')
  const [linkingLoading, setLinkingLoading] = useState(false)
  const [whatsappNumberId, setWhatsappNumberId] = useState<string | null>(null)

  // Issues modal state
  const [showIssuesModal, setShowIssuesModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      setError(null)

      // Try new dashboard API first
      const dashboardResponse = await fetch('/api/builder/dashboard')

      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json()
        setStats(data.stats)
        setProjects(data.projects)
        setActivityFeed(data.activityFeed || [])
        setRecentIssues(data.recentIssues || [])
      } else {
        // Fallback to legacy projects API with sample data overlay
        const legacyResponse = await fetch('/api/builder/projects')
        if (legacyResponse.ok) {
          const data = await legacyResponse.json()
          // Transform legacy data
          const transformedProjects: ProjectOverview[] = data.projects.map((p: LegacyProject) => ({
            id: p.id,
            name: p.name,
            address: p.address,
            client: p.client,
            phase: p.phase,
            photoCount: p.photosCount,
            qualityScore: Math.floor(Math.random() * 30) + 70, // Sample score
            issueCount: p.alerts,
            statusIndicator: p.alerts > 3 ? 'issues' : p.alerts > 0 ? 'attention-needed' : 'on-track',
            progress: p.progress,
            status: p.status,
            hasWhatsApp: p.whatsappNumbers.some(n => n.verified),
          }))
          setProjects(transformedProjects)
          setStats({
            activeProjects: data.stats.activeProjects,
            photosThisWeek: data.stats.photos,
            avgQualityScore: 85, // Sample
            openIssues: transformedProjects.reduce((acc: number, p: ProjectOverview) => acc + p.issueCount, 0),
          })
        } else {
          // Use sample data for demo
          loadSampleData()
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      // Load sample data for demo
      loadSampleData()
    } finally {
      setLoading(false)
    }
  }

  function loadSampleData() {
    // Sample data for demonstration
    const sampleProjects: ProjectOverview[] = [
      {
        id: 'proj-1',
        name: 'Zonneweide 42',
        address: 'Zonneweide 42, Amsterdam',
        client: 'Familie de Vries',
        phase: 'Gevel & Dak',
        photoCount: 156,
        qualityScore: 92,
        issueCount: 0,
        statusIndicator: 'on-track',
        progress: 65,
        status: 'construction',
        hasWhatsApp: true,
      },
      {
        id: 'proj-2',
        name: 'Kavel 15 Parkwijk',
        address: 'Kavel 15, Parkwijk, Utrecht',
        client: 'J. Bakker',
        phase: 'Installaties',
        photoCount: 89,
        qualityScore: 78,
        issueCount: 3,
        statusIndicator: 'attention-needed',
        progress: 45,
        status: 'construction',
        hasWhatsApp: true,
      },
      {
        id: 'proj-3',
        name: 'Duinzicht 8',
        address: 'Duinzicht 8, Den Haag',
        client: 'M. Janssen',
        phase: 'Ruwbouw',
        photoCount: 234,
        qualityScore: 56,
        issueCount: 7,
        statusIndicator: 'issues',
        progress: 30,
        status: 'construction',
        hasWhatsApp: false,
      },
      {
        id: 'proj-4',
        name: 'Waterfront 22',
        address: 'Waterfront 22, Rotterdam',
        client: 'K. van der Berg',
        phase: 'Oplevering',
        photoCount: 312,
        qualityScore: 95,
        issueCount: 0,
        statusIndicator: 'on-track',
        progress: 98,
        status: 'handover',
        hasWhatsApp: true,
      },
      {
        id: 'proj-5',
        name: 'Bosrand 5',
        address: 'Bosrand 5, Eindhoven',
        client: 'P. Smit',
        phase: 'Planning',
        photoCount: 12,
        qualityScore: null,
        issueCount: 0,
        statusIndicator: 'on-track',
        progress: 5,
        status: 'planning',
        hasWhatsApp: false,
      },
    ]

    const sampleActivity: ActivityItem[] = [
      { type: 'photo', timestamp: new Date().toISOString(), projectId: 'proj-1', projectName: 'Zonneweide 42', name: 'Dakconstructie detail', documentId: 'doc-1' },
      { type: 'issue', timestamp: new Date(Date.now() - 3600000).toISOString(), projectId: 'proj-3', projectName: 'Duinzicht 8', issue: 'Vochtschade gedetecteerd in metselwerk' },
      { type: 'phase_change', timestamp: new Date(Date.now() - 7200000).toISOString(), projectId: 'proj-4', projectName: 'Waterfront 22', eventType: 'FINAL_INSPECTION', title: 'Eindkeuring gepland' },
      { type: 'photo', timestamp: new Date(Date.now() - 10800000).toISOString(), projectId: 'proj-2', projectName: 'Kavel 15 Parkwijk', name: 'Elektra installatie', documentId: 'doc-2' },
      { type: 'issue', timestamp: new Date(Date.now() - 14400000).toISOString(), projectId: 'proj-2', projectName: 'Kavel 15 Parkwijk', issue: 'Kabelgoot niet conform tekening' },
    ]

    const sampleIssues: RecentIssue[] = [
      { projectId: 'proj-3', projectName: 'Duinzicht 8', issue: 'Vochtschade gedetecteerd in metselwerk', documentId: 'doc-3', createdAt: new Date().toISOString() },
      { projectId: 'proj-3', projectName: 'Duinzicht 8', issue: 'Isolatie niet correct aangebracht', documentId: 'doc-4', createdAt: new Date().toISOString() },
      { projectId: 'proj-2', projectName: 'Kavel 15 Parkwijk', issue: 'Kabelgoot niet conform tekening', documentId: 'doc-5', createdAt: new Date().toISOString() },
      { projectId: 'proj-3', projectName: 'Duinzicht 8', issue: 'Afwijking in betonkwaliteit', documentId: 'doc-6', createdAt: new Date().toISOString() },
    ]

    setProjects(sampleProjects)
    setStats({
      activeProjects: 4,
      photosThisWeek: 47,
      avgQualityScore: 82,
      openIssues: 10,
    })
    setActivityFeed(sampleActivity)
    setRecentIssues(sampleIssues)
  }

  async function handleLinkWhatsApp() {
    if (!linkingModal.projectId || !linkingPhone) return

    setLinkingLoading(true)
    try {
      const response = await fetch('/api/whatsapp/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: linkingPhone,
          companyId: 'current',
          projectId: linkingModal.projectId,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification')
      }

      setWhatsappNumberId(data.whatsappNumberId)
      setLinkingStep('verify')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to link')
    } finally {
      setLinkingLoading(false)
    }
  }

  async function handleVerifyCode() {
    setLinkingLoading(true)
    const checkVerification = async () => {
      const response = await fetch(`/api/whatsapp/link?companyId=current`)
      const data = await response.json()
      const number = data.numbers?.find((n: WhatsAppNumber) => n.id === whatsappNumberId)
      if (number?.verified) {
        closeLinkingModal()
        fetchDashboardData()
        return true
      }
      return false
    }

    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 2000))
      if (await checkVerification()) return
    }

    setLinkingLoading(false)
    alert('Verificatie niet ontvangen. Probeer opnieuw.')
  }

  function closeLinkingModal() {
    setLinkingModal({ open: false, projectId: null })
    setLinkingPhone('')
    setLinkingStep('phone')
    setWhatsappNumberId(null)
    setLinkingLoading(false)
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase())
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
              {stats.openIssues > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500" />
              )}
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

      <div className="p-6 lg:p-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-slate-900 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-2">
                Builder Dashboard
              </h1>
              <p className="text-white/50">
                Overzicht van al uw projecten en recente activiteit.
              </p>
            </div>
            <button className="group flex items-center gap-2 px-6 py-4 bg-[#93b9e6] text-slate-900 font-black uppercase tracking-wider text-sm hover:bg-white transition-colors">
              <Plus className="w-5 h-5" />
              <span>Nieuw project</span>
            </button>
          </div>
        </div>

        {/* Aggregated Stats Bar */}
        <div data-tour="builder-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          <StatsCard
            label="Actieve Projecten"
            value={stats.activeProjects}
            icon={Building2}
            color="bg-[#93b9e6]"
          />
          <StatsCard
            label="Foto's deze week"
            value={stats.photosThisWeek}
            icon={Camera}
            color="bg-slate-900"
          />
          <StatsCard
            label="Gem. Kwaliteitsscore"
            value={stats.avgQualityScore !== null ? `${stats.avgQualityScore}%` : '-'}
            icon={Shield}
            color="bg-emerald-500"
            trend={stats.avgQualityScore && stats.avgQualityScore >= 80 ? 'up' : undefined}
          />
          <StatsCard
            label="Open Aandachtspunten"
            value={stats.openIssues}
            icon={AlertTriangle}
            color={stats.openIssues > 5 ? 'bg-red-500' : stats.openIssues > 0 ? 'bg-amber-500' : 'bg-emerald-500'}
            onClick={() => stats.openIssues > 0 && setShowIssuesModal(true)}
            clickable={stats.openIssues > 0}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section - 2 columns */}
          <div data-tour="builder-projects" className="lg:col-span-2 space-y-4">
            {/* Projects Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Projecten</h2>

              <div className="flex flex-col lg:flex-row gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Zoek project..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full lg:w-56 pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-[#93b9e6] outline-none transition-all font-medium"
                  />
                </div>

                {/* Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
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

            {/* Projects List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">{error}</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-slate-500">Geen projecten gevonden</div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onLinkWhatsApp={() => setLinkingModal({ open: true, projectId: project.id })}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200">
                {filteredProjects.map((project, index) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    index={index}
                    onLinkWhatsApp={() => setLinkingModal({ open: true, projectId: project.id })}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Activity Feed */}
          <div data-tour="builder-activity" className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">
                  Recente Activiteit
                </h3>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {activityFeed.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    Geen recente activiteit
                  </div>
                ) : (
                  activityFeed.slice(0, 8).map((item, index) => (
                    <ActivityItem key={index} item={item} />
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">
                  Snelle Acties
                </h3>
              </div>
              <div className="p-2">
                <QuickAction
                  label="Bekijk alle aandachtspunten"
                  icon={AlertTriangle}
                  onClick={() => setShowIssuesModal(true)}
                  badge={stats.openIssues > 0 ? stats.openIssues : undefined}
                />
                <QuickAction label="Genereer rapport" icon={BarChart3} />
                <QuickAction label="Upload documenten" icon={FileText} />
                <QuickAction label="Markeer mijlpaal" icon={Target} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Linking Modal */}
      {linkingModal.open && (
        <Modal onClose={closeLinkingModal}>
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="font-black text-lg uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              WhatsApp Koppelen
            </h3>
            <button onClick={closeLinkingModal} className="p-2 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {linkingStep === 'phone' ? (
              <>
                <p className="text-slate-600 mb-4">
                  Koppel een telefoonnummer om foto&apos;s via WhatsApp direct toe te voegen aan dit project.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Telefoonnummer
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+31 6 12345678"
                        value={linkingPhone}
                        onChange={e => setLinkingPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleLinkWhatsApp}
                    disabled={linkingLoading || !linkingPhone}
                    className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-wider hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {linkingLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        Verstuur verificatiecode
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-slate-600">
                    Een verificatiecode is verzonden naar <strong>{linkingPhone}</strong>.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Open WhatsApp en stuur de code terug om te verifieren.
                  </p>
                </div>
                <button
                  onClick={handleVerifyCode}
                  disabled={linkingLoading}
                  className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {linkingLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Wachten op verificatie...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Ik heb de code verstuurd
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Issues Modal */}
      {showIssuesModal && (
        <Modal onClose={() => setShowIssuesModal(false)} wide>
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="font-black text-lg uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alle Aandachtspunten ({recentIssues.length})
            </h3>
            <button onClick={() => setShowIssuesModal(false)} className="p-2 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {recentIssues.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Geen openstaande aandachtspunten</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentIssues.map((issue, index) => (
                  <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{issue.issue}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{issue.projectName}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-xs text-slate-400">
                            {new Date(issue.createdAt).toLocaleDateString('nl-NL')}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/builder/projects/${issue.projectId}`}
                        className="p-2 hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

// ============================================
// Sub-Components
// ============================================

function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
  clickable,
}: {
  label: string
  value: number | string
  icon: typeof Building2
  color: string
  trend?: 'up' | 'down'
  onClick?: () => void
  clickable?: boolean
}) {
  const Component = clickable ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`bg-white p-6 hover:bg-slate-50 transition-colors text-left ${
        clickable ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`w-12 h-12 ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{label}</p>
    </Component>
  )
}

function ProjectCard({
  project,
  onLinkWhatsApp,
}: {
  project: ProjectOverview
  onLinkWhatsApp: () => void
}) {
  const getStatusColor = () => {
    switch (project.status) {
      case 'planning':
        return 'bg-blue-500'
      case 'construction':
        return 'bg-amber-500'
      case 'finishing':
        return 'bg-violet-500'
      case 'handover':
        return 'bg-emerald-500'
      case 'completed':
        return 'bg-slate-400'
    }
  }

  const getStatusLabel = () => {
    switch (project.status) {
      case 'planning':
        return 'Planning'
      case 'construction':
        return 'In bouw'
      case 'finishing':
        return 'Afwerking'
      case 'handover':
        return 'Oplevering'
      case 'completed':
        return 'Voltooid'
    }
  }

  const getIndicatorColor = () => {
    switch (project.statusIndicator) {
      case 'on-track':
        return 'bg-emerald-500'
      case 'attention-needed':
        return 'bg-amber-500'
      case 'issues':
        return 'bg-red-500'
    }
  }

  return (
    <Link
      href={`/builder/projects/${project.id}`}
      className="group bg-white border border-slate-200 p-6 hover:bg-slate-50 transition-all block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 ${getIndicatorColor()}`} />
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm group-hover:text-[#93b9e6] transition-colors truncate">
              {project.name}
            </h3>
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{project.address}</span>
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-black text-white uppercase tracking-wider flex-shrink-0 ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-50 p-2 text-center">
          <p className="text-lg font-black text-slate-900">{project.photoCount}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Foto&apos;s</p>
        </div>
        <div className="bg-slate-50 p-2 text-center">
          <p className="text-lg font-black text-slate-900">
            {project.qualityScore !== null ? `${project.qualityScore}%` : '-'}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Kwaliteit</p>
        </div>
        <div className={`p-2 text-center ${project.issueCount > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}>
          <p className={`text-lg font-black ${project.issueCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {project.issueCount}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Issues</p>
        </div>
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

      {/* WhatsApp Status */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {project.hasWhatsApp ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">WhatsApp actief</span>
          </div>
        ) : (
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onLinkWhatsApp()
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">+ WhatsApp koppelen</span>
          </button>
        )}
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}

function ProjectRow({
  project,
  index,
  onLinkWhatsApp,
}: {
  project: ProjectOverview
  index: number
  onLinkWhatsApp: () => void
}) {
  const getIndicatorColor = () => {
    switch (project.statusIndicator) {
      case 'on-track':
        return 'bg-emerald-500'
      case 'attention-needed':
        return 'bg-amber-500'
      case 'issues':
        return 'bg-red-500'
    }
  }

  const getStatusColor = () => {
    switch (project.status) {
      case 'planning':
        return 'bg-blue-500'
      case 'construction':
        return 'bg-amber-500'
      case 'finishing':
        return 'bg-violet-500'
      case 'handover':
        return 'bg-emerald-500'
      case 'completed':
        return 'bg-slate-400'
    }
  }

  return (
    <Link
      href={`/builder/projects/${project.id}`}
      className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${
        index > 0 ? 'border-t border-slate-100' : ''
      }`}
    >
      <div className={`w-2 h-12 ${getIndicatorColor()}`} />

      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-900 uppercase tracking-wider text-sm truncate">{project.name}</p>
        <p className="text-sm text-slate-500 truncate">{project.address}</p>
      </div>

      <div className="hidden md:block text-sm text-slate-500 w-32 uppercase tracking-wider">{project.phase}</div>

      <div className="hidden lg:flex items-center gap-4 w-32">
        <div className="text-center">
          <p className="text-sm font-black text-slate-900">{project.photoCount}</p>
          <p className="text-[9px] text-slate-400">FOTO&apos;S</p>
        </div>
        <div className="text-center">
          <p className={`text-sm font-black ${project.issueCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {project.issueCount}
          </p>
          <p className="text-[9px] text-slate-400">ISSUES</p>
        </div>
      </div>

      <div className="w-24">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-200 overflow-hidden">
            <div className={`h-full ${getStatusColor()}`} style={{ width: `${project.progress}%` }} />
          </div>
          <span className="text-sm font-black text-slate-900 w-10 text-right">{project.progress}%</span>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-400" />
    </Link>
  )
}

function ActivityItem({ item }: { item: ActivityItem }) {
  const getIcon = () => {
    switch (item.type) {
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-[#93b9e6]" />
      case 'issue':
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'phase_change':
        return <Zap className="w-4 h-4 text-emerald-500" />
    }
  }

  const getContent = () => {
    switch (item.type) {
      case 'photo':
        return (
          <>
            <p className="text-sm font-medium text-slate-900 truncate">{item.name || 'Nieuwe foto'}</p>
            <p className="text-xs text-slate-500">{item.projectName}</p>
          </>
        )
      case 'issue':
        return (
          <>
            <p className="text-sm font-medium text-amber-700 truncate">{item.issue}</p>
            <p className="text-xs text-slate-500">{item.projectName}</p>
          </>
        )
      case 'phase_change':
        return (
          <>
            <p className="text-sm font-medium text-emerald-700 truncate">{item.title}</p>
            <p className="text-xs text-slate-500">{item.projectName}</p>
          </>
        )
    }
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (diff < 60) return 'Zojuist'
    if (diff < 3600) return `${Math.floor(diff / 60)}m geleden`
    if (diff < 86400) return `${Math.floor(diff / 3600)}u geleden`
    return `${Math.floor(diff / 86400)}d geleden`
  }

  if (item.projectId) {
    return (
      <Link 
        href={`/builder/projects/${item.projectId}`}
        className="flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <div className="w-8 h-8 bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#93b9e6]/20 transition-colors">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          {getContent()}
          <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.timestamp)}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
      </Link>
    )
  }

  return (
    <div 
      className="flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className="w-8 h-8 bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#93b9e6]/20 transition-colors">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        {getContent()}
        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.timestamp)}</p>
      </div>
    </div>
  )
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
  badge,
}: {
  label: string
  icon: typeof FileText
  onClick?: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left group"
    >
      <div className="w-8 h-8 bg-slate-100 flex items-center justify-center group-hover:bg-[#93b9e6] transition-colors">
        <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-900 transition-colors" />
      </div>
      <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-black">{badge}</span>
      )}
      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
    </button>
  )
}

function Modal({
  children,
  onClose,
  wide,
}: {
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`bg-white w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
