'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { 
  ArrowRight, ArrowLeft, Check, Home, MapPin, Users, Star,
  Euro, Ruler, Heart, Trees, Palette, Sun, Moon, Sparkles,
  Building2, Car, Utensils, Baby, Dog, Briefcase, Dumbbell,
  Music, Book, Flower, Shield, Zap, ChevronRight
} from 'lucide-react'

type Section = 'plot' | 'living' | 'style' | 'priorities' | 'budget' | 'complete'

interface IntakeData {
  // Plot
  plotSize: number
  plotShape: string
  plotOrientation: string
  plotViews: string[]
  
  // Living
  householdSize: number
  bedrooms: number
  bathrooms: number
  homeOffice: boolean
  guestRoom: boolean
  multiGenerational: boolean
  
  // Style
  architectureStyle: string
  interiorMood: string
  colorPalette: string
  keyFeatures: string[]
  
  // Priorities
  topPriorities: string[]
  mustHaves: string[]
  niceToHaves: string[]
  
  // Budget
  totalBudget: number
  budgetFlexibility: string
  timeline: string
}

const initialData: IntakeData = {
  plotSize: 500,
  plotShape: '',
  plotOrientation: '',
  plotViews: [],
  householdSize: 4,
  bedrooms: 4,
  bathrooms: 2,
  homeOffice: true,
  guestRoom: false,
  multiGenerational: false,
  architectureStyle: '',
  interiorMood: '',
  colorPalette: '',
  keyFeatures: [],
  topPriorities: [],
  mustHaves: [],
  niceToHaves: [],
  totalBudget: 550000,
  budgetFlexibility: '',
  timeline: '',
}

