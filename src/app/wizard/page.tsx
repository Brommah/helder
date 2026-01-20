'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Home, ArrowLeft, ArrowRight, Check, MapPin,
  Building2, Calendar, Users,
  Zap, Shield, Sparkles, AlertCircle, Loader2
} from 'lucide-react'
import { CereVaultBadge } from '@/components/ui/verified-badge'
import { Logo } from '@/components/ui/logo'

// Nieuwbouw-focused wizard steps
const STEPS = [
  { id: 'intro', title: 'Welkom', icon: Sparkles },
  { id: 'location', title: 'Locatie', icon: MapPin },
  { id: 'property', title: 'Woning', icon: Building2 },
  { id: 'construction', title: 'Bouw', icon: Calendar },
  { id: 'account', title: 'Account', icon: Users },
]

const PROPERTY_TYPES = [
  { id: 'vrijstaand', label: 'Vrijstaand', icon: '🏡', desc: 'Eigen kavel, geen buren' },
  { id: 'twee_onder_een_kap', label: '2-onder-1-kap', icon: '🏘️', desc: 'Gedeelde zijmuur' },
  { id: 'hoekwoning', label: 'Hoekwoning', icon: '🏠', desc: 'Hoek van een rij' },
  { id: 'tussenwoning', label: 'Tussenwoning', icon: '🏘️', desc: 'Midden in een rij' },
]

const CONSTRUCTION_PHASES = [
  { id: 'planning', label: 'Planning/Ontwerp', desc: 'Nog niet gestart met bouwen' },
  { id: 'vergunning', label: 'Vergunning', desc: 'Wachten op bouwvergunning' },
  { id: 'fundering', label: 'Fundering', desc: 'Grondwerk of fundering' },
  { id: 'ruwbouw', label: 'Ruwbouw', desc: 'Muren en vloeren' },
  { id: 'afbouw', label: 'Afbouw', desc: 'Installaties en afwerking' },
  { id: 'oplevering', label: 'Bijna klaar', desc: 'Oplevering nadert' },
]

