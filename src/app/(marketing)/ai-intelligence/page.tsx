'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { 
  ArrowRight, Brain, Shield, Zap,
  FileText, Wrench, AlertTriangle,
  PiggyBank, ThermometerSun, Leaf,
  Database, Phone, Check,
  TrendingUp, Bell, Cpu, BarChart3,
  Lightbulb, Activity, LineChart,
  Sparkles
} from 'lucide-react'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, hasStarted])

  return { count, ref }
}

// Consistent label component
function SectionLabel({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'emerald' | 'red' | 'white' }) {
  const colors = {
    blue: 'bg-[#93b9e6] text-[#93b9e6]',
    emerald: 'bg-emerald-400 text-emerald-400',
    red: 'bg-red-500 text-red-500',
    white: 'bg-white text-white/50',
  }
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-2 h-2 ${colors[color].split(' ')[0]} rounded-full`} />
      <span className={`${colors[color].split(' ')[1]} text-xs font-black uppercase tracking-[0.4em]`}>{children}</span>
    </div>
  )
}

export default function AIIntelligencePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="transparent" />
      <HeroSection />
      <HowAIWorksSection />
      <PredictionsSection />
      <PreventionSection />
      <EnergyAISection />
      <SmartAlertsSection />
      <SavingsComparisonSection />
      <AITimelineSection />
      <TechnologySection />
      <CTASection />
      <Footer />
    </div>
  )
}


function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-[#93b9e6]/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#93b9e6]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="min-h-screen flex items-center py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            
            {/* Left - Content */}
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#93b9e6]/10 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-[#93b9e6]" />
                <span className="text-[#93b9e6] text-xs font-bold uppercase tracking-wider">AI voor uw woning</span>
              </div>

              {/* Headline */}
              <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
                Uw huis vertelt
                <br />
                <span className="text-[#93b9e6]">wat het nodig heeft</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-slate-500 max-w-lg mb-10 leading-relaxed">
                AI die uw woningdata analyseert en voorspelt wanneer onderhoud nodig is. 
                Voorkom dure reparaties, bespaar op energie, en verleng de levensduur van alles in uw huis.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 mb-10">
                <div>
                  <div className="text-3xl font-black text-slate-900">15 jaar</div>
                  <div className="text-sm text-slate-400">vooruit kijken</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-3xl font-black text-emerald-500">€3.200</div>
                  <div className="text-sm text-slate-400">extra besparing/jaar</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-3xl font-black text-slate-900">94%</div>
                  <div className="text-sm text-slate-400">nauwkeurigheid</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/assessment"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-[#93b9e6] transition-colors duration-300"
                >
                  Ontdek uw besparing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#how-it-works"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-slate-600 text-sm font-bold uppercase tracking-wider border-2 border-slate-200 hover:border-slate-900 hover:text-slate-900 transition-all duration-300"
                >
                  Hoe werkt het?
                </Link>
              </div>
            </div>

            {/* Right - Visual Card */}
            <div className="relative">
              {/* Main card */}
              <div className="bg-slate-900 rounded-2xl p-8 lg:p-10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#93b9e6] rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <div className="text-white font-bold">AI Analyse</div>
                      <div className="text-white/40 text-sm">Villa Zonneweide</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-bold">Live</span>
                  </div>
                </div>

                {/* Predictions */}
                <div className="space-y-4 mb-8">
                  <AIAlertCard 
                    icon={<AlertTriangle className="w-4 h-4" />}
                    type="warning"
                    title="CV-ketel onderhoud"
                    time="Over 3 maanden"
                    saving="Bespaar €420"
                  />
                  <AIAlertCard 
                    icon={<ThermometerSun className="w-4 h-4" />}
                    type="tip"
                    title="Energie tip"
                    time="23% boven gemiddelde"
                    saving="Bespaar €180/jaar"
                  />
                  <AIAlertCard 
                    icon={<Shield className="w-4 h-4" />}
                    type="success"
                    title="Garantie herinnering"
                    time="Warmtepomp - 45 dagen"
                    saving="Gratis keuring"
                  />
                </div>

                {/* Bottom summary */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Dit jaar bespaard</div>
                      <div className="text-2xl font-black text-emerald-400">€2.840</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Acties voltooid</div>
                      <div className="text-2xl font-black text-white">8/12</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-emerald-400 rounded-xl px-5 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-900" />
                  <span className="text-sm font-bold text-slate-900">Powered by AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white/80 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">AI Technologie</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Machine Learning</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Voorspellende Analyse</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Privacy-first</span>
            </div>
            <Link href="#how-it-works" className="text-xs font-bold text-[#93b9e6] hover:text-slate-900 uppercase tracking-wider flex items-center gap-2 transition-colors">
              Meer ontdekken
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper component for AI alert cards in hero
function AIAlertCard({ icon, type, title, time, saving }: { 
  icon: React.ReactNode; type: 'warning' | 'tip' | 'success'; title: string; time: string; saving: string 
}) {
  const styles = {
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
    tip: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
  }
  return (
    <div className={`${styles[type].bg} border ${styles[type].border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`${styles[type].icon} mt-0.5`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white font-medium text-sm">{title}</span>
            <span className="text-emerald-400 text-xs font-bold whitespace-nowrap">{saving}</span>
          </div>
          <span className="text-white/40 text-xs">{time}</span>
        </div>
      </div>
    </div>
  )
}

