'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText, Upload, Search, Filter, Grid3X3, List, Download, Eye,
  Check, Clock, AlertCircle, Lock, MoreVertical, ChevronDown,
  File, Image as ImageIcon, FileSpreadsheet, Folder, Plus, X, Shield,
  CheckCircle2, ArrowUpRight, Trash2, Share2, MessageCircle, Info,
  MapPin, Wrench, HardHat, Ruler, TrendingUp, AlertTriangle, CheckCircle,
  Mic, Play, Pause, Link2, Phone, Loader2
} from 'lucide-react'

interface MaterialSpec {
  name: string
  type?: string
  brand?: string
  color?: string
  dimensions?: string
  quantity?: string
}

interface AIClassification {
  phase?: string
  phaseName?: string
  category?: string
  title?: string
  description?: string
  confidence?: number
  detectedElements?: string[]
  materials?: MaterialSpec[]
  location?: {
    floor?: string
    room?: string
    wall?: string
    position?: string
  }
  quality?: {
    score?: number
    notes?: string[]
    issues?: string[]
  }
  safetyObservations?: string[]
  complianceNotes?: string[]
  progressPercentage?: number
  workStatus?: string
  weatherConditions?: string
  lighting?: string
  workersVisible?: number
  equipmentDetected?: string[]
  toolsVisible?: string[]
  measurements?: string[]
  technicalSpecs?: string[]
  nextSteps?: string[]
  attentionPoints?: string[]
}

interface Document {
  id: string
  name: string
  category: string
  type: 'pdf' | 'image' | 'spreadsheet' | 'other'
  size: string
  uploadDate: string
  status: 'verified' | 'pending' | 'rejected'
  required: boolean
  fileUrl?: string
  source?: string
  description?: string
  extractedData?: {
    aiClassification?: AIClassification
    submittedBy?: string
    submittedAt?: string
  }
}

interface VoiceNote {
  id: string
  projectId: string
  projectName: string
  documentId: string | null
  linkedDocument: {
    id: string
    name: string
    type: string
    fileUrl: string
  } | null
  audioUrl: string
  transcription: string | null
  duration: number | null
  createdAt: string
  createdBy: string | null
}

// Helper functions
function mapTypeToCategory(type: string): string {
  switch (type) {
    case 'PHOTO': return 'fotos'
    case 'VIDEO': return 'fotos'
    case 'BLUEPRINT': return 'tekeningen'
    case 'PERMIT': return 'tekeningen'
    case 'CONTRACT': return 'garanties'
    case 'INVOICE': return 'berekeningen'
    default: return 'overig'
  }
}

function mapMimeToType(mimeType: string | null): 'pdf' | 'image' | 'spreadsheet' | 'other' {
  if (!mimeType) return 'other'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet'
  return 'other'
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '0 KB'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const CATEGORIES = [
  { id: 'all', label: 'Alle categorieën', count: 24 },
  { id: 'fotos', label: "Foto's & Video's", count: 0, required: false },
  { id: 'tekeningen', label: 'Tekeningen', count: 6, required: true },
  { id: 'berekeningen', label: 'Berekeningen', count: 4, required: true },
  { id: 'materialen', label: 'Materiaalspecificaties', count: 5, required: true },
  { id: 'installaties', label: 'Installatie-instructies', count: 3, required: true },
  { id: 'garanties', label: 'Garantiebewijzen', count: 4, required: true },
  { id: 'keuringen', label: 'Keuringsrapporten', count: 2, required: false },
  { id: 'overig', label: 'Overig', count: 0, required: false },
]

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Bouwvergunning Villa Zonneweide.pdf', category: 'tekeningen', type: 'pdf', size: '2.3 MB', uploadDate: '2026-01-15', status: 'verified', required: true },
  { id: '2', name: 'BENG Berekening.pdf', category: 'berekeningen', type: 'pdf', size: '1.7 MB', uploadDate: '2026-01-14', status: 'verified', required: true },
  { id: '3', name: 'Constructieberekening.pdf', category: 'berekeningen', type: 'pdf', size: '5.0 MB', uploadDate: '2026-01-14', status: 'verified', required: true },
  { id: '4', name: 'Isolatie specificaties.pdf', category: 'materialen', type: 'pdf', size: '890 KB', uploadDate: '2026-01-13', status: 'verified', required: true },
  { id: '5', name: 'Kozijnen - Meranti hout.pdf', category: 'materialen', type: 'pdf', size: '1.2 MB', uploadDate: '2026-01-12', status: 'pending', required: true },
  { id: '6', name: 'Warmtepomp handleiding.pdf', category: 'installaties', type: 'pdf', size: '3.4 MB', uploadDate: '2026-01-10', status: 'verified', required: true },
  { id: '7', name: 'Garantiecertificaat dakwerk.pdf', category: 'garanties', type: 'pdf', size: '456 KB', uploadDate: '2026-01-08', status: 'verified', required: true },
  { id: '8', name: 'Elektrakeuring rapport.pdf', category: 'keuringen', type: 'pdf', size: '2.1 MB', uploadDate: '2026-01-05', status: 'pending', required: false },
]

