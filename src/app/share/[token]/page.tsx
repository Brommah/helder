'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { 
  Shield, Lock, CheckCircle2, MapPin,
  FileText, Clock, Zap, Thermometer, TrendingUp, Wind,
  Share2, ChevronRight, ArrowRight, ExternalLink, AlertTriangle
} from 'lucide-react'

interface PropertyData {
  id: string
  name: string
  address: string
  type: string
  size: number | null
  plot: number | null
  rooms: number | null
  bathrooms: number
  buildYear: string
  energy: string | null
  owner: string
  builder: string
  progress: number
  currentPhase: string
  verifiedDocs: number
  totalDocs: number
  blockchainId: string | null
  isDemo?: boolean
}

interface Document {
  name: string
  category: string
  verified: boolean
}

interface TimelineItem {
  phase: string
  status: 'completed' | 'current' | 'upcoming'
  date: string
  progress?: number
}

interface Highlight {
  label: string
  value: string
}

const HIGHLIGHT_ICONS = [Zap, Thermometer, TrendingUp, Wind]

export default function SharePage() {
  const params = useParams()
  const token = params.token as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/share/${token}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Failed to load property')
          return
        }

        setPropertyData(data.property)
        setDocuments(data.documents || [])
        setTimeline(data.timeline || [])
        setHighlights(data.highlights || [])
      } catch (err) {
        setError('Failed to load property data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm font-bold uppercase tracking-wider">Woningpaspoort laden</p>
        </div>
      </div>
    )
  }

  if (error || !propertyData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">NIET GEVONDEN</h1>
          <p className="text-white/50 mb-8">
            {error || 'Dit woningpaspoort kon niet worden geladen.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#93b9e6] text-slate-900 font-bold uppercase tracking-wider"
          >
            Naar homepage
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="md" dark />
              <span className="text-white/40 text-sm font-bold uppercase tracking-wider">Woningpaspoort</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Verified</span>
              </div>
              <button className="p-2 hover:bg-white/5 transition-colors">
                <Share2 className="w-5 h-5 text-white/50" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-1 mb-12">
          {/* Main Info */}
          <div className="lg:col-span-8 bg-slate-900 p-8 lg:p-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 mb-8">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Geverifieerd Woningpaspoort</span>
            </div>
            
            <h1 className="text-[2.5rem] lg:text-[4rem] font-black text-white leading-[0.9] tracking-tight mb-4">
              {propertyData.name}
            </h1>
            
            <div className="flex items-center gap-2 text-white/40 mb-6">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{propertyData.address}</span>
            </div>
            
            <p className="text-white/50 mb-8">
              {propertyData.type} • {propertyData.size ? `${propertyData.size} m²` : '-'} woonoppervlakte • {propertyData.plot ? `${propertyData.plot} m²` : '-'} kavel
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-white/5 p-4">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Kamers</span>
                <p className="text-2xl font-black text-white">{propertyData.rooms || '-'}</p>
              </div>
              <div className="bg-white/5 p-4">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Badkamers</span>
                <p className="text-2xl font-black text-white">{propertyData.bathrooms}</p>
              </div>
              <div className="bg-white/5 p-4">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Bouwjaar</span>
                <p className="text-2xl font-black text-white">{propertyData.buildYear}</p>
              </div>
            </div>

            {/* Blockchain verification */}
            {propertyData.blockchainId && (
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Blockchain geverifieerd</p>
                    <p className="text-white/40 text-xs font-mono">{propertyData.blockchainId}</p>
                  </div>
                </div>
                <div className="text-white/30 text-xs font-bold uppercase tracking-wider">
                  Verificatie: vandaag
                </div>
              </div>
            )}
          </div>

          {/* Energy Label */}
          <div className="lg:col-span-4 bg-emerald-500 p-8 lg:p-12 flex flex-col justify-center">
            <p className="text-black/40 text-xs font-black uppercase tracking-wider mb-4">Energielabel</p>
            <div className="text-[5rem] lg:text-[7rem] font-black text-black leading-[0.8] tracking-tight mb-4">
              {propertyData.energy || '-'}
            </div>
            <p className="text-black font-bold">{propertyData.energy?.startsWith('A') ? 'Bijna Energieneutraal' : 'Energie Efficiënt'}</p>
            <p className="text-black/50 text-sm">{propertyData.energy?.includes('+') ? 'BENG-compliant' : ''}</p>
          </div>
        </div>

        {/* Energy Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 mb-12">
          {highlights.map((item, index) => {
            const Icon = HIGHLIGHT_ICONS[index] || Zap
            return (
              <div key={item.label} className="bg-white p-6 group hover:bg-slate-900 transition-colors duration-300">
                <Icon className="w-8 h-8 text-[#93b9e6] mb-4 group-hover:text-[#93b9e6]" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-white/40">{item.label}</p>
                <p className="text-2xl font-black text-[#0a0a0a] group-hover:text-white">{item.value}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mb-12">
          {/* Documents */}
          {documents.length > 0 && (
            <div className="lg:col-span-2 bg-white">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#0a0a0a]" />
                  <div>
                    <h2 className="font-black text-[#0a0a0a] uppercase tracking-wider">Documenten</h2>
                    <p className="text-sm text-slate-500">{propertyData.verifiedDocs} van {propertyData.totalDocs} geverifieerd</p>
                  </div>
                </div>
                {propertyData.totalDocs > 0 && (
                  <div className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-black">
                    {Math.round((propertyData.verifiedDocs / propertyData.totalDocs) * 100)}%
                  </div>
                )}
              </div>
              
              <div>
                {documents.map((doc) => (
                  <div 
                    key={doc.name}
                    className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="font-bold text-[#0a0a0a]">{doc.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{doc.category}</p>
                    </div>
                    {doc.verified && (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Geverifieerd</span>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                ))}
              </div>
              
              {propertyData.totalDocs > documents.length && (
                <div className="p-4 bg-slate-50">
                  <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-black text-[#0a0a0a] uppercase tracking-wider hover:bg-slate-100 transition-colors">
                    Alle {propertyData.totalDocs} documenten
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div className={`bg-slate-900 ${documents.length === 0 ? 'lg:col-span-3' : ''}`}>
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#93b9e6]" />
                  <div>
                    <h2 className="font-black text-white uppercase tracking-wider">Bouwtijdlijn</h2>
                    <p className="text-sm text-white/40">{propertyData.progress}% voltooid</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div key={item.phase} className="flex items-center gap-4">
                      <div className={`w-3 h-3 ${
                        item.status === 'completed' ? 'bg-emerald-500' :
                        item.status === 'current' ? 'bg-[#93b9e6]' :
                        'bg-white/20'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${
                          item.status === 'upcoming' ? 'text-white/30' : 'text-white'
                        }`}>{item.phase}</p>
                        <p className="text-xs text-white/40">{item.date}</p>
                      </div>
                      {item.status === 'current' && item.progress && (
                        <span className="text-sm font-black text-[#93b9e6]">{item.progress}%</span>
                      )}
                      {item.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Builder & Owner Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-12">
          <div className="bg-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#0a0a0a] flex items-center justify-center text-white font-black text-xl">
                {propertyData.builder.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Bouwer</p>
                <p className="font-black text-[#0a0a0a]">{propertyData.builder}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Specialist in hoogwaardige nieuwbouw met focus op duurzaamheid en kwaliteit.
            </p>
          </div>
          
          <div className="bg-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#93b9e6] flex items-center justify-center text-[#0a0a0a] font-black text-xl">
                {propertyData.owner.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Eigenaar</p>
                <p className="font-black text-[#0a0a0a]">{propertyData.owner}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Eigenaar van dit woningpaspoort met volledige toegang tot alle documenten en verificaties.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#93b9e6] p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-[#0a0a0a] mb-2">
                Ook een woningpaspoort voor uw project?
              </h3>
              <p className="text-[#0a0a0a]/60">
                Start vandaag nog met Helder en geef uw woning het complete DNA dat het verdient.
              </p>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white font-black uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              Start intake
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" dark />
            <p className="text-sm text-white/30 font-bold uppercase tracking-wider">
              © 2026 Helder Engineering
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
