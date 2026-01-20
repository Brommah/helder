'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Check, X, Camera, MessageSquare, FileText, Clock,
  ChevronRight, Building2, Shield, AlertCircle, CheckCircle,
  Key, Award, Download, Share2, Calendar, Users, Sparkles
} from 'lucide-react'

interface InspectionItem {
  id: string
  room: string
  item: string
  status: 'pending' | 'approved' | 'issue'
  notes?: string
  photo?: boolean
}

interface PunchListItem {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'resolved'
  assignedTo: string
  dueDate: string
}

const MOCK_INSPECTION: InspectionItem[] = [
  { id: '1', room: 'Woonkamer', item: 'Vloer en plinten', status: 'approved' },
  { id: '2', room: 'Woonkamer', item: 'Muren en plafond', status: 'approved' },
  { id: '3', room: 'Woonkamer', item: 'Ramen en kozijnen', status: 'issue', notes: 'Kleine kras linkerkozijn' },
  { id: '4', room: 'Keuken', item: 'Apparatuur werking', status: 'approved' },
  { id: '5', room: 'Keuken', item: 'Wateraansluitingen', status: 'approved' },
  { id: '6', room: 'Badkamer', item: 'Sanitair', status: 'approved' },
  { id: '7', room: 'Badkamer', item: 'Tegels en voegen', status: 'pending' },
  { id: '8', room: 'Slaapkamer 1', item: 'Vloer en plinten', status: 'pending' },
  { id: '9', room: 'Slaapkamer 1', item: 'Inbouwkasten', status: 'pending' },
]

const MOCK_PUNCHLIST: PunchListItem[] = [
  {
    id: '1',
    description: 'Kras in kozijn woonkamer herstellen',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Van Dijk Schilderwerk',
    dueDate: '2026-01-25',
  },
  {
    id: '2',
    description: 'Afstelling voordeur',
    priority: 'low',
    status: 'open',
    assignedTo: 'Timmerwerk De Groot',
    dueDate: '2026-01-28',
  },
]

export default function HandoverPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'inspection' | 'punchlist' | 'ceremony'>('inspection')
  const [inspectionItems, setInspectionItems] = useState(MOCK_INSPECTION)

  const completedCount = inspectionItems.filter(i => i.status !== 'pending').length
  const progress = (completedCount / inspectionItems.length) * 100

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
                <p className="text-xs text-slate-500">Oplevering</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <span className="text-sm text-slate-500">Inspectie voortgang</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'inspection', label: 'Inspectie', icon: CheckCircle },
              { id: 'punchlist', label: 'Opleverpunten', icon: AlertCircle },
              { id: 'ceremony', label: 'Sleuteloverdracht', icon: Key },
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
        {activeTab === 'inspection' && (
          <InspectionTab 
            items={inspectionItems} 
            onUpdateItem={(id, status) => {
              setInspectionItems(prev => 
                prev.map(item => item.id === id ? { ...item, status } : item)
              )
            }}
          />
        )}
        {activeTab === 'punchlist' && <PunchlistTab items={MOCK_PUNCHLIST} />}
        {activeTab === 'ceremony' && <CeremonyTab />}
      </main>
    </div>
  )
}