const WKB_REQUIREMENTS = [
  { id: 'tekeningen', label: 'Tekeningen', completed: 6, total: 6 },
  { id: 'berekeningen', label: 'Berekeningen', completed: 4, total: 4 },
  { id: 'materialen', label: 'Materiaalspecificaties', completed: 3, total: 5 },
  { id: 'installaties', label: 'Installatie-instructies', completed: 2, total: 3 },
  { id: 'garanties', label: 'Garantiebewijzen', completed: 3, total: 4 },
  { id: 'energie', label: 'BENG / Energielabel', completed: 1, total: 1 },
]

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS)
  const [activeTab, setActiveTab] = useState<'documents' | 'voice-notes'>('documents')
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [selectedVoiceNote, setSelectedVoiceNote] = useState<VoiceNote | null>(null)
  const [voiceSearchQuery, setVoiceSearchQuery] = useState('')

  // Fetch documents function
  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents')
      if (res.ok) {
        const data = await res.json()
        // Merge with mock documents, real docs first
        const realDocs: Document[] = data.documents.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          category: mapTypeToCategory(doc.type),
          type: mapMimeToType(doc.mimeType),
          size: formatSize(doc.fileSize),
          uploadDate: doc.createdAt,
          status: doc.verified ? 'verified' : 'pending',
          required: false,
          fileUrl: doc.fileUrl,
          source: doc.source,
          description: doc.description,
          extractedData: doc.extractedData,
        }))
        setDocuments([...realDocs, ...MOCK_DOCUMENTS])
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
  }

  // Fetch real documents from database
  useEffect(() => {
    fetchDocuments()
  }, [])

  // Fetch voice notes
  useEffect(() => {
    async function fetchVoiceNotes() {
      try {
        const searchParam = voiceSearchQuery ? `&search=${encodeURIComponent(voiceSearchQuery)}` : ''
        const res = await fetch(`/api/voice-notes?${searchParam}`)
        if (res.ok) {
          const data = await res.json()
          setVoiceNotes(data.voiceNotes)
        }
      } catch (error) {
        console.error('Failed to fetch voice notes:', error)
      }
    }
    fetchVoiceNotes()
  }, [voiceSearchQuery])

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalCompleted = WKB_REQUIREMENTS.reduce((sum, req) => sum + req.completed, 0)
  const totalRequired = WKB_REQUIREMENTS.reduce((sum, req) => sum + req.total, 0)
  const wkbProgress = Math.round((totalCompleted / totalRequired) * 100)

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header - Brutalist */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-[#93b9e6]" />
              <span className="text-[#93b9e6] text-[10px] font-black uppercase tracking-[0.3em]">ARCHIEF</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Documenten
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Beheer alle documenten van uw woningpaspoort
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[#93b9e6] hover:text-slate-900 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>DOCUMENT UPLOADEN</span>
          </button>
        </div>

        {/* Wkb Progress Card - Brutalist */}
        <div className="grid lg:grid-cols-12 gap-px bg-slate-200">
          {/* Main info */}
          <div className="lg:col-span-8 bg-slate-900 p-8 text-white">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="w-8 h-8 text-[#93b9e6]" />
              <div>
                <h2 className="text-xl font-black uppercase tracking-wide">WKB CONSUMENTENDOSSIER</h2>
                <p className="text-white/50 text-sm">Wettelijk verplichte documentatie voor oplevering</p>
              </div>
            </div>

            {/* Progress bars - Brutalist */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">GEÜPLOAD</span>
                  <span className="text-white font-black">{totalCompleted}/{totalRequired}</span>
                </div>
                <div className="h-2 bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-1000"
                    style={{ width: `${wkbProgress}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">BLOCKCHAIN VERIFIED</span>
                  <span className="text-white font-black">{totalCompleted - 2}/{totalRequired}</span>
                </div>
                <div className="h-2 bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-[#93b9e6] transition-all duration-1000"
                    style={{ width: `${((totalCompleted - 2) / totalRequired) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Categories grid - Brutalist */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
              {WKB_REQUIREMENTS.slice(0, 4).map((req) => (
                <div 
                  key={req.id}
                  className="p-4 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {req.completed === req.total ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs font-bold text-white/50">
                      {req.completed}/{req.total}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white truncate uppercase tracking-wide">{req.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress percentage */}
          <div className="lg:col-span-4 bg-[#93b9e6] p-8 flex flex-col items-center justify-center">
            <p className="text-[6rem] font-black text-slate-900 leading-none tracking-tighter">{wkbProgress}</p>
            <p className="text-xl font-black text-slate-900/50 uppercase tracking-wider">% COMPLEET</p>
          </div>
        </div>

        {/* Tab Navigation - Brutalist */}
        <div className="flex gap-px bg-slate-200">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'documents'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            DOCUMENTEN
          </button>
          <button
            onClick={() => setActiveTab('voice-notes')}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'voice-notes'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Mic className="w-4 h-4" />
            VOICE NOTES
            {voiceNotes.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-[10px] ${
                activeTab === 'voice-notes' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {voiceNotes.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'documents' ? (
          <>
            {/* Search and Filter Bar - Brutalist */}
            <div className="flex flex-col lg:flex-row gap-px bg-slate-200">
              {/* Search */}
              <div className="flex-1 relative bg-white">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ZOEK DOCUMENTEN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-slate-900 outline-none text-sm font-bold uppercase tracking-wider placeholder:text-slate-400"
                />
              </div>

              {/* Category Filter */}
              <div className="relative bg-white">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full lg:w-56 px-4 py-4 pr-10 bg-white border-2 border-transparent focus:border-slate-900 outline-none cursor-pointer text-sm font-bold uppercase tracking-wider"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({cat.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>

              {/* View Toggle - Brutalist */}
              <div className="flex gap-px bg-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-4 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-4 transition-all ${
                    viewMode === 'list'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocs.map((doc, index) => (
              <DocumentCard 
                key={doc.id} 
                document={doc} 
                index={index}
                onClick={() => setSelectedDoc(doc)}
              />
            ))}
            
            {/* Upload placeholder card */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="group flex flex-col items-center justify-center min-h-[200px] bg-white border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-900/10 transition-all duration-300">
                <Plus className="w-7 h-7 text-slate-400 group-hover:text-slate-900" />
              </div>
              <p className="font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-wider text-sm transition-colors">
                Document toevoegen
              </p>
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Document</div>
              <div className="col-span-2">Categorie</div>
              <div className="col-span-2">Datum</div>
              <div className="col-span-1">Grootte</div>
              <div className="col-span-2 text-right">Acties</div>
            </div>
            {filteredDocs.map((doc, index) => (
              <DocumentRow 
                key={doc.id} 
                document={doc} 
                index={index}
                onClick={() => setSelectedDoc(doc)}
              />
            ))}
          </div>
        )}

            {/* Empty state */}
            {filteredDocs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
                  Geen documenten gevonden
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchQuery ? 'Probeer een andere zoekterm' : 'Upload uw eerste document'}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Document uploaden
                </button>
              </div>
            )}
          </>
        ) : (
          /* Voice Notes Tab Content */
          <VoiceNotesSection
            voiceNotes={voiceNotes}
            searchQuery={voiceSearchQuery}
            onSearchChange={setVoiceSearchQuery}
            onSelectNote={setSelectedVoiceNote}
          />
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)} 
          onUploadComplete={fetchDocuments}
        />
      )}

      {/* Document Preview Modal */}
      {selectedDoc && (
        <DocumentPreviewModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {/* Voice Note Preview Modal */}
      {selectedVoiceNote && (
        <VoiceNoteModal
          voiceNote={selectedVoiceNote}
          onClose={() => setSelectedVoiceNote(null)}
        />
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.4s ease-out backwards;
        }
      `}</style>
    </div>
  )
}

function DocumentCard({ document, index, onClick }: { document: Document; index: number; onClick: () => void }) {
  const getTypeIcon = () => {
    switch (document.type) {
      case 'pdf': return <FileText className="w-6 h-6" />
      case 'image': return <ImageIcon className="w-6 h-6" />
      case 'spreadsheet': return <FileSpreadsheet className="w-6 h-6" />
      default: return <File className="w-6 h-6" />
    }
  }

  const getStatusBadge = () => {
    switch (document.status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">VERIFIED</span>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">PENDING</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">REJECTED</span>
          </div>
        )
    }
  }

  const isWhatsApp = document.source === 'WHATSAPP'
  const isImage = document.type === 'image'

  return (
    <div
      className="group bg-white border border-slate-200 hover:border-slate-900 transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Thumbnail or Icon */}
      {isImage && document.fileUrl ? (
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          <img
            src={`/api/media/${document.id}`}
            alt={document.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isWhatsApp && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 pb-0">
          <div className="w-14 h-14 bg-[#93b9e6] flex items-center justify-center mb-4 text-slate-900">
            {getTypeIcon()}
          </div>
        </div>
      )}

      <div className="p-6 pt-4">
        {/* Name */}
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 text-sm uppercase tracking-wide">
          {document.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-bold">
          {CATEGORIES.find(c => c.id === document.category)?.label || document.category}
        </p>

        {/* Status */}
        <div className="flex items-center justify-between">
          {getStatusBadge()}
          {document.size !== '0 KB' && (
            <span className="text-xs text-slate-400 font-bold">{document.size}</span>
          )}
        </div>
      </div>

      {/* Actions on hover */}
      <div className="flex items-center gap-px border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-100">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-slate-200 uppercase tracking-wider transition-all">
          <Eye className="w-4 h-4" />
          BEKIJK
        </button>
        {document.extractedData?.aiClassification && (
          <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black text-[#93b9e6] hover:text-slate-900 hover:bg-slate-200 uppercase tracking-wider transition-all">
            <Info className="w-4 h-4" />
            INFO
          </button>
        )}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-slate-200 uppercase tracking-wider transition-all">
          <Download className="w-4 h-4" />
          DOWNLOAD
        </button>
      </div>
    </div>
  )
}

function DocumentRow({ document, index, onClick }: { document: Document; index: number; onClick: () => void }) {
  const getStatusBadge = () => {
    switch (document.status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Geverifieerd</span>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">In behandeling</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div 
      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="col-span-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#93b9e6]/10 flex items-center justify-center text-[#93b9e6]">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate">{document.name}</p>
          {getStatusBadge()}
        </div>
      </div>
      <div className="col-span-2 flex items-center text-sm text-slate-600">
        {CATEGORIES.find(c => c.id === document.category)?.label || document.category}
      </div>
      <div className="col-span-2 flex items-center text-sm text-slate-500">
        {new Date(document.uploadDate).toLocaleDateString('nl-NL', {
          day: 'numeric', month: 'short', year: 'numeric'
        })}
      </div>
      <div className="col-span-1 flex items-center text-sm text-slate-500">
        {document.size}
      </div>
      <div className="col-span-2 flex items-center justify-end gap-1">
        <button className="p-2 hover:bg-slate-100 transition-colors">
          <Eye className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 transition-colors">
          <Download className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 transition-colors">
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  )
}

function UploadModal({ onClose, onUploadComplete }: { onClose: () => void; onUploadComplete: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState('tekeningen')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  // Map category to document type
  const categoryToType: Record<string, string> = {
    tekeningen: 'TECHNICAL_DRAWING',
    berekeningen: 'SPECIFICATION',
    materialen: 'MATERIAL_SPEC',
    installaties: 'MANUAL',
    garanties: 'WARRANTY',
    keuringen: 'INSPECTION_REPORT',
    overig: 'OTHER',
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const totalFiles = selectedFiles.length
      let uploaded = 0

      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)
        formData.append('type', categoryToType[selectedCategory] || 'OTHER')
        formData.append('description', `Uploaded via dashboard - ${selectedCategory}`)

        const response = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Upload failed')
        }

        uploaded++
        setUploadProgress(Math.round((uploaded / totalFiles) * 100))
      }

      // Success - refresh documents and close
      onUploadComplete()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setIsUploading(false)
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

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider mb-2">Document uploaden</h2>
        <p className="text-slate-500 mb-6">Sleep bestanden of klik om te selecteren</p>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-slate-900 bg-slate-900/5' 
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
            isDragging ? 'bg-slate-900' : 'bg-slate-100'
          }`}>
            <Upload className={`w-8 h-8 transition-colors ${
              isDragging ? 'text-white' : 'text-slate-400'
            }`} />
          </div>
          
          <p className="text-slate-600 font-bold mb-1">
            {isDragging ? 'Laat los om te uploaden' : 'Sleep bestanden hierheen'}
          </p>
          <p className="text-sm text-slate-400">
            of klik om te selecteren
          </p>
        </div>

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider">{selectedFiles.length} bestand(en) geselecteerd</p>
            {selectedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50">
                <FileText className="w-5 h-5 text-[#93b9e6]" />
                <span className="flex-1 text-sm text-slate-900 truncate">{file.name}</span>
                <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFiles(files => files.filter((_, idx) => idx !== i))
                  }}
                  className="p-1 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Category selection */}
        <div className="mt-6">
          <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Categorie</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none transition-all"
            disabled={isUploading}
          >
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Upload progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-[#93b9e6] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-1 mt-8">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            Annuleren
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="flex-1 py-3 px-6 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploaden...
              </>
            ) : (
              'Uploaden'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function DocumentPreviewModal({ document, onClose }: { document: Document; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'info'>('preview')
  const ai = document.extractedData?.aiClassification
  const hasAIData = !!ai

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#93b9e6]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#93b9e6]" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">{document.name}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>{document.size}</span>
                <span>•</span>
                <span>{new Date(document.uploadDate).toLocaleDateString('nl-NL')}</span>
                {document.status === 'verified' && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="text-xs font-black uppercase tracking-wider">Geverifieerd</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        {hasAIData && (
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'preview'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              BEKIJK
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'info'
                  ? 'bg-[#93b9e6] text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Info className="w-4 h-4" />
              AI ANALYSE
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'preview' ? (
            <div className="h-[500px] bg-slate-100 flex items-center justify-center overflow-hidden">
              {document.type === 'image' && document.fileUrl ? (
                <img
                  src={`/api/media/${document.id}`}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Document preview</p>
                </div>
              )}
            </div>
          ) : (
            <AIAnalysisPanel ai={ai!} submittedBy={document.extractedData?.submittedBy} submittedAt={document.extractedData?.submittedAt} />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            {document.status === 'verified' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Blockchain geverifieerd</span>
              </div>
            )}
            {ai?.confidence && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#93b9e6] text-slate-900">
                <span className="text-xs font-black uppercase tracking-wider">AI: {Math.round(ai.confidence * 100)}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider text-xs hover:bg-white transition-all">
              <Share2 className="w-4 h-4" />
              Delen
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-black uppercase tracking-wider text-xs hover:bg-slate-800 transition-all">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIAnalysisPanel({ ai, submittedBy, submittedAt }: { ai: AIClassification; submittedBy?: string; submittedAt?: string }) {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-[500px]">
      {/* Header with phase and confidence */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 border-l-4 border-[#93b9e6]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">BOUWFASE</p>
          <p className="text-lg font-black text-slate-900 uppercase">{ai.phaseName || ai.phase}</p>
          <p className="text-sm text-slate-500">{ai.category}</p>
        </div>
        <div className="bg-white p-4 border-l-4 border-emerald-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">KWALITEITSSCORE</p>
          <p className="text-3xl font-black text-slate-900">{ai.quality?.score || '-'}<span className="text-lg text-slate-400">/10</span></p>
          {ai.progressPercentage !== undefined && (
            <p className="text-sm text-slate-500">Voortgang: {ai.progressPercentage}%</p>
          )}
        </div>
      </div>

      {/* Description */}
      {ai.description && (
        <div className="bg-white p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">BESCHRIJVING</p>
          <p className="text-sm text-slate-700">{ai.description}</p>
        </div>
      )}

      {/* Submitted by */}
      {submittedBy && (
        <div className="bg-white p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <HardHat className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{submittedBy}</p>
            <p className="text-xs text-slate-500">
              {submittedAt ? new Date(submittedAt).toLocaleString('nl-NL') : 'Ingediend via WhatsApp'}
            </p>
          </div>
        </div>
      )}

      {/* Location */}
      {ai.location && Object.values(ai.location).some(Boolean) && (
        <div className="bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#93b9e6]" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LOCATIE</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {ai.location.floor && <div><span className="text-slate-500">Verdieping:</span> <span className="font-bold">{ai.location.floor}</span></div>}
            {ai.location.room && <div><span className="text-slate-500">Ruimte:</span> <span className="font-bold">{ai.location.room}</span></div>}
            {ai.location.wall && <div><span className="text-slate-500">Muur:</span> <span className="font-bold">{ai.location.wall}</span></div>}
            {ai.location.position && <div><span className="text-slate-500">Positie:</span> <span className="font-bold">{ai.location.position}</span></div>}
          </div>
        </div>
      )}

      {/* Materials */}
      {ai.materials && ai.materials.length > 0 && (
        <div className="bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-[#93b9e6]" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MATERIALEN ({ai.materials.length})</p>
          </div>
          <div className="space-y-2">
            {ai.materials.map((mat, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-slate-50">
                <div className="w-2 h-2 bg-[#93b9e6] mt-1.5" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{mat.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {mat.type && <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600">{mat.type}</span>}
                    {mat.brand && <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600">{mat.brand}</span>}
                    {mat.dimensions && <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600">{mat.dimensions}</span>}
                    {mat.color && <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600">{mat.color}</span>}
                    {mat.quantity && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700">{mat.quantity}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Specs & Measurements */}
      {((ai.technicalSpecs && ai.technicalSpecs.length > 0) || (ai.measurements && ai.measurements.length > 0)) && (
        <div className="bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-[#93b9e6]" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TECHNISCHE SPECS</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ai.technicalSpecs?.map((spec, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-slate-400" />
                <span>{spec}</span>
              </div>
            ))}
            {ai.measurements?.map((meas, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-[#93b9e6]" />
                <span>{meas}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment & Tools */}
      {((ai.equipmentDetected && ai.equipmentDetected.length > 0) || (ai.toolsVisible && ai.toolsVisible.length > 0)) && (
        <div className="bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-[#93b9e6]" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">GEREEDSCHAP & MATERIEEL</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ai.equipmentDetected?.map((eq, i) => (
              <span key={i} className="text-xs px-3 py-1 bg-slate-900 text-white font-bold">{eq}</span>
            ))}
            {ai.toolsVisible?.map((tool, i) => (
              <span key={i} className="text-xs px-3 py-1 bg-slate-200 text-slate-700 font-bold">{tool}</span>
            ))}
          </div>
        </div>
      )}

      {/* Quality Notes & Issues */}
      {ai.quality && ((ai.quality.notes && ai.quality.notes.length > 0) || (ai.quality.issues && ai.quality.issues.length > 0)) && (
        <div className="grid grid-cols-2 gap-4">
          {ai.quality.notes && ai.quality.notes.length > 0 && (
            <div className="bg-emerald-50 p-4 border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">POSITIEF</p>
              </div>
              <ul className="space-y-1">
                {ai.quality.notes.map((note, i) => (
                  <li key={i} className="text-sm text-emerald-800">✓ {note}</li>
                ))}
              </ul>
            </div>
          )}
          {ai.quality.issues && ai.quality.issues.length > 0 && (
            <div className="bg-red-50 p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-[10px] font-black text-red-600 uppercase tracking-wider">AANDACHT</p>
              </div>
              <ul className="space-y-1">
                {ai.quality.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-red-800">⚠ {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Safety & Compliance */}
      {((ai.safetyObservations && ai.safetyObservations.length > 0) || (ai.complianceNotes && ai.complianceNotes.length > 0)) && (
        <div className="grid grid-cols-2 gap-4">
          {ai.safetyObservations && ai.safetyObservations.length > 0 && (
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardHat className="w-4 h-4 text-amber-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">VEILIGHEID</p>
              </div>
              <ul className="space-y-1">
                {ai.safetyObservations.map((obs, i) => (
                  <li key={i} className="text-sm text-slate-600">🦺 {obs}</li>
                ))}
              </ul>
            </div>
          )}
          {ai.complianceNotes && ai.complianceNotes.length > 0 && (
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">COMPLIANCE (Wkb)</p>
              </div>
              <ul className="space-y-1">
                {ai.complianceNotes.map((note, i) => (
                  <li key={i} className="text-sm text-slate-600">📋 {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Next Steps & Attention Points */}
      {((ai.nextSteps && ai.nextSteps.length > 0) || (ai.attentionPoints && ai.attentionPoints.length > 0)) && (
        <div className="grid grid-cols-2 gap-4">
          {ai.nextSteps && ai.nextSteps.length > 0 && (
            <div className="bg-blue-50 p-4 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">VOLGENDE STAPPEN</p>
              </div>
              <ul className="space-y-1">
                {ai.nextSteps.map((step, i) => (
                  <li key={i} className="text-sm text-blue-800">→ {step}</li>
                ))}
              </ul>
            </div>
          )}
          {ai.attentionPoints && ai.attentionPoints.length > 0 && (
            <div className="bg-amber-50 p-4 border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">LET OP</p>
              </div>
              <ul className="space-y-1">
                {ai.attentionPoints.map((point, i) => (
                  <li key={i} className="text-sm text-amber-800">⚡ {point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Detected Elements */}
      {ai.detectedElements && ai.detectedElements.length > 0 && (
        <div className="bg-white p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">GEDETECTEERDE ELEMENTEN</p>
          <div className="flex flex-wrap gap-1">
            {ai.detectedElements.map((el, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600">{el}</span>
            ))}
          </div>
        </div>
      )}

      {/* Environment */}
      {(ai.weatherConditions || ai.lighting || ai.workersVisible !== undefined) && (
        <div className="bg-white p-4 grid grid-cols-3 gap-4">
          {ai.weatherConditions && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WEER</p>
              <p className="text-sm font-bold text-slate-900">{ai.weatherConditions}</p>
            </div>
          )}
          {ai.lighting && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">VERLICHTING</p>
              <p className="text-sm font-bold text-slate-900">{ai.lighting}</p>
            </div>
          )}
          {ai.workersVisible !== undefined && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MEDEWERKERS</p>
              <p className="text-sm font-bold text-slate-900">{ai.workersVisible} zichtbaar</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Voice Notes Section Component
function VoiceNotesSection({
  voiceNotes,
  searchQuery,
  onSearchChange,
  onSelectNote,
}: {
  voiceNotes: VoiceNote[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectNote: (note: VoiceNote) => void
}) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-px bg-slate-200">
        <div className="flex-1 relative bg-white">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="ZOEK IN TRANSCRIPTIES..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-emerald-500 outline-none text-sm font-bold uppercase tracking-wider placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 px-4 bg-emerald-50 text-emerald-700">
          <Mic className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">
            {voiceNotes.length} VOICE NOTES
          </span>
        </div>
      </div>

      {/* Voice Notes List */}
      {voiceNotes.length > 0 ? (
        <div className="space-y-3">
          {voiceNotes.map((note) => (
            <VoiceNoteCard
              key={note.id}
              voiceNote={note}
              onClick={() => onSelectNote(note)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200">
          <div className="w-20 h-20 bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-10 h-10 text-emerald-300" />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
            Geen voice notes
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {searchQuery
              ? 'Geen resultaten gevonden voor deze zoekopdracht'
              : 'Stuur voice notes via WhatsApp om ze hier te zien. Ze worden automatisch getranscribeerd.'}
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-bold">Stuur audio naar het WhatsApp nummer</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Voice Note Card Component
function VoiceNoteCard({
  voiceNote,
  onClick,
}: {
  voiceNote: VoiceNote
  onClick: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatPhone = (phone: string | null) => {
    if (!phone) return 'Onbekend'
    // Format WhatsApp phone number
    return phone.replace('whatsapp:', '').replace(/^\+31/, '0')
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer overflow-hidden"
    >
      <div className="flex items-stretch">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-20 flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Transcription Preview */}
              {voiceNote.transcription ? (
                <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                  &ldquo;{voiceNote.transcription}&rdquo;
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic mb-2">
                  Transcriptie niet beschikbaar
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(voiceNote.duration)}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {formatPhone(voiceNote.createdBy)}
                </span>
                <span>
                  {new Date(voiceNote.createdAt).toLocaleString('nl-NL', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Linked Photo Badge */}
            {voiceNote.linkedDocument && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold">
                <Link2 className="w-3 h-3" />
                <span className="uppercase tracking-wider">Foto</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={voiceNote.audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}

// Voice Note Modal Component
function VoiceNoteModal({
  voiceNote,
  onClose,
}: {
  voiceNote: VoiceNote
  onClose: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatPhone = (phone: string | null) => {
    if (!phone) return 'Onbekend'
    return phone.replace('whatsapp:', '').replace(/^\+31/, '0')
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-500 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-wider">Voice Note</h3>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span>{formatDuration(voiceNote.duration)}</span>
                <span>-</span>
                <span>{new Date(voiceNote.createdAt).toLocaleString('nl-NL')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Player */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <div className="flex-1">
              <audio
                ref={audioRef}
                src={voiceNote.audioUrl}
                controls
                className="w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-auto max-h-[50vh]">
          {/* Transcription */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                TRANSCRIPTIE
              </h4>
            </div>
            {voiceNote.transcription ? (
              <div className="p-4 bg-white border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">{voiceNote.transcription}</p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                Transcriptie niet beschikbaar
              </div>
            )}
          </div>

          {/* Sender Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                VERZONDEN DOOR
              </h4>
            </div>
            <div className="p-4 bg-white border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <HardHat className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{formatPhone(voiceNote.createdBy)}</p>
                <p className="text-xs text-slate-500">Via WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Linked Document */}
          {voiceNote.linkedDocument && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-blue-500" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  GEKOPPELDE FOTO
                </h4>
              </div>
              <div className="p-4 bg-white border border-slate-200">
                <div className="flex items-center gap-4">
                  {voiceNote.linkedDocument.fileUrl && (
                    <div className="w-20 h-20 bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={`/api/media/${voiceNote.linkedDocument.id}`}
                        alt={voiceNote.linkedDocument.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {voiceNote.linkedDocument.name}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      {voiceNote.linkedDocument.type}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-colors">
                    BEKIJK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Project Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Folder className="w-4 h-4 text-slate-400" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                PROJECT
              </h4>
            </div>
            <div className="p-4 bg-white border border-slate-200">
              <p className="font-bold text-slate-900">{voiceNote.projectName}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-emerald-600">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Ontvangen via WhatsApp</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider text-xs hover:bg-white transition-all">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-black uppercase tracking-wider text-xs hover:bg-slate-800 transition-all"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
