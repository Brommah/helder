'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  Euro,
  Shield,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  ChevronDown,
  ChevronRight,
  Calendar,
  Zap,
  Lock,
  Briefcase,
  BarChart3,
  FileText,
  Megaphone,
  MousePointer,
  Home,
  MessageCircle,
  Search,
  Mail,
  PlayCircle,
  Newspaper,
  Download,
  Star,
  Eye,
  Share2,
  CreditCard,
  Linkedin,
  Globe,
  Video,
  FileCheck,
  Mic,
  Send,
} from 'lucide-react'

/**
 * Internal Executive Dashboard
 * For: Andries Broersma, CEO Broersma Bouwadvies
 * Purpose: Strategic overview and sign-off on Helder/Woningpaspoort initiative
 */

export default function InternalExecutivePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Terug</span>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <Logo size="md" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Lock className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Vertrouwelijk</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-8">

          {/* Hero */}
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#93b9e6]/10 text-[#93b9e6] text-xs font-black uppercase tracking-wider mb-8">
              <Briefcase className="w-4 h-4" />
              Executive Briefing • Januari 2026
            </div>
            
            <h1 className="text-[3rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-tight mb-6">
              HELDER
              <br />
              <span className="text-[#93b9e6]">STRATEGIE</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl font-light">
              Het digitale woningpaspoort voor de Nederlandse nieuwbouwmarkt.
              Strategisch overzicht voor besluitvorming.
            </p>
          </div>

          {/* Executive Summary Card */}
          <div className="bg-slate-900 p-10 lg:p-14 mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-8 h-8 text-[#93b9e6]" />
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                De Kernboodschap
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-[#93b9e6] uppercase tracking-wider mb-2">Het Probleem</h3>
                  <p className="text-white/80 leading-relaxed">
                    De Nederlandse bouwsector verliest jaarlijks €5 miljard door gebrekkige documentatie. 
                    De Wkb-wet (jan 2024) verplicht 20 jaar bewaring — maar er is geen goede oplossing.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#93b9e6] uppercase tracking-wider mb-2">De Kans</h3>
                  <p className="text-white/80 leading-relaxed">
                    Helder wordt het digitale woningpaspoort dat bouwers Wkb-compliant maakt én 
                    huiseigenaren transparantie geeft. Markt van €2.4B in Nederland.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-[#93b9e6] uppercase tracking-wider mb-2">Waarom Wij</h3>
                  <p className="text-white/80 leading-relaxed">
                    Broersma bouwt al 70 jaar. We kennen de pijn. We combineren bouwexpertise 
                    met tech (Martijn&apos;s achtergrond bij Cere). Familie-DNA + tech-DNA.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#93b9e6] uppercase tracking-wider mb-2">De Vraag</h3>
                  <p className="text-white/80 leading-relaxed">
                    Goedkeuring voor open beta lancering en 5-10 pilotprojecten binnen 
                    Broersma netwerk. Seed investering: €150K.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 mb-20">
            <MetricCard
              value="€2.4B"
              label="MARKTOMVANG NL"
              sublabel="TAM construction software"
              highlight
            />
            <MetricCard
              value="12-14K"
              label="DOELMARKT"
              sublabel="kavel-projecten per jaar"
            />
            <MetricCard
              value="€2.8M"
              label="JAAR 2 DOEL"
              sublabel="ARR bij 700 projecten"
            />
            <MetricCard
              value="0"
              label="CONCURRENTEN"
              sublabel="eigenaar-eerst platform"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-12">
            {[
              { id: 'overview', label: 'Overzicht', icon: BarChart3 },
              { id: 'market', label: 'Markt', icon: TrendingUp },
              { id: 'marketing', label: 'Marketing', icon: Megaphone },
              { id: 'funnels', label: 'Funnels', icon: MousePointer },
              { id: 'release', label: 'Release', icon: Rocket },
              { id: 'financials', label: 'Financieel', icon: Euro },
              { id: 'timeline', label: 'Planning', icon: Calendar },
              { id: 'risks', label: 'Risico\'s', icon: AlertTriangle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-black text-sm uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-16">
                {/* Value Proposition */}
                <section>
                  <SectionHeader>Wat We Bouwen</SectionHeader>
                  <div className="grid lg:grid-cols-3 gap-8">
                    <FeatureCard
                      icon={<FileText className="w-8 h-8" />}
                      title="WONINGPASPOORT"
                      description="Elk document, elke factuur, elke garantie. 20 jaar bewaard en blockchain-beveiligd."
                    />
                    <FeatureCard
                      icon={<Shield className="w-8 h-8" />}
                      title="WKB COMPLIANT"
                      description="Automatische archivering volgens de Wet kwaliteitsborging. Altijd up-to-date."
                    />
                    <FeatureCard
                      icon={<Zap className="w-8 h-8" />}
                      title="AI INTELLIGENCE"
                      description="Voorspellend onderhoud en energieoptimalisatie. Bespaar tot €5.640 per jaar."
                    />
                  </div>
                </section>

                {/* Competitive Position */}
                <section>
                  <SectionHeader>Concurrentiepositie</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="text-left py-4">Concurrent</th>
                          <th className="text-center py-4">Eigenaar-first</th>
                          <th className="text-center py-4">Wkb</th>
                          <th className="text-center py-4">Blockchain</th>
                          <th className="text-center py-4">Lifecycle</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-slate-100">
                          <td className="py-4 font-bold">Ed Controls</td>
                          <td className="text-center text-red-500">✕</td>
                          <td className="text-center text-emerald-500">✓</td>
                          <td className="text-center text-red-500">✕</td>
                          <td className="text-center text-red-500">✕</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4 font-bold">HomeDNA</td>
                          <td className="text-center text-slate-400">~</td>
                          <td className="text-center text-slate-400">~</td>
                          <td className="text-center text-red-500">✕</td>
                          <td className="text-center text-red-500">✕</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4 font-bold">PlanRadar</td>
                          <td className="text-center text-red-500">✕</td>
                          <td className="text-center text-slate-400">~</td>
                          <td className="text-center text-red-500">✕</td>
                          <td className="text-center text-red-500">✕</td>
                        </tr>
                        <tr className="bg-[#93b9e6]/10">
                          <td className="py-4 font-black text-[#93b9e6]">HELDER</td>
                          <td className="text-center text-emerald-500 font-bold">✓</td>
                          <td className="text-center text-emerald-500 font-bold">✓</td>
                          <td className="text-center text-emerald-500 font-bold">✓</td>
                          <td className="text-center text-emerald-500 font-bold">✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* GTM Summary */}
                <section>
                  <SectionHeader>Go-to-Market</SectionHeader>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Users className="w-6 h-6 text-[#93b9e6]" />
                        <h3 className="text-lg font-black uppercase tracking-wide">B2B: Bouwers</h3>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Target</span>
                          <span className="font-bold">10-50 FTE, 5-10 projecten/jaar</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Pricing</span>
                          <span className="font-bold">€49-149/maand</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-500">Strategie</span>
                          <span className="font-bold">Sales-led via netwerk</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Building2 className="w-6 h-6 text-[#93b9e6]" />
                        <h3 className="text-lg font-black uppercase tracking-wide">B2C: Eigenaren</h3>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Target</span>
                          <span className="font-bold">€400K-€700K budget</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Pricing</span>
                          <span className="font-bold">Gratis via bouwer • €4.99 premium</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-500">Strategie</span>
                          <span className="font-bold">Product-led growth</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Market Tab */}
            {activeTab === 'market' && (
              <div className="space-y-16">
                <section>
                  <SectionHeader>Het Probleem</SectionHeader>
                  <div className="grid lg:grid-cols-4 gap-6">
                    <StatCard value="€5B" label="Jaarlijks verlies door miscommunicatie" negative />
                    <StatCard value="19%" label="Gemiddelde kostenoverschrijding" negative />
                    <StatCard value="35%" label="Adoptie documentatiesoftware" negative />
                    <StatCard value="Wkb" label="Verplicht 20 jaar bewaring" />
                  </div>
                </section>

                <section>
                  <SectionHeader>Marktomvang</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="text-left py-4">Segment</th>
                          <th className="text-right py-4">Omvang</th>
                          <th className="text-right py-4">Groei</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-slate-100">
                          <td className="py-4">TAM (NL bouwsoftware)</td>
                          <td className="text-right font-bold">€50.95B</td>
                          <td className="text-right text-emerald-500">+3.9%</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4">SAM (particuliere kavelbouw)</td>
                          <td className="text-right font-bold">€7.7B</td>
                          <td className="text-right text-emerald-500">+5%</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4">SOM (2-jaar capture)</td>
                          <td className="text-right font-bold">€74-148M</td>
                          <td className="text-right text-emerald-500">980 proj.</td>
                        </tr>
                        <tr className="bg-[#93b9e6]/10">
                          <td className="py-4 font-black text-[#93b9e6]">Jaar 2 Target</td>
                          <td className="text-right font-black text-[#93b9e6]">€2.8M ARR</td>
                          <td className="text-right font-bold text-[#93b9e6]">700 proj.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <SectionHeader>Timing</SectionHeader>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-8">
                    <h3 className="text-lg font-black text-emerald-800 mb-4">Waarom Nu?</h3>
                    <ul className="space-y-3 text-emerald-900">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Wkb 2 jaar actief → handhaving begint</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Geen dominante speler in eigenaar-first segment</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>AI-classificatie nu betaalbaar en betrouwbaar</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>18 maanden window voordat concurrentie reageert</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            )}

            {/* Marketing Tab - Homeowner First */}
            {activeTab === 'marketing' && (
              <div className="space-y-16">
                {/* Strategy Overview */}
                <section>
                  <SectionHeader>Homeowner-First Strategie</SectionHeader>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-8 mb-8">
                    <h3 className="text-lg font-black text-emerald-800 mb-3">Waarom Eigenaar-Eerst?</h3>
                    <p className="text-emerald-900 mb-4">
                      Bouwers zijn moeilijk te bereiken en langzaam in adoptie. Eigenaren zijn gemotiveerd 
                      (hun droomhuis), actief zoekend, en trekken bouwers mee. <strong>Demand creation via B2C → B2B pull.</strong>
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">12-14K kavels/jaar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">€400K-700K budget</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">Transparantie-zoekers</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Content Pillars */}
                <section>
                  <SectionHeader>Content Pijlers</SectionHeader>
                  <div className="grid lg:grid-cols-5 gap-4">
                    <ContentPillar percentage={35} title="Transparantie" description="Waarom inzicht in je bouw" color="emerald" />
                    <ContentPillar percentage={25} title="Bouwproces" description="Wat te verwachten per fase" color="blue" />
                    <ContentPillar percentage={20} title="Wkb Rechten" description="Wat de wet jou geeft" color="amber" />
                    <ContentPillar percentage={15} title="Product" description="Woningpaspoort features" color="violet" />
                    <ContentPillar percentage={5} title="Community" description="Ervaringen van anderen" color="rose" />
                  </div>
                </section>

                {/* 12-Week Content Calendar */}
                <section>
                  <SectionHeader>12-Weken Content Kalender</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-black text-slate-400 uppercase tracking-wider text-xs">Week</div>
                      <div className="font-black text-slate-400 uppercase tracking-wider text-xs">Maandag</div>
                      <div className="font-black text-slate-400 uppercase tracking-wider text-xs">Woensdag</div>
                      <div className="font-black text-slate-400 uppercase tracking-wider text-xs">Vrijdag</div>
                      
                      <CalendarRow week="1-2" mon="Persoonlijk verhaal + heritage" wed="Poll: grootste frustratie?" fri="Industrie statistieken" />
                      <CalendarRow week="3-4" mon="Wkb educatie" wed="Bouwproces timeline" fri="Gratis Wkb checklist" highlight />
                      <CalendarRow week="5-6" mon="Assessment quiz lancering" wed="Transparantie tips" fri="Case study homeowner" />
                      <CalendarRow week="7-8" mon="Product teaser" wed="FAQ beantwoording" fri="Webinar aankondiging" highlight />
                      <CalendarRow week="9-10" mon="Webinar reminder" wed="Live demo clips" fri="Testimonials" />
                      <CalendarRow week="11-12" mon="Launch aankondiging" wed="Early adopter verhalen" fri="Q&A sessie" highlight />
                    </div>
                  </div>
                </section>

                {/* Channel Strategy */}
                <section>
                  <SectionHeader>Kanaal Strategie (Homeowner Focus)</SectionHeader>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <ChannelCard
                      icon={<Search className="w-6 h-6" />}
                      name="Google (SEO + Ads)"
                      role="PRIMARY"
                      budget="€800/mo"
                      targets={[
                        '"huis bouwen kavel"',
                        '"nieuwbouw documentatie"',
                        '"wkb consumentendossier"',
                        '"aannemer transparantie"'
                      ]}
                      metrics="5K clicks/mo target"
                    />
                    <ChannelCard
                      icon={<Globe className="w-6 h-6" />}
                      name="Content Marketing"
                      role="PRIMARY"
                      budget="€0 (time)"
                      targets={[
                        'Blog: "10 vragen aan je aannemer"',
                        'Guide: "Bouwproces in 6 fases"',
                        'Checklist: "Documenten bij oplevering"',
                        'Calculator: "Wat kost bouwen?"'
                      ]}
                      metrics="2K organic visits/mo"
                    />
                    <ChannelCard
                      icon={<MessageCircle className="w-6 h-6" />}
                      name="Social: Instagram/Facebook"
                      role="SECONDARY"
                      budget="€400/mo"
                      targets={[
                        'Bouwdagboek series',
                        'Voor/na transformaties',
                        'Fases uitgelegd (Reels)',
                        'Community Q&A'
                      ]}
                      metrics="10K followers Y1"
                    />
                    <ChannelCard
                      icon={<Users className="w-6 h-6" />}
                      name="Communities & Forums"
                      role="SECONDARY"
                      budget="€0"
                      targets={[
                        'Funda nieuwbouw forums',
                        'Reddit r/thenetherlands',
                        'Facebook: "Eigen huis bouwen"',
                        'Werkspot reviews'
                      ]}
                      metrics="50 referrals/mo"
                    />
                  </div>
                </section>

                {/* Paid Ads Strategy */}
                <section>
                  <SectionHeader>Betaalde Advertenties (Homeowner)</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="text-left py-4">Kanaal</th>
                          <th className="text-right py-4">Budget/mo</th>
                          <th className="text-left py-4 pl-6">Targeting</th>
                          <th className="text-right py-4">CPA Doel</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-slate-100">
                          <td className="py-4 font-bold">Google Search</td>
                          <td className="text-right">€500</td>
                          <td className="pl-6 text-slate-500">&quot;eigen huis bouwen&quot;, &quot;kavel kopen&quot;, &quot;nieuwbouw tips&quot;</td>
                          <td className="text-right font-bold text-emerald-600">€8/lead</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4 font-bold">Meta (FB/IG)</td>
                          <td className="text-right">€300</td>
                          <td className="pl-6 text-slate-500">25-45, gezinnen, interesse: wonen/bouwen</td>
                          <td className="text-right font-bold text-emerald-600">€5/lead</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4 font-bold">Retargeting</td>
                          <td className="text-right">€200</td>
                          <td className="pl-6 text-slate-500">Website bezoekers, assessment starters</td>
                          <td className="text-right font-bold text-emerald-600">€3/lead</td>
                        </tr>
                        <tr className="bg-[#93b9e6]/10">
                          <td className="py-4 font-black text-[#93b9e6]">TOTAAL</td>
                          <td className="text-right font-black text-[#93b9e6]">€1.000/mo</td>
                          <td className="pl-6 text-[#93b9e6]">—</td>
                          <td className="text-right font-black text-[#93b9e6]">€5.50 avg</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mt-6 p-4 bg-white border border-slate-200">
                      <p className="text-sm text-slate-600">
                        <strong className="text-slate-900">ROI Berekening:</strong> €1.000 budget → ~180 leads → 36 assessments (20%) → 
                        7 consultaties (20%) → 2-3 betalende klanten. Bij €4.99/mo = break-even na 6-12 maanden.
                        Bij €49/mo bouwer-referral = immediate ROI.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Marketing Metrics Dashboard */}
                <section>
                  <SectionHeader>Marketing KPIs (12-Week Targets)</SectionHeader>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
                    <MetricCard value="500" label="ASSESSMENT" sublabel="completions" />
                    <MetricCard value="300" label="WAITLIST" sublabel="signups" highlight />
                    <MetricCard value="50" label="CONSULTATIES" sublabel="geboekt" />
                    <MetricCard value="€5.50" label="AVG CPA" sublabel="cost per lead" />
                  </div>
                </section>
              </div>
            )}

            {/* Funnels Tab - Homeowner First */}
            {activeTab === 'funnels' && (
              <div className="space-y-16">
                {/* Homeowner Funnel Visualization */}
                <section>
                  <SectionHeader>Homeowner Acquisition Funnel</SectionHeader>
                  <div className="bg-slate-900 p-8 lg:p-10">
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <FunnelStage 
                        stage="AWARENESS"
                        icon={<Eye className="w-5 h-5" />}
                        volume="10.000"
                        channels={['Google Ads', 'Social Media', 'PR/Media', 'Referrals']}
                        conversion="100%"
                        color="slate"
                      />
                      <FunnelStage 
                        stage="INTEREST"
                        icon={<Download className="w-5 h-5" />}
                        volume="1.500"
                        channels={['Blog lezen', 'Checklist download', 'Video bekijken']}
                        conversion="15%"
                        color="blue"
                      />
                      <FunnelStage 
                        stage="CONSIDERATION"
                        icon={<FileCheck className="w-5 h-5" />}
                        volume="500"
                        channels={['Assessment quiz', 'Dashboard preview', 'Webinar']}
                        conversion="33%"
                        color="violet"
                      />
                      <FunnelStage 
                        stage="CONVERSION"
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        volume="100"
                        channels={['Waitlist signup', 'Consultatie', 'Account creation']}
                        conversion="20%"
                        color="emerald"
                        highlight
                      />
                      <FunnelStage 
                        stage="REFERRAL"
                        icon={<Share2 className="w-5 h-5" />}
                        volume="30"
                        channels={['Bouwer introduceren', 'Vrienden vertellen', 'Review geven']}
                        conversion="30%"
                        color="amber"
                      />
                    </div>
                  </div>
                </section>

                {/* Conversion Methods */}
                <section>
                  <SectionHeader>Conversie Methoden (Homeowner)</SectionHeader>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <ConversionMethod
                      icon={<FileCheck className="w-6 h-6" />}
                      name="Assessment Quiz → Waitlist"
                      description="Interactieve quiz over bouwplannen. Score bepaalt urgentie en advies."
                      trigger="Landing page CTA, blog posts, social ads"
                      target="50% completion, 30% → waitlist"
                      priority="HIGH"
                    />
                    <ConversionMethod
                      icon={<Download className="w-6 h-6" />}
                      name="Lead Magnet → Nurture"
                      description="Gratis Wkb checklist of 'Bouwproces Gids' in ruil voor email."
                      trigger="Blog sidebar, exit intent popup"
                      target="20% download → 10% → assessment"
                      priority="HIGH"
                    />
                    <ConversionMethod
                      icon={<Video className="w-6 h-6" />}
                      name="Webinar → Consultatie"
                      description="Live demo + Q&A. Directe CTA naar 1-op-1 gesprek."
                      trigger="Email nurture, retargeting ads"
                      target="100 live attendees → 15 consultaties"
                      priority="MEDIUM"
                    />
                    <ConversionMethod
                      icon={<MessageCircle className="w-6 h-6" />}
                      name="Chat Widget → Quick Win"
                      description="Real-time vragen beantwoorden, assessment starten."
                      trigger="Website visitors >30 sec"
                      target="5% engagement → 2% → lead"
                      priority="MEDIUM"
                    />
                    <ConversionMethod
                      icon={<Share2 className="w-6 h-6" />}
                      name="Referral Program"
                      description="Eigenaar introduceert hun bouwer. Beide krijgen voordeel."
                      trigger="Post-signup email, dashboard prompt"
                      target="30% eigenaren → bouwer referral"
                      priority="HIGH"
                    />
                    <ConversionMethod
                      icon={<Mail className="w-6 h-6" />}
                      name="Email Nurture Sequence"
                      description="7-email serie over bouwproces, transparantie, Wkb rechten."
                      trigger="Lead magnet download, quiz incomplete"
                      target="40% open rate, 5% → conversion"
                      priority="MEDIUM"
                    />
                  </div>
                </section>

                {/* Email Nurture Sequence */}
                <section>
                  <SectionHeader>Email Nurture Sequence (Homeowner)</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <div className="space-y-3">
                      <EmailSequenceRow day={0} subject="Welkom! Jouw Wkb checklist" type="Value" action="Checklist download link" />
                      <EmailSequenceRow day={2} subject="Vraag dit aan je aannemer (voordat je tekent)" type="Education" action="Blog link" />
                      <EmailSequenceRow day={5} subject="De 6 fases van nieuwbouw uitgelegd" type="Education" action="Guide download" />
                      <EmailSequenceRow day={8} subject="Wat zit er eigenlijk in jouw muren?" type="Problem" action="Assessment CTA" />
                      <EmailSequenceRow day={12} subject="Hoe [Naam] €3.200 bespaarde met transparantie" type="Social Proof" action="Case study" />
                      <EmailSequenceRow day={16} subject="Je rechten onder de Wkb (die niemand je vertelt)" type="Education" action="Blog link" />
                      <EmailSequenceRow day={21} subject="Klaar om te starten? Gratis consultatie" type="Conversion" action="Calendar link" highlight />
                    </div>
                  </div>
                </section>

                {/* B2C → B2B Bridge */}
                <section>
                  <SectionHeader>Van Eigenaar naar Bouwer (Pull Strategy)</SectionHeader>
                  <div className="bg-[#93b9e6]/10 p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <Home className="w-8 h-8 text-[#93b9e6]" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-2">1. Eigenaar Start</h3>
                        <p className="text-sm text-slate-600">
                          Eigenaar maakt gratis account, bekijkt demo dashboard, wordt enthousiast
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-8 h-8 text-[#93b9e6]" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-2">2. Eigenaar Vraagt</h3>
                        <p className="text-sm text-slate-600">
                          &quot;Beste aannemer, kunnen jullie Woningpaspoort gebruiken? Het is gratis voor jullie.&quot;
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <Building2 className="w-8 h-8 text-[#93b9e6]" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-2">3. Bouwer Adopteert</h3>
                        <p className="text-sm text-slate-600">
                          Bouwer start gratis pilot, ervaart voordeel, wordt betalende klant
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 p-4 bg-white border border-[#93b9e6]">
                      <p className="text-sm text-center">
                        <strong className="text-[#93b9e6]">Target:</strong> 30% van eigenaren introduceert hun bouwer → 
                        50% van geïntroduceerde bouwers start pilot → 60% wordt betalend
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Release Tab */}
            {activeTab === 'release' && (
              <div className="space-y-16">
                {/* Release Roadmap */}
                <section>
                  <SectionHeader>Release Roadmap</SectionHeader>
                  <div className="grid lg:grid-cols-4 gap-px bg-slate-200">
                    <ReleasePhase
                      phase="ALPHA"
                      date="Jan 2026"
                      status="active"
                      features={[
                        'Core dashboard',
                        'Document upload',
                        'Timeline view',
                        'Share page'
                      ]}
                      audience="Familie & vrienden (10)"
                    />
                    <ReleasePhase
                      phase="PRIVATE BETA"
                      date="Feb 2026"
                      status="next"
                      features={[
                        'Assessment quiz',
                        'WhatsApp upload',
                        'Notion CRM integratie',
                        'Cost tracking'
                      ]}
                      audience="Pilot bouwers (5) + eigenaren (50)"
                    />
                    <ReleasePhase
                      phase="PUBLIC BETA"
                      date="Mrt 2026"
                      status="planned"
                      features={[
                        'Waitlist open',
                        'Self-service signup',
                        'AI document sorting',
                        'Email notifications'
                      ]}
                      audience="Waitlist (300) + bouwers (15)"
                    />
                    <ReleasePhase
                      phase="V1.0 LAUNCH"
                      date="Apr 2026"
                      status="planned"
                      features={[
                        'Payment integration',
                        'Premium features',
                        'Cere blockchain',
                        'Builder dashboard'
                      ]}
                      audience="Open toegang + paid tiers"
                    />
                  </div>
                </section>

                {/* Content Pieces Tracker */}
                <section>
                  <SectionHeader>Content Pieces Status</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="text-left py-3">Content</th>
                          <th className="text-center py-3">Type</th>
                          <th className="text-center py-3">Doel</th>
                          <th className="text-center py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <ContentRow name="Wkb Compliance Checklist" type="Lead Magnet" goal="Email capture" status="done" />
                        <ContentRow name="Bouwproces in 6 Fases Guide" type="Lead Magnet" goal="Education + capture" status="progress" />
                        <ContentRow name="Assessment Quiz" type="Interactive" goal="Lead qualification" status="done" />
                        <ContentRow name="Demo Video (2 min)" type="Video" goal="Product awareness" status="todo" />
                        <ContentRow name="Webinar: Bouwtransparantie" type="Event" goal="Authority + leads" status="planned" />
                        <ContentRow name="Press Release (NL)" type="PR" goal="Media coverage" status="done" />
                        <ContentRow name="Case Study Template" type="Social Proof" goal="Conversion" status="done" />
                        <ContentRow name="Competitor Battle Card (Ziggu)" type="Sales" goal="Sales enablement" status="done" />
                        <ContentRow name="Pilot Agreement Template" type="Legal" goal="Partner signup" status="done" />
                        <ContentRow name="Builder Target List (100)" type="Sales" goal="Outreach" status="done" />
                        <ContentRow name="LinkedIn Content Calendar" type="Social" goal="Organic reach" status="done" />
                        <ContentRow name="Email Nurture (7-series)" type="Email" goal="Lead nurture" status="progress" />
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Webinar Plan Summary */}
                <section>
                  <SectionHeader>Launch Webinar: &quot;De Toekomst van Bouwtransparantie&quot;</SectionHeader>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Video className="w-6 h-6 text-[#93b9e6]" />
                        <h3 className="text-lg font-black uppercase tracking-wide">Event Details</h3>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Datum</span>
                          <span className="font-bold">Week 10 (TBD)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Tijd</span>
                          <span className="font-bold">14:00 - 15:00 CET</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Format</span>
                          <span className="font-bold">Zoom Webinar + Live Demo</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500">Registratie doel</span>
                          <span className="font-bold">200</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-500">Live attendees</span>
                          <span className="font-bold">100 (50%)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-[#93b9e6]" />
                        <h3 className="text-lg font-black uppercase tracking-wide">Agenda</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <AgendaItem time="14:00" duration="5m" topic="Welkom & Introductie" speaker="Martijn" />
                        <AgendaItem time="14:05" duration="10m" topic="Het Probleem: Wkb Chaos" speaker="Expert" />
                        <AgendaItem time="14:15" duration="10m" topic="Ons Verhaal: 68 Jaar Bouwen" speaker="Martijn" />
                        <AgendaItem time="14:25" duration="15m" topic="Live Demo: Woningpaspoort" speaker="Martijn" highlight />
                        <AgendaItem time="14:40" duration="10m" topic="Case Study: Pilot Resultaten" speaker="Bouwer" />
                        <AgendaItem time="14:50" duration="8m" topic="Q&A" speaker="Allen" />
                        <AgendaItem time="14:58" duration="2m" topic="Aanbod & Afsluiting" speaker="Martijn" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Media Outreach Summary */}
                <section>
                  <SectionHeader>Media & PR Plan</SectionHeader>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Newspaper className="w-5 h-5 text-[#93b9e6]" />
                        <span className="font-black text-xs uppercase tracking-wider text-[#93b9e6]">Tier 1: Bouw</span>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cobouw</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> BouwWereld</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> De Aannemer</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bouwformatie</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-[#93b9e6]" />
                        <span className="font-black text-xs uppercase tracking-wider text-[#93b9e6]">Tier 2: Vastgoed</span>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PropertyNL</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vastgoedmarkt</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Woningmarkt NL</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-[#93b9e6]" />
                        <span className="font-black text-xs uppercase tracking-wider text-[#93b9e6]">Tier 3: Tech</span>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sprout</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Emerce</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> MT/Sprout</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-100 p-4">
                      <p className="text-2xl font-black text-slate-900">50</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Persberichten</p>
                    </div>
                    <div className="bg-slate-100 p-4">
                      <p className="text-2xl font-black text-slate-900">10</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Artikelen doel</p>
                    </div>
                    <div className="bg-slate-100 p-4">
                      <p className="text-2xl font-black text-slate-900">5</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Interviews</p>
                    </div>
                    <div className="bg-slate-100 p-4">
                      <p className="text-2xl font-black text-slate-900">€1K</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Budget</p>
                    </div>
                  </div>
                </section>

                {/* Story Angles */}
                <section>
                  <SectionHeader>PR Story Angles</SectionHeader>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <StoryAngle
                      angle="Family Story"
                      headline="Drie generaties bouwers, nu software"
                      target="Regionale media, business magazines"
                      icon={<Users className="w-5 h-5" />}
                    />
                    <StoryAngle
                      angle="Consumer Protection"
                      headline="Eindelijk weten wat er in je muren zit"
                      target="Consumer media, nieuwssites"
                      icon={<Home className="w-5 h-5" />}
                      highlight
                    />
                    <StoryAngle
                      angle="Wkb Solution"
                      headline="70% van bouwers worstelt met Wkb - dit is de oplossing"
                      target="Bouw vakbladen"
                      icon={<Shield className="w-5 h-5" />}
                    />
                    <StoryAngle
                      angle="PropTech Innovation"
                      headline="Niet weer een startup: familiebedrijf met 19.000 projecten gaat tech"
                      target="Tech/startup media"
                      icon={<Rocket className="w-5 h-5" />}
                    />
                  </div>
                </section>
              </div>
            )}

            {/* Financials Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-16">
                <section>
                  <SectionHeader>Revenue Projectie</SectionHeader>
                  <div className="bg-slate-50 p-8">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="text-left py-4">Revenue Stream</th>
                          <th className="text-right py-4">Jaar 1</th>
                          <th className="text-right py-4">Jaar 2</th>
                          <th className="text-right py-4">Jaar 3</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-slate-100">
                          <td className="py-4">Bouwer SaaS (B2B)</td>
                          <td className="text-right">€120K</td>
                          <td className="text-right">€1.8M</td>
                          <td className="text-right">€8M</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4">Eigenaar Premium (B2C)</td>
                          <td className="text-right">€10K</td>
                          <td className="text-right">€200K</td>
                          <td className="text-right">€1.5M</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-4">Data & Partnerships</td>
                          <td className="text-right">€0</td>
                          <td className="text-right">€50K</td>
                          <td className="text-right">€500K</td>
                        </tr>
                        <tr className="bg-[#93b9e6]/10 font-black">
                          <td className="py-4 text-[#93b9e6]">TOTAAL ARR</td>
                          <td className="text-right text-[#93b9e6]">€130K</td>
                          <td className="text-right text-[#93b9e6]">€2.05M</td>
                          <td className="text-right text-[#93b9e6]">€10M</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <SectionHeader>Unit Economics</SectionHeader>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8">
                      <h3 className="text-lg font-black uppercase tracking-wide mb-6">Metrics</h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-500">Bouwer CAC</span>
                          <span className="font-bold">€500-1.000</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-500">Bouwer LTV</span>
                          <span className="font-bold">€8.000-15.000</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-500">LTV:CAC ratio</span>
                          <span className="font-bold text-emerald-500">10:1 - 15:1</span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-slate-500">Payback period</span>
                          <span className="font-bold">3-6 maanden</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8">
                      <h3 className="text-lg font-black uppercase tracking-wide mb-6">Investering</h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-500">MVP Development</span>
                          <span className="font-bold">€50K</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-500">Go-to-Market</span>
                          <span className="font-bold">€30K</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-500">Operations (12 maanden)</span>
                          <span className="font-bold">€70K</span>
                        </div>
                        <div className="flex justify-between py-3 font-black text-[#93b9e6]">
                          <span>TOTAAL SEED</span>
                          <span>€150K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-8">
                    <h3 className="text-lg font-black text-emerald-800 mb-3">Break-even</h3>
                    <p className="text-emerald-900">
                      Bij €49/maand per bouwer en €150K seed investment, break-even bij 
                      <strong> ~250 betalende bouwers</strong> (maand 8-10).
                      Met Broersma netwerk als startpunt is dit haalbaar binnen jaar 1.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-16">
                <section>
                  <SectionHeader>90-Dagen Plan</SectionHeader>
                  <div className="grid lg:grid-cols-3 gap-px bg-slate-200">
                    <PhaseCard
                      phase="1"
                      title="Validatie"
                      timeline="Week 1-4"
                      active
                      items={[
                        'Interview 10 bouwers (5-15 FTE)',
                        'Survey 20 recente bouwers',
                        'Gesprek met 3 kwaliteitsborgers',
                        'MVP features afronden',
                      ]}
                    />
                    <PhaseCard
                      phase="2"
                      title="Pilot Design"
                      timeline="Week 5-8"
                      items={[
                        'Definieer MVP (Wkb core)',
                        'Pilot programma opzet',
                        'Test pricing (€3K vs €5K)',
                        'Sales materiaal ready',
                      ]}
                    />
                    <PhaseCard
                      phase="3"
                      title="Pilot Launch"
                      timeline="Week 9-12"
                      items={[
                        '5-10 bouwers in pilot',
                        '100 eigenaren in beta',
                        'Eerste case study',
                        'Iteratie op feedback',
                      ]}
                    />
                  </div>
                </section>

                <section>
                  <SectionHeader>Go/No-Go Criteria</SectionHeader>
                  <div className="bg-[#93b9e6]/10 p-8">
                    <p className="text-slate-600 mb-8">
                      Na 90 dagen evalueren we op basis van:
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 text-center">
                        <p className="text-4xl font-black text-slate-900">5+</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Betalende bouwers</p>
                      </div>
                      <div className="bg-white p-6 text-center">
                        <p className="text-4xl font-black text-slate-900">50+</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Actieve eigenaren</p>
                      </div>
                      <div className="bg-white p-6 text-center">
                        <p className="text-4xl font-black text-slate-900">40+</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">NPS Score</p>
                      </div>
                      <div className="bg-white p-6 text-center">
                        <p className="text-4xl font-black text-slate-900">€15K</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">MRR</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Risks Tab */}
            {activeTab === 'risks' && (
              <div className="space-y-6">
                <SectionHeader>Risico Analyse</SectionHeader>
                <RiskRow
                  risk="Geen gebruikers buiten netwerk"
                  probability="Medium"
                  impact="Kritiek"
                  mitigation="Start met Broersma klanten. Meetbare KPIs vanaf dag 1. Go/no-go na 50 externe gebruikers."
                />
                <RiskRow
                  risk="WhatsApp foto-volume overweldigend"
                  probability="Laag"
                  impact="Medium"
                  mitigation="Start met max 5 projecten. AI-classificatie in fase 2. Handmatig als fallback."
                />
                <RiskRow
                  risk="Wkb interpretatie wijzigt"
                  probability="Laag"
                  impact="Hoog"
                  mitigation="Beta disclaimer. Juridische review voor V1. Continue monitoring regelgeving."
                />
                <RiskRow
                  risk="Cere integratie vertraagd"
                  probability="Medium"
                  impact="Laag"
                  mitigation="Mock badges werken voor MVP. Echte integratie is P1."
                />
                <RiskRow
                  risk="Concurrent reageert"
                  probability="Medium"
                  impact="Medium"
                  mitigation="18 maanden window. Speed to market. Eigenaar-first moeilijk te kopiëren."
                />
              </div>
            )}
          </div>

          {/* Final CTA */}
          <div className="mt-20 bg-slate-900 p-10 lg:p-14">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-[#93b9e6] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-8 h-8 text-slate-900" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">De Vraag</h2>
                <p className="text-white/60 mb-8 max-w-2xl">
                  Goedkeuring om door te gaan met open beta lancering en pilotprojecten binnen het Broersma netwerk.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <AskItem text="Open Beta Lancering" subtext="Product live voor eerste gebruikers" />
                  <AskItem text="5-10 Pilotprojecten" subtext="Binnen Broersma netwerk" />
                  <AskItem text="Seed Investering €150K" subtext="18 maanden runway" />
                  <AskItem text="Martijn Fulltime" subtext="Product & GTM lead" />
                </div>
                
                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#93b9e6] text-slate-900 font-black uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    Bekijk Live Product
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-700 text-white font-black uppercase tracking-wider hover:bg-slate-600 transition-colors"
                  >
                    Test Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
            <p className="font-bold uppercase tracking-wider">Intern document • Broersma Engineering • Januari 2026</p>
            <p className="mt-2">Vragen? Martijn: martijn@broersma.nl</p>
          </div>

        </div>
      </main>
    </div>
  )
}

// Components

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
      <h2 className="text-xs font-black text-[#93b9e6] uppercase tracking-[0.4em]">{children}</h2>
    </div>
  )
}

function MetricCard({ value, label, sublabel, highlight }: { value: string; label: string; sublabel: string; highlight?: boolean }) {
  return (
    <div className={`p-8 ${highlight ? 'bg-[#93b9e6]' : 'bg-white'}`}>
      <p className={`text-4xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      <p className={`text-xs font-black uppercase tracking-wider mt-2 ${highlight ? 'text-white/80' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-xs mt-1 ${highlight ? 'text-white/60' : 'text-slate-300'}`}>{sublabel}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-50 p-8 hover:bg-slate-100 transition-colors">
      <div className="text-[#93b9e6] mb-6">{icon}</div>
      <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wide">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  )
}

function StatCard({ value, label, negative }: { value: string; label: string; negative?: boolean }) {
  return (
    <div className={`p-8 ${negative ? 'bg-red-50 border-l-4 border-red-500' : 'bg-slate-50'}`}>
      <p className={`text-3xl font-black ${negative ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
      <p className="text-sm text-slate-500 mt-2">{label}</p>
    </div>
  )
}

function PhaseCard({ phase, title, timeline, items, active }: { phase: string; title: string; timeline: string; items: string[]; active?: boolean }) {
  return (
    <div className={`p-8 ${active ? 'bg-[#93b9e6]/10' : 'bg-white'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-10 h-10 flex items-center justify-center font-black ${active ? 'bg-[#93b9e6] text-white' : 'bg-slate-200 text-slate-600'}`}>
          {phase}
        </div>
        <div>
          <p className="font-black text-slate-900 uppercase tracking-wide">{title}</p>
          <p className="text-xs text-slate-400">{timeline}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
            <ChevronRight className="w-4 h-4 text-[#93b9e6] mt-0.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RiskRow({ risk, probability, impact, mitigation }: { risk: string; probability: string; impact: string; mitigation: string }) {
  const probColor = probability === 'Laag' ? 'text-emerald-500' : probability === 'Medium' ? 'text-amber-500' : 'text-red-500'
  const impactColor = impact === 'Laag' ? 'text-emerald-500' : impact === 'Medium' ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="bg-slate-50 p-6">
      <div className="flex items-start justify-between gap-8 mb-3">
        <p className="font-black text-slate-900">{risk}</p>
        <div className="flex gap-6 text-xs font-bold uppercase tracking-wider flex-shrink-0">
          <span className={probColor}>P: {probability}</span>
          <span className={impactColor}>I: {impact}</span>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        <strong className="text-slate-700">Mitigatie:</strong> {mitigation}
      </p>
    </div>
  )
}

function AskItem({ text, subtext }: { text: string; subtext: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-white font-bold">{text}</p>
        <p className="text-sm text-white/50">{subtext}</p>
      </div>
    </div>
  )
}

// Marketing Tab Components

function ContentPillar({ percentage, title, description, color }: { percentage: number; title: string; description: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
  }
  return (
    <div className="bg-slate-50 p-4 text-center">
      <div className={`w-full h-2 ${colorMap[color]} mb-3`} style={{ opacity: percentage / 35 }} />
      <p className="text-2xl font-black text-slate-900">{percentage}%</p>
      <p className="font-bold text-sm text-slate-700 mt-1">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
  )
}

function CalendarRow({ week, mon, wed, fri, highlight }: { week: string; mon: string; wed: string; fri: string; highlight?: boolean }) {
  return (
    <>
      <div className={`py-3 px-2 font-bold text-slate-600 ${highlight ? 'bg-[#93b9e6]/10' : ''}`}>Week {week}</div>
      <div className={`py-3 px-2 text-slate-600 ${highlight ? 'bg-[#93b9e6]/10' : ''}`}>{mon}</div>
      <div className={`py-3 px-2 text-slate-600 ${highlight ? 'bg-[#93b9e6]/10' : ''}`}>{wed}</div>
      <div className={`py-3 px-2 text-slate-600 ${highlight ? 'bg-[#93b9e6]/10' : ''}`}>{fri}</div>
    </>
  )
}

function ChannelCard({ icon, name, role, budget, targets, metrics }: { 
  icon: React.ReactNode; name: string; role: string; budget: string; targets: string[]; metrics: string 
}) {
  return (
    <div className="bg-slate-50 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-[#93b9e6]">{icon}</div>
          <div>
            <h3 className="font-black text-slate-900">{name}</h3>
            <span className={`text-xs font-bold uppercase tracking-wider ${role === 'PRIMARY' ? 'text-emerald-500' : 'text-slate-400'}`}>
              {role}
            </span>
          </div>
        </div>
        <span className="text-sm font-bold text-[#93b9e6]">{budget}</span>
      </div>
      <ul className="space-y-1 mb-4">
        {targets.map((target, i) => (
          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
            {target}
          </li>
        ))}
      </ul>
      <div className="pt-3 border-t border-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase">Target: {metrics}</p>
      </div>
    </div>
  )
}

// Funnel Tab Components

function FunnelStage({ stage, icon, volume, channels, conversion, color, highlight }: {
  stage: string; icon: React.ReactNode; volume: string; channels: string[]; conversion: string; color: string; highlight?: boolean
}) {
  return (
    <div className={`p-4 ${highlight ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
      <div className={`w-10 h-10 mx-auto mb-3 flex items-center justify-center ${highlight ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'}`}>
        {icon}
      </div>
      <p className="text-xs font-black uppercase tracking-wider text-white/60 mb-1">{stage}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-emerald-400' : 'text-white'}`}>{volume}</p>
      <div className="mt-3 space-y-1">
        {channels.map((ch, i) => (
          <p key={i} className="text-xs text-white/40">{ch}</p>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs font-bold text-white/40">↓ {conversion}</p>
      </div>
    </div>
  )
}

function ConversionMethod({ icon, name, description, trigger, target, priority }: {
  icon: React.ReactNode; name: string; description: string; trigger: string; target: string; priority: string
}) {
  const priorityColor = priority === 'HIGH' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'
  return (
    <div className="bg-slate-50 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-[#93b9e6]">{icon}</div>
          <h3 className="font-black text-slate-900">{name}</h3>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 ${priorityColor}`}>{priority}</span>
      </div>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <div className="space-y-2 text-xs">
        <div className="flex gap-2">
          <span className="font-bold text-slate-400 uppercase w-16">Trigger:</span>
          <span className="text-slate-600">{trigger}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-slate-400 uppercase w-16">Target:</span>
          <span className="text-slate-600">{target}</span>
        </div>
      </div>
    </div>
  )
}

function EmailSequenceRow({ day, subject, type, action, highlight }: {
  day: number; subject: string; type: string; action: string; highlight?: boolean
}) {
  const typeColors: Record<string, string> = {
    'Value': 'bg-emerald-100 text-emerald-700',
    'Education': 'bg-blue-100 text-blue-700',
    'Problem': 'bg-amber-100 text-amber-700',
    'Social Proof': 'bg-violet-100 text-violet-700',
    'Conversion': 'bg-rose-100 text-rose-700',
  }
  return (
    <div className={`flex items-center gap-4 py-3 px-4 ${highlight ? 'bg-emerald-50 border border-emerald-200' : 'bg-white'}`}>
      <div className="w-12 text-center">
        <span className="text-xs font-bold text-slate-400">Day</span>
        <p className="font-black text-slate-900">{day}</p>
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-900">{subject}</p>
        <p className="text-xs text-slate-400">CTA: {action}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-1 ${typeColors[type]}`}>{type}</span>
    </div>
  )
}

// Release Tab Components

function ReleasePhase({ phase, date, status, features, audience }: {
  phase: string; date: string; status: string; features: string[]; audience: string
}) {
  const statusStyles = {
    active: 'bg-emerald-50 border-l-4 border-emerald-500',
    next: 'bg-[#93b9e6]/10 border-l-4 border-[#93b9e6]',
    planned: 'bg-white',
  }
  return (
    <div className={`p-6 ${statusStyles[status as keyof typeof statusStyles]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-black uppercase tracking-wider ${status === 'active' ? 'text-emerald-600' : status === 'next' ? 'text-[#93b9e6]' : 'text-slate-400'}`}>
          {phase}
        </span>
        <span className="text-xs font-bold text-slate-400">{date}</span>
      </div>
      <ul className="space-y-2 mb-4">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`} />
            {f}
          </li>
        ))}
      </ul>
      <div className="pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-400"><strong>Audience:</strong> {audience}</p>
      </div>
    </div>
  )
}

function ContentRow({ name, type, goal, status }: { name: string; type: string; goal: string; status: string }) {
  const statusBadge = {
    done: { color: 'bg-emerald-100 text-emerald-700', label: '✓ Done' },
    progress: { color: 'bg-amber-100 text-amber-700', label: '⏳ In Progress' },
    planned: { color: 'bg-blue-100 text-blue-700', label: '📅 Planned' },
    todo: { color: 'bg-slate-100 text-slate-500', label: '○ To Do' },
  }
  const badge = statusBadge[status as keyof typeof statusBadge]
  return (
    <tr className="border-b border-slate-100">
      <td className="py-3 font-medium text-slate-900">{name}</td>
      <td className="py-3 text-center text-slate-500">{type}</td>
      <td className="py-3 text-center text-slate-500">{goal}</td>
      <td className="py-3 text-center">
        <span className={`text-xs font-bold px-2 py-1 ${badge.color}`}>{badge.label}</span>
      </td>
    </tr>
  )
}

function AgendaItem({ time, duration, topic, speaker, highlight }: {
  time: string; duration: string; topic: string; speaker: string; highlight?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 py-2 px-3 ${highlight ? 'bg-[#93b9e6]/10 border-l-2 border-[#93b9e6]' : ''}`}>
      <span className="text-xs font-bold text-slate-400 w-12">{time}</span>
      <span className="text-xs text-slate-300 w-8">{duration}</span>
      <span className={`flex-1 ${highlight ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{topic}</span>
      <span className="text-xs text-slate-400">{speaker}</span>
    </div>
  )
}

function StoryAngle({ angle, headline, target, icon, highlight }: {
  angle: string; headline: string; target: string; icon: React.ReactNode; highlight?: boolean
}) {
  return (
    <div className={`p-6 ${highlight ? 'bg-[#93b9e6]/10 border-l-4 border-[#93b9e6]' : 'bg-slate-50'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${highlight ? 'text-[#93b9e6]' : 'text-slate-400'}`}>{icon}</div>
        <span className={`text-xs font-black uppercase tracking-wider ${highlight ? 'text-[#93b9e6]' : 'text-slate-400'}`}>{angle}</span>
      </div>
      <p className="font-bold text-slate-900 mb-2">&quot;{headline}&quot;</p>
      <p className="text-xs text-slate-500"><strong>Best for:</strong> {target}</p>
    </div>
  )
}