function InspectionTab({ 
  items, 
  onUpdateItem 
}: { 
  items: InspectionItem[]
  onUpdateItem: (id: string, status: 'pending' | 'approved' | 'issue') => void
}) {
  // Group by room
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.room]) acc[item.room] = []
    acc[item.room].push(item)
    return acc
  }, {} as Record<string, InspectionItem[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Opleverinspectie</h2>
          <p className="text-slate-600">Loop alle ruimtes door en markeer goedkeuringen of problemen</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-slate-600">Goedgekeurd</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-slate-600">Probleem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-300 rounded-full" />
            <span className="text-slate-600">Te doen</span>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([room, roomItems]) => (
        <div key={room} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-[#1a1a2e]">{room}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {roomItems.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-[#1a1a2e]">{item.item}</p>
                  {item.notes && (
                    <p className="text-sm text-amber-600 mt-1">{item.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => onUpdateItem(item.id, 'approved')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        item.status === 'approved'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onUpdateItem(item.id, 'issue')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        item.status === 'issue'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-600'
                      }`}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-all">
          Opslaan als concept
        </button>
        <button className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all">
          Inspectie afronden
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function PunchlistTab({ items }: { items: PunchListItem[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Opleverpunten</h2>
          <p className="text-slate-600">Openstaande punten die opgelost moeten worden</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
            {items.filter(i => i.status === 'open').length} open
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {items.filter(i => i.status === 'in_progress').length} in uitvoering
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority === 'high' ? 'Hoog' :
                       item.priority === 'medium' ? 'Middel' : 'Laag'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.status === 'open' ? 'bg-amber-100 text-amber-700' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.status === 'open' ? 'Open' :
                       item.status === 'in_progress' ? 'In uitvoering' : 'Opgelost'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[#1a1a2e] mb-1">{item.description}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {item.assignedTo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.dueDate).toLocaleDateString('nl-NL', {
                        day: 'numeric', month: 'short'
                      })}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all">
                  Markeer opgelost
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="font-semibold text-[#1a1a2e] mb-2">Geen openstaande punten!</h3>
          <p className="text-slate-600">Alle opleverpunten zijn opgelost.</p>
        </div>
      )}
    </div>
  )
}

function CeremonyTab() {
  const [signed, setSigned] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Key className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Sleuteloverdracht</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Het grote moment is aangebroken! Onderteken de documenten en ontvang 
          uw sleutels én complete Woningpaspoort.
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Voorbereidingen</h3>
        <div className="space-y-3">
          {[
            { label: 'Opleverinspectie afgerond', done: true },
            { label: 'Alle opleverpunten opgelost', done: false },
            { label: 'Eindafrekening betaald', done: true },
            { label: 'Notaris documenten gereed', done: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.done ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
                {item.done ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Clock className="w-4 h-4 text-white" />
                )}
              </div>
              <span className={item.done ? 'text-[#1a1a2e]' : 'text-slate-500'}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Documenten</h3>
        <div className="space-y-3">
          {[
            { name: 'Proces-verbaal van oplevering', ready: true },
            { name: 'Garantiecertificaat', ready: true },
            { name: 'Wkb dossier', ready: true },
            { name: 'Woningpaspoort overdracht', ready: true },
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="flex-1 font-medium text-[#1a1a2e]">{doc.name}</span>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Woningpaspoort Preview */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">Uw Woningpaspoort</span>
            </div>
            <p className="text-slate-300">Het complete DNA van uw nieuwe huis</p>
          </div>
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
            Gereed
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Documenten', value: '156' },
            { label: 'Materialen', value: '847' },
            { label: "Foto's", value: '1.243' },
            { label: 'Garanties', value: '23' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-[#1a1a2e] font-semibold rounded-xl hover:shadow-lg transition-all">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
            <Share2 className="w-4 h-4" />
            Deel toegang
          </button>
        </div>
      </div>

      {/* Sign Button */}
      {!signed ? (
        <button
          onClick={() => setSigned(true)}
          className="w-full py-5 bg-emerald-500 text-white font-semibold rounded-2xl hover:bg-emerald-600 transition-all text-lg"
        >
          Onderteken en ontvang uw sleutels 🔑
        </button>
      ) : (
        <div className="text-center py-8 bg-emerald-50 rounded-2xl border border-emerald-200">
          <Award className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-emerald-700 mb-2">
            Gefeliciteerd! 🎉
          </h3>
          <p className="text-emerald-600 mb-6">
            Uw droomhuis is officieel van u. Welkom thuis!
          </p>
          <Link
            href={`/home/${1}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all"
          >
            Naar uw Woningpaspoort
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
