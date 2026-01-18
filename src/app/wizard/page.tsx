'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HousePreferences } from '@/types'

const steps = [
  { id: 'style', title: 'Bouwstijl', description: 'Wat voor huis droomt u van?' },
  { id: 'size', title: 'Grootte', description: 'Hoeveel ruimte heeft u nodig?' },
  { id: 'rooms', title: 'Indeling', description: 'Kamers en voorzieningen' },
  { id: 'energy', title: 'Energie', description: 'Duurzaamheid en energielabel' },
  { id: 'budget', title: 'Budget', description: 'Uw financiële kaders' },
  { id: 'contact', title: 'Contact', description: 'Start uw woningpaspoort' },
]

const styles = [
  { id: 'modern', label: 'Modern', desc: 'Strakke lijnen, veel glas' },
  { id: 'traditional', label: 'Traditioneel', desc: 'Klassieke Nederlandse stijl' },
  { id: 'minimalist', label: 'Minimalistisch', desc: 'Eenvoud en rust' },
  { id: 'industrial', label: 'Industrieel', desc: 'Robuust en stoer' },
  { id: 'rural', label: 'Landelijk', desc: 'Warm en gezellig' },
]

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState<Partial<HousePreferences>>({})

  const updatePreference = <K extends keyof HousePreferences>(
    key: K,
    value: HousePreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'style':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => updatePreference('style', style.id as HousePreferences['style'])}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  preferences.style === style.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{style.label}</div>
                <div className="text-sm text-gray-500">{style.desc}</div>
              </button>
            ))}
          </div>
        )

      case 'size':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Woonoppervlakte (m²)
              </label>
              <input
                type="range"
                min="80"
                max="400"
                step="10"
                value={preferences.livingArea || 150}
                onChange={e => updatePreference('livingArea', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-2xl font-bold text-primary-600 mt-2">
                {preferences.livingArea || 150} m²
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Aantal verdiepingen
              </label>
              <div className="flex gap-4">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => updatePreference('floors', n)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                      preferences.floors === n
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {n} {n === 1 ? 'laag' : 'lagen'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'rooms':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slaapkamers</label>
                <select
                  value={preferences.bedrooms || 3}
                  onChange={e => updatePreference('bedrooms', Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Badkamers</label>
                <select
                  value={preferences.bathrooms || 1}
                  onChange={e => updatePreference('bathrooms', Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.hasGarage || false}
                  onChange={e => updatePreference('hasGarage', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span>Garage</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.hasBasement || false}
                  onChange={e => updatePreference('hasBasement', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span>Kelder</span>
              </label>
            </div>
          </div>
        )

      case 'energy':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Gewenst energielabel</label>
              <div className="flex gap-2">
                {['A++++', 'A+++', 'A++', 'A+', 'A'].map(label => (
                  <button
                    key={label}
                    onClick={() => updatePreference('energyLabel', label as HousePreferences['energyLabel'])}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium ${
                      preferences.energyLabel === label
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.solarPanels || false}
                  onChange={e => updatePreference('solarPanels', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span>Zonnepanelen</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.heatPump || false}
                  onChange={e => updatePreference('heatPump', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span>Warmtepomp</span>
              </label>
            </div>
          </div>
        )

      case 'budget':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Budget range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Minimum</label>
                  <input
                    type="number"
                    step="50000"
                    value={preferences.budgetMin || 300000}
                    onChange={e => updatePreference('budgetMin', Number(e.target.value))}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Maximum</label>
                  <input
                    type="number"
                    step="50000"
                    value={preferences.budgetMax || 500000}
                    onChange={e => updatePreference('budgetMax', Number(e.target.value))}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Locatie (optioneel)</label>
              <input
                type="text"
                placeholder="Stad of regio"
                value={preferences.city || ''}
                onChange={e => updatePreference('city', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Vul uw gegevens in om uw persoonlijke woningpaspoort te starten.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Naam</label>
              <input
                type="text"
                value={preferences.name || ''}
                onChange={e => updatePreference('name', e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Uw naam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mailadres</label>
              <input
                type="email"
                value={preferences.email || ''}
                onChange={e => updatePreference('email', e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="email@voorbeeld.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefoon (optioneel)</label>
              <input
                type="tel"
                value={preferences.phone || ''}
                onChange={e => updatePreference('phone', e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="06-12345678"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Submit and redirect to dashboard
      console.log('Wizard complete:', preferences)
      window.location.href = '/dashboard'
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Woningpaspoort
          </Link>
          <span className="text-sm text-gray-500">
            Stap {currentStep + 1} van {steps.length}
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 text-center ${
                  index <= currentStep ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-primary-600 text-white'
                      : index === currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <p className="text-xs mt-1 hidden sm:block">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Vorige
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {currentStep === steps.length - 1 ? 'Start mijn woningpaspoort' : 'Volgende'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
