import Link from 'next/link'
import { SharedFooter } from '@/components/layout/footer'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Algemene Voorwaarden',
  description: 'De algemene voorwaarden van Helder Woningbouw.',
}

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#93b9e6]/10">
              <FileText className="w-8 h-8 text-[#93b9e6]" />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
              Juridisch
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-wider mb-4">
            Algemene Voorwaarden
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
            <div className="p-6 bg-[#93b9e6]/10 border-l-4 border-[#93b9e6] mb-12 not-prose">
              <p className="text-slate-700">
                <strong className="font-black">Let op:</strong> Deze voorwaarden zijn van toepassing op alle diensten 
                van Helder Woningbouw B.V. Door gebruik te maken van onze diensten gaat u 
                akkoord met deze voorwaarden.
              </p>
            </div>

            <h2>Artikel 1 - Definities</h2>
            <p>In deze voorwaarden wordt verstaan onder:</p>
            <ol>
              <li><strong>Helder:</strong> Helder Woningbouw B.V., gevestigd te Den Haag, KvK 12345678</li>
              <li><strong>Opdrachtgever:</strong> de natuurlijke of rechtspersoon die met Helder een overeenkomst aangaat</li>
              <li><strong>Woningpaspoort:</strong> het digitale dossier met alle documentatie over een woning</li>
              <li><strong>Project:</strong> de bouw, verbouwing of renovatie van een woning</li>
            </ol>

            <h2>Artikel 2 - Toepasselijkheid</h2>
            <ol>
              <li>Deze voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen Helder en opdrachtgever.</li>
              <li>Afwijkingen van deze voorwaarden zijn alleen geldig indien schriftelijk overeengekomen.</li>
              <li>De toepasselijkheid van eventuele inkoop- of andere voorwaarden van opdrachtgever wordt uitdrukkelijk van de hand gewezen.</li>
            </ol>

            <h2>Artikel 3 - Offertes en Overeenkomsten</h2>
            <ol>
              <li>Alle offertes van Helder zijn vrijblijvend en hebben een geldigheidsduur van 30 dagen.</li>
              <li>Een overeenkomst komt tot stand na schriftelijke aanvaarding door opdrachtgever.</li>
              <li>Aanvullende of gewijzigde afspraken zijn alleen bindend indien schriftelijk bevestigd door Helder.</li>
            </ol>

            <h2>Artikel 4 - Uitvoering</h2>
            <ol>
              <li>Helder zal de overeenkomst naar beste inzicht en vermogen uitvoeren, conform de eisen van goed vakmanschap.</li>
              <li>Opdrachtgever zorgt ervoor dat alle gegevens en toegang die noodzakelijk zijn tijdig worden verstrekt.</li>
              <li>Vermelde termijnen zijn indicatief en niet fataal, tenzij uitdrukkelijk anders overeengekomen.</li>
            </ol>

            <h2>Artikel 5 - Woningpaspoort Dienst</h2>
            <ol>
              <li>Het Woningpaspoort is een digitale dienst voor het documenteren van woninginformatie.</li>
              <li>Helder garandeert een beschikbaarheid van 99,5% op jaarbasis.</li>
              <li>Opdrachtgever behoudt eigendom van alle geüploade documenten en gegevens.</li>
              <li>Bij beëindiging van de dienst heeft opdrachtgever recht op export van alle gegevens.</li>
              <li>Helder kan de dienst niet garanderen bij omstandigheden buiten haar macht (overmacht).</li>
            </ol>

            <h2>Artikel 6 - Prijzen en Betaling</h2>
            <ol>
              <li>Alle prijzen zijn exclusief BTW, tenzij anders vermeld.</li>
              <li>Betaling dient te geschieden binnen 14 dagen na factuurdatum.</li>
              <li>Bij overschrijding van de betalingstermijn is opdrachtgever van rechtswege in verzuim.</li>
              <li>Helder mag jaarlijks de prijzen indexeren conform het CBS consumentenprijsindexcijfer.</li>
            </ol>

            <h2>Artikel 7 - Intellectueel Eigendom</h2>
            <ol>
              <li>Alle intellectuele eigendomsrechten op de door Helder ontwikkelde software, ontwerpen en documentatie blijven eigendom van Helder.</li>
              <li>Opdrachtgever verkrijgt een niet-exclusief gebruiksrecht voor de duur van de overeenkomst.</li>
              <li>Het is niet toegestaan om zonder toestemming de systemen van Helder te kopiëren of reverse-engineeren.</li>
            </ol>

            <h2>Artikel 8 - Aansprakelijkheid</h2>
            <ol>
              <li>De aansprakelijkheid van Helder is beperkt tot het bedrag dat in het desbetreffende geval door de verzekering wordt uitgekeerd.</li>
              <li>Indien geen uitkering plaatsvindt, is de aansprakelijkheid beperkt tot het factuurbedrag van het project.</li>
              <li>Helder is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst.</li>
            </ol>

            <h2>Artikel 9 - Overmacht</h2>
            <ol>
              <li>In geval van overmacht is Helder niet gehouden tot nakoming van enige verplichting.</li>
              <li>Onder overmacht wordt verstaan: natuurrampen, pandemie, stakingen, overheidsmaatregelen, storingen in energie- of communicatienetwerken.</li>
            </ol>

            <h2>Artikel 10 - Geheimhouding</h2>
            <ol>
              <li>Partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie.</li>
              <li>Deze verplichting geldt ook na beëindiging van de overeenkomst.</li>
            </ol>

            <h2>Artikel 11 - Privacy</h2>
            <p>
              Helder verwerkt persoonsgegevens conform de AVG. Zie onze{' '}
              <Link href="/privacy" className="text-[#93b9e6] hover:underline font-bold">
                privacyverklaring
              </Link>{' '}
              voor meer informatie.
            </p>

            <h2>Artikel 12 - Geschillen</h2>
            <ol>
              <li>Op alle overeenkomsten is Nederlands recht van toepassing.</li>
              <li>Geschillen worden voorgelegd aan de bevoegde rechter te Den Haag.</li>
              <li>Partijen zullen eerst proberen om geschillen in onderling overleg op te lossen.</li>
            </ol>

            <h2>Artikel 13 - Wijzigingen</h2>
            <p>
              Helder behoudt zich het recht voor deze voorwaarden te wijzigen. Wijzigingen 
              worden minimaal 30 dagen voor inwerkingtreding aangekondigd.
            </p>

            <h2>Contact</h2>
            <p>
              Voor vragen over deze voorwaarden kunt u contact opnemen via{' '}
              <a href="mailto:info@helder.nl">info@helder.nl</a> of 070 - 123 45 67.
            </p>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
