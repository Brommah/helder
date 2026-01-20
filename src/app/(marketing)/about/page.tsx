'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/footer'
import {
  ArrowRight, Building2, Users, Heart, Shield, Clock,
  Award, MapPin, Zap, CheckCircle2
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-[#1a1a2e] font-medium">
              Home
            </Link>
            <Link href="/assessment" className="text-slate-600 hover:text-[#1a1a2e] font-medium">
              Start assessment
            </Link>
          </nav>
          <Link
            href="/assessment"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Start nu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#93b9e6]100 text-[#93b9e6]700 rounded-full text-sm font-medium mb-6">
                  <Clock className="w-4 h-4" />
                  Sinds 1956
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] mb-6 leading-tight">
                  Drie generaties vakmanschap,<br />
                  <span className="text-[#93b9e6]600">nu met technologie</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                  Broersma Engineering begon als een klein familiebedrijf. Na 70 jaar en
                  meer dan 19.000 projecten combineren we nu traditioneel vakmanschap
                  met moderne technologie.
                </p>
                <div className="flex flex-wrap gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Familiebedrijf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>19.000+ projecten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>3 generaties</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl overflow-hidden">
                  {/* Placeholder for family photo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Familie Broersma</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#93b9e6]100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#93b9e6]600" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e]">70+ jaar</p>
                      <p className="text-sm text-slate-500">Ervaring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8 text-center">
              Ons verhaal
            </h2>

            <div className="space-y-12">
              {/* Timeline items */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#93b9e6]100 rounded-full flex items-center justify-center">
                    <span className="text-[#93b9e6]700 font-bold">1956</span>
                  </div>
                  <div className="w-0.5 h-full bg-[#93b9e6]200 mt-4" />
                </div>
                <div className="pb-12">
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">Het begin</h3>
                  <p className="text-slate-600">
                    Opa Broersma startte het bedrijf met een simpele belofte: kwaliteit boven alles.
                    Met zijn handen bouwde hij de eerste woningen in de regio. Geen fancy technologie,
                    maar vakmanschap en toewijding.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#93b9e6]100 rounded-full flex items-center justify-center">
                    <span className="text-[#93b9e6]700 font-bold">1985</span>
                  </div>
                  <div className="w-0.5 h-full bg-[#93b9e6]200 mt-4" />
                </div>
                <div className="pb-12">
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">Tweede generatie</h3>
                  <p className="text-slate-600">
                    Vader nam het stokje over en breidde uit naar grotere projecten. De kernwaarden
                    bleven: transparantie, kwaliteit, en persoonlijk contact. Elke klant kent de
                    familie, elke familie kent hun woning.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-bold">2024</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">Helder wordt geboren</h3>
                  <p className="text-slate-600">
                    De derde generatie - broer, zus, en ik - brengen technologie naar het familiebedrijf.
                    We combineren 70 jaar bouwervaring met blockchain-verificatie en digitale transparantie.
                    Het Woningpaspoort is de ultieme belofte: alles wat we bouwen, leggen we vast.
                    Voor altijd, onveranderbaar, en volledig transparant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4 text-center">
              Waar we voor staan
            </h2>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto">
              Onze waarden zijn niet geschreven in een vergadering, maar gevormd door generaties
              van klanten en collega's die ons vertrouwden.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-14 h-14 bg-[#93b9e6]100 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-[#93b9e6]600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Transparantie</h3>
                <p className="text-slate-600">
                  Geen verborgen kosten, geen verrassingen. U weet precies wat u krijgt,
                  wat het kost, en wanneer het klaar is. Altijd.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Kwaliteit</h3>
                <p className="text-slate-600">
                  We bouwen woningen waarin we zelf zouden wonen. Geen compromissen op
                  materialen of vakmanschap.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Persoonlijk</h3>
                <p className="text-slate-600">
                  U spreekt met de familie, niet met een callcenter. Elke vraag krijgt
                  een persoonlijk antwoord.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4 text-center">
              Het team
            </h2>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto">
              Familie en vakmanschap, van generatie op generatie
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: 'Pa Broersma', role: 'Oprichter', initials: 'PB', color: 'blue' },
                { name: 'Broer Broersma', role: 'Projectleider', initials: 'BB', color: 'emerald' },
                { name: 'Zus Broersma', role: 'Operations', initials: 'ZB', color: 'violet' },
                { name: 'Martijn', role: 'Tech & Marketing', initials: 'MB', color: 'blue' },
              ].map((member) => (
                <div key={member.name} className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${
                    member.color === 'blue' ? 'bg-[#93b9e6]' :
                    member.color === 'emerald' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                    member.color === 'violet' ? 'bg-gradient-to-br from-violet-400 to-purple-500' :
                    'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}>
                    {member.initials}
                  </div>
                  <h3 className="font-semibold text-[#1a1a2e]">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Helder / Technology */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Technologie
              </div>
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
                Waarom Woningpaspoort?
              </h2>
              <p className="text-xl text-slate-600">
                70 jaar lang legden we alles vast op papier. Nu gaan we een stap verder.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Het probleem</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500">-</span>
                      Bouwdossiers verdwijnen na oplevering
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500">-</span>
                      Niemand weet wat er precies in de muren zit
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500">-</span>
                      Bij verkoop geen bewijs van kwaliteit
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500">-</span>
                      Wkb vereist 20 jaar documentatie
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Onze oplossing</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      Alles digitaal, voor altijd bewaard
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      Elk materiaal, elke foto vastgelegd
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      Deel uw paspoort met kopers
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      100% Wkb-compliant vanaf dag één
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Klaar om te bouwen met transparantie?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Ontdek of bouwen met Helder bij u past. Eerlijk advies, geen verplichtingen.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1a1a2e] font-semibold rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              Start de assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Location */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Gevestigd in Nederland
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              Broersma Engineering / Helder
            </h2>
            <p className="text-slate-600">
              Actief in heel Nederland, met roots in de Randstad
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
