'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/footer'
import {
  ArrowRight, ArrowLeft, Check, MapPin, Euro,
  Calendar, Heart, Sparkles, Target, Shield, Clock, Phone
} from 'lucide-react'

type Step = 'intro' | 'situation' | 'budget' | 'vision' | 'readiness' | 'result'
type Tier = 'ready' | 'almost' | 'explore'

interface Answers {
  hasPlot: string
  plotLocation: string
  timeline: string
  budgetRange: string
  financing: string
  contingency: string
  familySize: string
  style: string
  mustHaves: string[]
  decisionTimeline: string
  partnerAligned: string
  experience: string
}

const initialAnswers: Answers = {
  hasPlot: '',
  plotLocation: '',
  timeline: '',
  budgetRange: '',
  financing: '',
  contingency: '',
  familySize: '',
  style: '',
  mustHaves: [],
  decisionTimeline: '',
  partnerAligned: '',
  experience: '',
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState<Step>('intro')
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [score, setScore] = useState(0)
  const [tier, setTier] = useState<Tier>('explore')
  const hasSubmittedRef = useRef(false)

  const steps: Step[] = ['intro', 'situation', 'budget', 'vision', 'readiness', 'result']
  const currentIndex = steps.indexOf(currentStep)
  const progress = (currentIndex / (steps.length - 1)) * 100

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (currentStep === 'result' && !hasSubmittedRef.current && score > 0) {
      hasSubmittedRef.current = true
      fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, score, tier }),
      }).catch(err => console.warn('Failed to submit assessment lead:', err))
    }
  }, [currentStep, score, tier, answers])

  const nextStep = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < steps.length) {
      if (steps[nextIndex] === 'result') calculateScore()
      setCurrentStep(steps[nextIndex])
    }
  }

  const prevStep = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex])
  }

  const calculateScore = () => {
    let points = 0
    if (answers.hasPlot === 'yes') points += 25
    else if (answers.hasPlot === 'searching') points += 15
    else if (answers.hasPlot === 'considering') points += 5

    if (answers.timeline === '1-2years') points += 20
    else if (answers.timeline === '6-12months') points += 15
    else if (answers.timeline === '2-3years') points += 10

    if (answers.budgetRange === '500-600' || answers.budgetRange === '600-700') points += 20
    else if (answers.budgetRange === '400-500' || answers.budgetRange === '700+') points += 15

    if (answers.financing === 'approved' || answers.financing === 'inprogress') points += 15
    if (answers.contingency === 'yes') points += 10
    if (answers.decisionTimeline === 'ready' || answers.decisionTimeline === '1month') points += 10
    if (answers.partnerAligned === 'yes') points += 10

    const finalScore = Math.min(points, 100)
    setScore(finalScore)

    if (finalScore >= 75) setTier('ready')
    else if (finalScore >= 50) setTier('almost')
    else setTier('explore')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'intro': return true
      case 'situation': return answers.hasPlot && answers.timeline
      case 'budget': return answers.budgetRange && answers.financing
      case 'vision': return answers.familySize && answers.style
      case 'readiness': return answers.decisionTimeline && answers.partnerAligned
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          
          {currentStep !== 'intro' && currentStep !== 'result' && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                STAP {currentIndex} / {steps.length - 2}
              </span>
              <div className="w-32 h-1 bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-[#93b9e6] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 pt-24 pb-32">
        <div className="max-w-3xl mx-auto px-6">
          {currentStep === 'intro' && <IntroStep onStart={nextStep} />}
          {currentStep === 'situation' && <SituationStep answers={answers} updateAnswer={updateAnswer} />}
          {currentStep === 'budget' && <BudgetStep answers={answers} updateAnswer={updateAnswer} />}
          {currentStep === 'vision' && <VisionStep answers={answers} updateAnswer={updateAnswer} />}
          {currentStep === 'readiness' && <ReadinessStep answers={answers} updateAnswer={updateAnswer} />}
          {currentStep === 'result' && <ResultStep score={score} />}
        </div>
      </main>

      {/* Step Navigation */}
      {currentStep !== 'intro' && currentStep !== 'result' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 font-black uppercase tracking-wider text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Vorige
            </button>
            
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-wider text-sm hover:bg-[#93b9e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {currentStep === 'readiness' ? 'BEKIJK RESULTAAT' : 'VOLGENDE'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 'result' && <Footer variant="minimal" />}
    </div>
  )
}

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
        <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">BOUW ASSESSMENT</span>
      </div>
      
      <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-8">
        PAST BOUWEN
        <br />
        <span className="text-[#93b9e6]">BIJ U?</span>
      </h1>
      
      <p className="text-xl text-slate-500 mb-12 max-w-lg">
        Ontdek in 3 minuten of het bouwen van uw droomhuis de juiste keuze is. 
        Eerlijk advies, geen verplichtingen.
      </p>

      <div className="flex flex-wrap gap-8 mb-12">
        {[
          { icon: Clock, label: '3 MINUTEN' },
          { icon: Shield, label: 'PRIVACY' },
          { icon: Sparkles, label: 'DIRECT RESULTAAT' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="group inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white font-black uppercase tracking-wider text-sm hover:bg-[#93b9e6] transition-all"
      >
        START DE TEST
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </button>

      <p className="mt-8 text-sm text-slate-400 font-bold">
        Meer dan 500 families gingen u voor
      </p>
    </div>
  )
}

function SituationStep({ 
  answers, 
  updateAnswer 
}: { 
  answers: Answers
  updateAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void
}) {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-[#93b9e6]" />
        <span className="text-xs font-black text-[#93b9e6] uppercase tracking-wider">STAP 1</span>
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">UW SITUATIE</h2>
      <p className="text-slate-500 mb-8">Laten we beginnen met de basis.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Heeft u al een kavel (bouwgrond)?
          </label>
          <div className="space-y-2">
            {[
              { value: 'yes', label: 'JA, IK HEB EEN KAVEL', icon: Check },
              { value: 'searching', label: 'NEE, MAAR IK ZOEK ACTIEF', icon: Target },
              { value: 'considering', label: 'NEE, IK ORIËNTEER ME NOG', icon: Sparkles },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('hasPlot', option.value)}
                className={`w-full flex items-center gap-4 p-5 text-left transition-all ${
                  answers.hasPlot === option.value
                    ? 'bg-[#93b9e6] text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center ${
                  answers.hasPlot === option.value ? 'bg-white/20' : 'bg-white'
                }`}>
                  <option.icon className={`w-5 h-5 ${answers.hasPlot === option.value ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className={`font-bold text-sm ${answers.hasPlot === option.value ? 'text-white' : 'text-slate-700'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Wanneer wilt u in uw nieuwe huis wonen?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: '6-12months', label: '6-12 MAANDEN' },
              { value: '1-2years', label: '1-2 JAAR' },
              { value: '2-3years', label: '2-3 JAAR' },
              { value: 'flexible', label: 'FLEXIBEL' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('timeline', option.value)}
                className={`p-5 text-left transition-all ${
                  answers.timeline === option.value
                    ? 'bg-[#93b9e6] text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-black text-xs uppercase tracking-wider ${
                  answers.timeline === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BudgetStep({ 
  answers, 
  updateAnswer 
}: { 
  answers: Answers
  updateAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void
}) {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-4">
        <Euro className="w-5 h-5 text-emerald-500" />
        <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">STAP 2</span>
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">UW BUDGET</h2>
      <p className="text-slate-500 mb-8">Realistisch plannen begint bij een helder budget.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Wat is uw totaalbudget?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: '400-500', label: '€400K - €500K' },
              { value: '500-600', label: '€500K - €600K' },
              { value: '600-700', label: '€600K - €700K' },
              { value: '700+', label: '€700K+' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('budgetRange', option.value)}
                className={`p-5 text-left transition-all ${
                  answers.budgetRange === option.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-black text-sm ${
                  answers.budgetRange === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Hoe staat het met uw financiering?
          </label>
          <div className="space-y-2">
            {[
              { value: 'approved', label: 'HYPOTHEEK GOEDGEKEURD' },
              { value: 'inprogress', label: 'IN GESPREK MET BANK' },
              { value: 'notstarted', label: 'NOG NIET GESTART' },
              { value: 'cash', label: 'EIGEN MIDDELEN' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('financing', option.value)}
                className={`w-full p-5 text-left transition-all ${
                  answers.financing === option.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  answers.financing === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Ruimte voor onvoorziene kosten? (10-15%)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'yes', label: 'JA' },
              { value: 'somewhat', label: 'DEELS' },
              { value: 'no', label: 'NEE' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('contingency', option.value)}
                className={`p-5 text-center transition-all ${
                  answers.contingency === option.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-black text-xs uppercase tracking-wider ${
                  answers.contingency === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VisionStep({ 
  answers, 
  updateAnswer 
}: { 
  answers: Answers
  updateAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void
}) {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-5 h-5 text-[#93b9e6]" />
        <span className="text-xs font-black text-[#93b9e6] uppercase tracking-wider">STAP 3</span>
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">UW VISIE</h2>
      <p className="text-slate-500 mb-8">Vertel ons over uw droomhuis.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Hoe groot is uw gezin?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'couple', label: 'STEL (2)' },
              { value: 'small-family', label: 'KLEIN GEZIN (3-4)' },
              { value: 'large-family', label: 'GROOT GEZIN (5+)' },
              { value: 'multigenerational', label: 'MEERGENERATIE' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('familySize', option.value)}
                className={`p-5 text-left transition-all ${
                  answers.familySize === option.value
                    ? 'bg-[#93b9e6] text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-black text-xs uppercase tracking-wider ${
                  answers.familySize === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Welke stijl spreekt u aan?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'modern', label: 'MODERN', desc: 'Veel glas, rechte lijnen' },
              { value: 'traditional', label: 'TRADITIONEEL', desc: 'Klassieke uitstraling' },
              { value: 'countryside', label: 'LANDELIJK', desc: 'Warm en gezellig' },
              { value: 'sustainable', label: 'DUURZAAM', desc: 'Eco-focus' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('style', option.value)}
                className={`p-5 text-left transition-all ${
                  answers.style === option.value
                    ? 'bg-[#93b9e6] text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`block font-black text-xs uppercase tracking-wider mb-1 ${
                  answers.style === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
                <span className={`text-xs ${answers.style === option.value ? 'text-white/70' : 'text-slate-500'}`}>
                  {option.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadinessStep({ 
  answers, 
  updateAnswer 
}: { 
  answers: Answers
  updateAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void
}) {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-slate-900" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">STAP 4</span>
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">BESLUITVORMING</h2>
      <p className="text-slate-500 mb-8">Laatste vragen over uw gereedheid.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Wanneer wilt u beslissen?
          </label>
          <div className="space-y-2">
            {[
              { value: 'ready', label: 'KLAAR OM TE STARTEN' },
              { value: '1month', label: 'BINNEN 1 MAAND' },
              { value: '3months', label: 'BINNEN 3 MAANDEN' },
              { value: 'exploring', label: 'IK ORIËNTEER ME NOG' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('decisionTimeline', option.value)}
                className={`w-full p-5 text-left transition-all ${
                  answers.decisionTimeline === option.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  answers.decisionTimeline === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Is uw partner op één lijn?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'yes', label: 'JA' },
              { value: 'mostly', label: 'GROTENDEELS' },
              { value: 'discussing', label: 'WE BESPREKEN' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('partnerAligned', option.value)}
                className={`p-5 text-center transition-all ${
                  answers.partnerAligned === option.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className={`font-black text-xs uppercase tracking-wider ${
                  answers.partnerAligned === option.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultStep({ score }: { score: number }) {
  const getCategory = () => {
    if (score >= 75) return 'ready'
    if (score >= 50) return 'almost'
    return 'explore'
  }

  const category = getCategory()

  const results = {
    ready: {
      title: 'U BENT KLAAR',
      subtitle: 'Uw situatie is ideaal voor een bouwproject.',
      badge: 'KLAAR',
      tips: ['Basis goed op orde', 'Budget past', 'Timing is realistisch'],
    },
    almost: {
      title: 'BIJNA KLAAR',
      subtitle: 'Met een paar stappen bent u startklaar.',
      badge: 'BIJNA',
      tips: ['Financiering uitwerken', 'Kavel is essentieel', 'Alignment met partner'],
    },
    explore: {
      title: 'ORIËNTEREN',
      subtitle: 'Bouwen kan fantastisch zijn, timing is alles.',
      badge: 'VERKENNEN',
      tips: ['Zoek een kavel', 'Breng financiën in kaart', 'Maak wensen helder'],
    },
  }

  const result = results[category]

  return (
    <div className="py-8">
      {/* Result Card */}
      <div className={`p-8 lg:p-12 mb-8 ${
        category === 'ready' ? 'bg-emerald-500' :
        category === 'almost' ? 'bg-[#93b9e6]' : 'bg-slate-900'
      }`}>
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-xs font-black text-white/50 uppercase tracking-wider mb-4">{result.badge}</div>
            <h1 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">{result.title}</h1>
            <p className="text-white/70">{result.subtitle}</p>
          </div>
        </div>

        <Link
          href="/consultation"
          className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-wider text-sm hover:bg-slate-100 transition-all"
        >
          PLAN EEN GESPREK
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Tips */}
      <div className="bg-slate-50 p-8 mb-8">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6">ONZE AANBEVELINGEN</h3>
        <div className="space-y-4">
          {result.tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center ${
                category === 'ready' ? 'bg-emerald-500' :
                category === 'almost' ? 'bg-[#93b9e6]' : 'bg-slate-900'
              }`}>
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-700 font-medium">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-2 gap-px bg-slate-200">
        <Link
          href="/consultation"
          className="p-8 bg-white hover:bg-slate-50 transition-all group"
        >
          <Calendar className="w-8 h-8 text-[#93b9e6] mb-4" />
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">
            PLAN EEN GESPREK
          </h4>
          <p className="text-sm text-slate-500">Vrijblijvend kennismaken</p>
        </Link>

        <a
          href="tel:+31701234567"
          className="p-8 bg-white hover:bg-slate-50 transition-all group"
        >
          <Phone className="w-8 h-8 text-emerald-500 mb-4" />
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">
            BEL ONS DIRECT
          </h4>
          <p className="text-sm text-slate-500">070 - 123 45 67</p>
        </a>
      </div>
    </div>
  )
}
