'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/layout/footer'
import { 
  ArrowRight, Shield,
  FileText, Calendar,
  PiggyBank, 
  Users, Database, Phone, Check,
  TrendingUp, Clock, Search, AlertTriangle,
  Receipt, Smartphone, Brain
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

export default function WoningpaspoortPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProblemSection />
      <WhatIsItSection />
      <WhatsIncludedSection />
      <CoreBenefitsSection />
      <CostSavingsSection />
      <ResaleValueSection />
      <TimelineSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  )
}


function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-slate-50 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#93b9e6 1px, transparent 1px), linear-gradient(90deg, #93b9e6 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 py-32 lg:py-40 pt-32">
        <SectionLabel>HET WONINGPASPOORT</SectionLabel>

        <h1 className="text-[3rem] sm:text-[4.5rem] lg:text-[7rem] xl:text-[9rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-8">
          NOOIT
          <br />
          MEER
          <br />
          <span className="text-[#93b9e6]">ZOEKEN</span>
        </h1>

        <p className="text-xl lg:text-2xl text-slate-500 max-w-xl mb-12 font-light">
          Uw woning onthoudt alles. Elk document, elke factuur, elke garantie. 
          Altijd vindbaar. Altijd actueel. Voor altijd van u.
        </p>

        <div className="flex flex-wrap items-end gap-8 lg:gap-16 mb-16">
          <div>
            <div className="text-4xl sm:text-5xl lg:text-7xl font-black text-emerald-500 tracking-tight">€5.640</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">BESPARING PER JAAR</div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#93b9e6] tracking-tight">+€113K</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">HOGERE VERKOOPPRIJS</div>
          </div>
        </div>

        <Link 
          href="/assessment"
          className="group inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white text-base font-black uppercase tracking-[0.15em] hover:bg-[#93b9e6] transition-colors duration-300"
        >
          BEREKEN UW BESPARING
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </section>
  )
}


function ProblemSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="red">HET PROBLEEM</SectionLabel>
        
        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-8">
          WEET U NOG
          <br />
          <span className="text-red-500">WAAR</span> HET LIGT?
        </h2>

        <p className="text-xl lg:text-2xl text-[#050507]/40 max-w-2xl mb-12">
          De garantie van uw warmtepomp. De factuur van het dak. 
          De naam van de elektricien. Kunt u het binnen 30 seconden vinden?
        </p>

        {/* Pain points */}
        <div className="grid md:grid-cols-3 gap-1 mb-12">
          {[
            { icon: Search, value: '4+ uur', label: 'ZOEKTIJD', sub: 'Per jaar aan documenten zoeken' },
            { icon: AlertTriangle, value: '€2.400', label: 'GEMISTE GARANTIES', sub: 'Per woning gemiddeld verloren' },
            { icon: TrendingUp, value: '-15%', label: 'VERKOOPPRIJS', sub: 'Zonder complete documentatie' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#f5f5f5] p-8 lg:p-10 border-l-4 border-red-500">
              <stat.icon className="w-8 h-8 text-red-500/50 mb-4" />
              <div className="text-4xl lg:text-5xl font-black text-[#050507] tracking-tight">{stat.value}</div>
              <div className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
              <div className="text-sm text-[#050507]/40 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhatIsItSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#93b9e6] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white text-xs font-black uppercase tracking-[0.4em]">WAT IS HET?</span>
        </div>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-8">
          HET GEHEUGEN
          <br />
          <span className="text-slate-900">VAN UW WONING</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xl lg:text-2xl text-white/80 mb-8 leading-relaxed">
              Het Woningpaspoort is een digitaal dossier dat alles over uw woning onthoudt. 
              Niet een map met papieren die u kwijtraakt, maar een slim systeem dat groeit 
              met uw woning.
            </p>
            
            <div className="space-y-4">
              {[
                'Alle documenten op één plek',
                'Automatisch georganiseerd per ruimte en systeem',
                'Herinneringen voor garanties en onderhoud',
                'Overdraagbaar aan nieuwe eigenaar',
                'Toegankelijk via app en web',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-slate-900 flex-shrink-0" />
                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 lg:p-12">
            <Smartphone className="w-12 h-12 text-[#93b9e6] mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">ALTIJD BIJ DE HAND</h3>
            <p className="text-slate-500 mb-6">
              Loodgieter aan de deur? Open de app, toon de plattegrond met alle leidingen. 
              Garantie nodig? Zoek op &quot;warmtepomp&quot; en vind direct de factuur.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="text-[#93b9e6]">iOS</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#93b9e6]">Android</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#93b9e6]">Web</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatsIncludedSection() {
  const categories = [
    { 
      icon: FileText, 
      title: 'DOCUMENTEN', 
      items: ['Bouwtekeningen', 'Vergunningen', 'Certificaten', 'Handleidingen'],
      count: '150+',
      bg: '/images/cards/card-bg-documenten.png'
    },
    { 
      icon: Receipt, 
      title: 'FACTUREN', 
      items: ['Aanschaf materialen', 'Installaties', 'Reparaties', 'Onderhoud'],
      count: '200+',
      bg: '/images/cards/card-bg-facturen.png'
    },
    { 
      icon: Shield, 
      title: 'GARANTIES', 
      items: ['Apparaten', 'Installaties', 'Materialen', 'Werkzaamheden'],
      count: '25+',
      bg: '/images/cards/card-bg-garanties.png'
    },
    { 
      icon: Users, 
      title: 'CONTACTEN', 
      items: ['Installateurs', 'Aannemers', 'Leveranciers', 'Specialisten'],
      count: '15+',
      bg: '/images/cards/card-bg-contacten.png'
    },
    { 
      icon: Database, 
      title: 'MATERIALEN', 
      items: ['Verfkleuren', 'Vloerentypes', 'Tegelsoorten', 'Specificaties'],
      count: '500+',
      bg: '/images/cards/card-bg-materialen.png'
    },
    { 
      icon: Calendar, 
      title: 'ONDERHOUD', 
      items: ['Historie', 'Planning', 'Herinneringen', 'Kosten'],
      count: '∞',
      bg: '/images/cards/card-bg-onderhoud.png'
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="blue">WAT ZIT ERIN</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-16">
          ALLES OVER
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93b9e6] to-[#93b9e6]">UW WONING</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="relative bg-[#f5f5f5] p-8 hover:bg-[#050507] group transition-all duration-300 overflow-hidden"
            >
              {/* Background image */}
              <div 
                className="absolute inset-0 opacity-30 group-hover:opacity-20 transition-opacity bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${cat.bg})` }}
              />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <cat.icon className="w-8 h-8 text-[#050507]/30 group-hover:text-[#93b9e6] transition-colors" />
                  <span className="text-3xl font-black text-[#050507]/20 group-hover:text-white/20">{cat.count}</span>
                </div>
                <h3 className="text-lg font-black text-[#050507] group-hover:text-white uppercase tracking-wider mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-sm text-[#050507]/50 group-hover:text-white/50 flex items-center gap-2">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoreBenefitsSection() {
  const benefits = [
    { 
      icon: PiggyBank, 
      title: 'BESPAAR DUIZENDEN', 
      amount: '€5.640/jaar',
      desc: 'Nooit meer garanties missen. Gepland onderhoud is goedkoper dan noodreparaties. Energie-inzicht bespaart direct.',
      highlight: true
    },
    { 
      icon: TrendingUp, 
      title: 'HOGERE WONINGWAARDE', 
      amount: '+23%',
      desc: 'Kopers betalen meer voor zekerheid. Complete documentatie = hogere verkoopprijs + snellere verkoop.',
      highlight: false
    },
    { 
      icon: Clock, 
      title: 'NOOIT MEER ZOEKEN', 
      amount: '30 sec',
      desc: 'Elk document binnen 30 seconden gevonden. Garantie verlopen? U krijgt automatisch bericht.',
      highlight: false
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
          <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">VOORDELEN</span>
        </div>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-16">
          WAAROM EEN
          <br />
          <span className="text-[#93b9e6]">WONINGPASPOORT</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-slate-800">
          {benefits.map((benefit, i) => (
            <div key={i} className={`p-8 lg:p-12 ${benefit.highlight ? 'bg-[#93b9e6]' : 'bg-slate-900'}`}>
              <benefit.icon className={`w-10 h-10 mb-6 ${benefit.highlight ? 'text-slate-900' : 'text-[#93b9e6]'}`} />
              <div className={`text-4xl lg:text-5xl font-black mb-4 ${benefit.highlight ? 'text-white' : 'text-white'}`}>
                {benefit.amount}
              </div>
              <h3 className={`text-lg font-black uppercase tracking-wider mb-4 ${benefit.highlight ? 'text-slate-900' : 'text-white'}`}>{benefit.title}</h3>
              <p className={`text-sm leading-relaxed ${benefit.highlight ? 'text-slate-900/70' : 'text-white/50'}`}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CostSavingsSection() {
  const { count: savingsCount, ref: savingsRef } = useCounter(5640)

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="emerald">DE CIJFERS</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-16">
          ZONDER VS
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">MET</span>
        </h2>

        {/* Comparison */}
        <div className="grid lg:grid-cols-2 gap-1 mb-8">
          {/* WITHOUT */}
          <div className="bg-[#f5f5f5] p-8 lg:p-12">
            <div className="text-xs font-black text-[#050507]/30 uppercase tracking-[0.3em] mb-4">ZONDER WONINGPASPOORT</div>
            <div className="text-5xl lg:text-7xl font-black text-red-500 mb-4">€9.200</div>
            <div className="text-sm font-bold text-[#050507]/40 mb-8">Jaarlijkse kosten</div>
            
            <div className="space-y-3 text-sm text-[#050507]/50">
              <div className="flex justify-between"><span>Onderhoud (reactief)</span><span className="text-red-500 font-black">€4.200</span></div>
              <div className="flex justify-between"><span>Noodreparaties</span><span className="text-red-500 font-black">€2.400</span></div>
              <div className="flex justify-between"><span>Energie inefficiëntie</span><span className="text-red-500 font-black">€1.800</span></div>
              <div className="flex justify-between"><span>Gemiste garantieclaims</span><span className="text-red-500 font-black">€800</span></div>
            </div>
          </div>

          {/* WITH */}
          <div className="bg-emerald-500 p-8 lg:p-12">
            <div className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-4">MET WONINGPASPOORT</div>
            <div className="text-5xl lg:text-7xl font-black text-white mb-4">€3.560</div>
            <div className="text-sm font-bold text-white/60 mb-8">Jaarlijkse kosten</div>
            
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex justify-between"><span>Onderhoud (gepland)</span><span className="text-white font-black">€2.800</span></div>
              <div className="flex justify-between"><span>Noodreparaties</span><span className="text-white font-black">€360</span></div>
              <div className="flex justify-between"><span>Energie geoptimaliseerd</span><span className="text-white font-black">€1.200</span></div>
              <div className="flex justify-between"><span>Garanties benut</span><span className="text-white font-black">€0</span></div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-slate-900 p-8 lg:p-16" ref={savingsRef}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-4">UW JAARLIJKSE BESPARING</div>
              <div className="text-[3rem] sm:text-[5rem] lg:text-[7rem] font-black text-emerald-400 leading-none tracking-tight">
                €{savingsCount.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/40 mb-2">Over 20 jaar eigenaarschap</div>
              <div className="text-3xl lg:text-5xl font-black text-[#93b9e6]">
                €112.800
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResaleValueSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="blue">BIJ VERKOOP</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-16">
          DE GROTE
          <br />
          <span className="text-[#93b9e6]">BELONING</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-px bg-slate-200">
          <div className="bg-white p-8 lg:p-12">
            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">ZONDER PASPOORT</div>
            <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">€500.000</div>
            <div className="text-sm text-slate-400 mb-8">Vraagprijs</div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500"><span>Onderhandeling</span><span className="text-red-500 font-black">-€25.000</span></div>
              <div className="flex justify-between text-slate-500"><span>Keuring verrassingen</span><span className="text-red-500 font-black">-€8.000</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 mt-3 font-black">
                <span className="text-slate-600">Netto ontvangen</span><span className="text-slate-900">€467.000</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500 p-8 lg:p-12">
            <div className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-6">MET PASPOORT</div>
            <div className="text-4xl lg:text-5xl font-black text-white mb-2">€500.000</div>
            <div className="text-sm text-white/70 mb-8">Vraagprijs</div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/70"><span>Documentatie premium</span><span className="text-white font-black">+€50.000</span></div>
              <div className="flex justify-between text-white/70"><span>Energie certificering</span><span className="text-white font-black">+€25.000</span></div>
              <div className="flex justify-between text-white/70"><span>Snellere verkoop</span><span className="text-white font-black">+€5.000</span></div>
              <div className="flex justify-between border-t border-white/20 pt-3 mt-3 font-black">
                <span className="text-white">Netto ontvangen</span><span className="text-white">€580.000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-px bg-[#93b9e6] p-8 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black text-slate-900 uppercase tracking-wider">Uw meerwaarde bij verkoop</span>
          <span className="text-4xl lg:text-6xl font-black text-white">+€113.000</span>
        </div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const timeline = [
    { year: '0', event: 'OPLEVERING', desc: 'Compleet Woningpaspoort bij sleuteloverdracht' },
    { year: '2', event: 'GARANTIE', desc: 'Automatisch herinnering, claim ingediend' },
    { year: '5', event: 'ONDERHOUD', desc: 'CV-ketel service gepland, storingen voorkomen' },
    { year: '8', event: 'RENOVATIE', desc: 'Alle specs direct beschikbaar voor aannemer' },
    { year: '12', event: 'ENERGIE', desc: 'Zonnepanelen toegevoegd, alles gedocumenteerd' },
    { year: '15+', event: 'VERKOOP', desc: '+23% verkoopprijs door complete documentatie' },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="blue">LEVENSLANG PROFIJT</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-[#050507] leading-[0.9] tracking-[-0.03em] mb-16">
          UW WONING
          <br />
          <span className="text-[#050507]/20">DOOR DE JAREN</span>
        </h2>

        {/* Horizontal timeline */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          {timeline.map((item, i) => (
            <div key={i} className="bg-[#f5f5f5] p-6 lg:p-8 hover:bg-[#050507] group transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-black text-[#93b9e6] group-hover:text-[#93b9e6] mb-2">{item.year}</div>
              <div className="text-[10px] font-black text-[#050507]/30 group-hover:text-white/30 uppercase tracking-[0.2em] mb-4">JAAR</div>
              <h3 className="text-sm font-black text-[#050507] group-hover:text-white mb-2">{item.event}</h3>
              <p className="text-xs text-[#050507]/40 group-hover:text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCasesSection() {
  const cases = [
    { 
      title: 'SLIMME VERKOPER', 
      result: '+€95K', 
      desc: 'Familie Bakker verkocht voor €95.000 meer dan vergelijkbare woningen in dezelfde straat.',
      quote: 'Kopers stonden letterlijk in de rij.' 
    },
    { 
      title: 'GARANTIE HELD', 
      result: '€4.800', 
      desc: 'Daklekkage gerepareerd op garantie. Factuur in 5 minuten gevonden via de app.',
      quote: 'Zonder paspoort was dit nooit gelukt.' 
    },
    { 
      title: 'SLIMME RENOVEERDER', 
      result: '€2.200', 
      desc: 'Aannemer had direct alle bouwtekeningen. Geen verrassingen, exacte offerte.',
      quote: 'De aannemer was onder de indruk.' 
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel color="emerald">RESULTATEN</SectionLabel>

        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-16">
          ECHTE
          <br />
          <span className="text-slate-200">EIGENAREN</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-slate-200">
          {cases.map((c, i) => (
            <div key={i} className="bg-slate-50 p-8 lg:p-12 group hover:bg-white transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-black text-emerald-500 mb-4">{c.result}</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">BESPAARD / VERDIEND</div>
              <h3 className="text-lg font-black text-slate-900 mb-4">{c.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{c.desc}</p>
              <p className="text-sm italic text-[#93b9e6]">&quot;{c.quote}&quot;</p>
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
        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] xl:text-[8rem] font-black text-white leading-[0.85] tracking-[-0.03em] mb-8">
          START MET
          <br />
          UW PASPOORT
        </h2>

        <p className="text-xl lg:text-2xl font-bold text-white/70 max-w-xl mb-12">
          3 minuten. Geen verplichtingen. Direct inzicht in wat u kunt besparen 
          én verdienen met een Woningpaspoort.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-12">
          <Link
            href="/assessment"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-slate-900 text-base font-black uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-colors duration-300"
          >
            BEREKEN MIJN BESPARING
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link
            href="/ai-intelligence"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-slate-900 text-white text-base font-black uppercase tracking-[0.15em] hover:bg-white hover:text-slate-900 transition-colors duration-300"
          >
            <Brain className="w-5 h-5" />
            ONTDEK AI INTELLIGENCE
          </Link>
          <Link
            href="/consultation"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-transparent text-white text-base font-black uppercase tracking-[0.15em] border-2 border-white/30 hover:border-white transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            PLAN EEN GESPREK
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-white/70 text-sm font-bold">
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Gratis</span>
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> 3 minuten</span>
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Persoonlijk advies</span>
        </div>
      </div>
    </section>
  )
}

