'use client'

import { useState } from 'react'
import { 
  Share2, Link2, Copy, Check, Users, Eye, Clock, Shield,
  Mail, QrCode, ChevronDown, ChevronRight, Settings, Trash2,
  Plus, Globe, Lock, Calendar, CheckCircle2, AlertCircle,
  ExternalLink, Download, Building2, FileText, Package
} from 'lucide-react'

interface ShareLink {
  id: string
  name: string
  type: 'full' | 'documents' | 'timeline' | 'materials'
  recipientType: 'buyer' | 'bank' | 'contractor' | 'custom'
  recipient?: string
  createdAt: string
  expiresAt?: string
  viewCount: number
  lastViewed?: string
  status: 'active' | 'expired' | 'revoked'
  permissions: string[]
}

const SHARE_TEMPLATES = [
  {
    id: 'buyer',
    name: 'Potentiële koper',
    icon: Users,
    description: 'Deel alle relevante informatie met geïnteresseerde kopers',
    permissions: ['Basisgegevens', 'Energielabel', 'Bouwjaar', 'Oppervlakte'],
    color: 'blue'
  },
  {
    id: 'bank',
    name: 'Hypotheekverstrekker',
    icon: Building2,
    description: 'Officiële documentatie voor hypotheekaanvragen',
    permissions: ['Taxatierapport', 'Eigendomsbewijs', 'Bouwvergunning', 'BENG-rapport'],
    color: 'emerald'
  },
  {
    id: 'contractor',
    name: 'Aannemer / Vakman',
    icon: Package,
    description: 'Technische specificaties voor onderhoud of verbouwing',
    permissions: ['Materiaalspecificaties', 'Installatiehandleidingen', 'Bouwtekeningen'],
    color: 'violet'
  },
]

const MOCK_LINKS: ShareLink[] = [
  {
    id: '1',
    name: 'Bezichtiging Familie Jansen',
    type: 'full',
    recipientType: 'buyer',
    recipient: 'familie.jansen@email.nl',
    createdAt: '2026-01-10',
    expiresAt: '2026-02-10',
    viewCount: 5,
    lastViewed: '2026-01-18',
    status: 'active',
    permissions: ['Basisgegevens', 'Energielabel', 'Foto\'s', 'Plattegronden']
  },
  {
    id: '2',
    name: 'ING Hypotheek aanvraag',
    type: 'documents',
    recipientType: 'bank',
    recipient: 'hypotheken@ing.nl',
    createdAt: '2026-01-05',
    expiresAt: '2026-03-05',
    viewCount: 2,
    lastViewed: '2026-01-12',
    status: 'active',
    permissions: ['Taxatierapport', 'Eigendomsbewijs', 'BENG-rapport']
  },
  {
    id: '3',
    name: 'Dakdekker offerte',
    type: 'materials',
    recipientType: 'contractor',
    createdAt: '2025-12-15',
    expiresAt: '2026-01-15',
    viewCount: 3,
    status: 'expired',
    permissions: ['Dakspecificaties', 'Materiaallijst']
  },
]

