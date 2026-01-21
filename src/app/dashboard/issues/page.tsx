'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle, AlertCircle, CheckCircle, Clock, Filter,
  ChevronDown, Eye, User, Calendar, Image as ImageIcon,
  Plus, X, MoreVertical, ArrowRight, Shield, Wrench,
  XCircle, Check, RefreshCw, AtSign
} from 'lucide-react'

interface TeamMemberMention {
  id: string
  name: string
  role: string | null
}

interface Mention {
  id: string
  teamMember: TeamMemberMention
  notified: boolean
  notifiedAt: string | null
}

interface Issue {
  id: string
  projectId: string
  documentId: string | null
  title: string
  description: string | null
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'dismissed'
  assignedTo: string | null
  phase: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  document: {
    id: string
    name: string
    fileUrl: string
    mimeType: string
  } | null
  project: {
    id: string
    name: string
  }
  mentions?: Mention[]
}

interface IssueStats {
  total: number
  open: number
  resolved: number
  critical: number
}

const SEVERITY_CONFIG = {
  low: {
    label: 'Laag',
    color: 'bg-slate-500',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    icon: AlertCircle,
  },
  medium: {
    label: 'Gemiddeld',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: AlertCircle,
  },
  high: {
    label: 'Hoog',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Kritiek',
    color: 'bg-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: AlertTriangle,
  },
}

const STATUS_CONFIG = {
  open: {
    label: 'Open',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: AlertCircle,
  },
  in_progress: {
    label: 'In behandeling',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: Clock,
  },
  resolved: {
    label: 'Opgelost',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    icon: CheckCircle,
  },
  dismissed: {
    label: 'Afgewezen',
    color: 'bg-slate-400',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-600',
    icon: XCircle,
  },
}

const PHASE_OPTIONS = [
  { value: 'all', label: 'Alle fases' },
  { value: 'GRONDWERK', label: 'Grondwerk' },
  { value: 'RUWBOUW', label: 'Ruwbouw' },
  { value: 'DAK_GEVEL', label: 'Dak & Gevel' },
  { value: 'INSTALLATIES', label: 'Installaties' },
  { value: 'AFBOUW', label: 'Afbouw' },
  { value: 'OPLEVERING', label: 'Oplevering' },
]

