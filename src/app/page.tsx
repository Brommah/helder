import Link from 'next/link'
import { Home, FileText, Shield, Share2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8" />
            <span className="text-xl font-bold">Woningpaspoort</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="hover:underline">
              Inloggen
            </Link>
            <Link href="/register" className="btn-secondary !text-primary-700">
              Registreren
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Alle informatie over uw woning op één plek
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Beheer documenten, volg onderhoud en deel informatie veilig met makelaars, 
            kopers of dienstverleners.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary !bg-white !text-primary-700 !py-3 !px-8 text-lg">
              Gratis starten
            </Link>
            <Link href="/demo" className="btn-secondary !border-white/30 !text-white !py-3 !px-8 text-lg hover:!bg-white/10">
              Demo bekijken
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Waarom een Woningpaspoort?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Alles op één plek"
              description="Energielabel, plattegrond, onderhoudshistorie en documenten - altijd binnen handbereik."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Veilig & privé"
              description="U bepaalt wie toegang heeft. Deel selectief met makelaars of potentiële kopers."
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8" />}
              title="Eenvoudig delen"
              description="Genereer een veilige link om uw woningpaspoort te delen - met of zonder gevoelige informatie."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-gray-600 mb-8">
            Maak gratis uw woningpaspoort aan in minder dan 5 minuten.
          </p>
          <Link href="/register" className="btn-primary !py-3 !px-8 text-lg">
            Registreer nu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="text-white font-semibold">Woningpaspoort</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Voorwaarden</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-sm text-center">
            © 2026 Woningpaspoort. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
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
    <div className="card text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
