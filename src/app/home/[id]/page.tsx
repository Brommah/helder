'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { 
  Shield, FileText, Wrench, Calendar, Bell, Share2,
  ChevronRight, Download, Lock, Check, Clock, AlertTriangle,
  Zap, Thermometer, Droplets, Home, Users, Award, Gift,
  Search, Filter, Eye, ExternalLink, Star, Heart, ArrowRight
} from 'lucide-react'

interface MaintenanceTask {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  category: string
  estimatedCost?: string
  aiPrediction?: boolean
}

interface Document {
  id: string
  name: string
  category: string
  uploadDate: string
  size: string
  verified: boolean
}

const MOCK_MAINTENANCE: MaintenanceTask[] = [
  {
    id: '1',
    title: 'CV-ketel onderhoud',
    description: 'Jaarlijkse onderhoudsbeurt voor optimale werking',
    dueDate: '2026-03-15',
    priority: 'medium',
    category: 'Installaties',
    estimatedCost: '€120 - €180',
    aiPrediction: false,
  },
  {
    id: '2',
    title: 'Dakgoot inspectie',
    description: 'Controle op vervuiling en beschadigingen',
    dueDate: '2026-04-01',
    priority: 'low',
    category: 'Buitenwerk',
    aiPrediction: false,
  },
  {
    id: '3',
    title: 'Schilderwerk kozijnen',
    description: 'AI voorspelling: Gebaseerd op materiaaldata en weersomstandigheden',
    dueDate: '2028-06-01',
    priority: 'low',
    category: 'Buitenwerk',
    estimatedCost: '€2.500 - €3.500',
    aiPrediction: true,
  },
  {
    id: '4',
    title: 'Warmtepomp inspectie',
    description: 'AI voorspelling: Op basis van draaiuren en installatiedatum',
    dueDate: '2029-01-15',
    priority: 'medium',
    category: 'Installaties',
    estimatedCost: '€250 - €400',
    aiPrediction: true,
  },
]

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Bouwtekeningen definitief.pdf', category: 'Ontwerp', uploadDate: '2026-01-15', size: '4.2 MB', verified: true },
  { id: '2', name: 'Constructieberekening.pdf', category: 'Constructie', uploadDate: '2026-01-15', size: '2.8 MB', verified: true },
  { id: '3', name: 'Energielabel A+++.pdf', category: 'Energie', uploadDate: '2026-01-18', size: '856 KB', verified: true },
  { id: '4', name: 'Garantiecertificaat dakwerk.pdf', category: 'Garanties', uploadDate: '2026-01-18', size: '1.2 MB', verified: true },
  { id: '5', name: 'Installatietekening.pdf', category: 'Installaties', uploadDate: '2026-01-18', size: '3.1 MB', verified: true },
  { id: '6', name: 'Wkb dossier compleet.pdf', category: 'Wkb', uploadDate: '2026-01-18', size: '12.4 MB', verified: true },
]

const WARRANTY_ITEMS = [
  { name: 'Constructie', years: 10, expires: '2036-01-18' },
  { name: 'Dakbedekking', years: 15, expires: '2041-01-18' },
  { name: 'Kozijnen', years: 10, expires: '2036-01-18' },
  { name: 'Keukenapparatuur', years: 5, expires: '2031-01-18' },
  { name: 'Warmtepomp', years: 7, expires: '2033-01-18' },
  { name: 'Sanitair', years: 5, expires: '2031-01-18' },
]