// Mock project ID for demo - in production this would come from context/params
const DEMO_PROJECT_ID = 'demo-project-1'

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [stats, setStats] = useState<IssueStats>({ total: 0, open: 0, resolved: 0, critical: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [phaseFilter, setPhaseFilter] = useState<string>('all')

  // Modal state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch issues
  const fetchIssues = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        projectId: DEMO_PROJECT_ID,
      })
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (severityFilter !== 'all') params.append('severity', severityFilter)
      if (phaseFilter !== 'all') params.append('phase', phaseFilter)

      const res = await fetch(`/api/issues?${params}`)
      if (!res.ok) throw new Error('Failed to fetch issues')

      const data = await res.json()
      setIssues(data.issues)
      setStats(data.stats)
      setError(null)
    } catch (err) {
      console.error('Error fetching issues:', err)
      setError('Kon problemen niet laden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [statusFilter, severityFilter, phaseFilter])

  // Update issue status
  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update issue')

      // Refresh the list
      fetchIssues()
      setSelectedIssue(null)
    } catch (err) {
      console.error('Error updating issue:', err)
    }
  }

  // Update issue severity
  const updateIssueSeverity = async (issueId: string, newSeverity: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ severity: newSeverity }),
      })
      if (!res.ok) throw new Error('Failed to update severity')

      fetchIssues()
    } catch (err) {
      console.error('Error updating severity:', err)
    }
  }

  // Assign issue
  const assignIssue = async (issueId: string, assignedTo: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo }),
      })
      if (!res.ok) throw new Error('Failed to assign issue')

      fetchIssues()
    } catch (err) {
      console.error('Error assigning issue:', err)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-red-500" />
              <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">KWALITEIT</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Problemen
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Door AI gedetecteerde issues uit bouwfoto&apos;s
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[#93b9e6] hover:text-slate-900 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>PROBLEEM MELDEN</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOTAAL</p>
                <p className="text-2xl font-black text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">OPEN</p>
                <p className="text-2xl font-black text-blue-600">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">OPGELOST</p>
                <p className="text-2xl font-black text-emerald-600">{stats.resolved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">KRITIEK</p>
                <p className="text-2xl font-black text-red-600">{stats.critical}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-px bg-slate-200">
          {/* Status filter */}
          <div className="relative bg-white flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full px-4 py-4 pr-10 bg-white border-2 border-transparent focus:border-slate-900 outline-none cursor-pointer text-sm font-bold uppercase tracking-wider"
            >
              <option value="all">Alle statussen</option>
              <option value="open">Open</option>
              <option value="in_progress">In behandeling</option>
              <option value="resolved">Opgelost</option>
              <option value="dismissed">Afgewezen</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          {/* Severity filter */}
          <div className="relative bg-white flex-1">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="appearance-none w-full px-4 py-4 pr-10 bg-white border-2 border-transparent focus:border-slate-900 outline-none cursor-pointer text-sm font-bold uppercase tracking-wider"
            >
              <option value="all">Alle prioriteiten</option>
              <option value="critical">Kritiek</option>
              <option value="high">Hoog</option>
              <option value="medium">Gemiddeld</option>
              <option value="low">Laag</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          {/* Phase filter */}
          <div className="relative bg-white flex-1">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="appearance-none w-full px-4 py-4 pr-10 bg-white border-2 border-transparent focus:border-slate-900 outline-none cursor-pointer text-sm font-bold uppercase tracking-wider"
            >
              {PHASE_OPTIONS.map((phase) => (
                <option key={phase.value} value={phase.value}>
                  {phase.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchIssues}
            className="p-4 bg-white hover:bg-slate-50 transition-colors"
            title="Vernieuwen"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-[#93b9e6] mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Laden...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-bold">{error}</p>
            <button
              onClick={fetchIssues}
              className="mt-4 px-6 py-2 bg-slate-900 text-white font-bold uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
              Geen problemen gevonden
            </h3>
            <p className="text-slate-500 mb-6">
              {statusFilter !== 'all' || severityFilter !== 'all' || phaseFilter !== 'all'
                ? 'Probeer andere filters'
                : 'Er zijn nog geen problemen gedetecteerd'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => setSelectedIssue(issue)}
                onStatusChange={(status) => updateIssueStatus(issue.id, status)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onStatusChange={(status) => updateIssueStatus(selectedIssue.id, status)}
          onSeverityChange={(severity) => updateIssueSeverity(selectedIssue.id, severity)}
          onAssign={(assignedTo) => assignIssue(selectedIssue.id, assignedTo)}
        />
      )}

      {/* Create Issue Modal */}
      {showCreateModal && (
        <CreateIssueModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            fetchIssues()
          }}
        />
      )}
    </div>
  )
}

function IssueCard({
  issue,
  onClick,
  onStatusChange,
}: {
  issue: Issue
  onClick: () => void
  onStatusChange: (status: string) => void
}) {
  const severityConfig = SEVERITY_CONFIG[issue.severity]
  const statusConfig = STATUS_CONFIG[issue.status]
  const SeverityIcon = severityConfig.icon

  return (
    <div
      className="group bg-white border border-slate-200 hover:border-slate-900 transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="flex">
        {/* Severity indicator */}
        <div className={`w-2 ${severityConfig.color}`} />

        {/* Thumbnail */}
        {issue.document && (
          <div className="w-32 h-32 bg-slate-100 flex-shrink-0 overflow-hidden">
            <img
              src={`/api/media/${issue.document.id}`}
              alt={issue.document.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide line-clamp-2 mb-2">
                {issue.title}
              </h3>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {/* Status badge */}
                <div className={`flex items-center gap-1.5 px-2 py-1 ${statusConfig.bgColor}`}>
                  <statusConfig.icon className={`w-3.5 h-3.5 ${statusConfig.textColor}`} />
                  <span className={`text-[10px] font-black uppercase tracking-wider ${statusConfig.textColor}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Severity badge */}
                <div className={`flex items-center gap-1.5 px-2 py-1 ${severityConfig.bgColor}`}>
                  <SeverityIcon className={`w-3.5 h-3.5 ${severityConfig.textColor}`} />
                  <span className={`text-[10px] font-black uppercase tracking-wider ${severityConfig.textColor}`}>
                    {severityConfig.label}
                  </span>
                </div>

                {/* Phase badge */}
                {issue.phase && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#93b9e6]/20">
                    <Wrench className="w-3.5 h-3.5 text-[#5a8fd4]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#5a8fd4]">
                      {PHASE_OPTIONS.find(p => p.value === issue.phase)?.label || issue.phase}
                    </span>
                  </div>
                )}

                {/* Mention chips */}
                {issue.mentions && issue.mentions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-slate-400" />
                    {issue.mentions.slice(0, 3).map((mention) => (
                      <span
                        key={mention.id}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider"
                        title={mention.teamMember.role || ''}
                      >
                        {mention.teamMember.name.split(' ')[0]}
                      </span>
                    ))}
                    {issue.mentions.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold">
                        +{issue.mentions.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(issue.createdAt).toLocaleDateString('nl-NL')}</span>
                </div>
                {issue.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{issue.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {issue.status !== 'resolved' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange('resolved')
                  }}
                  className="p-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  title="Markeer als opgelost"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
                className="p-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                title="Details bekijken"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function IssueDetailModal({
  issue,
  onClose,
  onStatusChange,
  onSeverityChange,
  onAssign,
}: {
  issue: Issue
  onClose: () => void
  onStatusChange: (status: string) => void
  onSeverityChange: (severity: string) => void
  onAssign: (assignedTo: string) => void
}) {
  const [assignInput, setAssignInput] = useState(issue.assignedTo || '')
  const severityConfig = SEVERITY_CONFIG[issue.severity]
  const statusConfig = STATUS_CONFIG[issue.status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 ${severityConfig.color}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${severityConfig.textColor}`}>
                {severityConfig.label} PRIORITEIT
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg uppercase tracking-wide">
              {issue.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Photo preview */}
          {issue.document && (
            <div className="bg-slate-100 overflow-hidden">
              <img
                src={`/api/media/${issue.document.id}`}
                alt={issue.document.name}
                className="w-full max-h-64 object-contain"
              />
              <div className="p-3 bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">{issue.document.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {issue.description && (
            <div className="bg-slate-50 p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">BESCHRIJVING</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{issue.description}</p>
            </div>
          )}

          {/* Status and Severity selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">STATUS</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => onStatusChange(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 transition-all ${
                      issue.status === key
                        ? `${config.color} text-white`
                        : `${config.bgColor} ${config.textColor} hover:opacity-80`
                    }`}
                  >
                    <config.icon className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">PRIORITEIT</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => onSeverityChange(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 transition-all ${
                      issue.severity === key
                        ? `${config.color} text-white`
                        : `${config.bgColor} ${config.textColor} hover:opacity-80`
                    }`}
                  >
                    <config.icon className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">TOEGEWEZEN AAN</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={assignInput}
                onChange={(e) => setAssignInput(e.target.value)}
                placeholder="Naam van aannemer..."
                className="flex-1 px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium"
              />
              <button
                onClick={() => onAssign(assignInput)}
                className="px-4 py-3 bg-slate-900 text-white font-black uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors"
              >
                TOEWIJZEN
              </button>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">AANGEMAAKT</p>
              <p className="font-bold text-slate-900">
                {new Date(issue.createdAt).toLocaleString('nl-NL')}
              </p>
            </div>
            {issue.resolvedAt && (
              <div className="bg-emerald-50 p-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">OPGELOST</p>
                <p className="font-bold text-emerald-900">
                  {new Date(issue.resolvedAt).toLocaleString('nl-NL')}
                </p>
              </div>
            )}
            {issue.phase && (
              <div className="bg-[#93b9e6]/10 p-4">
                <p className="text-[10px] font-black text-[#5a8fd4] uppercase tracking-wider mb-1">BOUWFASE</p>
                <p className="font-bold text-slate-900">
                  {PHASE_OPTIONS.find(p => p.value === issue.phase)?.label || issue.phase}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig.color} text-white`}>
              <statusConfig.icon className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">{statusConfig.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {issue.status !== 'resolved' && (
              <button
                onClick={() => onStatusChange('resolved')}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white font-black uppercase tracking-wider text-xs hover:bg-emerald-600 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Markeer opgelost
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider text-xs hover:bg-white transition-all"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateIssueModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [phase, setPhase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Titel is verplicht')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: DEMO_PROJECT_ID,
          title: title.trim(),
          description: description.trim() || null,
          severity,
          phase: phase || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to create issue')

      onCreated()
    } catch (err) {
      console.error('Error creating issue:', err)
      setError('Kon probleem niet aanmaken')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider mb-2">
          Probleem melden
        </h2>
        <p className="text-slate-500 mb-6">Voeg handmatig een nieuw probleem toe</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Titel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Beschrijf het probleem kort..."
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Beschrijving
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Geef meer details over het probleem..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium resize-none transition-all"
            />
          </div>

          {/* Severity & Phase */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                Prioriteit
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                <option value="low">Laag</option>
                <option value="medium">Gemiddeld</option>
                <option value="high">Hoog</option>
                <option value="critical">Kritiek</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                Bouwfase
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                <option value="">Selecteer fase...</option>
                {PHASE_OPTIONS.filter(p => p.value !== 'all').map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 py-3 px-6 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Bezig...' : 'Aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
