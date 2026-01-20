import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { SharedFooter } from '@/components/layout/footer'
import { 
  ArrowLeft, Calendar, MapPin, Ruler, Home as HomeIcon,
  CheckCircle, Clock, Euro, Users, Zap, Shield
} from 'lucide-react'

// Project data - in production, this would come from a database
const PROJECTS = {
  'villa-schuur': {
    name: 'Villa Schuur',
    location: 'Wassenaar',
    year: '2024',
    type: 'Nieuwbouw villa',
    size: '385 m²',
    budget: '€ 1.2M - € 1.5M',
    duration: '14 maanden',
    image: '/images/projects/schuur.jpg',
    description: 'Een moderne interpretatie van de klassieke schuurwoning. Deze villa combineert landelijke uitstraling met hedendaags comfort en duurzaamheid.',
    highlights: [
      'Triple glas met zonwering',
      'Warmtepomp met vloerverwarming',
      'Energielabel A++++',
      'Smart home integratie',
      'Domotica systeem',
      'Eigen laadpaal voor EV',
    ],
    specs: {
      'Woonoppervlakte': '385 m²',
      'Perceeloppervlakte': '1.200 m²',
      'Slaapkamers': '5',
      'Badkamers': '3',
      'Verdiepingen': '2 + kelder',
      'Garage': 'Dubbele inpandige garage',
      'Tuin': 'Volledig aangelegd',
      'Energielabel': 'A++++',
    },
    features: [
      { icon: Zap, label: 'Energieneutraal', desc: 'Nul op de meter dankzij zonnepanelen' },
      { icon: Shield, label: 'WKB Compliant', desc: 'Volledig gedocumenteerd woningpaspoort' },
      { icon: HomeIcon, label: 'Smart Home', desc: 'Volledig geautomatiseerd wonen' },
    ],
    gallery: [
      '/images/projects/schuur.jpg',
      '/images/hero-house.jpg',
      '/images/materials-showcase.jpg',
    ],
  },
  'eco-woning': {
    name: 'Eco Woning',
    location: 'Leiden',
    year: '2024',
    type: 'Duurzame nieuwbouw',
    size: '245 m²',
    budget: '€ 650K - € 800K',
    duration: '11 maanden',
    image: '/images/projects/eco.jpg',
    description: 'Een volledig circulair gebouwde woning met hergebruikte materialen en maximale energie-efficiëntie. Een showcase van duurzaam bouwen.',
    highlights: [
      'Circulaire materialen',
      'Groendak met sedum',
      'Regenwateropvang',
      'Passief huis concept',
      'Natuurlijke ventilatie',
      'Lokaal geproduceerde materialen',
    ],
    specs: {
      'Woonoppervlakte': '245 m²',
      'Perceeloppervlakte': '650 m²',
      'Slaapkamers': '4',
      'Badkamers': '2',
      'Verdiepingen': '2',
      'Garage': 'Carport met groendak',
      'Tuin': 'Natuurlijke tuin',
      'Energielabel': 'A++++',
    },
    features: [
      { icon: Zap, label: 'CO2-neutraal', desc: 'Negatieve carbon footprint' },
      { icon: Shield, label: 'Circulair', desc: '95% herbruikbare materialen' },
      { icon: HomeIcon, label: 'Biobased', desc: 'Natuurlijke isolatie' },
    ],
    gallery: [
      '/images/projects/eco.jpg',
      '/images/energy-label.jpg',
      '/images/timeline-visual.jpg',
    ],
  },
  'cube-house': {
    name: 'Cube House',
    location: 'Rotterdam',
    year: '2023',
    type: 'Moderne kubuswoning',
    size: '180 m²',
    budget: '€ 450K - € 550K',
    duration: '9 maanden',
    image: '/images/projects/cube.jpg',
    description: 'Strak, modern en compact. Deze kubuswoning bewijst dat kleiner ook luxe kan zijn met slimme indelingen en hoogwaardige afwerking.',
    highlights: [
      'Minimalistische architectuur',
      'Vide met lichtstraat',
      'Betonnen binnenmuren',
      'Stalen kozijnen',
      'Open woonkeuken',
      'Dakterras met uitzicht',
    ],
    specs: {
      'Woonoppervlakte': '180 m²',
      'Perceeloppervlakte': '320 m²',
      'Slaapkamers': '3',
      'Badkamers': '2',
      'Verdiepingen': '3',
      'Garage': 'Geen (parkeerplaats)',
      'Tuin': 'Patio + dakterras',
      'Energielabel': 'A+++',
    },
    features: [
      { icon: Zap, label: 'Compact', desc: 'Maximaal rendement per m²' },
      { icon: Shield, label: 'Design', desc: 'Award-winnend ontwerp' },
      { icon: HomeIcon, label: 'Stadswoning', desc: 'Perfect voor urban living' },
    ],
    gallery: [
      '/images/projects/cube.jpg',
      '/images/design-step.jpg',
      '/images/handover-step.jpg',
    ],
  },
  'landhuis-modern': {
    name: 'Landhuis Modern',
    location: 'Het Gooi',
    year: '2023',
    type: 'Landelijk modern',
    size: '420 m²',
    budget: '€ 1.5M - € 2M',
    duration: '16 maanden',
    image: '/images/projects/landhuis.jpg',
    description: 'Luxe landhuis met moderne twist. Traditionele materialen ontmoeten hedendaagse architectuur in een prachtige bosrijke omgeving.',
    highlights: [
      'Rieten dak met moderne dakkapellen',
      'Buitenzwembad verwarmd',
      'Wellness ruimte met sauna',
      'Wijnkelder',
      'Paardenstallen',
      'Gastenverblijf',
    ],
    specs: {
      'Woonoppervlakte': '420 m²',
      'Perceeloppervlakte': '5.000 m²',
      'Slaapkamers': '6',
      'Badkamers': '4',
      'Verdiepingen': '2 + kelder',
      'Garage': 'Vrijstaand, 3 auto\'s',
      'Tuin': 'Parkachtig aangelegd',
      'Energielabel': 'A++',
    },
    features: [
      { icon: Zap, label: 'Luxe', desc: 'Hoogwaardige afwerkingen' },
      { icon: Shield, label: 'Privacy', desc: 'Volledig omheind terrein' },
      { icon: HomeIcon, label: 'Landelijk', desc: 'Rust en ruimte' },
    ],
    gallery: [
      '/images/projects/landhuis.jpg',
      '/images/build-step.jpg',
      '/images/discover-step.jpg',
    ],
  },
  'tuinwoning': {
    name: 'Tuinwoning',
    location: 'Haarlem',
    year: '2024',
    type: 'Gezinswoning',
    size: '195 m²',
    budget: '€ 550K - € 700K',
    duration: '10 maanden',
    image: '/images/projects/tuin.jpg',
    description: 'Een gezinsvriendelijke woning waar de tuin centraal staat. Grote schuifpuien maken binnen en buiten één geheel.',
    highlights: [
      'Grote schuifpuien naar tuin',
      'Kindvriendelijke indeling',
      'Speelzolder',
      'Moestuin met kas',
      'Veranda met buitenkeuken',
      'Fietsenberging',
    ],
    specs: {
      'Woonoppervlakte': '195 m²',
      'Perceeloppervlakte': '450 m²',
      'Slaapkamers': '4',
      'Badkamers': '2',
      'Verdiepingen': '2',
      'Garage': 'Inpandige garage',
      'Tuin': 'Rondom de woning',
      'Energielabel': 'A+++',
    },
    features: [
      { icon: Zap, label: 'Gezinsvriendelijk', desc: 'Veilig en praktisch' },
      { icon: Shield, label: 'Buitenleven', desc: 'Focus op de tuin' },
      { icon: HomeIcon, label: 'Flexibel', desc: 'Meegroeiend met uw gezin' },
    ],
    gallery: [
      '/images/projects/tuin.jpg',
      '/images/hero-house.jpg',
      '/images/materials-showcase.jpg',
    ],
  },
  'zonneweide-villa': {
    name: 'Zonneweide Villa',
    location: 'Zeeland',
    year: '2024',
    type: 'Vakantiewoning',
    size: '150 m²',
    budget: '€ 400K - € 500K',
    duration: '8 maanden',
    image: '/images/projects/zonneweide.jpg',
    description: 'Luxe vakantiewoning aan de Zeeuwse kust. Maximaal genieten van zee, strand en natuur in een onderhoudsvriendelijke woning.',
    highlights: [
      'Panoramisch zicht op duinen',
      'Onderhoudsvriendelijke materialen',
      'Verhuurgeschikt',
      'Buitendouche',
      'Overdekt terras',
      'Fietsen inbegrepen',
    ],
    specs: {
      'Woonoppervlakte': '150 m²',
      'Perceeloppervlakte': '800 m²',
      'Slaapkamers': '3',
      'Badkamers': '2',
      'Verdiepingen': '1',
      'Garage': 'Carport',
      'Tuin': 'Duintuin',
      'Energielabel': 'A++',
    },
    features: [
      { icon: Zap, label: 'Recreatie', desc: 'Perfect als tweede woning' },
      { icon: Shield, label: 'Verhuurbaar', desc: 'Extra inkomsten mogelijk' },
      { icon: HomeIcon, label: 'Zee & strand', desc: '500m van het strand' },
    ],
    gallery: [
      '/images/projects/zonneweide.jpg',
      '/images/design-step.jpg',
      '/images/handover-step.jpg',
    ],
  },
}

