'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Brain, AlertTriangle, TrendingUp, Zap, Bell, Shield,
  ThermometerSun, Wrench, PiggyBank, Leaf, CheckCircle2,
  ArrowRight, BarChart3, Lightbulb, Activity, Calendar,
  ChevronRight, Clock, Target, Sparkles, LineChart,
  Home, Droplets, Wind, Flame, Sun, Battery
} from 'lucide-react'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, hasStarted])

  return { count, ref }
}

// Component health data
const COMPONENT_HEALTH = [
  { 
    name: 'Warmtepomp', 
    icon: ThermometerSun, 
    health: 94, 
    status: 'excellent',
    lastService: 'Mrt 2025',
    nextService: 'Mrt 2026',
    lifespan: '12-15 jaar',
    remaining: '11 jaar',
    prediction: 'Optimaal functionerend. Geen actie vereist.'
  },
  { 
    name: 'Zonnepanelen', 
    icon: Sun, 
    health: 98, 
    status: 'excellent',
    lastService: 'Jun 2025',
    nextService: 'Jun 2026',
    lifespan: '25-30 jaar',
    remaining: '24 jaar',
    prediction: 'Maximale efficiëntie. Productie boven verwachting.'
  },
  { 
    name: 'Vloerverwarming', 
    icon: Flame, 
    health: 91, 
    status: 'good',
    lastService: 'Jan 2025',
    nextService: 'Jan 2026',
    lifespan: '50+ jaar',
    remaining: '49 jaar',
    prediction: 'Stabiel. Waterdruk check aanbevolen binnen 6 maanden.'
  },
  { 
    name: 'Ventilatie (WTW)', 
    icon: Wind, 
    health: 78, 
    status: 'attention',
    lastService: 'Sep 2024',
    nextService: 'Feb 2026',
    lifespan: '15-20 jaar',
    remaining: '14 jaar',
    prediction: 'Filter vervanging aanbevolen binnen 45 dagen.'
  },
  { 
    name: 'Thuisbatterij', 
    icon: Battery, 
    health: 96, 
    status: 'excellent',
    lastService: 'Dec 2025',
    nextService: 'Dec 2026',
    lifespan: '10-15 jaar',
    remaining: '14 jaar',
    prediction: 'Capaciteit 96%. Geen degradatie gedetecteerd.'
  },
  { 
    name: 'Waterinstallatie', 
    icon: Droplets, 
    health: 88, 
    status: 'good',
    lastService: 'Nov 2024',
    nextService: 'Nov 2025',
    lifespan: '30-40 jaar',
    remaining: '29 jaar',
    prediction: 'Druk stabiel. Jaarlijkse inspectie gepland.'
  },
]

const AI_ALERTS = [
  { 
    type: 'warning', 
    icon: AlertTriangle,
    title: 'WTW Filter vervanging', 
    message: 'De filters van uw warmteterugwinning systeem zijn aan vervanging toe. Plan dit binnen 45 dagen voor optimale luchtkwaliteit.',
    time: 'Vandaag',
    action: 'Plan onderhoud',
    saving: '€85/jaar energie'
  },
  { 
    type: 'tip', 
    icon: Lightbulb,
    title: 'Energiebespaartip', 
    message: 'Door uw thermostaat 1°C lager in te stellen bespaart u €120/jaar. Uw woning is uitstekend geïsoleerd.',
    time: '2 dagen geleden',
    action: 'Bekijk instellingen',
    saving: '€120/jaar'
  },
  { 
    type: 'success', 
    icon: CheckCircle2,
    title: 'Zonnepanelen presteren boven verwachting', 
    message: 'Uw systeem produceerde 15% meer energie dan voorspeld deze maand. Totaal: 892 kWh.',
    time: '3 dagen geleden',
    action: 'Bekijk rapport',
    saving: '+€134 dit kwartaal'
  },
  { 
    type: 'info', 
    icon: Bell,
    title: 'Garantie herinnering', 
    message: 'De garantie op uw warmtepomp verloopt over 8 maanden. Plan een gratis inspectie.',
    time: '1 week geleden',
    action: 'Plan inspectie',
    saving: 'Gratis keuring'
  },
]

const ENERGY_COMPARISON = {
  yourUsage: { gas: 0, electricity: 2840 },
  average: { gas: 1180, electricity: 3400 },
  savings: { gas: '100%', electricity: '16%' },
}

