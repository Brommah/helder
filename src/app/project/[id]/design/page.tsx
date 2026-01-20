'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowRight, ArrowLeft, Check, Eye, Download, MessageSquare,
  FileText, Layers, Palette, Box, Clock, CheckCircle, Circle,
  ChevronRight, Building2, Shield, AlertCircle, ThumbsUp, ThumbsDown,
  Maximize2, RotateCcw, ZoomIn, Home
} from 'lucide-react'

interface DesignVersion {
  id: string
  version: number
  date: string
  status: 'draft' | 'review' | 'approved' | 'rejected'
  changes: string[]
  comments: number
}

interface MaterialSelection {
  category: string
  selected: string | null
  options: { id: string; name: string; price: string; image?: string }[]
}

const MOCK_VERSIONS: DesignVersion[] = [
  {
    id: 'v3',
    version: 3,
    date: '2026-01-15',
    status: 'review',
    changes: ['Uitbreiding woonkamer', 'Aangepaste daklijnen', 'Extra raam slaapkamer 2'],
    comments: 2,
  },
  {
    id: 'v2',
    version: 2,
    date: '2026-01-08',
    status: 'approved',
    changes: ['Grotere keuken', 'Verplaatste trap'],
    comments: 5,
  },
  {
    id: 'v1',
    version: 1,
    date: '2025-12-20',
    status: 'approved',
    changes: ['Eerste ontwerp'],
    comments: 12,
  },
]

const MOCK_MATERIALS: MaterialSelection[] = [
  {
    category: 'Dakpannen',
    selected: 'monier-antraciet',
    options: [
      { id: 'monier-antraciet', name: 'Monier Antraciet', price: '€45/m²' },
      { id: 'wienerberger-rood', name: 'Wienerberger Rood', price: '€52/m²' },
      { id: 'nelskamp-zwart', name: 'Nelskamp Mat Zwart', price: '€58/m²' },
    ],
  },
  {
    category: 'Kozijnen',
    selected: null,
    options: [
      { id: 'kunststof-wit', name: 'Kunststof Wit', price: '€280/stuk' },
      { id: 'hout-meranti', name: 'Hout Meranti', price: '€420/stuk' },
      { id: 'aluminium-antraciet', name: 'Aluminium Antraciet', price: '€380/stuk' },
    ],
  },
  {
    category: 'Voordeur',
    selected: 'skantrae-modern',
    options: [
      { id: 'skantrae-modern', name: 'Skantrae Modern', price: '€1.850' },
      { id: 'bruynzeel-klassiek', name: 'Bruynzeel Klassiek', price: '€2.100' },
      { id: 'custom', name: 'Maatwerk', price: 'Op aanvraag' },
    ],
  },
]

const PERMIT_STAGES = [
  { id: 'submitted', label: 'Ingediend', date: '2026-01-10', status: 'completed' },
  { id: 'review', label: 'In behandeling', date: '2026-01-15', status: 'current' },
  { id: 'comments', label: 'Gemeente opmerkingen', date: null, status: 'pending' },
  { id: 'approved', label: 'Goedgekeurd', date: null, status: 'pending' },
]

export default function DesignPortalPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'design' | 'materials' | 'permits'>('design')
  const [selectedVersion, setSelectedVersion] = useState(MOCK_VERSIONS[0])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="font-semibold text-[#1a1a2e]">Villa Zonneweide</h1>
                <p className="text-xs text-slate-500">Ontwerpfase</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Bouwfase komt binnenkort beschikbaar')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#1a1a2e] rounded-lg hover:bg-slate-50 transition-all"
              >
                <Building2 className="w-4 h-4" />
                Naar bouw
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'design', label: 'Ontwerp', icon: Layers },
              { id: 'materials', label: 'Materialen', icon: Box },
              { id: 'permits', label: 'Vergunningen', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1a1a2e] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'design' && (
          <DesignTab 
            versions={MOCK_VERSIONS} 
            selectedVersion={selectedVersion}
            onSelectVersion={setSelectedVersion}
          />
        )}
        {activeTab === 'materials' && <MaterialsTab materials={MOCK_MATERIALS} />}
        {activeTab === 'permits' && <PermitsTab stages={PERMIT_STAGES} />}
      </main>
    </div>
  )
}