export default function IntakePage({ params }: { params: { projectId: string } }) {
  const [currentSection, setCurrentSection] = useState<Section>('plot')
  const [data, setData] = useState<IntakeData>(initialData)

  const sections: Section[] = ['plot', 'living', 'style', 'priorities', 'budget', 'complete']
  const currentIndex = sections.indexOf(currentSection)
  const progress = (currentIndex / (sections.length - 1)) * 100

  const updateData = <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: keyof IntakeData, item: string) => {
    const currentArray = data[key] as string[]
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item]
    updateData(key, newArray as IntakeData[typeof key])
  }

  const nextSection = () => {
    const next = currentIndex + 1
    if (next < sections.length) {
      setCurrentSection(sections[next])
    }
  }

  const prevSection = () => {
    const prev = currentIndex - 1
    if (prev >= 0) {
      setCurrentSection(sections[prev])
    }
  }

  const sectionLabels: Record<Section, string> = {
    plot: 'Uw kavel',
    living: 'Leefruimtes',
    style: 'Stijl & sfeer',
    priorities: 'Prioriteiten',
    budget: 'Budget',
    complete: 'Gereed',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Logo size="md" />
            <span className="text-sm text-slate-500">Droomhuis Intake</span>
          </div>
          
          {/* Progress */}
          {currentSection !== 'complete' && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-600 w-20">
                {currentIndex + 1} / {sections.length - 1}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {currentSection === 'plot' && (
          <PlotSection data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
        )}
        {currentSection === 'living' && (
          <LivingSection data={data} updateData={updateData} />
        )}
        {currentSection === 'style' && (
          <StyleSection data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
        )}
        {currentSection === 'priorities' && (
          <PrioritiesSection data={data} toggleArrayItem={toggleArrayItem} />
        )}
        {currentSection === 'budget' && (
          <BudgetSection data={data} updateData={updateData} />
        )}
        {currentSection === 'complete' && (
          <CompleteSection data={data} />
        )}
      </main>

      {/* Navigation */}
      {currentSection !== 'complete' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 safe-bottom">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            {currentIndex > 0 ? (
              <button
                onClick={prevSection}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-[#1a1a2e] font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Vorige
              </button>
            ) : (
              <div />
            )}
            
            <button
              onClick={nextSection}
              className="flex items-center gap-2 px-8 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              {currentSection === 'budget' ? 'Afronden' : 'Volgende'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

// Section Components
function PlotSection({ 
  data, 
  updateData, 
  toggleArrayItem 
}: { 
  data: IntakeData
  updateData: <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => void
  toggleArrayItem: (key: keyof IntakeData, item: string) => void
}) {
  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Trees className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="text-sm font-medium text-emerald-600">Stap 1 van 5</span>
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Uw kavel</h1>
      <p className="text-slate-600 mb-8">Vertel ons over de bouwgrond waarop uw droomhuis komt.</p>

      <div className="space-y-8">
        {/* Plot Size */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Kavelgrootte
          </label>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-500">Oppervlakte</span>
            <span className="font-bold text-[#1a1a2e]">{data.plotSize} m²</span>
          </div>
          <input
            type="range"
            min="200"
            max="1500"
            step="25"
            value={data.plotSize}
            onChange={(e) => updateData('plotSize', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>200 m²</span>
            <span>1500 m²</span>
          </div>
        </div>

        {/* Plot Shape */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Kavelvorm
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'rectangular', label: 'Rechthoekig', desc: 'Standaard vorm' },
              { value: 'square', label: 'Vierkant', desc: 'Gelijke zijden' },
              { value: 'irregular', label: 'Onregelmatig', desc: 'Afwijkende vorm' },
              { value: 'corner', label: 'Hoekperceel', desc: 'Twee straten' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('plotShape', option.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.plotShape === option.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block font-medium text-[#1a1a2e]">{option.label}</span>
                <span className="text-sm text-slate-500">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Tuin oriëntatie (achtertuin richting)
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'north', label: 'Noord', icon: '↑' },
              { value: 'east', label: 'Oost', icon: '→' },
              { value: 'south', label: 'Zuid', icon: '↓' },
              { value: 'west', label: 'West', icon: '←' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('plotOrientation', option.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  data.plotOrientation === option.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl mb-1 block">{option.icon}</span>
                <span className="text-sm font-medium text-[#1a1a2e]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Uitzicht (meerdere mogelijk)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'water', label: 'Water' },
              { value: 'nature', label: 'Natuur / Groen' },
              { value: 'open', label: 'Open landschap' },
              { value: 'residential', label: 'Woonwijk' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => toggleArrayItem('plotViews', option.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.plotViews.includes(option.value)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-medium text-[#1a1a2e]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LivingSection({ 
  data, 
  updateData 
}: { 
  data: IntakeData
  updateData: <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => void
}) {
  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Home className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-blue-600">Stap 2 van 5</span>
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Leefruimtes</h1>
      <p className="text-slate-600 mb-8">Hoe wilt u wonen? Vertel over uw gezin en ruimtebehoeftes.</p>

      <div className="space-y-8">
        {/* Household */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Huishoudgrootte
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => updateData('householdSize', num)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  data.householdSize === num
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Users className={`w-6 h-6 mx-auto mb-1 ${data.householdSize === num ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="font-bold text-[#1a1a2e]">{num}{num >= 6 ? '+' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block font-semibold text-[#1a1a2e] mb-4">Slaapkamers</label>
            <div className="flex items-center justify-between">
              <button
                onClick={() => updateData('bedrooms', Math.max(1, data.bedrooms - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-bold"
              >
                -
              </button>
              <span className="text-3xl font-bold text-[#1a1a2e]">{data.bedrooms}</span>
              <button
                onClick={() => updateData('bedrooms', Math.min(8, data.bedrooms + 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block font-semibold text-[#1a1a2e] mb-4">Badkamers</label>
            <div className="flex items-center justify-between">
              <button
                onClick={() => updateData('bathrooms', Math.max(1, data.bathrooms - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-bold"
              >
                -
              </button>
              <span className="text-3xl font-bold text-[#1a1a2e]">{data.bathrooms}</span>
              <button
                onClick={() => updateData('bathrooms', Math.min(5, data.bathrooms + 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Special Rooms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Speciale ruimtes
          </label>
          <div className="space-y-3">
            {[
              { key: 'homeOffice', label: 'Thuiswerkplek / kantoor', icon: Briefcase },
              { key: 'guestRoom', label: 'Logeerkamer', icon: Users },
              { key: 'multiGenerational', label: 'Inwoning / mantelzorg', icon: Heart },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => updateData(item.key as keyof IntakeData, !data[item.key as keyof IntakeData])}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  data[item.key as keyof IntakeData]
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${data[item.key as keyof IntakeData] ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-[#1a1a2e]">{item.label}</span>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  data[item.key as keyof IntakeData] ? 'bg-blue-500' : 'bg-slate-200'
                }`}>
                  {data[item.key as keyof IntakeData] && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StyleSection({ 
  data, 
  updateData,
  toggleArrayItem 
}: { 
  data: IntakeData
  updateData: <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => void
  toggleArrayItem: (key: keyof IntakeData, item: string) => void
}) {
  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <Palette className="w-5 h-5 text-violet-600" />
        </div>
        <span className="text-sm font-medium text-violet-600">Stap 3 van 5</span>
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Stijl & sfeer</h1>
      <p className="text-slate-600 mb-8">Hoe moet uw droomhuis eruitzien en aanvoelen?</p>

      <div className="space-y-8">
        {/* Architecture Style */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Architectuurstijl
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'modern', label: 'Modern', desc: 'Strak, veel glas, plat dak' },
              { value: 'traditional', label: 'Traditioneel', desc: 'Klassiek, pannendak' },
              { value: 'countryside', label: 'Landelijk', desc: 'Warm, natuurlijk, riet' },
              { value: 'industrial', label: 'Industrieel', desc: 'Raw, staal, beton' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('architectureStyle', option.value)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  data.architectureStyle === option.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block font-semibold text-[#1a1a2e] mb-1">{option.label}</span>
                <span className="text-sm text-slate-500">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interior Mood */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Interieur sfeer
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'minimalist', label: 'Minimalistisch', icon: '◻️' },
              { value: 'cozy', label: 'Warm & gezellig', icon: '🛋️' },
              { value: 'luxurious', label: 'Luxe & elegant', icon: '✨' },
              { value: 'natural', label: 'Natuurlijk', icon: '🌿' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('interiorMood', option.value)}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  data.interiorMood === option.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <span className="font-medium text-[#1a1a2e]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Belangrijke kenmerken (meerdere mogelijk)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Veel licht', 'Open keuken', 'Vide', 'Serre', 
              'Garage', 'Kelder', 'Zolder', 'Terras op verdieping',
              'Sauna', 'Zwembad', 'Buitenkeuken', 'Grote tuin'
            ].map((feature) => (
              <button
                key={feature}
                onClick={() => toggleArrayItem('keyFeatures', feature)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  data.keyFeatures.includes(feature)
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PrioritiesSection({ 
  data, 
  toggleArrayItem 
}: { 
  data: IntakeData
  toggleArrayItem: (key: keyof IntakeData, item: string) => void
}) {
  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-600" />
        </div>
        <span className="text-sm font-medium text-amber-600">Stap 4 van 5</span>
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Prioriteiten</h1>
      <p className="text-slate-600 mb-8">Wat is voor u het allerbelangrijkst?</p>

      <div className="space-y-8">
        {/* Top Priorities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-2">
            Top 3 prioriteiten
          </label>
          <p className="text-sm text-slate-500 mb-4">Selecteer maximaal 3</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'energy', label: 'Energiezuinigheid', icon: Zap },
              { value: 'space', label: 'Veel ruimte', icon: Ruler },
              { value: 'quality', label: 'Kwaliteit materialen', icon: Shield },
              { value: 'design', label: 'Uniek design', icon: Sparkles },
              { value: 'budget', label: 'Binnen budget', icon: Euro },
              { value: 'timeline', label: 'Snelle oplevering', icon: ArrowRight },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  if (data.topPriorities.length < 3 || data.topPriorities.includes(option.value)) {
                    toggleArrayItem('topPriorities', option.value)
                  }
                }}
                disabled={data.topPriorities.length >= 3 && !data.topPriorities.includes(option.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.topPriorities.includes(option.value)
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <option.icon className={`w-5 h-5 mb-2 ${data.topPriorities.includes(option.value) ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="font-medium text-[#1a1a2e]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Must-haves */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Absolute must-haves
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Vloerverwarming', 'Airco', 'Zonnepanelen', 'Thuisbatterij',
              'Laadpaal', 'Alarmsysteem', 'Smart home', 'Warmtepomp'
            ].map((item) => (
              <button
                key={item}
                onClick={() => toggleArrayItem('mustHaves', item)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  data.mustHaves.includes(item)
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BudgetSection({ 
  data, 
  updateData 
}: { 
  data: IntakeData
  updateData: <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => void
}) {
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Euro className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="text-sm font-medium text-emerald-600">Stap 5 van 5</span>
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Budget & planning</h1>
      <p className="text-slate-600 mb-8">Tot slot: uw financiële kaders en timing.</p>

      <div className="space-y-8">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Totaalbudget (bouw + afwerking)
          </label>
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-[#1a1a2e]">{formatBudget(data.totalBudget)}</span>
          </div>
          <input
            type="range"
            min="350000"
            max="1000000"
            step="10000"
            value={data.totalBudget}
            onChange={(e) => updateData('totalBudget', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>€350.000</span>
            <span>€1.000.000</span>
          </div>
        </div>

        {/* Budget Flexibility */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Budgetflexibiliteit
          </label>
          <div className="space-y-3">
            {[
              { value: 'strict', label: 'Strikt', desc: 'Maximaal 5% overschrijding' },
              { value: 'moderate', label: 'Gemiddeld', desc: '10-15% buffer mogelijk' },
              { value: 'flexible', label: 'Flexibel', desc: 'Kwaliteit gaat voor prijs' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('budgetFlexibility', option.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  data.budgetFlexibility === option.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block font-medium text-[#1a1a2e]">{option.label}</span>
                <span className="text-sm text-slate-500">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-lg font-semibold text-[#1a1a2e] mb-4">
            Gewenste oplevering
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '12months', label: 'Binnen 12 maanden' },
              { value: '18months', label: 'Binnen 18 maanden' },
              { value: '24months', label: 'Binnen 2 jaar' },
              { value: 'flexible', label: 'Flexibel' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('timeline', option.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  data.timeline === option.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-medium text-[#1a1a2e]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompleteSection({ data }: { data: IntakeData }) {
  return (
    <div className="animate-fade-in text-center py-8">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-12 h-12 text-emerald-600" />
      </div>

      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">
        Bedankt voor uw intake!
      </h1>
      <p className="text-slate-600 mb-8 max-w-lg mx-auto">
        We hebben al uw wensen ontvangen. Ons team gaat aan de slag met een 
        eerste schets en begroting op basis van uw input.
      </p>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left mb-8 max-w-lg mx-auto">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Uw specificaties</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Kavelgrootte</span>
            <span className="font-medium text-[#1a1a2e]">{data.plotSize} m²</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Slaapkamers</span>
            <span className="font-medium text-[#1a1a2e]">{data.bedrooms}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Stijl</span>
            <span className="font-medium text-[#1a1a2e] capitalize">{data.architectureStyle || 'Nog te bepalen'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Budget</span>
            <span className="font-medium text-[#1a1a2e]">
              {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(data.totalBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-amber-50 rounded-2xl p-6 text-left mb-8 max-w-lg mx-auto">
        <h3 className="font-semibold text-[#1a1a2e] mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Volgende stappen
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-amber-600 mt-0.5" />
            <span>We bellen u binnen 2 werkdagen</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-amber-600 mt-0.5" />
            <span>Eerste schets binnen 1 week</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-amber-600 mt-0.5" />
            <span>Indicatieve begroting erbij</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-[#1a1a2e] font-semibold rounded-xl hover:bg-slate-200 transition-all"
        >
          Terug naar home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-xl transition-all"
        >
          Naar uw project
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
