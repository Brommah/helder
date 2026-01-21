'use client'

import { useState, useEffect } from 'react'
import {
  Package, Search, Filter, Grid3X3, List, ChevronDown, ChevronRight,
  Layers, Droplets, Thermometer, Zap, Home, Shield, CheckCircle2,
  ExternalLink, Info, Tag, Calendar, MapPin, FileText, Lock,
  Building2, Hammer, Wind, Sun, Sparkles, MessageCircle, Download
} from 'lucide-react'

// AI-detected material from WhatsApp
interface AIMaterial {
  name: string
  type?: string
  brand?: string
  color?: string
  dimensions?: string
  totalQuantity: string
  occurrences: number
  firstSeen: string
  lastSeen: string
  phase: string
  documents: { id: string; name: string; date: string }[]
}

interface Material {
  id: string
  name: string
  category: string
  brand: string
  model: string
  quantity: string
  location: string
  installDate: string
  warrantyYears: number
  verified: boolean
  specs: Record<string, string>
  image?: string
}

const CATEGORIES = [
  { id: 'all', label: 'Alle materialen', icon: Package, count: 156 },
  { id: 'structure', label: 'Constructie', icon: Building2, count: 24 },
  { id: 'insulation', label: 'Isolatie', icon: Thermometer, count: 18 },
  { id: 'facade', label: 'Gevel & Dak', icon: Home, count: 32 },
  { id: 'windows', label: 'Kozijnen & Glas', icon: Layers, count: 16 },
  { id: 'installations', label: 'Installaties', icon: Zap, count: 28 },
  { id: 'plumbing', label: 'Sanitair', icon: Droplets, count: 22 },
  { id: 'ventilation', label: 'Ventilatie', icon: Wind, count: 8 },
  { id: 'solar', label: 'Zonne-energie', icon: Sun, count: 8 },
]

const MATERIALS: Material[] = [
  {
    id: '1',
    name: 'HSB Wandelementen',
    category: 'structure',
    brand: 'Finnframe',
    model: 'HSB 180',
    quantity: '42 elementen',
    location: 'Dragende wanden',
    installDate: '2025-10-01',
    warrantyYears: 50,
    verified: true,
    specs: { 'Dikte': '180 mm', 'U-waarde': '0.14 W/m²K', 'Brandklasse': 'B-s1,d0' }
  },
  {
    id: '2',
    name: 'PIR Dakisolatie',
    category: 'insulation',
    brand: 'Recticel',
    model: 'Eurowall+ 160',
    quantity: '210 m²',
    location: 'Dak',
    installDate: '2025-12-20',
    warrantyYears: 30,
    verified: true,
    specs: { 'Dikte': '160 mm', 'Rc-waarde': '7.27 m²K/W', 'Lambda': '0.022 W/mK' }
  },
  {
    id: '3',
    name: 'Triple Glas HR+++',
    category: 'windows',
    brand: 'AGC',
    model: 'Planitherm 4S',
    quantity: '65 m²',
    location: 'Alle ramen',
    installDate: '2026-01-10',
    warrantyYears: 15,
    verified: true,
    specs: { 'U-waarde': '0.6 W/m²K', 'ZTA': '0.50', 'Lichttoetred.': '71%' }
  },
  {
    id: '4',
    name: 'Warmtepomp',
    category: 'installations',
    brand: 'Daikin',
    model: 'Altherma 3 H HT',
    quantity: '1 unit',
    location: 'Technische ruimte',
    installDate: '2026-03-15',
    warrantyYears: 10,
    verified: false,
    specs: { 'Vermogen': '11 kW', 'COP': '4.64', 'Type': 'Lucht-water' }
  },
  {
    id: '5',
    name: 'WTW Ventilatie',
    category: 'ventilation',
    brand: 'Brink',
    model: 'Renovent Sky 300',
    quantity: '1 unit',
    location: 'Zolder',
    installDate: '2026-04-15',
    warrantyYears: 5,
    verified: false,
    specs: { 'Rendement': '95%', 'Capaciteit': '300 m³/h', 'Geluid': '28 dB(A)' }
  },
  {
    id: '6',
    name: 'Zonnepanelen',
    category: 'solar',
    brand: 'SunPower',
    model: 'Maxeon 6 AC',
    quantity: '24 panelen',
    location: 'Dak Zuid',
    installDate: '2026-06-01',
    warrantyYears: 40,
    verified: false,
    specs: { 'Vermogen': '400 Wp', 'Totaal': '9.6 kWp', 'Rendement': '22.8%' }
  },
  {
    id: '7',
    name: 'Keramische Gevelbekleding',
    category: 'facade',
    brand: 'Moeding',
    model: 'Alphaton',
    quantity: '180 m²',
    location: 'Voorgevel',
    installDate: '2026-01-25',
    warrantyYears: 50,
    verified: true,
    specs: { 'Formaat': '600x300 mm', 'Kleur': 'Antraciet', 'Bevestiging': 'Verborgen' }
  },
  {
    id: '8',
    name: 'Vloerverwarming',
    category: 'installations',
    brand: 'Uponor',
    model: 'Comfort E',
    quantity: '185 m²',
    location: 'Begane grond + verdieping',
    installDate: '2026-03-01',
    warrantyYears: 50,
    verified: false,
    specs: { 'Buisafstand': '10-15 cm', 'Diameter': '16 mm', 'Systeem': 'Nop' }
  },
]