const MONTHLY_PREDICTIONS = [
  { month: 'JAN', maintenance: 'Geen', energy: '€45', savings: '€0' },
  { month: 'FEB', maintenance: 'WTW Filter', energy: '€38', savings: '€85' },
  { month: 'MRT', maintenance: 'Warmtepomp check', energy: '€32', savings: '€0' },
  { month: 'APR', maintenance: 'Geen', energy: '€28', savings: '€0' },
  { month: 'MEI', maintenance: 'Dakgoten', energy: '€22', savings: '€0' },
  { month: 'JUN', maintenance: 'Zonnepanelen', energy: '-€45', savings: '€0' },
  { month: 'JUL', maintenance: 'Geen', energy: '-€68', savings: '€0' },
  { month: 'AUG', maintenance: 'Geen', energy: '-€52', savings: '€0' },
  { month: 'SEP', maintenance: 'Geen', energy: '€18', savings: '€0' },
  { month: 'OKT', maintenance: 'Geen', energy: '€35', savings: '€0' },
  { month: 'NOV', maintenance: 'Waterinstallatie', energy: '€42', savings: '€0' },
  { month: 'DEC', maintenance: 'Jaarrapport', energy: '€48', savings: '€0' },
]

const INVESTMENT_ROI = [
  { 
    item: 'Zonnepanelen (18 stuks)', 
    cost: 8400, 
    annualSaving: 1680, 
    payback: 5.0,
    status: 'Terugverdiend in 2028'
  },
  { 
    item: 'Thuisbatterij 10kWh', 
    cost: 6200, 
    annualSaving: 890, 
    payback: 7.0,
    status: 'Terugverdiend in 2030'
  },
  { 
    item: 'Extra isolatie (Rc 8.0)', 
    cost: 4800, 
    annualSaving: 640, 
    payback: 7.5,
    status: 'Terugverdiend in 2031'
  },
]

