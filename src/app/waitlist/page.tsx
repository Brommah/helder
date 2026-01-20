'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { 
  ArrowRight, Check, Shield, FileText, Lock, 
  Building2, Users, Clock, Star, ChevronDown,
  Mail, Phone, MapPin, Award, TrendingUp
} from 'lucide-react'

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    projectTimeline: '',
    company: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call - replace with actual Notion API integration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return <SuccessState />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Link 
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Terug naar home
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Content */}
            <div className="lg:sticky lg:top-32">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-800 text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Exclusieve vroege toegang
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-tight mb-6">
                Uw nieuwe woning verdient 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> een paspoort</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                <strong>19.000+ projecten</strong> hebben ons geleerd wat écht telt bij het bouwen van een droomhuis. 
                Nu brengen we die kennis digitaal naar u toe.
              </p>

              {/* Heritage Story */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
                <h3 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  Ons verhaal
                </h3>
                <p className="text-slate-600 mb-4">
                  Broersma Engineering is een familiebedrijf - vader, broer, zus, en ikzelf - 
                  opgericht in 1956. Na drie generaties en 19.000+ projecten hebben we één 
                  belangrijke les geleerd:
                </p>
                <blockquote className="border-l-4 border-amber-400 pl-4 text-lg font-medium text-[#1a1a2e] italic">
                  "De beste bouwprojecten zijn de meest transparante."
                </blockquote>
                <p className="text-slate-600 mt-4">
                  Daarom bouwen we <strong>Helder</strong> - de technologie-arm van Broersma Engineering. 
                  Uw Woningpaspoort is onze belofte: elk materiaal, elke keuze, elke garantie - 
                  voor altijd gedocumenteerd.
                </p>
              </div>

              {/* Wkb Compliance Hook */}
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 text-white mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Wkb-compliant vanaf dag één
                </h3>
                <p className="text-slate-300 mb-4">
                  Sinds januari 2024 verplicht de <strong>Wet kwaliteitsborging (Wkb)</strong> dat 
                  elke nieuwbouwwoning een compleet consumentendossier krijgt - 20 jaar bewaard.
                </p>
                <ul className="space-y-2">
                  {[
                    'Alle tekeningen en specificaties',
                    'Materiaalcertificaten en garanties',
                    'Keuringsrapporten en inspecties',
                    'Energielabel en BENG-berekening',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-amber-300 mt-4">
                  Woningpaspoort genereert dit automatisch tijdens de bouw.
                </p>
              </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '68', label: 'Jaar ervaring' },
                  { value: '19K+', label: 'Projecten' },
                  { value: '100%', label: 'Transparant' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                    <p className="text-2xl font-bold text-[#1a1a2e]">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                  Krijg als eerste toegang
                </h2>
                <p className="text-slate-600">
                  Schrijf u in voor de wachtlijst en ontvang exclusieve updates, 
                  plus een gratis Wkb-checklist.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Uw naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all outline-none"
                    placeholder="Jan van der Berg"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all outline-none"
                    placeholder="jan@email.nl"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                    Ik ben een... *
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all outline-none appearance-none bg-white"
                    >
                      <option value="">Selecteer...</option>
                      <option value="homeowner">Huiseigenaar / Familie die wil bouwen</option>
                      <option value="builder">Aannemer / Bouwbedrijf</option>
                      <option value="architect">Architect / Ontwerper</option>
                      <option value="developer">Projectontwikkelaar</option>
                      <option value="other">Anders</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Company (conditional for builders) */}
                {formData.role === 'builder' && (
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                      Bedrijfsnaam
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all outline-none"
                      placeholder="Uw bouwbedrijf"
                    />
                  </div>
                )}

                {/* Project Timeline */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-2">
                    Wanneer wilt u starten?
                  </label>
                  <div className="relative">
                    <select
                      id="timeline"
                      value={formData.projectTimeline}
                      onChange={(e) => setFormData({ ...formData, projectTimeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all outline-none appearance-none bg-white"
                    >
                      <option value="">Selecteer...</option>
                      <option value="now">Direct / Al bezig</option>
                      <option value="3months">Binnen 3 maanden</option>
                      <option value="6months">Binnen 6 maanden</option>
                      <option value="1year">Binnen 1 jaar</option>
                      <option value="exploring">Nog aan het verkennen</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#1a1a2e]/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Even geduld...
                    </>
                  ) : (
                    <>
                      Schrijf mij in
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-slate-500 text-center">
                  Door in te schrijven gaat u akkoord met onze{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacyvoorwaarden worden binnenkort gepubliceerd.'); }} className="underline hover:text-slate-700 cursor-pointer">
                    privacyvoorwaarden
                  </a>
                  . We delen uw gegevens nooit met derden.
                </p>
              </form>

              {/* What You Get */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-4">
                  Wat krijgt u?
                </h4>
                <ul className="space-y-3">
                  {[
                    { icon: FileText, text: 'Gratis Wkb Compliance Checklist (PDF)' },
                    { icon: Mail, text: 'Exclusieve updates over de lancering' },
                    { icon: TrendingUp, text: 'Vroege toegang tot het platform' },
                    { icon: Users, text: 'Uitnodiging voor pilot programma' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Logo size="sm" href={null} />
              <span className="text-slate-300">|</span>
              <span>Een product van Broersma Engineering</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-700 cursor-pointer" onClick={() => alert('Privacybeleid komt binnenkort')}>Privacy</span>
              <Link href="/" className="hover:text-slate-700">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SuccessState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">
          Welkom bij de wachtlijst!
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          U ontvangt binnen enkele minuten een bevestigingsmail met uw gratis 
          Wkb Compliance Checklist. Check ook uw spam folder.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-4 px-6 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-xl transition-all"
          >
            Terug naar home
          </Link>
          <p className="text-sm text-slate-500">
            Heeft u vragen? Mail ons op{' '}
            <a href="mailto:info@helder.nl" className="text-[#1a1a2e] underline">
              info@helder.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