export default function HomeownerPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'maintenance' | 'share'>('overview')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="md" dark />
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-xs font-black uppercase tracking-wider mb-1">Welkom terug bij</p>
              <h1 className="text-3xl font-black uppercase tracking-wider mb-2">Villa Zonneweide</h1>
              <p className="text-white/50 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Amstelveenseweg 123, Amersfoort
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4" />
                Blockchain geverifieerd
              </div>
              <p className="text-white/40 text-sm">Opgeleverd 18 jan 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs - overlapping the header */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white border border-slate-200 p-1 inline-flex">
          {[
            { id: 'overview', label: 'Overzicht', icon: Shield },
            { id: 'documents', label: 'Documenten', icon: FileText },
            { id: 'maintenance', label: 'Onderhoud', icon: Wrench },
            { id: 'share', label: 'Delen', icon: Share2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'documents' && <DocumentsTab documents={MOCK_DOCUMENTS} />}
        {activeTab === 'maintenance' && <MaintenanceTab tasks={MOCK_MAINTENANCE} />}
        {activeTab === 'share' && <ShareTab />}
      </main>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
        {[
          { icon: FileText, label: 'Documenten', value: '156', color: 'blue' },
          { icon: Wrench, label: 'Materialen', value: '847', color: 'violet' },
          { icon: Shield, label: 'Garanties actief', value: '23', color: 'emerald' },
          { icon: Calendar, label: 'Onderhoud gepland', value: '4', color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6">
            <div className={`w-12 h-12 flex items-center justify-center mb-3 ${
              stat.color === 'blue' ? 'bg-[#93b9e6]/10' :
              stat.color === 'violet' ? 'bg-[#93b9e6]/10' :
              stat.color === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50'
            }`}>
              <stat.icon className={`w-6 h-6 ${
                stat.color === 'blue' ? 'text-[#93b9e6]' :
                stat.color === 'violet' ? 'text-[#93b9e6]' :
                stat.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
              }`} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-1">
        {/* Property Details */}
        <div className="bg-white border border-slate-200 p-6">
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Woninggegevens</h3>
          <div className="space-y-3">
            {[
              { label: 'Woonoppervlakte', value: '185 m²' },
              { label: 'Perceel', value: '450 m²' },
              { label: 'Bouwjaar', value: '2026' },
              { label: 'Energielabel', value: 'A+++' },
              { label: 'Slaapkamers', value: '4' },
              { label: 'Badkamers', value: '2' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="bg-white border border-slate-200 p-6">
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Energie & installaties</h3>
          <div className="space-y-4">
            {[
              { icon: Thermometer, label: 'Warmtepomp', status: 'Actief', statusColor: 'emerald' },
              { icon: Zap, label: 'Zonnepanelen', status: '18 panelen', statusColor: 'amber' },
              { icon: Droplets, label: 'Vloerverwarming', status: 'Actief', statusColor: 'emerald' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50">
                <div className="w-10 h-10 bg-white flex items-center justify-center border border-slate-200">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{item.label}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-black uppercase tracking-wider ${
                  item.statusColor === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warranties */}
      <div className="bg-white border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">Actieve garanties</h3>
          <Link href="#" className="text-xs font-black text-[#93b9e6] uppercase tracking-wider flex items-center gap-1 hover:underline">
            Bekijk alles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-1">
          {WARRANTY_ITEMS.slice(0, 3).map((item, i) => (
            <div key={i} className="p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900">{item.name}</span>
                <span className="text-sm font-black text-emerald-600">{item.years} jaar</span>
              </div>
              <p className="text-sm text-slate-500">
                Verloopt: {new Date(item.expires).toLocaleDateString('nl-NL', { 
                  month: 'long', year: 'numeric' 
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="bg-[#93b9e6] p-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Deel uw ervaring</h3>
            <p className="text-slate-800 text-sm mb-3">
              Kent u iemand die ook wil bouwen? Verwijs ze naar Helder en ontvang €500 korting op toekomstige verbouwingen.
            </p>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 transition-all">
              <Users className="w-4 h-4" />
              Nodig vrienden uit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentsTab({ documents }: { documents: Document[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))]
  
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek documenten..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-[#93b9e6] focus:outline-none transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 focus:border-[#93b9e6] focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Alle categorieën' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid md:grid-cols-2 gap-1">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white border border-slate-200 p-5 hover:bg-slate-50 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#93b9e6]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#93b9e6]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 truncate">{doc.name}</h4>
                  {doc.verified && (
                    <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{doc.category}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadDate).toLocaleDateString('nl-NL')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 mt-4 pt-4 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                <Eye className="w-4 h-4" />
                Bekijk
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-wider text-white bg-[#93b9e6] hover:bg-[#7aa8d9] transition-all">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MaintenanceTab({ tasks }: { tasks: MaintenanceTask[] }) {
  const upcomingTasks = tasks.filter(t => new Date(t.dueDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
  const predictedTasks = tasks.filter(t => t.aiPrediction)

  return (
    <div className="space-y-8">
      {/* Upcoming */}
      <div>
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Aankomend onderhoud</h3>
        <div className="space-y-1">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="bg-white border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${
                    task.priority === 'high' ? 'bg-red-100' :
                    task.priority === 'medium' ? 'bg-amber-100' : 'bg-slate-100'
                  }`}>
                    <Wrench className={`w-6 h-6 ${
                      task.priority === 'high' ? 'text-red-600' :
                      task.priority === 'medium' ? 'text-amber-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-slate-500 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(task.dueDate).toLocaleDateString('nl-NL', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      {task.estimatedCost && (
                        <span className="text-slate-500">{task.estimatedCost}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-[#93b9e6] hover:bg-[#7aa8d9] transition-all">
                  Plan afspraak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#93b9e6]" />
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">AI Voorspellingen</h3>
          <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#93b9e6] text-slate-900">
            Beta
          </span>
        </div>
        <div className="bg-[#93b9e6]/10 border border-[#93b9e6]/30 p-6">
          <p className="text-sm text-slate-700 mb-4">
            Op basis van uw materiaalgegevens en installatiedata voorspellen we wanneer onderhoud nodig zal zijn.
          </p>
          <div className="space-y-1">
            {predictedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 bg-white">
                <div className="w-10 h-10 bg-[#93b9e6]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#93b9e6]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{task.title}</p>
                  <p className="text-sm text-slate-500">
                    Verwacht: {new Date(task.dueDate).toLocaleDateString('nl-NL', {
                      month: 'long', year: 'numeric'
                    })}
                    {task.estimatedCost && ` • ${task.estimatedCost}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ShareTab() {
  const [shareEmail, setShareEmail] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [linkGenerated, setLinkGenerated] = useState(false)

  const generateLink = () => {
    setShareLink('https://helder.nl/share/abc123xyz789')
    setLinkGenerated(true)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider mb-2">Deel uw Woningpaspoort</h2>
        <p className="text-slate-600">
          Geef veilig toegang tot (delen van) uw Woningpaspoort aan makelaars, 
          kopers, of andere belanghebbenden.
        </p>
      </div>

      {/* Share Options */}
      <div className="space-y-1">
        {/* Email Share */}
        <div className="bg-white border border-slate-200 p-6">
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Deel via e-mail</h3>
          <div className="flex gap-1">
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="email@voorbeeld.nl"
              className="flex-1 px-4 py-3 border border-slate-200 focus:border-[#93b9e6] focus:outline-none"
            />
            <button className="px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 transition-all">
              Verstuur
            </button>
          </div>
        </div>

        {/* Link Share */}
        <div className="bg-white border border-slate-200 p-6">
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Deel via link</h3>
          {!linkGenerated ? (
            <button
              onClick={generateLink}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Genereer deelbare link
            </button>
          ) : (
            <div className="flex gap-1">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="px-6 py-3 bg-emerald-500 text-white font-black uppercase tracking-wider hover:bg-emerald-600 transition-all"
              >
                Kopieer
              </button>
            </div>
          )}
          <p className="text-sm text-slate-500 mt-3">
            Links verlopen automatisch na 30 dagen
          </p>
        </div>
      </div>

      {/* Access Control */}
      <div className="bg-white border border-slate-200 p-6">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Wat wilt u delen?</h3>
        <div className="space-y-1">
          {[
            { label: 'Basisgegevens (oppervlakte, energielabel)', default: true },
            { label: 'Bouwtekeningen en ontwerp', default: true },
            { label: 'Materiaalspecificaties', default: false },
            { label: 'Garantiecertificaten', default: true },
            { label: 'Onderhoudshistorie', default: false },
            { label: 'Volledige Wkb dossier', default: false },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                defaultChecked={item.default}
                className="w-5 h-5 accent-[#93b9e6]"
              />
              <span className="text-slate-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Shares */}
      <div className="bg-white border border-slate-200 p-6">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-4">Actieve delingen</h3>
        <div className="space-y-1">
          {[
            { email: 'makelaar@vastgoed.nl', access: 'Basis + Garanties', expires: '15 feb 2026' },
          ].map((share, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50">
              <div>
                <p className="font-bold text-slate-900">{share.email}</p>
                <p className="text-sm text-slate-500">{share.access} • Verloopt {share.expires}</p>
              </div>
              <button className="text-red-600 text-xs font-black uppercase tracking-wider hover:text-red-700">
                Intrekken
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
