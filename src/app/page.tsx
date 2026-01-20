'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/logo'
import { 
  ArrowRight, Check,
  FileText, Shield, Lock,
  Building2, Calendar, Star, MapPin,
  Phone, Mail, TrendingUp,
  Sparkles, Database, Home, Zap, Eye,
  Brain, Quote, Cpu, Bell
} from 'lucide-react'

// Animated number counter
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

// Section label component - light brutalist style
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
      <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">{children}</span>
    </div>
  )
}

export default function HelderLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WoningpaspoortSection />
      <AISection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />
          
          <div className="hidden lg:flex items-center gap-6">
            <a href="#werkwijze" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Werkwijze
            </a>
            <Link href="/woningpaspoort" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              Woningpaspoort
            </Link>
            <Link href="/ai-intelligence" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              AI
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              Login
            </Link>
            <Link 
              href="/assessment" 
              className="group px-5 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-colors"
            >
              <span className="flex items-center gap-2">
                Start
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center bg-slate-50 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#93b9e6 1px, transparent 1px), linear-gradient(90deg, #93b9e6 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Background image */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3 hidden lg:block">
        <Image 
          src="/images/hero-house.jpg"
          alt="Modern huis"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 pt-20">
        <SectionLabel>SINDS 1956</SectionLabel>

        <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[6rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-4">
          BOUW
          <br />
          <span className="text-[#93b9e6]">
            HELDER.
          </span>
          <br />
          BOUW DNA.
        </h1>

        <p className="text-base lg:text-lg text-slate-500 max-w-md mb-6 font-light">
          Uw droomhuis verdient meer dan een sleutel. Het verdient een compleet 
          Woningpaspoort — elk materiaal, elke keuze, elke garantie.
        </p>

        {/* Key stats */}
        <div className="flex flex-wrap items-end gap-6 lg:gap-10 mb-8">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#93b9e6] tracking-tight">19K+</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">PROJECTEN</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">68</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">JAAR ERVARING</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-300 tracking-tight">100%</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">TRANSPARANTIE</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/assessment"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.1em] hover:bg-[#93b9e6] transition-colors duration-300"
          >
            ONTDEK OF BOUWEN PAST
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link
            href="/woningpaspoort"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-slate-900 text-sm font-black uppercase tracking-[0.1em] border-2 border-slate-200 hover:border-[#93b9e6] hover:text-[#93b9e6] transition-all duration-300"
          >
            <Shield className="w-4 h-4" />
            WONINGPASPOORT
          </Link>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, suffix, label, icon: Icon, isDecimal }: { 
  value: number; suffix: string; label: string; icon: React.ElementType; isDecimal?: boolean 
}) {
  const { count, ref } = useCounter(Math.floor(value))
  return (
    <div ref={ref} className="text-center">
      <Icon className="w-6 h-6 text-[#93b9e6] mx-auto mb-4" />
      <p className="text-3xl lg:text-5xl font-black text-white mb-2">
        {isDecimal ? '4.9' : count}{suffix}
      </p>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{label}</p>
    </div>
  )
}