type ProjectSlug = keyof typeof PROJECTS

export function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({
    slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = PROJECTS[params.slug as ProjectSlug]
  if (!project) return { title: 'Project niet gevonden' }
  
  return {
    title: `${project.name} | ${project.location}`,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS[params.slug as ProjectSlug]
  
  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size="lg" />
            <Link 
              href="/portfolio"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1a1a2e] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Alle projecten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <section className="relative h-[70vh] pt-20">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                {project.type}
              </span>
              <span className="px-3 py-1 bg-amber-500 rounded-full text-sm text-white font-medium">
                {project.year}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {project.location}
              </span>
              <span className="flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                {project.size}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {project.duration}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Over dit project</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Kenmerken</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {project.features.map((feature, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200">
                      <feature.icon className="w-8 h-8 text-amber-500 mb-3" />
                      <h3 className="font-semibold text-[#1a1a2e] mb-1">{feature.label}</h3>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Galerij</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src={img}
                        alt={`${project.name} foto ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget Card */}
              <div className="p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl text-white">
                <Euro className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-1">Budget indicatie</h3>
                <p className="text-2xl font-bold">{project.budget}</p>
                <p className="text-sm text-white/60 mt-2">Exclusief grondkosten</p>
              </div>

              {/* Specs Card */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200">
                <h3 className="font-bold text-[#1a1a2e] mb-4">Specificaties</h3>
                <dl className="space-y-3">
                  {Object.entries(project.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <dt className="text-slate-500">{key}</dt>
                      <dd className="font-medium text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* CTA Card */}
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <h3 className="font-bold text-[#1a1a2e] mb-2">
                  Geïnspireerd door dit project?
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Ontdek of bouwen bij u past met onze gratis bouwtest.
                </p>
                <Link
                  href="/assessment"
                  className="block text-center px-6 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#16213e] transition-colors"
                >
                  Start de bouwtest
                </Link>
              </div>

              {/* Contact Card */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200">
                <Users className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-[#1a1a2e] mb-2">Vragen over dit project?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Onze adviseurs vertellen u er graag meer over.
                </p>
                <Link
                  href="/contact"
                  className="block text-center px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Neem contact op
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Andere projecten</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PROJECTS)
              .filter(([slug]) => slug !== params.slug)
              .slice(0, 3)
              .map(([slug, proj]) => (
                <Link
                  key={slug}
                  href={`/portfolio/${slug}`}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden"
                >
                  <Image
                    src={proj.image}
                    alt={proj.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                    <p className="text-sm text-white/70">{proj.location}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
