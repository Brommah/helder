'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { 
  Building2, Shield, Lock, CheckCircle2, Home, MapPin, Calendar,
  FileText, Package, Clock, Zap, Thermometer, TrendingUp, Wind,
  Download, Share2, ExternalLink, ChevronRight, ChevronDown,
  Camera, Eye, Award, Sparkles, ArrowRight
} from 'lucide-react'

// Mock property data
const PROPERTY_DATA = {
  name: 'Villa Zonneweide',
  address: 'Kavel 12, De Buitenplaats, Almere',
  type: 'Vrijstaande nieuwbouwwoning',
  size: '210 m²',
  plot: '650 m²',
  rooms: 5,
  bathrooms: 2,
  buildYear: '2025-2026',
  energy: 'A++++',
  owner: 'Familie Van der Berg',
  builder: 'Helder Engineering',
  progress: 75,
  currentPhase: 'Gevel & Dak',
  verifiedDocs: 24,
  totalDocs: 28,
  blockchainId: '0x7f3a...b2c4',
}

const HIGHLIGHTS = [
  { label: 'Energielabel', value: 'A++++', icon: Zap, color: 'emerald' },
  { label: 'Isolatie', value: 'Rc 8.0', icon: Thermometer, color: 'blue' },
  { label: 'Zonnepanelen', value: '9.6 kWp', icon: TrendingUp, color: 'amber' },
  { label: 'Ventilatie', value: 'WTW 95%', icon: Wind, color: 'cyan' },
]

const DOCUMENTS = [
  { name: 'Bouwvergunning', category: 'Vergunningen', verified: true },
  { name: 'BENG Berekening', category: 'Energie', verified: true },
  { name: 'Constructieberekening', category: 'Berekeningen', verified: true },
  { name: 'Materiaalspecificaties', category: 'Materialen', verified: true },
  { name: 'Garantiecertificaten', category: 'Garanties', verified: true },
]

const TIMELINE = [
  { phase: 'Fundering', status: 'completed', date: 'Sep 2025' },
  { phase: 'Ruwbouw', status: 'completed', date: 'Nov 2025' },
  { phase: 'Gevel & Dak', status: 'current', date: 'Jan 2026', progress: 60 },
  { phase: 'Installaties', status: 'upcoming', date: 'Mrt 2026' },
  { phase: 'Afbouw', status: 'upcoming', date: 'Mei 2026' },
  { phase: 'Oplevering', status: 'upcoming', date: 'Jul 2026' },
]

export default function SharePage({ params }: { params: { token: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSection, setExpandedSection] = useState<string>('overview')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a1a2e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Woningpaspoort laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="md" showSubtitle subtitle="Woningpaspoort" />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Blockchain Verified</span>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-white/90 text-sm font-medium">Geverifieerd Woningpaspoort</span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  {PROPERTY_DATA.name}
                </h1>
                
                <div className="flex items-center gap-2 text-white/70 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{PROPERTY_DATA.address}</span>
                </div>
                
                <p className="text-white/60 max-w-lg mb-6">
                  {PROPERTY_DATA.type} • {PROPERTY_DATA.size} woonoppervlakte • {PROPERTY_DATA.plot} kavel
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <span className="text-white/70 text-sm">Kamers</span>
                    <p className="text-white font-bold">{PROPERTY_DATA.rooms}</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <span className="text-white/70 text-sm">Badkamers</span>
                    <p className="text-white font-bold">{PROPERTY_DATA.bathrooms}</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <span className="text-white/70 text-sm">Bouwjaar</span>
                    <p className="text-white font-bold">{PROPERTY_DATA.buildYear}</p>
                  </div>
                </div>
              </div>

              {/* Energy label card */}
              <div className="lg:w-64 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <p className="text-white/60 text-sm mb-3">Energielabel</p>
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
                    <span className="text-2xl font-black">{PROPERTY_DATA.energy}</span>
                  </div>
                  <p className="text-white font-semibold">Bijna Energieneutraal</p>
                  <p className="text-white/50 text-sm">BENG-compliant</p>
                </div>
              </div>
            </div>

            {/* Blockchain verification */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Blockchain geverifieerd</p>
                  <p className="text-white/50 text-sm font-mono">{PROPERTY_DATA.blockchainId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Laatste verificatie: vandaag</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((item, index) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                'bg-cyan-50 text-cyan-600'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <p className="text-slate-500 text-sm mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-[#1a1a2e]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1a2e]">Documenten</h2>
                  <p className="text-sm text-slate-500">{PROPERTY_DATA.verifiedDocs} van {PROPERTY_DATA.totalDocs} geverifieerd</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">{Math.round((PROPERTY_DATA.verifiedDocs / PROPERTY_DATA.totalDocs) * 100)}%</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {DOCUMENTS.map((doc, index) => (
                <div 
                  key={doc.name}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1a1a2e]">{doc.name}</p>
                    <p className="text-sm text-slate-500">{doc.category}</p>
                  </div>
                  {doc.verified && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Geverifieerd</span>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-slate-100 rounded-xl transition-colors">
                Alle {PROPERTY_DATA.totalDocs} documenten bekijken
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1a2e]">Bouwtijdlijn</h2>
                  <p className="text-sm text-slate-500">{PROPERTY_DATA.progress}% voltooid</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />
                
                <div className="space-y-4">
                  {TIMELINE.map((item, index) => (
                    <div key={item.phase} className="relative flex items-center gap-4">
                      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-emerald-500' :
                        item.status === 'current' ? 'bg-blue-500 ring-4 ring-blue-100' :
                        'bg-slate-200'
                      }`}>
                        {item.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : item.status === 'current' ? (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        ) : (
                          <div className="w-2 h-2 bg-slate-400 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${
                          item.status === 'upcoming' ? 'text-slate-400' : 'text-[#1a1a2e]'
                        }`}>{item.phase}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                      {item.status === 'current' && item.progress && (
                        <span className="text-sm font-bold text-blue-600">{item.progress}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Builder & Owner Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                HE
              </div>
              <div>
                <p className="text-sm text-slate-500">Bouwer</p>
                <p className="font-bold text-[#1a1a2e]">{PROPERTY_DATA.builder}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Sinds 1956 specialist in hoogwaardige nieuwbouw met focus op duurzaamheid en kwaliteit.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                FV
              </div>
              <div>
                <p className="text-sm text-slate-500">Eigenaar</p>
                <p className="font-bold text-[#1a1a2e]">{PROPERTY_DATA.owner}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Eigenaar van dit woningpaspoort met volledige toegang tot alle documenten en verificaties.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 text-center border border-slate-200">
          <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
            Ook een woningpaspoort voor uw nieuwbouwproject?
          </h3>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Start vandaag nog met Helder en geef uw toekomstige woning het complete DNA dat het verdient.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#1a1a2e]/20 transition-all hover:-translate-y-0.5"
          >
            Start de intake
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" showSubtitle subtitle="Woningpaspoort" />
            <p className="text-sm text-slate-500">
              © 2026 Helder Engineering. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