function StatsSection() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem value={68} suffix="" label="JAAR ERVARING" icon={Calendar} />
          <StatItem value={19} suffix="K+" label="PROJECTEN" icon={Building2} />
          <StatItem value={4.9} suffix="/5" label="BEOORDELING" icon={Star} isDecimal />
          <StatItem value={20} suffix=" JAAR" label="DOCUMENTATIE" icon={Database} />
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const services = [
    {
      icon: Shield,
      title: 'WONINGPASPOORT',
      description: 'Uw complete huis-DNA. Elk document, elke factuur, elke garantie. 20 jaar bewaard en blockchain-beveiligd.',
      link: '/woningpaspoort' as const
    },
    {
      icon: Brain,
      title: 'AI INTELLIGENCE',
      description: 'Voorspellend onderhoud, energieoptimalisatie en slimme aanbevelingen. Bespaar tot €5.640 per jaar.',
      link: '/ai-intelligence' as const
    },
    {
      icon: FileText,
      title: 'WKB COMPLIANT',
      description: 'Automatische archivering volgens de Wet kwaliteitsborging. Altijd up-to-date, altijd compliant.',
      link: '/woningpaspoort' as const
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel>ONZE DIENSTEN</SectionLabel>
        
        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-16">
          MEER DAN
          <br />
          <span className="text-[#93b9e6]">BOUWEN</span>
        </h2>

        <div className="grid lg:grid-cols-3 gap-px bg-slate-200">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link 
                key={service.title} 
                href={service.link}
                className="bg-white p-12 lg:p-16 group hover:bg-slate-50 transition-all duration-300"
              >
                <Icon className="w-12 h-12 text-[#93b9e6] mb-8" />
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-wider">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
                <span className="text-[#93b9e6] font-black uppercase tracking-wider text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                  MEER INFO
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WoningpaspoortSection() {
  const features = [
    { icon: FileText, title: 'Alle documenten', desc: 'Bouwtekeningen, vergunningen, facturen' },
    { icon: Shield, title: '20 jaar bewaard', desc: 'Wkb-compliant archivering' },
    { icon: Lock, title: 'Blockchain beveiligd', desc: 'Onveranderbare verificatie' },
    { icon: TrendingUp, title: '+€113K waarde', desc: 'Hogere verkoopprijs' },
  ]

  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>WONINGPASPOORT</SectionLabel>
            
            <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-8">
              UW HUIS-DNA,
              <br />
              <span className="text-[#93b9e6]">VOOR ALTIJD</span>
            </h2>

            <p className="text-xl text-slate-500 mb-12 font-light max-w-lg">
              Geen papieren in een la, geen zoekgeraakte handleidingen. 
              Eén digitaal paspoort met alles wat u ooit over uw huis wilt weten.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#93b9e6]" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 mb-1">{f.title}</h3>
                      <p className="text-sm text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/woningpaspoort"
              className="group inline-flex items-center gap-4 text-[#93b9e6] font-black uppercase tracking-wider hover:text-slate-900 transition-colors"
            >
              ONTDEK MEER
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
              <Image 
                src="/images/woningpaspoort-mockup.jpg"
                alt="Woningpaspoort interface"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-8 left-8 right-8 bg-white shadow-2xl p-8 border border-slate-100">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#93b9e6]">847</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">Materialen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900">156</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">Documenten</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-400">1.2K</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">Foto&apos;s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AISection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
          <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">AI INTELLIGENCE</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Main content */}
          <div className="lg:col-span-5">
            <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-8">
              UW HUIS
              <br />
              DENKT
              <br />
              <span className="text-[#93b9e6]">VOORUIT</span>
            </h2>

            <p className="text-lg text-white/50 mb-8 max-w-md">
              Onze AI voorspelt onderhoud voordat problemen ontstaan, 
              optimaliseert uw energieverbruik en geeft slimme aanbevelingen.
            </p>

            <Link
              href="/ai-intelligence"
              className="group inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#93b9e6] text-slate-900 text-sm font-black uppercase tracking-[0.15em] hover:bg-white transition-colors duration-300"
            >
              ONTDEK AI
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Right: Feature grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {/* Main stat */}
              <div className="col-span-2 bg-[#93b9e6] p-8 lg:p-12">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] font-black text-slate-900/50 uppercase tracking-[0.3em] mb-2">JAARLIJKSE BESPARING</div>
                    <div className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight">€5.640</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-900/60 mb-1">Over 20 jaar</div>
                    <div className="text-2xl lg:text-3xl font-black text-white">€112.800</div>
                  </div>
                </div>
              </div>

              {/* Feature cards */}
              <div className="bg-slate-900 p-6 lg:p-8 border-r border-b border-white/10">
                <Cpu className="w-8 h-8 text-[#93b9e6] mb-4" />
                <div className="text-2xl font-black text-white mb-1">3 maanden</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-2">VOORUIT PLANNEN</div>
                <p className="text-sm text-white/40">AI voorspelt problemen voordat ze ontstaan</p>
              </div>

              <div className="bg-slate-900 p-6 lg:p-8 border-b border-white/10">
                <Zap className="w-8 h-8 text-[#93b9e6] mb-4" />
                <div className="text-2xl font-black text-white mb-1">-32%</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-2">ENERGIEKOSTEN</div>
                <p className="text-sm text-white/40">Door slimme optimalisatie</p>
              </div>

              <div className="bg-slate-900 p-6 lg:p-8 border-r border-white/10">
                <Bell className="w-8 h-8 text-[#93b9e6] mb-4" />
                <div className="text-2xl font-black text-white mb-1">24/7</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-2">MONITORING</div>
                <p className="text-sm text-white/40">Altijd waakzaam over uw woning</p>
              </div>

              <div className="bg-slate-900 p-6 lg:p-8">
                <TrendingUp className="w-8 h-8 text-[#93b9e6] mb-4" />
                <div className="text-2xl font-black text-white mb-1">+23%</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-2">WONINGWAARDE</div>
                <p className="text-sm text-white/40">Hogere verkoopprijs door AI-inzichten</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'ASSESSMENT', desc: 'Ontdek in 3 minuten of bouwen bij u past', icon: Sparkles, image: '/images/discover-step.jpg' },
    { num: '02', title: 'ONTWERP', desc: 'Uw wensen worden werkelijkheid op papier', icon: Eye, image: '/images/design-step.jpg' },
    { num: '03', title: 'BOUW', desc: 'Transparant proces met live updates', icon: Home, image: '/images/build-step.jpg' },
    { num: '04', title: 'OPLEVERING', desc: 'Compleet Woningpaspoort voor altijd', icon: Shield, image: '/images/handover-step.jpg' },
  ]

  return (
    <section id="werkwijze" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel>WERKWIJZE</SectionLabel>
        
        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-16">
          VAN DROOM
          <br />
          <span className="text-[#93b9e6]">NAAR THUIS</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="bg-white p-8 lg:p-12 group hover:bg-slate-50 transition-all duration-300 relative overflow-hidden">
                {/* Background image with overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <Image 
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="text-6xl lg:text-8xl font-black text-slate-100 group-hover:text-[#93b9e6]/20 transition-colors mb-6">{step.num}</div>
                  <Icon className="w-8 h-8 text-[#93b9e6] mb-6" />
                  <h3 className="text-lg font-black text-slate-900 mb-4 tracking-wider">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/assessment"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-slate-900 text-white text-base font-black uppercase tracking-[0.15em] hover:bg-[#93b9e6] transition-colors duration-300"
          >
            START DE TEST
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'Het Woningpaspoort was doorslaggevend bij de verkoop. Kopers wisten precies wat ze kochten.',
      author: 'Familie De Vries',
      location: 'Almere',
      result: '+€127K'
    },
    {
      quote: 'De AI voorspelde een lekkage voordat we er iets van merkten. Dat heeft ons duizenden bespaard.',
      author: 'Mark & Lisa',
      location: 'Utrecht',
      result: '€8.400'
    },
    {
      quote: 'Eindelijk een bouwer die doet wat ze beloven. Elke factuur, elk materiaal, alles gedocumenteerd.',
      author: 'Familie Jansen',
      location: 'Den Haag',
      result: '100%'
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <SectionLabel>ERVARINGEN</SectionLabel>
        
        <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-16">
          WAT KLANTEN
          <br />
          <span className="text-slate-300">ZEGGEN</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-slate-200">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 lg:p-12 group hover:bg-slate-50 transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-black text-[#93b9e6] mb-4">{t.result}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">BESPAARD / VERDIEND</div>
              <Quote className="w-8 h-8 text-slate-200 mb-4" />
              <p className="text-slate-600 mb-8 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-black text-slate-900">{t.author}</p>
                <p className="text-sm text-slate-400">{t.location}</p>
              </div>
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
          KLAAR OM
          <br />
          HELDER TE
          <br />
          BOUWEN?
        </h2>

        <p className="text-xl lg:text-2xl font-bold text-white/70 max-w-xl mb-12">
          Ontdek in 3 minuten of bouwen bij u past. 
          Geen verplichtingen, wel eerlijk advies.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-12">
          <Link
            href="/assessment"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-slate-900 text-base font-black uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-colors duration-300"
          >
            DOE DE TEST
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link
            href="/consultation"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-slate-900 text-white text-base font-black uppercase tracking-[0.15em] hover:bg-white hover:text-slate-900 transition-colors duration-300"
          >
            <Phone className="w-5 h-5" />
            PLAN EEN GESPREK
          </Link>
          <Link
            href="/calculator"
            className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-transparent text-white text-base font-black uppercase tracking-[0.15em] border-2 border-white/30 hover:border-white transition-all duration-300"
          >
            BEREKEN UW BUDGET
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

function Footer() {
  return (
    <footer className="py-16 bg-slate-900">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="text-white/30 text-sm mt-4 mb-6">
              Sinds 1956 bouwen wij dromen met complete transparantie.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/20">
              <MapPin className="w-4 h-4" />
              <span>Groothertoginnelaan 33, Den Haag</span>
            </div>
          </div>

          {/* Diensten */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-sm">Diensten</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/assessment" className="hover:text-[#93b9e6] transition-colors">Bouw assessment</Link></li>
              <li><Link href="/calculator" className="hover:text-[#93b9e6] transition-colors">Budget calculator</Link></li>
              <li><Link href="/woningpaspoort" className="hover:text-[#93b9e6] transition-colors">Woningpaspoort</Link></li>
              <li><Link href="/ai-intelligence" className="hover:text-[#93b9e6] transition-colors">AI Intelligence</Link></li>
            </ul>
          </div>

          {/* Bedrijf */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-sm">Bedrijf</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/about" className="hover:text-[#93b9e6] transition-colors">Over ons</Link></li>
              <li><Link href="/contact" className="hover:text-[#93b9e6] transition-colors">Contact</Link></li>
              <li><a href="mailto:vacatures@helder.nl" className="hover:text-[#93b9e6] transition-colors">Vacatures</a></li>
              <li><Link href="/internal" className="hover:text-[#93b9e6] transition-colors">Interne docs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <a href="tel:+31701234567" className="hover:text-[#93b9e6] transition-colors">070 - 123 45 67</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@helder.nl" className="hover:text-[#93b9e6] transition-colors">info@helder.nl</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2026 HELDER WONINGBOUW
          </p>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-[#93b9e6] transition-colors">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-[#93b9e6] transition-colors">Voorwaarden</Link>
            <Link href="/cookies" className="hover:text-[#93b9e6] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