export default function WizardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Property name
    name: '',

    // Kavel-based location (nieuwbouw addresses may not exist yet)
    kavelNumber: '',
    projectName: '',
    city: '',

    // Property specs
    propertyType: '',
    woonoppervlakte: 150,
    perceelOppervlakte: 400,
    kamers: 5,
    verdiepingen: 2,

    // Construction timeline
    constructionPhase: '',
    startDate: '',
    expectedEnd: '',
    aannemer: '',
  })

  const updateFormData = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const isStepComplete = () => {
    switch (STEPS[currentStep].id) {
      case 'intro':
        return true
      case 'location':
        return formData.city && formData.name
      case 'property':
        return formData.propertyType
      case 'construction':
        return formData.constructionPhase && formData.startDate
      case 'account':
        return true // User is already logged in
      default:
        return false
    }
  }

  const handleComplete = async () => {
    setError('')
    setIsSubmitting(true)

    // Map form data to API schema
    const phaseMap: Record<string, string> = {
      'planning': 'GRONDWERK',
      'vergunning': 'GRONDWERK',
      'fundering': 'GRONDWERK',
      'ruwbouw': 'RUWBOUW',
      'afbouw': 'AFBOUW',
      'oplevering': 'OPLEVERING',
    }

    const typeMap: Record<string, string> = {
      'vrijstaand': 'VRIJSTAAND',
      'twee_onder_een_kap': 'TWEE_ONDER_EEN_KAP',
      'hoekwoning': 'HOEKWONING',
      'tussenwoning': 'TUSSENWONING',
    }

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          kavelNumber: formData.kavelNumber,
          projectName: formData.projectName,
          city: formData.city,
          propertyType: typeMap[formData.propertyType] || 'OTHER',
          woonoppervlakte: formData.woonoppervlakte,
          perceelOppervlakte: formData.perceelOppervlakte,
          aantalKamers: formData.kamers,
          aantalVerdiepingen: formData.verdiepingen,
          startDate: formData.startDate,
          expectedEnd: formData.expectedEnd,
          currentPhase: phaseMap[formData.constructionPhase],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Er is iets misgegaan')
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Er is iets misgegaan bij het aanmaken van uw woning')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/register')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" />
          </Link>
          
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Stap {currentStep + 1} van {STEPS.length}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep
              const isComplete = index < currentStep
              const Icon = step.icon
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 flex items-center justify-center transition-all
                    ${isActive ? 'bg-[#93b9e6] text-slate-900 scale-110' : 
                      isComplete ? 'bg-emerald-500 text-white' : 
                      'bg-slate-200 text-slate-400'}
                  `}>
                    {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-12 h-1 mx-1 transition-colors ${
                      isComplete ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step Content */}
          <div className="bg-white border border-slate-200 p-8">
            {STEPS[currentStep].id === 'intro' && (
              <IntroStep />
            )}
            
            {STEPS[currentStep].id === 'location' && (
              <LocationStep 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            
            {STEPS[currentStep].id === 'property' && (
              <PropertyStep 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            
            {STEPS[currentStep].id === 'construction' && (
              <ConstructionStep 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            
            {STEPS[currentStep].id === 'account' && (
              <AccountStep
                formData={formData}
                session={session}
              />
            )}

            {error && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Vorige
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleComplete}
              disabled={!isStepComplete() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-[#93b9e6] text-slate-900 text-sm font-black uppercase tracking-wider hover:bg-[#7aa8d9] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aanmaken...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Start mijn Woningpaspoort
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!isStepComplete()}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-black uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Volgende
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

function IntroStep() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-slate-900 flex items-center justify-center mx-auto mb-6">
        <Home className="w-10 h-10 text-white" />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wider mb-4">
        Welkom bij Woningpaspoort
      </h1>
      
      <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
        In een paar minuten maakt u het complete digitale dossier van uw nieuwe woning. 
        Alle documenten, foto&apos;s en specificaties van uw nieuwbouwproject op één plek.
      </p>
      
      <div className="grid md:grid-cols-3 gap-1 text-left">
        <div className="p-4 bg-[#93b9e6]/10">
          <Shield className="w-8 h-8 text-[#93b9e6] mb-2" />
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Wkb Compliant</h3>
          <p className="text-sm text-slate-600">
            Voldoet aan alle eisen van de Wet kwaliteitsborging
          </p>
        </div>
        
        <div className="p-4 bg-emerald-50">
          <Zap className="w-8 h-8 text-emerald-600 mb-2" />
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Complete DNA</h3>
          <p className="text-sm text-slate-600">
            Elk materiaal, elke aannemer, elke specificatie
          </p>
        </div>
        
        <div className="p-4 bg-slate-100">
          <Shield className="w-8 h-8 text-slate-600 mb-2" />
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Blockchain Beveiligd</h3>
          <p className="text-sm text-slate-600">
            Cryptografisch geverifieerd via Cere Network
          </p>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-200">
        <CereVaultBadge />
      </div>
    </div>
  )
}

function LocationStep({
  formData,
  updateFormData
}: {
  formData: any
  updateFormData: (key: string, value: any) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#93b9e6]/10">
          <MapPin className="w-6 h-6 text-[#93b9e6]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Uw nieuwbouwproject</h2>
          <p className="text-slate-500">Geef uw project een naam en locatie</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Projectnaam *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Bijv. Villa Zonneweide"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
          />
          <p className="text-sm text-slate-500 mt-1">
            Kies een naam voor uw woningpaspoort
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Kavelnummer</label>
            <input
              type="text"
              value={formData.kavelNumber}
              onChange={(e) => updateFormData('kavelNumber', e.target.value)}
              placeholder="Bijv. Kavel 12"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Wijk/Project</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => updateFormData('projectName', e.target.value)}
              placeholder="Bijv. De Buitenplaats"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Plaats *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            placeholder="Bijv. Almere"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
          />
        </div>

        <div className="p-4 bg-amber-50 border-l-4 border-amber-500">
          <p className="text-sm text-amber-800">
            <strong>Nieuwbouw?</strong> Geen probleem als uw adres nog niet bestaat.
            U kunt kavelnummer en wijk opgeven. Het officiële adres wordt later toegevoegd
            zodra uw woning is geregistreerd in de BAG.
          </p>
        </div>
      </div>
    </div>
  )
}

function PropertyStep({ 
  formData, 
  updateFormData 
}: { 
  formData: any
  updateFormData: (key: string, value: any) => void 
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#93b9e6]/10">
          <Building2 className="w-6 h-6 text-[#93b9e6]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Type woning</h2>
          <p className="text-slate-500">Wat voor woning wordt er gebouwd?</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Property Type */}
        <div className="grid grid-cols-2 gap-1">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => updateFormData('propertyType', type.id)}
              className={`p-4 border-2 text-left transition-all ${
                formData.propertyType === type.id
                  ? 'border-[#93b9e6] bg-[#93b9e6]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-black text-slate-900 uppercase tracking-wider text-sm">{type.label}</div>
              <div className="text-sm text-slate-500">{type.desc}</div>
            </button>
          ))}
        </div>
        
        {/* Size */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Woonoppervlakte (m²)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="80"
              max="350"
              step="5"
              value={formData.woonoppervlakte}
              onChange={(e) => updateFormData('woonoppervlakte', Number(e.target.value))}
              className="flex-1 accent-[#93b9e6]"
            />
            <div className="w-20 text-center">
              <span className="text-2xl font-black text-[#93b9e6]">{formData.woonoppervlakte}</span>
              <span className="text-slate-500 text-sm ml-1">m²</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Perceeloppervlakte (m²)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="150"
              max="1000"
              step="25"
              value={formData.perceelOppervlakte}
              onChange={(e) => updateFormData('perceelOppervlakte', Number(e.target.value))}
              className="flex-1 accent-[#93b9e6]"
            />
            <div className="w-20 text-center">
              <span className="text-2xl font-black text-[#93b9e6]">{formData.perceelOppervlakte}</span>
              <span className="text-slate-500 text-sm ml-1">m²</span>
            </div>
          </div>
        </div>
        
        {/* Rooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Aantal kamers</label>
            <select
              value={formData.kamers}
              onChange={(e) => updateFormData('kamers', Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} kamers</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Verdiepingen</label>
            <select
              value={formData.verdiepingen}
              onChange={(e) => updateFormData('verdiepingen', Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
            >
              {[1, 2, 3].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'verdieping' : 'verdiepingen'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConstructionStep({ 
  formData, 
  updateFormData 
}: { 
  formData: any
  updateFormData: (key: string, value: any) => void 
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#93b9e6]/10">
          <Calendar className="w-6 h-6 text-[#93b9e6]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Bouwstatus</h2>
          <p className="text-slate-500">In welke fase bevindt de bouw zich?</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Construction Phase */}
        <div className="space-y-1">
          {CONSTRUCTION_PHASES.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => updateFormData('constructionPhase', phase.id)}
              className={`w-full p-4 border-2 text-left transition-all flex items-center gap-4 ${
                formData.constructionPhase === phase.id
                  ? 'border-[#93b9e6] bg-[#93b9e6]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center text-lg font-black ${
                formData.constructionPhase === phase.id
                  ? 'bg-[#93b9e6] text-slate-900'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-black text-slate-900 uppercase tracking-wider text-sm">{phase.label}</div>
                <div className="text-sm text-slate-500">{phase.desc}</div>
              </div>
              {formData.constructionPhase === phase.id && (
                <Check className="w-5 h-5 text-[#93b9e6] ml-auto" />
              )}
            </button>
          ))}
        </div>
        
        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Startdatum bouw *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData('startDate', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Verwachte oplevering</label>
            <input
              type="date"
              value={formData.expectedEnd}
              onChange={(e) => updateFormData('expectedEnd', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Builder Info */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Naam aannemer (optioneel)</label>
          <input
            type="text"
            value={formData.aannemer}
            onChange={(e) => updateFormData('aannemer', e.target.value)}
            placeholder="Bijv. Helder Woningbouw"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:outline-none transition-colors"
          />
          <p className="text-sm text-slate-500 mt-1">
            Uw aannemer kan later foto&apos;s sturen via WhatsApp
          </p>
        </div>
      </div>
    </div>
  )
}

function AccountStep({
  formData,
  session,
}: {
  formData: any
  session: any
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#93b9e6]/10">
          <Users className="w-6 h-6 text-[#93b9e6]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Bevestig uw gegevens</h2>
          <p className="text-slate-500">Controleer en maak uw woningpaspoort aan</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Logged in user */}
        <div className="p-4 bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white font-black">
              {session?.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
            </div>
            <div>
              <p className="font-black text-slate-900">{session?.user?.name || 'Gebruiker'}</p>
              <p className="text-sm text-slate-500">{session?.user?.email}</p>
            </div>
            <Check className="w-5 h-5 text-emerald-500 ml-auto" />
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-slate-50">
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-3">Samenvatting woningpaspoort</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Naam</span>
              <span className="font-bold text-slate-900">{formData.name || '-'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Locatie</span>
              <span className="font-bold text-slate-900">
                {[formData.kavelNumber, formData.projectName, formData.city].filter(Boolean).join(', ') || '-'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Type</span>
              <span className="font-bold text-slate-900">{PROPERTY_TYPES.find(t => t.id === formData.propertyType)?.label || '-'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Woonoppervlakte</span>
              <span className="font-bold text-slate-900">{formData.woonoppervlakte} m²</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Bouwfase</span>
              <span className="font-bold text-slate-900">{CONSTRUCTION_PHASES.find(p => p.id === formData.constructionPhase)?.label || '-'}</span>
            </div>
            {formData.startDate && (
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Startdatum</span>
                <span className="font-bold text-slate-900">{new Date(formData.startDate).toLocaleDateString('nl-NL')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="font-black text-emerald-800 uppercase tracking-wider text-sm">Klaar om te starten</h4>
              <p className="text-sm text-emerald-700 mt-1">
                Uw woningpaspoort wordt beveiligd met cryptografische verificatie.
                Alle documenten worden onveranderbaar vastgelegd.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