function DesignTab({ 
  versions, 
  selectedVersion,
  onSelectVersion 
}: { 
  versions: DesignVersion[]
  selectedVersion: DesignVersion
  onSelectVersion: (v: DesignVersion) => void
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Viewer */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1a2e]">
                Versie {selectedVersion.version}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedVersion.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                selectedVersion.status === 'review' ? 'bg-amber-100 text-amber-700' :
                selectedVersion.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {selectedVersion.status === 'approved' ? 'Goedgekeurd' :
                 selectedVersion.status === 'review' ? 'In review' :
                 selectedVersion.status === 'rejected' ? 'Afgewezen' : 'Concept'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ZoomIn className="w-4 h-4 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <RotateCcw className="w-4 h-4 text-slate-600" />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* 3D Viewer Placeholder */}
          <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
            <div className="text-center">
              <Home className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">3D Model Preview</p>
              <p className="text-sm text-slate-300">Villa Zonneweide - v{selectedVersion.version}</p>
            </div>
          </div>

          {/* Changes */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Wijzigingen in deze versie:</p>
            <div className="flex flex-wrap gap-2">
              {selectedVersion.changes.map((change, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700">
                  {change}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Review Actions */}
        {selectedVersion.status === 'review' && (
          <div className="mt-6 bg-amber-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="font-semibold text-amber-800 mb-2">Wacht op uw goedkeuring</h3>
            <p className="text-amber-700 text-sm mb-4">
              Bekijk de wijzigingen en geef uw feedback. Heeft u vragen? Laat een opmerking achter.
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all">
                <ThumbsUp className="w-4 h-4" />
                Goedkeuren
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all">
                <MessageSquare className="w-4 h-4" />
                Opmerking ({selectedVersion.comments})
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all">
                <ThumbsDown className="w-4 h-4" />
                Aanpassingen nodig
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Version History */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1a1a2e] mb-4">Versiegeschiedenis</h3>
          <div className="space-y-3">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => onSelectVersion(version)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedVersion.id === version.id
                    ? 'bg-[#1a1a2e] text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Versie {version.version}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedVersion.id === version.id ? 'bg-white/20 text-white' :
                    version.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    version.status === 'review' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {version.status === 'approved' ? '✓' : version.status === 'review' ? '⏳' : '○'}
                  </span>
                </div>
                <p className={`text-sm ${
                  selectedVersion.id === version.id ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {new Date(version.date).toLocaleDateString('nl-NL', { 
                    day: 'numeric', month: 'short', year: 'numeric' 
                  })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1a1a2e] mb-4">Project overzicht</h3>
          <div className="space-y-3">
            {[
              { label: 'Woonoppervlakte', value: '185 m²' },
              { label: 'Kavelgrootte', value: '450 m²' },
              { label: 'Slaapkamers', value: '4' },
              { label: 'Badkamers', value: '2' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500">{stat.label}</span>
                <span className="font-semibold text-[#1a1a2e]">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MaterialsTab({ materials }: { materials: MaterialSelection[] }) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    materials.forEach(m => {
      if (m.selected) initial[m.category] = m.selected
    })
    return initial
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Materiaalkeuzes</h2>
          <p className="text-slate-600">Selecteer de materialen voor uw woning</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">
            {Object.keys(selected).length} van {materials.length} gekozen
          </span>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${(Object.keys(selected).length / materials.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {materials.map((material) => (
          <div key={material.category} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1a1a2e]">{material.category}</h3>
              {selected[material.category] ? (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <Check className="w-4 h-4" />
                  Gekozen
                </span>
              ) : (
                <span className="text-sm text-amber-600">Keuze nodig</span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {material.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelected(prev => ({ ...prev, [material.category]: option.id }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selected[material.category] === option.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-full h-20 bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                    <Box className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-medium text-[#1a1a2e] mb-1">{option.name}</p>
                  <p className="text-sm text-slate-500">{option.price}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-all">
          Opslaan als concept
        </button>
        <button className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all">
          Keuzes bevestigen
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function PermitsTab({ stages }: { stages: typeof PERMIT_STAGES }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Vergunningstraject</h2>
        <p className="text-slate-600">Volg de status van uw omgevingsvergunning</p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="space-y-0">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex gap-4">
              {/* Icon */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-emerald-500' :
                  stage.status === 'current' ? 'bg-amber-500' :
                  'bg-slate-200'
                }`}>
                  {stage.status === 'completed' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : stage.status === 'current' ? (
                    <Clock className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                {i < stages.length - 1 && (
                  <div className={`w-0.5 h-16 ${
                    stage.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${
                    stage.status === 'pending' ? 'text-slate-400' : 'text-[#1a1a2e]'
                  }`}>
                    {stage.label}
                  </h4>
                  {stage.date && (
                    <span className="text-sm text-slate-500">
                      {new Date(stage.date).toLocaleDateString('nl-NL', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                {stage.status === 'current' && (
                  <p className="text-sm text-amber-600 mt-1">
                    Verwachte doorlooptijd: 6-8 weken
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Ingediende documenten</h3>
        <div className="space-y-3">
          {[
            { name: 'Bouwtekeningen v3.pdf', size: '4.2 MB', date: '10 jan 2026' },
            { name: 'Constructieberekening.pdf', size: '2.8 MB', date: '10 jan 2026' },
            { name: 'EPC berekening.pdf', size: '1.1 MB', date: '10 jan 2026' },
            { name: 'Situatietekening.pdf', size: '856 KB', date: '10 jan 2026' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <FileText className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="font-medium text-[#1a1a2e]">{doc.name}</p>
                <p className="text-xs text-slate-500">{doc.size} • {doc.date}</p>
              </div>
              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
