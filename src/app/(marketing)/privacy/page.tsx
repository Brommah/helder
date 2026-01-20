import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { SharedFooter } from '@/components/layout/footer'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacyverklaring',
  description: 'Lees hoe Helder Woningbouw omgaat met uw persoonsgegevens.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size="lg" />
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1a1a2e] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Juridisch
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] mb-4">
            Privacyverklaring
          </h1>
          <p className="text-lg text-slate-600">
            Laatst bijgewerkt: januari 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-12 not-prose">
              <p className="text-blue-800">
                <strong>Samenvatting:</strong> Bij Helder Woningbouw nemen we uw privacy serieus. 
                We verzamelen alleen gegevens die nodig zijn voor onze dienstverlening en delen 
                deze nooit met derden voor marketingdoeleinden.
              </p>
            </div>

            <h2>1. Wie zijn wij?</h2>
            <p>
              Helder Woningbouw B.V. (&ldquo;Helder&rdquo;, &ldquo;wij&rdquo;, &ldquo;ons&rdquo;) is verantwoordelijk voor de verwerking 
              van persoonsgegevens zoals weergegeven in deze privacyverklaring. Wij zijn gevestigd 
              aan de Bouwlaan 123, 2512 AB Den Haag en ingeschreven bij de Kamer van Koophandel 
              onder nummer 12345678.
            </p>

            <h2>2. Welke gegevens verzamelen wij?</h2>
            <p>Wij verzamelen en verwerken de volgende persoonsgegevens:</p>
            <ul>
              <li><strong>Contactgegevens:</strong> naam, e-mailadres, telefoonnummer, adres</li>
              <li><strong>Projectgegevens:</strong> informatie over uw bouwproject, wensen, budget</li>
              <li><strong>Woningpaspoort data:</strong> documenten, foto&apos;s, specificaties van uw woning</li>
              <li><strong>Websitegebruik:</strong> IP-adres, browsertype, bezochte pagina&apos;s</li>
              <li><strong>Communicatie:</strong> correspondentie via e-mail, telefoon of chat</li>
            </ul>

            <h2>3. Waarvoor gebruiken wij uw gegevens?</h2>
            <p>Wij verwerken uw persoonsgegevens voor de volgende doeleinden:</p>
            <ul>
              <li>Het uitvoeren van onze dienstverlening (bouwprojecten, woningpaspoort)</li>
              <li>Het versturen van offertes en facturen</li>
              <li>Het beantwoorden van uw vragen en verzoeken</li>
              <li>Het verbeteren van onze website en diensten</li>
              <li>Het voldoen aan wettelijke verplichtingen</li>
            </ul>

            <h2>4. Hoe lang bewaren wij uw gegevens?</h2>
            <p>
              Wij bewaren uw persoonsgegevens niet langer dan strikt noodzakelijk is om de 
              doelen te realiseren waarvoor uw gegevens worden verzameld. Onze bewaartermijnen:
            </p>
            <ul>
              <li>Projectdossiers: 20 jaar na oplevering (wettelijke verplichting)</li>
              <li>Woningpaspoort data: zolang u klant bent, plus 7 jaar</li>
              <li>Marketinggegevens: 2 jaar na laatste contact</li>
              <li>Boekhoudkundige gegevens: 7 jaar (fiscale bewaarplicht)</li>
            </ul>

            <h2>5. Delen met derden</h2>
            <p>
              Wij delen uw gegevens alleen met derden wanneer dit noodzakelijk is voor onze 
              dienstverlening of wanneer wij hiertoe wettelijk verplicht zijn. Denk aan:
            </p>
            <ul>
              <li>Onderaannemers en leveranciers (alleen projectgerelateerde info)</li>
              <li>Gemeente en overheidsinstanties (vergunningen)</li>
              <li>Onze IT-dienstverleners (onder verwerkersovereenkomst)</li>
            </ul>
            <p>
              Wij verkopen uw gegevens nooit aan derden voor marketingdoeleinden.
            </p>

            <h2>6. Uw rechten</h2>
            <p>U heeft de volgende rechten met betrekking tot uw persoonsgegevens:</p>
            <ul>
              <li><strong>Inzage:</strong> U kunt opvragen welke gegevens wij van u hebben</li>
              <li><strong>Correctie:</strong> U kunt onjuiste gegevens laten aanpassen</li>
              <li><strong>Verwijdering:</strong> U kunt verzoeken uw gegevens te verwijderen</li>
              <li><strong>Bezwaar:</strong> U kunt bezwaar maken tegen bepaalde verwerkingen</li>
              <li><strong>Overdracht:</strong> U kunt uw gegevens opvragen in een leesbaar formaat</li>
            </ul>
            <p>
              Om uw rechten uit te oefenen, stuurt u een e-mail naar{' '}
              <a href="mailto:privacy@helder.nl">privacy@helder.nl</a>.
            </p>

            <h2>7. Beveiliging</h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om uw gegevens te 
              beschermen tegen verlies, misbruik en ongeautoriseerde toegang. Dit omvat:
            </p>
            <ul>
              <li>Versleutelde verbindingen (HTTPS/SSL)</li>
              <li>Regelmatige beveiligingsaudits</li>
              <li>Strenge toegangscontroles</li>
              <li>Training van medewerkers</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              Onze website maakt gebruik van cookies. Lees meer in ons{' '}
              <Link href="/cookies" className="text-[#93b9e6]600 hover:underline">
                cookiebeleid
              </Link>.
            </p>

            <h2>9. Contact</h2>
            <p>
              Heeft u vragen over deze privacyverklaring of over de manier waarop wij omgaan 
              met uw persoonsgegevens? Neem dan contact met ons op:
            </p>
            <ul>
              <li>E-mail: <a href="mailto:privacy@helder.nl">privacy@helder.nl</a></li>
              <li>Telefoon: 070 - 123 45 67</li>
              <li>Post: Helder Woningbouw B.V., Bouwlaan 123, 2512 AB Den Haag</li>
            </ul>
            <p>
              U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens 
              via <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
                autoriteitpersoonsgegevens.nl
              </a>.
            </p>

            <h2>10. Wijzigingen</h2>
            <p>
              Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen. De meest recente 
              versie is altijd beschikbaar op deze pagina. Bij significante wijzigingen 
              informeren wij u actief.
            </p>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
