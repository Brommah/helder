'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout'
import { 
  Building2, MapPin, ArrowRight, ChevronRight, Zap, Home,
  Ruler, Euro, Calendar, Users, Star, Quote, Filter,
  Grid3X3, List, Check, Award, Shield, Eye
} from 'lucide-react'

interface Project {
  id: string
  name: string
  location: string
  type: string
  size: number
  plot: number
  bedrooms: number
  budget: string
  year: string
  energyLabel: string
  style: string
  image: string
  featured: boolean
  testimonial?: {
    quote: string
    author: string
  }
}

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Villa Zonneweide',
    location: 'Almere',
    type: 'Vrijstaand',
    size: 210,
    plot: 650,
    bedrooms: 5,
    budget: '€580.000',
    year: '2025',
    energyLabel: 'A++++',
    style: 'Modern',
    image: '/images/projects/zonneweide.jpg',
    featured: true,
    testimonial: {
      quote: 'Helder maakte ons droomhuis werkelijkheid. De transparantie en professionaliteit waren ongeëvenaard.',
      author: 'Familie Van der Berg'
    }
  },
  {
    id: '2',
    name: 'Woning De Tuin',
    location: 'Utrecht',
    type: 'Vrijstaand',
    size: 180,
    plot: 500,
    bedrooms: 4,
    budget: '€520.000',
    year: '2025',
    energyLabel: 'A+++',
    style: 'Landelijk',
    image: '/images/projects/tuin.jpg',
    featured: false,
  },
  {
    id: '3',
    name: 'Modern Cube',
    location: 'Amsterdam',
    type: 'Stadsvilla',
    size: 165,
    plot: 350,
    bedrooms: 4,
    budget: '€680.000',
    year: '2024',
    energyLabel: 'A++++',
    style: 'Modern',
    image: '/images/projects/cube.jpg',
    featured: true,
    testimonial: {
      quote: 'Van eerste gesprek tot sleuteloverdracht: Helder houdt woord. Ons woningpaspoort is goud waard.',
      author: 'Familie Bakker'
    }
  },
  {
    id: '4',
    name: 'Villa Het Landhuis',
    location: 'Amersfoort',
    type: 'Vrijstaand',
    size: 245,
    plot: 800,
    bedrooms: 6,
    budget: '€720.000',
    year: '2024',
    energyLabel: 'A+++',
    style: 'Klassiek',
    image: '/images/projects/landhuis.jpg',
    featured: false,
  },
  {
    id: '5',
    name: 'Eco Woning Noord',
    location: 'Groningen',
    type: 'Vrijstaand',
    size: 155,
    plot: 450,
    bedrooms: 4,
    budget: '€445.000',
    year: '2024',
    energyLabel: 'A++++',
    style: 'Duurzaam',
    image: '/images/projects/eco.jpg',
    featured: false,
  },
  {
    id: '6',
    name: 'Schuurwoning Veluwe',
    location: 'Apeldoorn',
    type: 'Schuurwoning',
    size: 200,
    plot: 900,
    bedrooms: 5,
    budget: '€550.000',
    year: '2023',
    energyLabel: 'A+++',
    style: 'Landelijk',
    image: '/images/projects/schuur.jpg',
    featured: true,
    testimonial: {
      quote: 'Een schuurwoning bouwen leek complex, maar Helder maakte het simpel. Resultaat overtreft verwachtingen.',
      author: 'Familie De Groot'
    }
  },
]

const STYLES = ['Alle stijlen', 'Modern', 'Landelijk', 'Klassiek', 'Duurzaam']
const BUDGET_RANGES = ['Alle budgetten', '€400k - €500k', '€500k - €600k', '€600k+']

export default function PortfolioPage() {
  const [selectedStyle, setSelectedStyle] = useState('Alle stijlen')
  const [selectedBudget, setSelectedBudget] = useState('Alle budgetten')
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured')

  const filteredProjects = PROJECTS.filter(project => {
    const matchesStyle = selectedStyle === 'Alle stijlen' || project.style === selectedStyle
    const matchesBudget = selectedBudget === 'Alle budgetten' || 
      (selectedBudget === '€400k - €500k' && parseInt(project.budget.replace(/[€.]/g, '')) < 500000) ||
      (selectedBudget === '€500k - €600k' && parseInt(project.budget.replace(/[€.]/g, '')) >= 500000 && parseInt(project.budget.replace(/[€.]/g, '')) < 600000) ||
      (selectedBudget === '€600k+' && parseInt(project.budget.replace(/[€.]/g, '')) >= 600000)
    return matchesStyle && matchesBudget
  })

  const featuredProjects = filteredProjects.filter(p => p.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              {PROJECTS.length}+ projecten gerealiseerd
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] mb-6">
              Droomhuizen worden werkelijkheid
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ontdek wat families net als u hebben gebouwd. Elk project inclusief 
              compleet woningpaspoort.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-y border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '50+', label: 'Woningen gebouwd' },
                { value: '€28M', label: 'Projectwaarde' },
                { value: '4.9/5', label: 'Klant score' },
                { value: '100%', label: 'Woningpaspoort' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-[#1a1a2e]">{stat.value}</p>
                  <p className="text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedStyle === style
                        ? 'bg-[#1a1a2e] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#1a1a2e] outline-none"
              >
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="py-8 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Uitgelichte projecten</h2>
              <div className="space-y-8">
                {featuredProjects.map((project, index) => (
                  <FeaturedProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Projects Grid */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Alle projecten</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#93b9e6]500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Uw droomhuis bouwen?
                </h2>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                  Start vandaag nog met de intake en ontdek wat er mogelijk is 
                  binnen uw budget en wensen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1a1a2e] font-semibold rounded-xl hover:shadow-xl transition-all"
                  >
                    Doe de bouwtest
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Plan een gesprek
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
          <Image 
            src={project.image}
            alt={project.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-[#1a1a2e]">
              {project.style}
            </span>
            <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm font-semibold">
              {project.energyLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#1a1a2e] mb-1">{project.name}</h3>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#1a1a2e]">{project.budget}</p>
              <p className="text-sm text-slate-500">{project.year}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 mb-6">
            <div>
              <p className="text-slate-500 text-sm">Woonoppervlakte</p>
              <p className="font-bold text-[#1a1a2e]">{project.size} m²</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Perceel</p>
              <p className="font-bold text-[#1a1a2e]">{project.plot} m²</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Slaapkamers</p>
              <p className="font-bold text-[#1a1a2e]">{project.bedrooms}</p>
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <Quote className="w-6 h-6 text-slate-300 mb-2" />
              <p className="text-slate-600 italic mb-2">&ldquo;{project.testimonial.quote}&rdquo;</p>
              <p className="text-sm font-medium text-[#1a1a2e]">— {project.testimonial.author}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              <Eye className="w-5 h-5" />
              Bekijk project
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
              <Shield className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-semibold">
            {project.energyLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-[#1a1a2e] group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-[#1a1a2e]">{project.budget}</span>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span>{project.size} m²</span>
          <span>•</span>
          <span>{project.bedrooms} slk</span>
          <span>•</span>
          <span>{project.style}</span>
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors group-hover:border-[#1a1a2e] group-hover:text-[#1a1a2e]">
          Bekijk details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