function HowAIWorksSection() {
  const steps = [
    { 
      number: '01', 
      icon: Database,
      title: 'VERZAMELEN', 
      desc: 'AI analyseert alle data uit uw woningpaspoort: materialen, installaties, leeftijden, onderhoudshistorie.' 
    },
    { 
      number: '02', 
      icon: Brain,
      title: 'LEREN', 
      desc: 'Machine learning vergelijkt uw woning met duizenden andere woningen en herkent patronen.' 
    },
    { 
      number: '03', 
      icon: LineChart,
      title: 'VOORSPELLEN', 
      desc: 'Algoritmes berekenen wanneer onderdelen falen, wat optimaal onderhoud is, en waar u kunt besparen.' 
    },
    { 
      number: '04', 
      icon: Bell,
      title: 'ADVISEREN', 
      desc: 'U krijgt persoonlijke, tijdige meldingen: "Vervang uw CV-ketel binnen 8 maanden voor optimaal rendement."' 
    },
  ]

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="blue">HOE HET WERKT</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-16">
          VAN DATA
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93b9e6] to-[#93b9e6]">NAAR ACTIE</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
          {steps.map((step, i) => (
            <div key={i} className="group bg-[#f5f5f5] p-8 hover:bg-slate-900 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <span className="text-5xl font-black text-[#050507]/10 group-hover:text-white/10">{step.number}</span>
                <step.icon className="w-8 h-8 text-[#93b9e6] group-hover:text-[#93b9e6]" />
              </div>
              <h3 className="text-lg font-black text-[#050507] group-hover:text-white uppercase tracking-wider mb-3">{step.title}</h3>
              <p className="text-sm text-[#050507]/50 group-hover:text-white/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PredictionsSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/images/ai/neural-network-house.jpg" alt="Neural Network" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="emerald">VOORSPELLINGEN</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-8">
          WAT DE AI
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">VOORSPELT</span>
        </h2>

        <p className="text-xl text-white/40 max-w-2xl mb-16">
          Onze AI kijkt tot 15 jaar vooruit en geeft concrete, 
          actiegerichte voorspellingen voor uw woning.
        </p>

        {/* Prediction cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          {[
            { 
              icon: Wrench, 
              title: 'LEVENSDUUR COMPONENTEN', 
              example: '"Uw warmtepomp heeft nog 4-6 jaar optimale werking"',
              accuracy: '94%'
            },
            { 
              icon: AlertTriangle, 
              title: 'STORINGEN', 
              example: '"Verhoogd risico op CV-storing deze winter"',
              accuracy: '87%'
            },
            { 
              icon: ThermometerSun, 
              title: 'ENERGIEVERBRUIK', 
              example: '"U verbruikt 23% meer gas dan vergelijkbare woningen"',
              accuracy: '91%'
            },
            { 
              icon: PiggyBank, 
              title: 'ONDERHOUDSKOSTEN', 
              example: '"Verwachte kosten komende 5 jaar: €8.400"',
              accuracy: '89%'
            },
            { 
              icon: TrendingUp, 
              title: 'WAARDEONTWIKKELING', 
              example: '"Zonnepanelen verhogen uw woningwaarde met €12.000"',
              accuracy: '85%'
            },
            { 
              icon: Leaf, 
              title: 'DUURZAAMHEID', 
              example: '"Met 3 aanpassingen verbetert u 2 energielabels"',
              accuracy: '92%'
            },
          ].map((pred, i) => (
            <div key={i} className="bg-white/5 p-8 hover:bg-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <pred.icon className="w-8 h-8 text-white/30 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs font-black text-emerald-400">{pred.accuracy} nauwkeurig</span>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3">{pred.title}</h3>
              <p className="text-sm text-white/40 italic leading-relaxed">{pred.example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PreventionSection() {
  const { count: savingsCount, ref: savingsRef } = useCounter(2400)

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="red">PREVENTIE</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-8">
          VOORKOMEN IS
          <br />
          <span className="text-red-500">GOEDKOPER</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xl text-[#050507]/50 mb-8 leading-relaxed">
              De gemiddelde noodreparatie kost <strong className="text-[#050507]">3x meer</strong> dan gepland onderhoud. 
              AI helpt u de juiste beslissing nemen op het juiste moment.
            </p>

            {/* Example scenario */}
            <div className="bg-[#f5f5f5] p-8 mb-8">
              <h3 className="text-sm font-black text-[#050507] uppercase tracking-wider mb-4">VOORBEELD: CV-KETEL</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#050507]">Zonder AI: Noodvervanging</div>
                    <div className="text-sm text-[#050507]/50">Ketel kapot in januari, weekend spoedtarief, oude voorraad</div>
                    <div className="text-lg font-black text-red-500 mt-1">€4.200</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#050507]">Met AI: Geplande vervanging</div>
                    <div className="text-sm text-[#050507]/50">6 maanden vooraf gepland, beste prijs, nieuwste model</div>
                    <div className="text-lg font-black text-emerald-500 mt-1">€2.800</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 lg:p-12" ref={savingsRef}>
            <div className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-4">GEMIDDELDE BESPARING PER VOORSPELLING</div>
            <div className="text-[4rem] lg:text-[6rem] font-black text-emerald-400 leading-none mb-4">
              €{savingsCount.toLocaleString()}
            </div>
            <p className="text-white/40">
              Per vermeden noodreparatie. De AI maakt gemiddeld 
              <span className="text-white font-bold"> 3-5 voorspellingen per jaar </span>
              die directe actie vereisen.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function EnergyAISection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="emerald">ENERGIE AI</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-8">
          SLIMMER
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">VERBRUIKEN</span>
        </h2>

        <p className="text-xl text-white/40 max-w-2xl mb-16">
          De AI analyseert uw energieverbruik, vergelijkt met soortgelijke woningen, 
          en geeft concrete tips om te besparen.
        </p>

        <div className="grid lg:grid-cols-3 gap-1">
          {/* Benchmark */}
          <div className="bg-white/5 p-8 lg:p-10">
            <BarChart3 className="w-10 h-10 text-[#93b9e6] mb-6" />
            <h3 className="text-lg font-black text-white mb-3">BENCHMARK</h3>
            <p className="text-sm text-white/40 mb-6">
              Vergelijk uw verbruik met 500+ vergelijkbare woningen in uw regio.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Uw gasverbruik</span>
                <span className="text-white font-bold">1.450 m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Gemiddeld</span>
                <span className="text-[#93b9e6] font-bold">1.180 m³</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-[#93b9e6] to-red-500 rounded-full" />
              </div>
              <div className="text-xs text-red-400">23% boven gemiddelde</div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/5 p-8 lg:p-10">
            <Lightbulb className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-lg font-black text-white mb-3">AANBEVELINGEN</h3>
            <p className="text-sm text-white/40 mb-6">
              Persoonlijke tips gebaseerd op uw situatie en budget.
            </p>
            <div className="space-y-4">
              {[
                { tip: 'Radiatorfolie achter radiatoren', saving: '€85/jaar' },
                { tip: 'Thermostaat 1° lager', saving: '€120/jaar' },
                { tip: 'LED verlichting overal', saving: '€65/jaar' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-white/70">{item.tip}</span>
                  <span className="text-emerald-400 font-bold">{item.saving}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="bg-emerald-500 p-8 lg:p-10">
            <Activity className="w-10 h-10 text-white/80 mb-6" />
            <h3 className="text-lg font-black text-white mb-3">INVESTERINGS ROI</h3>
            <p className="text-sm text-white/70 mb-6">
              AI berekent terugverdientijd van elke investering.
            </p>
            <div className="bg-white/20 p-4 rounded">
              <div className="text-sm text-white/70 mb-2">Zonnepanelen (12 stuks)</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-white/50">Investering</div>
                  <div className="text-lg font-bold text-white">€6.800</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50">Terugverdientijd</div>
                  <div className="text-lg font-bold text-white">5.2 jaar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SmartAlertsSection() {
  const alerts = [
    { 
      type: 'urgent', 
      icon: AlertTriangle,
      title: 'Garantie verloopt', 
      message: 'Garantie warmtepomp verloopt over 45 dagen. Laat nu gratis keuring uitvoeren.',
      time: '2 dagen geleden'
    },
    { 
      type: 'warning', 
      icon: Wrench,
      title: 'Onderhoud aanbevolen', 
      message: 'CV-ketel efficiency daalt. Plan onderhoud binnen 3 maanden voor €180 extra besparing.',
      time: '1 week geleden'
    },
    { 
      type: 'tip', 
      icon: Lightbulb,
      title: 'Bespaartip', 
      message: 'Uw energieverbruik steeg 15% vs vorig jaar. Mogelijk isolatie probleem. Bekijk advies.',
      time: '2 weken geleden'
    },
    { 
      type: 'success', 
      icon: Check,
      title: 'Actie voltooid', 
      message: 'Dakgoot reiniging afgerond. Volgende inspectie gepland voor november 2026.',
      time: '1 maand geleden'
    },
  ]

  const typeColors = {
    urgent: 'border-red-500 bg-red-500/10',
    warning: 'border-[#93b9e6] bg-[#93b9e6]/10',
    tip: 'border-blue-500 bg-blue-500/10',
    success: 'border-emerald-500 bg-emerald-500/10',
  }

  const iconColors = {
    urgent: 'text-red-500',
    warning: 'text-[#93b9e6]',
    tip: 'text-blue-500',
    success: 'text-emerald-500',
  }

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="blue">MELDINGEN</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-8">
          SLIMME
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93b9e6] to-[#93b9e6]">ALERTS</span>
        </h2>

        <p className="text-xl text-[#050507]/50 max-w-2xl mb-16">
          Geen spam, alleen relevante meldingen. De AI bepaalt de urgentie 
          en het beste moment om u te informeren.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Alert examples */}
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div key={i} className={`border-l-4 p-6 ${typeColors[alert.type as keyof typeof typeColors]}`}>
                <div className="flex items-start gap-4">
                  <alert.icon className={`w-6 h-6 flex-shrink-0 ${iconColors[alert.type as keyof typeof iconColors]}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#050507]">{alert.title}</h3>
                      <span className="text-xs text-[#050507]/30">{alert.time}</span>
                    </div>
                    <p className="text-sm text-[#050507]/60">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-slate-900 p-8 lg:p-12">
            <h3 className="text-lg font-black text-white mb-8">HOE VAAK KRIJGT U BERICHT?</h3>
            
            <div className="space-y-6">
              {[
                { label: 'Urgente meldingen', freq: '2-3x per jaar', color: 'bg-red-500' },
                { label: 'Onderhoud reminders', freq: '4-6x per jaar', color: 'bg-[#93b9e6]' },
                { label: 'Bespaartips', freq: '1x per maand', color: 'bg-blue-500' },
                { label: 'Garantie herinneringen', freq: 'Wanneer relevant', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-xs text-white/40">{item.freq}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Totaal per jaar</div>
              <div className="text-3xl font-black text-white">15-20 meldingen</div>
              <div className="text-sm text-white/40 mt-1">Alleen wat écht belangrijk is</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SavingsComparisonSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="emerald">EXTRA BESPARING</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-16">
          WAT LEVERT
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">AI EXTRA OP?</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-1 mb-8">
          {/* Without AI */}
          <div className="bg-white p-8 lg:p-12">
            <div className="text-xs font-black text-[#050507]/30 uppercase tracking-[0.3em] mb-4">WONINGPASPOORT ZONDER AI</div>
            <div className="text-5xl lg:text-6xl font-black text-[#050507] mb-4">€2.440</div>
            <div className="text-sm font-bold text-[#050507]/40 mb-8">Jaarlijkse besparing</div>
            
            <div className="space-y-3 text-sm text-[#050507]/50">
              <div className="flex justify-between"><span>Documenten vindbaar</span><span className="text-emerald-500 font-black">€400</span></div>
              <div className="flex justify-between"><span>Garanties benut</span><span className="text-emerald-500 font-black">€800</span></div>
              <div className="flex justify-between"><span>Betere onderhandeling</span><span className="text-emerald-500 font-black">€640</span></div>
              <div className="flex justify-between"><span>Georganiseerd onderhoud</span><span className="text-emerald-500 font-black">€600</span></div>
            </div>
          </div>

          {/* With AI */}
          <div className="bg-emerald-500 p-8 lg:p-12">
            <div className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-4">WONINGPASPOORT MET AI</div>
            <div className="text-5xl lg:text-6xl font-black text-white mb-4">€5.640</div>
            <div className="text-sm font-bold text-white/60 mb-8">Jaarlijkse besparing</div>
            
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex justify-between"><span>Alles van basis</span><span className="text-white font-black">€2.440</span></div>
              <div className="flex justify-between"><span>+ Preventief onderhoud</span><span className="text-white font-black">€1.400</span></div>
              <div className="flex justify-between"><span>+ Energie optimalisatie</span><span className="text-white font-black">€640</span></div>
              <div className="flex justify-between"><span>+ Timing optimalisatie</span><span className="text-white font-black">€560</span></div>
              <div className="flex justify-between"><span>+ Investering advies</span><span className="text-white font-black">€600</span></div>
            </div>
          </div>
        </div>

        {/* Extra value */}
        <div className="bg-[#93b9e6] p-8 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black text-[#050507] uppercase tracking-wider">Extra waarde door AI</span>
          <span className="text-4xl lg:text-5xl font-black text-[#050507]">+€3.200/jaar</span>
        </div>
      </div>
    </section>
  )
}

function AITimelineSection() {
  const timeline = [
    { 
      month: 'JAN', 
      alert: 'CV-ketel onderhoudsadvies',
      action: 'Onderhoud ingepland',
      saving: '€180'
    },
    { 
      month: 'APR', 
      alert: 'Dakgoten inspecteren',
      action: 'Reiniging uitgevoerd',
      saving: '€0'
    },
    { 
      month: 'JUN', 
      alert: 'Airco filter vervangen',
      action: 'Filter besteld',
      saving: '€45'
    },
    { 
      month: 'SEP', 
      alert: 'Verwarmingssysteem check',
      action: 'Efficiëntie geoptimaliseerd',
      saving: '€320'
    },
    { 
      month: 'NOV', 
      alert: 'Garantie warmtepomp verloopt',
      action: 'Keuring aangevraagd',
      saving: '€1.200'
    },
    { 
      month: 'DEC', 
      alert: 'Jaaroverzicht beschikbaar',
      action: 'Budget planning 2027',
      saving: '—'
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="blue">EEN JAAR MET AI</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-16">
          UW AI
          <br />
          <span className="text-[#050507]/20">IN ACTIE</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          {timeline.map((item, i) => (
            <div key={i} className="bg-[#f5f5f5] p-6 hover:bg-slate-900 group transition-all duration-300">
              <div className="text-2xl font-black text-[#93b9e6] group-hover:text-[#93b9e6] mb-4">{item.month}</div>
              <h3 className="text-xs font-black text-[#050507] group-hover:text-white uppercase tracking-wider mb-2">{item.alert}</h3>
              <p className="text-xs text-[#050507]/40 group-hover:text-white/40 mb-4">{item.action}</p>
              {item.saving !== '—' && (
                <div className="text-lg font-black text-emerald-500 group-hover:text-emerald-400">{item.saving}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-8 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/50">Totale besparing dit jaar door AI-adviezen</span>
          <span className="text-3xl font-black text-emerald-400">€1.745</span>
        </div>
      </div>
    </section>
  )
}

function TechnologySection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="white">TECHNOLOGIE</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-16">
          ONDER DE
          <br />
          <span className="text-white/20">MOTORKAP</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
          {[
            { 
              icon: Cpu, 
              title: 'MACHINE LEARNING', 
              desc: 'Algoritmes die leren van duizenden woningen en steeds nauwkeuriger worden.' 
            },
            { 
              icon: Database, 
              title: 'BIG DATA', 
              desc: 'Analyse van historische data, weerspatronen, energieprijzen en markttrends.' 
            },
            { 
              icon: Shield, 
              title: 'PRIVACY FIRST', 
              desc: 'Uw data is versleuteld en wordt nooit gedeeld. U blijft eigenaar.' 
            },
            { 
              icon: Zap, 
              title: 'REAL-TIME', 
              desc: 'Doorlopende analyse. Updates zodra nieuwe informatie beschikbaar is.' 
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-8 hover:bg-white/10 transition-all group">
              <item.icon className="w-10 h-10 text-white/30 mb-6 group-hover:text-[#93b9e6] transition-colors" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-[#93b9e6] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-[#050507] leading-[0.85] tracking-[-0.03em] mb-8">
          LAAT AI
          <br />
          VOOR U WERKEN
        </h2>

        <p className="text-xl lg:text-2xl font-bold text-[#050507]/50 max-w-xl mb-12">
          Ontdek hoeveel u kunt besparen met voorspellende AI. 
          Persoonlijk advies in 3 minuten.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-12">
          <Link
            href="/assessment"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-slate-900 text-white text-base font-black uppercase tracking-[0.15em] hover:bg-white hover:text-[#050507] transition-colors duration-300"
          >
            START DE AI SCAN
            <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            href="/woningpaspoort"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-slate-900 text-base font-black uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-colors duration-300"
          >
            <Shield className="w-5 h-5" />
            WAT IS WONINGPASPOORT
          </Link>
          <Link
            href="/consultation"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-transparent text-[#050507] text-base font-black uppercase tracking-[0.15em] border-2 border-[#050507]/30 hover:border-[#050507] transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            PLAN EEN GESPREK
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-[#050507]/50 text-sm font-bold">
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Gratis analyse</span>
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Persoonlijk advies</span>
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Geen verplichtingen</span>
        </div>
      </div>
    </section>
  )
}

