'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { 
  FileText, Upload, Search, Filter, Grid3X3, List, Download, Eye,
  Check, Clock, AlertCircle, Lock, MoreVertical, ChevronDown,
  File, Image, FileSpreadsheet, Folder, Plus, X, Shield,
  CheckCircle2, ArrowUpRight, Trash2, Share2
} from 'lucide-react'

interface Document {
  id: string
  name: string
  category: string
  type: 'pdf' | 'image' | 'spreadsheet' | 'other'
  size: string
  uploadDate: string
  status: 'verified' | 'pending' | 'rejected'
  required: boolean
}

const CATEGORIES = [
  { id: 'all', label: 'Alle categorieën', count: 24 },
  { id: 'tekeningen', label: 'Tekeningen', count: 6, required: true },
  { id: 'berekeningen', label: 'Berekeningen', count: 4, required: true },
  { id: 'materialen', label: 'Materiaalspecificaties', count: 5, required: true },
  { id: 'installaties', label: 'Installatie-instructies', count: 3, required: true },
  { id: 'garanties', label: 'Garantiebewijzen', count: 4, required: true },
  { id: 'keuringen', label: 'Keuringsrapporten', count: 2, required: false },
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

  const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
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
              className="group flex flex-col items-center justify-center min-h-[200px] bg-white border-2 border-dashed border-slate-200 rounded-2xl hover:border-[#1a1a2e] hover:bg-slate-50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-[#1a1a2e]/10 group-hover:scale-110 transition-all duration-300">
                <Plus className="w-7 h-7 text-slate-400 group-hover:text-[#1a1a2e]" />
              </div>
              <p className="font-medium text-slate-500 group-hover:text-[#1a1a2e] transition-colors">
                Document toevoegen
              </p>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
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
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
              Geen documenten gevonden
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Probeer een andere zoekterm' : 'Upload uw eerste document'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Upload className="w-5 h-5" />
              Document uploaden
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}

      {/* Document Preview Modal */}
      {selectedDoc && (
        <DocumentPreviewModal 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
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
      case 'image': return <Image className="w-6 h-6" />
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

  return (
    <div 
      className="group bg-white border border-slate-200 p-6 hover:border-slate-900 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Icon */}
      <div className="w-14 h-14 bg-[#93b9e6] flex items-center justify-center mb-4 text-slate-900">
        {getTypeIcon()}
      </div>

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
        <span className="text-xs text-slate-400 font-bold">{document.size}</span>
      </div>

      {/* Actions on hover */}
      <div className="flex items-center gap-px mt-4 pt-4 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-100">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-slate-200 uppercase tracking-wider transition-all">
          <Eye className="w-4 h-4" />
          BEKIJK
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-slate-200 uppercase tracking-wider transition-all">
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
            <span className="text-sm font-medium">Geverifieerd</span>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">In behandeling</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div 
      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors animate-fade-in-delay"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onClick}
    >
      <div className="col-span-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-[#1a1a2e] truncate">{document.name}</p>
          {getStatusBadge()}
        </div>
      </div>
      <div className="col-span-2 flex items-center text-sm text-slate-600 capitalize">
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
      <div className="col-span-2 flex items-center justify-end gap-2">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Eye className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Download className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  )
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Document uploaden</h2>
        <p className="text-slate-500 mb-6">Sleep bestanden of klik om te selecteren</p>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-[#1a1a2e] bg-[#1a1a2e]/5' 
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
          
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging ? 'bg-[#1a1a2e] scale-110' : 'bg-slate-100'
          }`}>
            <Upload className={`w-8 h-8 transition-colors ${
              isDragging ? 'text-white' : 'text-slate-400'
            }`} />
          </div>
          
          <p className="text-slate-600 font-medium mb-1">
            {isDragging ? 'Laat los om te uploaden' : 'Sleep bestanden hierheen'}
          </p>
          <p className="text-sm text-slate-400">
            of klik om te selecteren
          </p>
        </div>

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-slate-600">{selectedFiles.length} bestand(en) geselecteerd</p>
            {selectedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="flex-1 text-sm text-[#1a1a2e] truncate">{file.name}</span>
                <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFiles(files => files.filter((_, idx) => idx !== i))
                  }}
                  className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Category selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">Categorie</label>
          <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1a1a2e] focus:ring-4 focus:ring-[#1a1a2e]/5 outline-none transition-all">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
          >
            Annuleren
          </button>
          <button
            disabled={selectedFiles.length === 0}
            className="flex-1 py-3 px-6 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Uploaden
          </button>
        </div>
      </div>
    </div>
  )
}

function DocumentPreviewModal({ document, onClose }: { document: Document; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a2e]">{document.name}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>{document.size}</span>
                <span>•</span>
                <span>{new Date(document.uploadDate).toLocaleDateString('nl-NL')}</span>
                {document.status === 'verified' && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Lock className="w-3.5 h-3.5" />
                      Geverifieerd
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Preview area */}
        <div className="h-[500px] bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Document preview</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            {document.status === 'verified' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Blockchain geverifieerd</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-white transition-all">
              <Share2 className="w-4 h-4" />
              Delen
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] text-white font-medium rounded-xl hover:shadow-lg transition-all">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
