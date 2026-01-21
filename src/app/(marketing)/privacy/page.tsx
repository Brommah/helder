import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacyverklaring',
  description: 'Lees hoe Helder Woningbouw omgaat met uw persoonsgegevens.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#93b9e6] flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
              Juridisch
            </span>
          </div>
          <h1 className="text-[2.5rem] lg:text-[4rem] font-black text-slate-900 uppercase tracking-tight leading-[0.9] mb-4">
            PRIVACY<br />VERKLARING
          </h1>
          <p className="text-slate-500">
            Laatst bijgewerkt: januari 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Summary */}
          <div className="p-6 bg-[#93b9e6]/10 border-l-4 border-[#93b9e6] mb-12">
            <p className="text-slate-700">
              <strong className="font-black uppercase tracking-wider text-sm">Samenvatting:</strong> Bij Helder Woningbouw nemen we uw privacy serieus. 
              We verzamelen alleen gegevens die nodig zijn voor onze dienstverlening en delen 
              deze nooit met derden voor marketingdoeleinden.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">1. Wie zijn wij?</h2>
              <p className="text-slate-600 leading-relaxed">
                Helder Woningbouw B.V. (&ldquo;Helder&rdquo;, &ldquo;wij&rdquo;, &ldquo;ons&rdquo;) is verantwoordelijk voor de verwerking 
                van persoonsgegevens zoals weergegeven in deze privacyverklaring. Wij zijn gevestigd 
                aan de Groothertoginnelaan 33, 2517 EB Den Haag.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">2. Welke gegevens verzamelen wij?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Wij verzamelen en verwerken de volgende persoonsgegevens:</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#93b9e6] mt-2 flex-shrink-0" />
                  <span><strong>Contactgegevens:</strong> naam, e-mailadres, telefoonnummer, adres</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#93b9e6] mt-2 flex-shrink-0" />
                  <span><strong>Projectgegevens:</strong> informatie over uw bouwproject, wensen, budget</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#93b9e6] mt-2 flex-shrink-0" />
                  <span><strong>Woningpaspoort data:</strong> documenten, foto&apos;s, specificaties van uw woning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#93b9e6] mt-2 flex-shrink-0" />
                  <span><strong>Websitegebruik:</strong> IP-adres, browsertype, bezochte pagina&apos;s</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">3. Waarvoor gebruiken wij uw gegevens?</h2>
              <ul className="space-y-2 text-slate-600">
                {[
                  'Het uitvoeren van onze dienstverlening (bouwprojecten, woningpaspoort)',
                  'Het versturen van offertes en facturen',
                  'Het beantwoorden van uw vragen en verzoeken',
                  'Het verbeteren van onze website en diensten',
                  'Het voldoen aan wettelijke verplichtingen',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">4. Hoe lang bewaren wij uw gegevens?</h2>
              <div className="bg-slate-50 p-6">
                <ul className="space-y-3 text-slate-600">
                  <li className="flex justify-between border-b border-slate-200 pb-3">
                    <span>Projectdossiers</span>
                    <span className="font-bold">20 jaar</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-200 pb-3">
                    <span>Woningpaspoort data</span>
                    <span className="font-bold">Klant + 7 jaar</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-200 pb-3">
                    <span>Marketinggegevens</span>
                    <span className="font-bold">2 jaar</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Boekhoudkundige gegevens</span>
                    <span className="font-bold">7 jaar</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">5. Uw rechten</h2>
              <p className="text-slate-600 leading-relaxed mb-4">U heeft de volgende rechten met betrekking tot uw persoonsgegevens:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Inzage', desc: 'Opvragen welke gegevens wij van u hebben' },
                  { title: 'Correctie', desc: 'Onjuiste gegevens laten aanpassen' },
                  { title: 'Verwijdering', desc: 'Verzoeken uw gegevens te verwijderen' },
                  { title: 'Overdracht', desc: 'Uw gegevens opvragen in leesbaar formaat' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50">
                    <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 mt-4">
                Om uw rechten uit te oefenen, stuurt u een e-mail naar{' '}
                <a href="mailto:privacy@helder.nl" className="text-[#93b9e6] font-bold hover:text-slate-900 transition-colors">privacy@helder.nl</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">6. Contact</h2>
              <div className="bg-slate-900 p-6 text-white">
                <p className="mb-4 text-white/70">
                  Heeft u vragen over deze privacyverklaring? Neem contact op:
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>E-mail: <a href="mailto:privacy@helder.nl" className="text-[#93b9e6] font-bold">privacy@helder.nl</a></li>
                  <li>Telefoon: 070 - 123 45 67</li>
                  <li>Post: Helder Woningbouw B.V., Groothertoginnelaan 33, 2517 EB Den Haag</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
