'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/footer'
import { 
  ArrowRight, ArrowLeft, Home, Ruler, Trees,
  ChevronDown, ChevronUp, Info, Sparkles, Check, AlertCircle
} from 'lucide-react'

interface BudgetBreakdown {
  plot: number
  construction: number
  finishing: number
  technical: number
  outdoor: number
  contingency: number
  fees: number
}

const PRICE_PER_M2 = {
  basic: 2200,
  standard: 2800,
  premium: 3500,
}

const PLOT_PRICES = {
  randstad: 600,
  urban: 450,
  suburban: 350,
  rural: 250,
}

export default function CalculatorPage() {
  const [plotSize, setPlotSize] = useState(400)
  const [livingArea, setLivingArea] = useState(160)
  const [plotLocation, setPlotLocation] = useState<keyof typeof PLOT_PRICES>('suburban')
  const [finishLevel, setFinishLevel] = useState<keyof typeof PRICE_PER_M2>('standard')
  const [hasPlot, setHasPlot] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const breakdown = useMemo<BudgetBreakdown>(() => {
    const plotCost = hasPlot ? 0 : plotSize * PLOT_PRICES[plotLocation]
    const constructionCost = livingArea * PRICE_PER_M2[finishLevel]
    const finishingCost = livingArea * (finishLevel === 'basic' ? 200 : finishLevel === 'standard' ? 400 : 700)
    const technicalCost = livingArea * 150
    const outdoorCost = plotSize * 40
    const fees = (plotCost + constructionCost) * 0.08
    const subtotal = plotCost + constructionCost + finishingCost + technicalCost + outdoorCost + fees
    const contingency = subtotal * 0.1

    return {
      plot: plotCost,
      construction: constructionCost,
      finishing: finishingCost,
      technical: technicalCost,
      outdoor: outdoorCost,
      fees,
      contingency,
    }
  }, [plotSize, livingArea, plotLocation, finishLevel, hasPlot])

  const totalBudget = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Link 
            href="/assessment" 
            className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-900 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
              <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">BUDGET CALCULATOR</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-6">
              WAT KOST
              <br />
              <span className="text-[#93b9e6]">UW DROOMHUIS?</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl">
              Krijg direct een realistische inschatting van uw bouwbudget. 
              Pas de parameters aan om te zien wat er mogelijk is.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Left: Controls */}
              <div className="space-y-1">
                {/* Plot */}
                <div className="bg-slate-50 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Trees className="w-6 h-6 text-[#93b9e6]" />
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-wider">KAVEL</h3>
                      <p className="text-sm text-slate-500">Bouwgrond</p>
                    </div>
                  </div>

                  {/* Has Plot Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white mb-6">
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">Ik heb al een kavel</span>
                    <button
                      onClick={() => setHasPlot(!hasPlot)}
                      className={`w-14 h-8 transition-colors ${hasPlot ? 'bg-[#93b9e6]' : 'bg-slate-300'}`}
                    >
                      <div className={`w-6 h-6 bg-white shadow transition-transform ${hasPlot ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {!hasPlot && (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Kavelgrootte</span>
                          <span className="font-black text-slate-900">{plotSize} m²</span>
                        </div>
                        <input
                          type="range"
                          min="200"
                          max="1000"
                          step="25"
                          value={plotSize}
                          onChange={(e) => setPlotSize(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-[#93b9e6]"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1 font-bold">
                          <span>200 m²</span>
                          <span>1000 m²</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-3">Locatie</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'randstad', label: 'RANDSTAD', price: '€600/m²' },
                            { key: 'urban', label: 'GROTE STAD', price: '€450/m²' },
                            { key: 'suburban', label: 'VOORSTAD', price: '€350/m²' },
                            { key: 'rural', label: 'LANDELIJK', price: '€250/m²' },
                          ].map((loc) => (
                            <button
                              key={loc.key}
                              onClick={() => setPlotLocation(loc.key as keyof typeof PLOT_PRICES)}
                              className={`p-4 text-left transition-all ${
                                plotLocation === loc.key
                                  ? 'bg-[#93b9e6] text-white'
                                  : 'bg-white hover:bg-slate-100'
                              }`}
                            >
                              <span className="block font-black text-xs uppercase tracking-wider">{loc.label}</span>
                              <span className={`text-xs ${plotLocation === loc.key ? 'text-white/70' : 'text-slate-500'}`}>{loc.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Living Area */}
                <div className="bg-slate-50 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Ruler className="w-6 h-6 text-[#93b9e6]" />
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-wider">WOONOPPERVLAKTE</h3>
                      <p className="text-sm text-slate-500">Binnenruimte</p>
                    </div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Oppervlakte</span>
                    <span className="font-black text-slate-900">{livingArea} m²</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    step="10"
                    value={livingArea}
                    onChange={(e) => setLivingArea(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-[#93b9e6]"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1 font-bold">
                    <span>100 m²</span>
                    <span>300 m²</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-6">
                    {[
                      { label: 'COMPACT', value: 120 },
                      { label: 'STANDAARD', value: 160 },
                      { label: 'RUIM', value: 200 },
                      { label: 'VILLA', value: 250 },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setLivingArea(preset.value)}
                        className={`py-3 text-[10px] font-black uppercase tracking-wider transition-all ${
                          livingArea === preset.value
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finish Level */}
                <div className="bg-slate-50 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Sparkles className="w-6 h-6 text-[#93b9e6]" />
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-wider">AFWERKINGSNIVEAU</h3>
                      <p className="text-sm text-slate-500">Kwaliteit en materialen</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'basic', label: 'BASIS', price: '€2.200/m²', desc: 'Functioneel en degelijk' },
                      { key: 'standard', label: 'STANDAARD', price: '€2.800/m²', desc: 'Comfort en kwaliteit' },
                      { key: 'premium', label: 'PREMIUM', price: '€3.500/m²', desc: 'Luxe en top afwerking' },
                    ].map((level) => (
                      <button
                        key={level.key}
                        onClick={() => setFinishLevel(level.key as keyof typeof PRICE_PER_M2)}
                        className={`w-full p-4 text-left transition-all ${
                          finishLevel === level.key
                            ? 'bg-[#93b9e6]'
                            : 'bg-white hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`font-black text-sm uppercase tracking-wider ${finishLevel === level.key ? 'text-white' : 'text-slate-900'}`}>{level.label}</span>
                            <span className={`block text-xs mt-1 ${finishLevel === level.key ? 'text-white/70' : 'text-slate-500'}`}>{level.desc}</span>
                          </div>
                          <span className={`text-sm font-black ${finishLevel === level.key ? 'text-white' : 'text-slate-400'}`}>
                            {level.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Result */}
              <div>
                <div className="sticky top-24">
                  {/* Total Card */}
                  <div className="bg-slate-900 p-8 lg:p-12 mb-1">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">GESCHAT TOTAALBUDGET</p>
                        <p className="text-4xl lg:text-6xl font-black text-white tracking-tight">{formatCurrency(totalBudget)}</p>
                      </div>
                      <div className="w-16 h-16 bg-[#93b9e6] flex items-center justify-center">
                        <Home className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
                      <Info className="w-4 h-4" />
                      <span>Inclusief 10% onvoorzien</span>
                    </div>

                    <div className="grid grid-cols-3 gap-px bg-white/10">
                      <div className="bg-slate-900 p-4 text-center">
                        <p className="text-2xl font-black text-white">{livingArea}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">m² wonen</p>
                      </div>
                      <div className="bg-slate-900 p-4 text-center">
                        <p className="text-2xl font-black text-white">{plotSize}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">m² kavel</p>
                      </div>
                      <div className="bg-slate-900 p-4 text-center">
                        <p className="text-2xl font-black text-[#93b9e6]">{formatCurrency(totalBudget / livingArea).replace('€', '€')}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">per m²</p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-slate-50 p-8 mb-1">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full flex items-center justify-between"
                    >
                      <span className="font-black text-slate-900 uppercase tracking-wider text-sm">Kostenopbouw</span>
                      {showDetails ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {showDetails && (
                      <div className="mt-6 space-y-3">
                        {[
                          { label: 'Kavel', value: breakdown.plot, show: !hasPlot },
                          { label: 'Ruwbouw', value: breakdown.construction, show: true },
                          { label: 'Afwerking', value: breakdown.finishing, show: true },
                          { label: 'Installaties', value: breakdown.technical, show: true },
                          { label: 'Tuin & buiten', value: breakdown.outdoor, show: true },
                          { label: 'Leges & kosten', value: breakdown.fees, show: true },
                          { label: 'Onvoorzien (10%)', value: breakdown.contingency, show: true },
                        ].filter(item => item.show).map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                            <span className="text-sm text-slate-600">{item.label}</span>
                            <span className="font-black text-slate-900">{formatCurrency(item.value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="space-y-1">
                    <Link
                      href="/consultation"
                      className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-[#93b9e6] text-white font-black uppercase tracking-wider text-sm hover:bg-slate-900 transition-colors"
                    >
                      BESPREEK DIT BUDGET
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/assessment"
                      className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-slate-100 text-slate-900 font-black uppercase tracking-wider text-sm hover:bg-slate-200 transition-colors"
                    >
                      DOE EERST DE BOUWTEST
                    </Link>
                  </div>

                  <p className="mt-6 text-xs text-slate-400 text-center">
                    Dit is een indicatie. Werkelijke kosten kunnen afwijken. 
                    Vraag persoonlijk advies voor een nauwkeurige begroting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <h2 className="text-[2rem] lg:text-[3rem] font-black text-slate-900 uppercase tracking-tight mb-12 text-center">
              WAT KRIJGT U<br /><span className="text-slate-300">VOOR DIT BUDGET?</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-px bg-slate-200">
              {[
                {
                  type: 'BESTAANDE WONING',
                  budget: formatCurrency(totalBudget),
                  features: [
                    'Onbekende bouwgeschiedenis',
                    'Mogelijk renovatie nodig',
                    'Geen ontwerpvrijheid',
                    'Papieren in een la',
                  ],
                  negative: true,
                },
                {
                  type: 'CATALOGUSWONING',
                  budget: formatCurrency(totalBudget * 0.9),
                  features: [
                    'Beperkte aanpassingen',
                    'Standaard indeling',
                    'Basis documentatie',
                    'Builder bepaalt tempo',
                  ],
                  negative: true,
                },
                {
                  type: 'BOUWEN MET HELDER',
                  budget: formatCurrency(totalBudget),
                  features: [
                    '100% maatwerk',
                    'Complete Woningpaspoort',
                    'Uw team van specialisten',
                    'Elke keuze gedocumenteerd',
                  ],
                  negative: false,
                },
              ].map((option, i) => (
                <div 
                  key={i} 
                  className={`p-8 ${!option.negative ? 'bg-[#93b9e6]' : 'bg-white'}`}
                >
                  <h3 className={`font-black text-xs uppercase tracking-wider mb-2 ${!option.negative ? 'text-white/70' : 'text-slate-400'}`}>
                    {option.type}
                  </h3>
                  <p className={`text-3xl font-black mb-6 ${!option.negative ? 'text-white' : 'text-slate-900'}`}>
                    {option.budget}
                  </p>
                  <ul className="space-y-3">
                    {option.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        {option.negative ? (
                          <AlertCircle className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                        )}
                        <span className={option.negative ? 'text-slate-500' : 'text-white'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  )
}
