'use client'

import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import {
  ArrowRight, Building2, Users, Heart, Shield, Clock,
  Award, MapPin, Zap, Check
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-[#93b9e6]" />
                  <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">OVER HELDER</span>
                </div>
                <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-6">
                  DRIE
                  <br />
                  <span className="text-[#93b9e6]">GENERATIES</span>
                </h1>
                <p className="text-xl text-slate-500 mb-8">
                  Broersma Engineering begon als een klein familiebedrijf. Na 70 jaar en
                  meer dan 19.000 projecten combineren we nu traditioneel vakmanschap
                  met moderne technologie.
                </p>
                <div className="flex flex-wrap gap-6">
                  {[
                    'Familiebedrijf',
                    '19.000+ projecten',
                    '3 generaties',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-wider">Familie Broersma</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#93b9e6] p-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-slate-900" />
                    <div>
                      <p className="font-black text-slate-900 text-lg">70+ JAAR</p>
                      <p className="text-xs text-slate-900/60 font-bold uppercase tracking-wider">Ervaring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tight mb-12 text-center">
              ONS VERHAAL
            </h2>

            <div className="space-y-1">
              {[
                { year: '1956', title: 'HET BEGIN', desc: 'Opa Broersma startte het bedrijf met een simpele belofte: kwaliteit boven alles. Met zijn handen bouwde hij de eerste woningen in de regio.' },
                { year: '1985', title: 'TWEEDE GENERATIE', desc: 'Vader nam het stokje over en breidde uit naar grotere projecten. De kernwaarden bleven: transparantie, kwaliteit, en persoonlijk contact.' },
                { year: '2024', title: 'HELDER WORDT GEBOREN', desc: 'De derde generatie brengt technologie naar het familiebedrijf. Het Woningpaspoort is de ultieme belofte: alles wat we bouwen, leggen we vast.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-20 flex-shrink-0">
                    <span className="text-2xl font-black text-[#93b9e6]">{item.year}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-slate-900">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-4">
                WAAR WE VOOR STAAN
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Onze waarden zijn niet geschreven in een vergadering, maar gevormd door generaties
                van klanten en collega&apos;s die ons vertrouwden.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-1">
              <div className="bg-[#93b9e6] p-8">
                <Heart className="w-10 h-10 text-slate-900 mb-6" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-3">Transparantie</h3>
                <p className="text-slate-900/60">
                  Geen verborgen kosten, geen verrassingen. U weet precies wat u krijgt,
                  wat het kost, en wanneer het klaar is.
                </p>
              </div>

              <div className="bg-white/5 p-8">
                <Shield className="w-10 h-10 text-emerald-400 mb-6" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-3">Kwaliteit</h3>
                <p className="text-white/50">
                  We bouwen woningen waarin we zelf zouden wonen. Geen compromissen op
                  materialen of vakmanschap.
                </p>
              </div>

              <div className="bg-white/5 p-8">
                <Users className="w-10 h-10 text-[#93b9e6] mb-6" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-3">Persoonlijk</h3>
                <p className="text-white/50">
                  U spreekt met de familie, niet met een callcenter. Elke vraag krijgt
                  een persoonlijk antwoord.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 text-center">
              HET TEAM
            </h2>
            <p className="text-slate-500 mb-12 text-center max-w-xl mx-auto">
              Familie en vakmanschap, van generatie op generatie
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {[
                { name: 'PA BROERSMA', role: 'Oprichter', initials: 'PB', color: 'bg-[#93b9e6]' },
                { name: 'BROER BROERSMA', role: 'Projectleider', initials: 'BB', color: 'bg-emerald-500' },
                { name: 'ZUS BROERSMA', role: 'Operations', initials: 'ZB', color: 'bg-violet-500' },
                { name: 'MARTIJN', role: 'Tech & Marketing', initials: 'MB', color: 'bg-slate-900' },
              ].map((member) => (
                <div key={member.name} className="bg-slate-50 p-6 text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center text-white text-xl font-black ${member.color}`}>
                    {member.initials}
                  </div>
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">{member.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Woningpaspoort */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">TECHNOLOGIE</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">
                WAAROM WONINGPASPOORT?
              </h2>
              <p className="text-slate-500">
                70 jaar lang legden we alles vast op papier. Nu gaan we een stap verder.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-slate-200">
              <div className="bg-white p-8">
                <h3 className="font-black text-red-500 uppercase tracking-wider text-sm mb-6">Het probleem</h3>
                <ul className="space-y-3 text-slate-600">
                  {[
                    'Bouwdossiers verdwijnen na oplevering',
                    'Niemand weet wat er in de muren zit',
                    'Bij verkoop geen bewijs van kwaliteit',
                    'Wkb vereist 20 jaar documentatie',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-red-500 font-black">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-500 p-8">
                <h3 className="font-black text-white uppercase tracking-wider text-sm mb-6">Onze oplossing</h3>
                <ul className="space-y-3 text-white/80">
                  {[
                    'Alles digitaal, voor altijd bewaard',
                    'Elk materiaal, elke foto vastgelegd',
                    'Deel uw paspoort met kopers',
                    '100% Wkb-compliant vanaf dag één',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-white flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-[#93b9e6]">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-2xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">
              KLAAR OM TE BOUWEN MET TRANSPARANTIE?
            </h2>
            <p className="text-slate-900/60 mb-8 max-w-xl mx-auto">
              Ontdek of bouwen met Helder bij u past. Eerlijk advies, geen verplichtingen.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-wider text-sm hover:bg-white hover:text-slate-900 transition-colors"
            >
              Start de assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Location */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Gevestigd in Nederland</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
              Broersma Engineering / Helder
            </h2>
            <p className="text-slate-500">
              Actief in heel Nederland, met roots in de Randstad
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
