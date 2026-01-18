import Link from 'next/link'
import { 
  Home, 
  FileText, 
  Shield, 
  Share2, 
  HardHat, 
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Woningpaspoort</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">Hoe het werkt</Link>
            <Link href="#builders" className="text-gray-600 hover:text-gray-900">Voor bouwers</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-700 hover:text-gray-900 py-2 px-4">
              Inloggen
            </Link>
            <Link href="/register" className="btn-primary">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Nu beschikbaar voor woningeigenaren
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Het complete digitale dossier van uw woning
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Van bouwgeschiedenis tot onderhoud — alles op één plek. 
              Veilig, volledig, en altijd binnen handbereik.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary !py-4 !px-8 text-lg inline-flex items-center gap-2">
                Start uw woningpaspoort
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/demo" className="btn-secondary !py-4 !px-8 text-lg">
                Bekijk demo
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              Gratis voor woningeigenaren · Geen creditcard nodig
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-12 border-y border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="€5 mrd" label="Jaarlijks verlies in de bouw door miscommunicatie" />
            <Stat value="19%" label="Gemiddelde budgetoverschrijding" />
            <Stat value="20 jaar" label="Verplichte documentatietermijn (Wkb)" />
            <Stat value="100%" label="Transparantie met Woningpaspoort" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alles wat u nodig heeft
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Een compleet overzicht van uw woning, van fundering tot dak
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Complete documentatie"
              description="Alle documenten op één plek: energielabel, bouwtekeningen, vergunningen, en onderhoudshistorie."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Tijdlijn van uw woning"
              description="Volg de volledige geschiedenis: verbouwingen, onderhoud, en wijzigingen — allemaal gedocumenteerd."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Veilig & privé"
              description="U bepaalt wie toegang heeft. Geavanceerde encryptie beschermt uw gegevens."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Slim delen"
              description="Deel selectief met makelaars, kopers, of aannemers — met of zonder gevoelige informatie."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI-ondersteuning"
              description="Ontvang slimme onderhoudsherinneringen en gepersonaliseerde verbeteradviezen."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="Wkb-compliant"
              description="Voldoe moeiteloos aan de nieuwe kwaliteitsborgingswet met complete documentatie."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hoe het werkt
            </h2>
            <p className="text-xl text-gray-600">
              In 3 minuten uw woningpaspoort aanmaken
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <Step 
              number={1}
              title="Registreer"
              description="Maak gratis een account aan met uw e-mailadres."
            />
            <Step 
              number={2}
              title="Voeg uw woning toe"
              description="Vul basisgegevens in of importeer automatisch via postcode."
            />
            <Step 
              number={3}
              title="Upload documenten"
              description="Voeg bestaande documenten toe. Wij organiseren ze automatisch."
            />
          </div>
          
          <div className="text-center mt-12">
            <Link href="/register" className="btn-primary !py-3 !px-8 text-lg">
              Begin nu
            </Link>
          </div>
        </div>
      </section>

      {/* For Builders */}
      <section id="builders" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <HardHat className="h-4 w-4" />
                Voor bouwbedrijven
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Documenteer automatisch, focus op bouwen
              </h2>
              
              <p className="text-gray-300 text-lg mb-8">
                Voldoe moeiteloos aan Wkb-vereisten met slimme documentatie. 
                Integreer met smart glasses voor automatische vastlegging van 
                elke bouwfase.
              </p>
              
              <ul className="space-y-4 mb-8">
                <BenefitItem text="Automatische Wkb-compliance rapportage" />
                <BenefitItem text="Smart glasses integratie voor hands-free documentatie" />
                <BenefitItem text="Real-time projectdashboard voor alle betrokkenen" />
                <BenefitItem text="AI-herkenning van materialen en processen" />
              </ul>
              
              <Link href="/builders" className="btn-primary !bg-white !text-gray-900 hover:!bg-gray-100">
                Meer informatie voor bouwers
              </Link>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-semibold">Bouwer Dashboard</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Project: Amstelstraat 42</span>
                    <span className="text-green-400 text-sm">Op schema</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Documentatie</span>
                    <span className="text-primary-400 text-sm">98% compleet</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    247 foto's · 12 certificaten · 5 rapporten
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-gray-300 mb-2">Wkb Status</div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Alle fasen goedgekeurd</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Maak uw gratis woningpaspoort aan en krijg direct overzicht 
              over al uw woningdocumenten.
            </p>
            <Link href="/register" className="btn-primary !bg-white !text-primary-700 !py-4 !px-8 text-lg hover:!bg-primary-50">
              Gratis registreren
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-semibold">Woningpaspoort</span>
              </div>
              <p className="text-sm">
                Het complete digitale dossier van uw woning.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Prijzen</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">Over ons</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Voorwaarden</Link></li>
                <li><Link href="/security" className="hover:text-white">Beveiliging</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2026 Woningpaspoort. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-primary-600 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function Step({ 
  number, 
  title, 
  description 
}: { 
  number: number
  title: string
  description: string 
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
      <span>{text}</span>
    </li>
  )
}