export default function SharePage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedLink, setSelectedLink] = useState<ShareLink | null>(null)

  const activeLinks = MOCK_LINKS.filter(l => l.status === 'active')
  const expiredLinks = MOCK_LINKS.filter(l => l.status === 'expired' || l.status === 'revoked')

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://helder.nl/share/${id}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header - Brutalist */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-[#93b9e6]" />
              <span className="text-[#93b9e6] text-[10px] font-black uppercase tracking-[0.3em]">TOEGANG</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Delen
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Deel uw woningpaspoort veilig met derden
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[#93b9e6] hover:text-slate-900 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>NIEUWE DEELLINK</span>
          </button>
        </div>

        {/* Security Notice - Brutalist */}
        <div className="bg-emerald-500 p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-white flex-shrink-0" />
            <div>
              <h3 className="font-black text-white mb-1 uppercase tracking-wide">BLOCKCHAIN VERIFIED SHARING</h3>
              <p className="text-white/80 text-sm">
                Alle gedeelde documenten zijn blockchain-geverifieerd. Ontvangers kunnen de authenticiteit 
                en volledigheid van de informatie altijd verifiëren. U behoudt volledige controle over wie 
                wat kan zien en wanneer de toegang verloopt.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Share Templates - Brutalist */}
        <div>
          <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">SNEL DELEN</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200">
            {SHARE_TEMPLATES.map((template) => {
              const Icon = template.icon
              return (
                <button
                  key={template.id}
                  onClick={() => setShowCreateModal(true)}
                  className="group text-left bg-white p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-12 h-12 flex items-center justify-center mb-4 ${
                    template.color === 'blue' ? 'bg-[#93b9e6] text-slate-900' :
                    template.color === 'emerald' ? 'bg-emerald-500 text-white' :
                    'bg-violet-500 text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-1 uppercase tracking-wide text-sm">{template.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.permissions.slice(0, 3).map((perm, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {perm}
                      </span>
                    ))}
                    {template.permissions.length > 3 && (
                      <span className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                        +{template.permissions.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Links */}
        <div>
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            Actieve deellinks ({activeLinks.length})
          </h2>
          <div className="space-y-3">
            {activeLinks.map((link, index) => (
              <ShareLinkCard
                key={link.id}
                link={link}
                index={index}
                onCopy={() => handleCopyLink(link.id)}
                isCopied={copiedId === link.id}
                onSelect={() => setSelectedLink(link)}
              />
            ))}
          </div>
        </div>

        {/* Expired Links */}
        {expiredLinks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Verlopen links ({expiredLinks.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {expiredLinks.map((link, index) => (
                <ShareLinkCard
                  key={link.id}
                  link={link}
                  index={index}
                  onCopy={() => {}}
                  isCopied={false}
                  onSelect={() => setSelectedLink(link)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {MOCK_LINKS.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
              Nog geen deellinks
            </h3>
            <p className="text-slate-500 mb-6">
              Maak een deellink om uw woningpaspoort veilig te delen
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Nieuwe deellink
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateShareModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Link Details Modal */}
      {selectedLink && (
        <LinkDetailsModal 
          link={selectedLink} 
          onClose={() => setSelectedLink(null)} 
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
      `}</style>
    </div>
  )
}

function ShareLinkCard({ 
  link, 
  index, 
  onCopy, 
  isCopied,
  onSelect 
}: { 
  link: ShareLink
  index: number
  onCopy: () => void
  isCopied: boolean
  onSelect: () => void
}) {
  const getTypeIcon = () => {
    switch (link.recipientType) {
      case 'buyer': return Users
      case 'bank': return Building2
      case 'contractor': return Package
      default: return Link2
    }
  }
  const TypeIcon = getTypeIcon()

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          link.status === 'active' ? 'bg-emerald-50' : 'bg-slate-100'
        }`}>
          <TypeIcon className={`w-6 h-6 ${
            link.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-[#1a1a2e]">{link.name}</h3>
            {link.status === 'active' ? (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                Actief
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                Verlopen
              </span>
            )}
          </div>
          
          {link.recipient && (
            <p className="text-sm text-slate-500 mb-2">{link.recipient}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {link.viewCount} weergaven
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {link.expiresAt ? `Verloopt ${new Date(link.expiresAt).toLocaleDateString('nl-NL')}` : 'Geen vervaldatum'}
            </span>
            {link.lastViewed && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Laatst bekeken {new Date(link.lastViewed).toLocaleDateString('nl-NL')}
              </span>
            )}
          </div>

          {/* Permissions */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {link.permissions.map((perm, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-lg">
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {link.status === 'active' && (
            <>
              <button
                onClick={onCopy}
                className={`p-2.5 rounded-xl transition-all ${
                  isCopied 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={onSelect}
                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={onSelect}
            className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateShareModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [shareType, setShareType] = useState<string>('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-slate-500 rotate-45" />
        </button>

        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Nieuwe deellink</h2>
        <p className="text-slate-500 mb-6">Selecteer met wie u wilt delen</p>

        {/* Step 1: Select recipient type */}
        <div className="space-y-3 mb-6">
          {SHARE_TEMPLATES.map((template) => {
            const Icon = template.icon
            const isSelected = shareType === template.id
            return (
              <button
                key={template.id}
                onClick={() => setShareType(template.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-[#1a1a2e] bg-slate-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  template.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  template.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-violet-50 text-violet-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[#1a1a2e]">{template.name}</p>
                  <p className="text-sm text-slate-500">{template.description}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-[#1a1a2e]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Link name input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Naam voor deze link
          </label>
          <input
            type="text"
            placeholder="bijv. 'Bezichtiging Familie Jansen'"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1a1a2e] focus:ring-4 focus:ring-[#1a1a2e]/5 outline-none transition-all"
          />
        </div>

        {/* Expiration */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Vervaldatum
          </label>
          <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1a1a2e] focus:ring-4 focus:ring-[#1a1a2e]/5 outline-none transition-all appearance-none bg-white">
            <option>30 dagen</option>
            <option>60 dagen</option>
            <option>90 dagen</option>
            <option>Geen vervaldatum</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
          >
            Annuleren
          </button>
          <button
            disabled={!shareType}
            className="flex-1 py-3 px-6 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Link aanmaken
          </button>
        </div>
      </div>
    </div>
  )
}

function LinkDetailsModal({ link, onClose }: { link: ShareLink; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-slate-500 rotate-45" />
        </button>

        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">{link.name}</h2>
        <p className="text-slate-500 mb-6">{link.recipient || 'Geen ontvanger opgegeven'}</p>

        {/* Link URL */}
        <div className="p-4 bg-slate-50 rounded-xl mb-6">
          <p className="text-sm text-slate-500 mb-2">Deellink</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-[#1a1a2e] truncate">
              https://helder.nl/share/{link.id}
            </code>
            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <Copy className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-[#1a1a2e]">{link.viewCount}</p>
            <p className="text-xs text-slate-500">Weergaven</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-[#1a1a2e]">{link.permissions.length}</p>
            <p className="text-xs text-slate-500">Rechten</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-[#1a1a2e]">
              {link.expiresAt 
                ? Math.max(0, Math.ceil((new Date(link.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : '∞'}
            </p>
            <p className="text-xs text-slate-500">Dagen over</p>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-600 mb-2">Toegangsrechten</p>
          <div className="flex flex-wrap gap-2">
            {link.permissions.map((perm, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg">
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {link.status === 'active' && (
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all">
              <Trash2 className="w-4 h-4" />
              Intrekken
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  )
}