export default function AIDashboardPage() {
  const { count: savingsCount, ref: savingsRef } = useCounter(5640)
  const { count: lifetimeCount, ref: lifetimeRef } = useCounter(112800)
  const [selectedComponent, setSelectedComponent] = useState(COMPONENT_HEALTH[0])

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-6">
        
        {/* AI Header */}
        <div className="bg-slate-900 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#93b9e6] flex items-center justify-center">
                <Brain className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black text-white">AI INTELLIGENCE</h1>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Live</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm">Voorspellende analyse voor Villa Zonneweide</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-wider">AI Nauwkeurigheid</div>
                <div className="text-2xl font-black text-white">94%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-wider">Laatste analyse</div>
                <div className="text-2xl font-black text-[#93b9e6]">Nu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-200">
          <div ref={savingsRef} className="bg-emerald-500 p-8 lg:col-span-2">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-2">
                  Jaarlijkse besparing door AI
                </div>
                <div className="text-5xl lg:text-7xl font-black text-white">
                  €{savingsCount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-white/50 text-xs mb-1">vs. Zonder AI</div>
                  <div className="text-2xl font-black text-white">+€3.200</div>
                </div>
                <div ref={lifetimeRef}>
                  <div className="text-white/50 text-xs mb-1">Over 20 jaar</div>
                  <div className="text-2xl font-black text-white">€{lifetimeCount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#93b9e6]" />
              <span className="text-white font-black uppercase tracking-wider text-sm">Dit jaar gerealiseerd</span>
            </div>
            <div className="text-4xl font-black text-[#93b9e6] mb-2">€2.840</div>
            <div className="h-2 bg-white/10 overflow-hidden mb-2">
              <div className="h-full bg-[#93b9e6]" style={{ width: '50%' }} />
            </div>
            <div className="text-white/40 text-xs">50% van jaardoel bereikt</div>
          </div>
        </div>

        {/* AI Alerts */}
        <div className="bg-white">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-[#93b9e6]" />
              <div>
                <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Slimme meldingen</h2>
                <p className="text-xs text-slate-400">AI-gegenereerde aanbevelingen</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-bold">1 actie vereist</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {AI_ALERTS.map((alert, i) => {
              const colors = {
                warning: { bg: 'bg-amber-500/10', border: 'border-amber-500', icon: 'text-amber-500' },
                tip: { bg: 'bg-blue-500/10', border: 'border-blue-500', icon: 'text-blue-500' },
                success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500', icon: 'text-emerald-500' },
                info: { bg: 'bg-slate-500/10', border: 'border-slate-400', icon: 'text-slate-500' },
              }
              const style = colors[alert.type as keyof typeof colors]
              
              return (
                <div key={i} className={`p-6 ${style.bg} border-l-4 ${style.border}`}>
                  <div className="flex items-start gap-4">
                    <alert.icon className={`w-6 h-6 flex-shrink-0 ${style.icon}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-black text-slate-900">{alert.title}</h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{alert.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <button className="flex items-center gap-2 text-xs font-black text-[#93b9e6] uppercase tracking-wider hover:text-slate-900 transition-colors">
                          {alert.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-emerald-600">{alert.saving}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Component Health + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-200">
          {/* Component List */}
          <div className="bg-white">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <Activity className="w-6 h-6 text-[#93b9e6]" />
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Component gezondheid</h2>
                  <p className="text-xs text-slate-400">Real-time monitoring</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {COMPONENT_HEALTH.map((component) => {
                const statusColors = {
                  excellent: 'bg-emerald-500',
                  good: 'bg-[#93b9e6]',
                  attention: 'bg-amber-500',
                  critical: 'bg-red-500',
                }
                return (
                  <button
                    key={component.name}
                    onClick={() => setSelectedComponent(component)}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left ${
                      selectedComponent.name === component.name ? 'bg-slate-50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      selectedComponent.name === component.name ? 'bg-[#93b9e6]' : 'bg-slate-100'
                    }`}>
                      <component.icon className={`w-5 h-5 ${
                        selectedComponent.name === component.name ? 'text-slate-900' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-sm">{component.name}</div>
                      <div className="text-xs text-slate-400">Volgende: {component.nextService}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900">{component.health}%</div>
                      </div>
                      <div className={`w-3 h-3 ${statusColors[component.status as keyof typeof statusColors]}`} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Component Detail */}
          <div className="lg:col-span-2 bg-white p-6 lg:p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#93b9e6] flex items-center justify-center">
                  <selectedComponent.icon className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedComponent.name}</h3>
                  <p className="text-slate-400">Laatst geserviced: {selectedComponent.lastService}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black text-slate-900">{selectedComponent.health}%</div>
                <div className="text-xs font-black text-emerald-500 uppercase tracking-wider">
                  {selectedComponent.status === 'excellent' && 'Uitstekend'}
                  {selectedComponent.status === 'good' && 'Goed'}
                  {selectedComponent.status === 'attention' && 'Aandacht nodig'}
                  {selectedComponent.status === 'critical' && 'Kritiek'}
                </div>
              </div>
            </div>

            {/* Health bar */}
            <div className="mb-8">
              <div className="h-4 bg-slate-100 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    selectedComponent.health >= 90 ? 'bg-emerald-500' :
                    selectedComponent.health >= 70 ? 'bg-[#93b9e6]' :
                    selectedComponent.health >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedComponent.health}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 mb-8">
              <div className="bg-white p-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Levensduur</div>
                <div className="text-lg font-black text-slate-900">{selectedComponent.lifespan}</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Resterend</div>
                <div className="text-lg font-black text-[#93b9e6]">{selectedComponent.remaining}</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Volgende service</div>
                <div className="text-lg font-black text-slate-900">{selectedComponent.nextService}</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</div>
                <div className="text-lg font-black text-emerald-500">Actief</div>
              </div>
            </div>

            {/* AI Prediction */}
            <div className="bg-slate-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-[#93b9e6]" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">AI Voorspelling</span>
              </div>
              <p className="text-white text-lg">{selectedComponent.prediction}</p>
            </div>
          </div>
        </div>

        {/* Energy Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-200">
          {/* Energy Comparison */}
          <div className="bg-white p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 className="w-6 h-6 text-[#93b9e6]" />
              <div>
                <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Energie benchmark</h2>
                <p className="text-xs text-slate-400">Vergelijking met 500+ vergelijkbare woningen</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Gas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Gasverbruik</span>
                  <span className="text-sm font-bold text-emerald-500">-100% vs gemiddeld</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">U</span>
                      <div className="flex-1 h-6 bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '0%' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900">0 m³</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Gem.</span>
                      <div className="flex-1 h-6 bg-slate-100 overflow-hidden">
                        <div className="h-full bg-slate-300" style={{ width: '100%' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">1.180 m³</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-bold">Gasvrij! Volledig elektrisch verwarmd.</div>
              </div>

              {/* Electricity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Elektriciteit</span>
                  <span className="text-sm font-bold text-emerald-500">-16% vs gemiddeld</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">U</span>
                      <div className="flex-1 h-6 bg-slate-100 overflow-hidden">
                        <div className="h-full bg-[#93b9e6]" style={{ width: '83%' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900">2.840 kWh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Gem.</span>
                      <div className="flex-1 h-6 bg-slate-100 overflow-hidden">
                        <div className="h-full bg-slate-300" style={{ width: '100%' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">3.400 kWh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your position */}
            <div className="mt-8 p-4 bg-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Uw positie</span>
                <span className="text-2xl font-black text-white">Top 3%</span>
              </div>
              <div className="text-white/70 text-xs mt-1">Meest energie-efficiënte woningen in Nederland</div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <Lightbulb className="w-6 h-6 text-emerald-500" />
              <div>
                <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">AI Aanbevelingen</h2>
                <p className="text-xs text-slate-400">Persoonlijke tips voor extra besparing</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { tip: 'Thermostaat 1°C lager', saving: '€120/jaar', impact: 'Hoog', difficulty: 'Makkelijk' },
                { tip: 'Wasmachine op daltarief', saving: '€85/jaar', impact: 'Medium', difficulty: 'Makkelijk' },
                { tip: 'Standby verbruik reduceren', saving: '€65/jaar', impact: 'Medium', difficulty: 'Makkelijk' },
                { tip: 'Warmtepomp optimalisatie', saving: '€180/jaar', impact: 'Hoog', difficulty: 'Technisch' },
              ].map((rec, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{rec.tip}</div>
                      <div className="text-xs text-slate-400">{rec.difficulty} • {rec.impact} impact</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600 font-black">{rec.saving}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#93b9e6] transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Totale extra besparing mogelijk</span>
                <span className="text-xl font-black text-emerald-400">€450/jaar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment ROI */}
        <div className="bg-white">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-6 h-6 text-[#93b9e6]" />
              <div>
                <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Investering ROI</h2>
                <p className="text-xs text-slate-400">AI-berekende terugverdientijd</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {INVESTMENT_ROI.map((inv, i) => {
              const progress = Math.min(100, (2026 - 2023) / inv.payback * 100)
              return (
                <div key={i} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{inv.item}</h3>
                      <p className="text-xs text-slate-400">{inv.status}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">{inv.payback} jaar</div>
                      <div className="text-xs text-slate-400">terugverdientijd</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Investering</div>
                      <div className="text-lg font-black text-slate-900">€{inv.cost.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Besparing/jaar</div>
                      <div className="text-lg font-black text-emerald-500">€{inv.annualSaving.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Na 20 jaar</div>
                      <div className="text-lg font-black text-[#93b9e6]">+€{(inv.annualSaving * 20 - inv.cost).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Voortgang terugverdienen</span>
                      <span className="text-xs font-bold text-slate-900">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly Forecast */}
        <div className="bg-slate-900 p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Calendar className="w-6 h-6 text-[#93b9e6]" />
            <div>
              <h2 className="font-black text-white uppercase tracking-wider text-sm">AI Jaarvoorspelling 2026</h2>
              <p className="text-xs text-white/40">Verwacht onderhoud en energiekosten</p>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-px bg-white/10">
            {MONTHLY_PREDICTIONS.map((month) => (
              <div key={month.month} className="bg-slate-900 p-4 text-center hover:bg-slate-800 transition-colors">
                <div className="text-lg font-black text-[#93b9e6] mb-2">{month.month}</div>
                <div className={`text-sm font-bold mb-1 ${
                  month.energy.startsWith('-') ? 'text-emerald-400' : 'text-white'
                }`}>{month.energy}</div>
                <div className="text-[10px] text-white/30 truncate" title={month.maintenance}>
                  {month.maintenance === 'Geen' ? '—' : month.maintenance}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-[#93b9e6]">
            <span className="text-slate-900 font-black">Voorspelde jaarkosten energie</span>
            <span className="text-2xl font-black text-slate-900">€143</span>
          </div>
        </div>

      </div>
    </div>
  )
}