export default function MaterialsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null)

  // AI-detected materials from WhatsApp
  const [aiMaterials, setAiMaterials] = useState<AIMaterial[]>([])
  const [aiStats, setAiStats] = useState<{ totalMaterials: number; totalDocuments: number; phases: number } | null>(null)
  const [loadingAI, setLoadingAI] = useState(true)

  useEffect(() => {
    async function fetchAIMaterials() {
      try {
        const res = await fetch('/api/materials?projectId=proj_villa_zonneweide_ams')
        if (res.ok) {
          const data = await res.json()
          setAiMaterials(data.materials || [])
          setAiStats(data.stats || null)
        }
      } catch (err) {
        console.error('Failed to fetch AI materials:', err)
      } finally {
        setLoadingAI(false)
      }
    }
    fetchAIMaterials()
  }, [])

  const handleGenerateReport = () => {
    window.open('/api/reports/progress?projectId=proj_villa_zonneweide_ams&format=html', '_blank')
  }

  const filteredMaterials = MATERIALS.filter(mat => {
    const matchesCategory = selectedCategory === 'all' || mat.category === selectedCategory
    const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mat.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const verifiedCount = MATERIALS.filter(m => m.verified).length
  const totalWarrantyValue = MATERIALS.reduce((sum, m) => sum + m.warrantyYears, 0)

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1a1a2e] tracking-tight">
              Materialen & Specificaties
            </h1>
            <p className="text-slate-500 mt-1">
              Complete DNA van alle bouwmaterialen in uw woning
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-5 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            RAPPORT GENEREREN
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">{MATERIALS.length}</p>
            <p className="text-sm text-slate-500">Geregistreerde materialen</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">{verifiedCount}</p>
            <p className="text-sm text-slate-500">Blockchain geverifieerd</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-violet-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">{CATEGORIES.length - 1}</p>
            <p className="text-sm text-slate-500">Categorieën</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">50 jaar</p>
            <p className="text-sm text-slate-500">Langste garantie</p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1a1a2e] text-white shadow-lg shadow-[#1a1a2e]/20' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-slate-100'
                }`}>{cat.count}</span>
              </button>
            )
          })}
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1a1a2e] transition-colors" />
            <input
              type="text"
              placeholder="Zoek materialen, merken of modellen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:border-[#1a1a2e] focus:ring-4 focus:ring-[#1a1a2e]/5 outline-none transition-all duration-200"
            />
          </div>
          <div className="flex bg-white border-2 border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-[#1a1a2e] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-[#1a1a2e] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Materials Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material, index) => (
              <MaterialCard 
                key={material.id} 
                material={material} 
                index={index}
                isExpanded={expandedMaterial === material.id}
                onToggle={() => setExpandedMaterial(
                  expandedMaterial === material.id ? null : material.id
                )}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {filteredMaterials.map((material, index) => (
              <MaterialRow 
                key={material.id} 
                material={material} 
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
              Geen materialen gevonden
            </h3>
            <p className="text-slate-500">
              Probeer een andere zoekterm of categorie
            </p>
          </div>
        )}

        {/* AI-Detected Materials from WhatsApp */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e]">AI-Gedetecteerde Materialen</h2>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Automatisch herkend uit WhatsApp foto&apos;s
              </p>
            </div>
            {aiStats && (
              <div className="ml-auto flex items-center gap-4 text-sm text-slate-500">
                <span>{aiStats.totalDocuments} foto&apos;s geanalyseerd</span>
                <span>•</span>
                <span>{aiStats.totalMaterials} materialen gevonden</span>
              </div>
            )}
          </div>

          {loadingAI ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500">AI materialen laden...</p>
            </div>
          ) : aiMaterials.length === 0 ? (
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-8 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="font-semibold text-[#1a1a2e] mb-2">Nog geen materialen gedetecteerd</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Stuur bouwfoto&apos;s via WhatsApp naar het project en de AI herkent automatisch materialen, merken en specificaties.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiMaterials.map((mat, idx) => (
                <AIMaterialCard key={`${mat.name}-${idx}`} material={mat} index={idx} />
              ))}
            </div>
          )}
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

function MaterialCard({ 
  material, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  material: Material
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const categoryIcon = CATEGORIES.find(c => c.id === material.category)?.icon || Package
  const CategoryIcon = categoryIcon

  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isExpanded 
          ? 'border-[#1a1a2e] shadow-xl shadow-slate-200/50' 
          : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center">
            <CategoryIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div className="flex items-center gap-2">
            {material.verified && (
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="font-bold text-[#1a1a2e] mb-1">{material.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{material.brand} • {material.model}</p>

        {/* Quick specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
            {material.quantity}
          </span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
            {material.warrantyYears} jaar garantie
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{material.location}</span>
        </div>

        {/* Expand button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-t border-slate-100 text-sm font-medium text-slate-500 hover:text-[#1a1a2e] hover:bg-slate-50 rounded-lg -mx-5 px-5 mt-2 transition-all"
        >
          <span>{isExpanded ? 'Minder details' : 'Meer details'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100 animate-fade-in">
          <div className="pt-4 space-y-4">
            {/* Specifications */}
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e] mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                Specificaties
              </h4>
              <div className="space-y-2">
                {Object.entries(material.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 px-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">{key}</span>
                    <span className="text-sm font-medium text-[#1a1a2e]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Installation date */}
            <div className="flex items-center justify-between py-3 px-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Geïnstalleerd</span>
              </div>
              <span className="text-sm font-medium text-[#1a1a2e]">
                {new Date(material.installDate).toLocaleDateString('nl-NL', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all">
                <FileText className="w-4 h-4" />
                Documentatie
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a2e] text-white font-medium rounded-xl hover:shadow-lg transition-all">
                <ExternalLink className="w-4 h-4" />
                Product info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MaterialRow({ material, index }: { material: Material; index: number }) {
  const categoryIcon = CATEGORIES.find(c => c.id === material.category)?.icon || Package
  const CategoryIcon = categoryIcon

  return (
    <div
      className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
        <CategoryIcon className="w-6 h-6 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-[#1a1a2e] truncate">{material.name}</p>
          {material.verified && (
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-slate-500">{material.brand} • {material.model}</p>
      </div>
      <div className="hidden md:block text-sm text-slate-500 w-32">
        {material.quantity}
      </div>
      <div className="hidden lg:block text-sm text-slate-500 w-40">
        {material.location}
      </div>
      <div className="text-sm font-medium text-blue-600 w-24 text-right">
        {material.warrantyYears} jaar
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </div>
  )
}

function AIMaterialCard({ material, index }: { material: AIMaterial; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        expanded
          ? 'border-violet-300 shadow-xl shadow-violet-100/50'
          : 'border-slate-200 hover:border-violet-200 hover:shadow-lg'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-5">
        {/* Header with AI badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-lg">
              {material.occurrences}x gezien
            </span>
          </div>
        </div>

        {/* Material name */}
        <h3 className="font-bold text-[#1a1a2e] mb-1">{material.name}</h3>
        {material.brand && (
          <p className="text-sm text-slate-500 mb-3">{material.brand}{material.type ? ` • ${material.type}` : ''}</p>
        )}

        {/* Quick info */}
        <div className="flex flex-wrap gap-2 mb-3">
          {material.totalQuantity && material.totalQuantity !== '-' && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
              {material.totalQuantity}
            </span>
          )}
          {material.color && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg">
              {material.color}
            </span>
          )}
          {material.dimensions && (
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
              {material.dimensions}
            </span>
          )}
        </div>

        {/* Phase */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Hammer className="w-4 h-4" />
          <span>{material.phase}</span>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-t border-slate-100 text-sm font-medium text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg -mx-5 px-5 mt-2 transition-all"
        >
          <span>{expanded ? 'Verbergen' : "Foto's bekijken"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded: show documents */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 animate-fade-in">
          <div className="pt-4">
            <h4 className="text-sm font-semibold text-[#1a1a2e] mb-3">
              Gedetecteerd in {material.documents.length} foto&apos;s
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {material.documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 truncate max-w-[150px]">{doc.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(doc.date)}</span>
                </div>
              ))}
              {material.documents.length > 5 && (
                <p className="text-xs text-slate-400 text-center py-2">
                  +{material.documents.length - 5} meer foto&apos;s
                </p>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Eerste: {formatDate(material.firstSeen)}</span>
              <span>Laatste: {formatDate(material.lastSeen)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
