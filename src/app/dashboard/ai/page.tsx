'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProperty } from '../layout'
import { 
  Brain, AlertTriangle, TrendingUp, Zap, Bell, Shield,
  CheckCircle2, ArrowRight, Calendar, Clock, Target,
  Home, Sun, Battery, Thermometer, Droplets, Wind,
  ChevronRight, Lock, HardHat, Sparkles, Euro,
  Phone, ExternalLink, Wrench, Leaf
} from 'lucide-react'

// ===========================================
// ACTION ITEMS - The reason to return
// ===========================================
const ACTION_ITEMS = [
  {
    id: 1,
    priority: 'high',
    title: 'Warmtepomp service',
    description: 'Jaarlijkse controle is over 2 weken nodig',
    saving: 'Voorkomt €800 reparatiekosten',
    action: 'Plan afspraak',
    actionUrl: 'tel:+31201234567',
    dueDate: '3 feb',
    provider: 'Daikin Service',
  },
  {
    id: 2,
    priority: 'medium',
    title: 'Zonnepanelen reinigen',
    description: 'Opbrengst 12% lager dan verwacht',
    saving: '+€180/jaar na reiniging',
    action: 'Bekijk tips',
    dueDate: 'Deze maand',
  },
  {
    id: 3,
    priority: 'low',
    title: 'Energietarief check',
    description: 'Contract loopt af over 3 maanden',
    saving: 'Mogelijk €400/jaar besparen',
    action: 'Vergelijk tarieven',
    dueDate: 'Apr 2026',
  },
]

// ===========================================
// SYSTEM HEALTH - Simple traffic light
// ===========================================
const SYSTEMS = [
  { name: 'Warmtepomp', status: 'good', detail: 'Optimaal', icon: Thermometer },
  { name: 'Zonnepanelen', status: 'warning', detail: '88% efficiëntie', icon: Sun },
  { name: 'Ventilatie', status: 'good', detail: 'Filters OK', icon: Wind },
  { name: 'Batterij', status: 'good', detail: '94% capaciteit', icon: Battery },
  { name: 'Isolatie', status: 'good', detail: 'Rc 8.0', icon: Home },
  { name: 'Waterleiding', status: 'good', detail: 'Geen lekkage', icon: Droplets },
]

// ===========================================
// UPCOMING COSTS - What to budget for
// ===========================================
const UPCOMING_COSTS = [
  { month: 'Feb', item: 'Warmtepomp service', cost: 150, type: 'maintenance' },
  { month: 'Apr', item: 'Dakgoot inspectie', cost: 0, type: 'free' },
  { month: 'Jun', item: 'CV-ketel controle', cost: 120, type: 'maintenance' },
  { month: 'Sep', item: 'Schoorsteen vegen', cost: 85, type: 'maintenance' },
]

export default function AIDashboardPage() {
  const property = useProperty()
  const [expandedAction, setExpandedAction] = useState<number | null>(null)

  // Show locked state if property is not completed
  if (!property?.isCompleted) {
    return (
      <div className="min-h-screen">
        <div className="p-6 lg:p-8">
          <div className="bg-slate-900 p-8 lg:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-white/10 mx-auto mb-8 flex items-center justify-center">
                <Lock className="w-12 h-12 text-white/30" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">
                AI INTELLIGENCE
              </h1>
              <p className="text-lg text-white/50 mb-8">
                Beschikbaar na oplevering van uw woning
              </p>
              
              <div className="bg-white/5 p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <HardHat className="w-8 h-8 text-[#93b9e6]" />
                  <div className="text-left">
                    <p className="font-black text-white">Woning in aanbouw</p>
                    <p className="text-white/50 text-sm">Voortgang: {property?.progress || 0}%</p>
                  </div>
                </div>
                <div className="h-2 bg-white/10 overflow-hidden mb-4">
                  <div 
                    className="h-full bg-[#93b9e6] transition-all"
                    style={{ width: `${property?.progress || 0}%` }}
                  />
                </div>
                <p className="text-white/40 text-sm">
                  Na oplevering activeert het AI-systeem automatisch.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#93b9e6] text-slate-900 font-black uppercase tracking-wider hover:bg-white transition-colors"
              >
                Terug naar overzicht
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const goodSystems = SYSTEMS.filter(s => s.status === 'good').length
  const totalSystems = SYSTEMS.length
  const healthPercentage = Math.round((goodSystems / totalSystems) * 100)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8 space-y-6">
        
        {/* ============================================ */}
        {/* HERO: Overall Status - Answer "Is my house OK?" */}
        {/* ============================================ */}
        <div className="bg-white border-l-4 border-emerald-500">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Woningsstatus</p>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">
                    Alles in orde
                  </h1>
                  <p className="text-slate-500">
                    {goodSystems} van {totalSystems} systemen werken optimaal • 1 aandachtspunt
                  </p>
                </div>
              </div>
              
              {/* Savings highlight */}
              <div className="lg:text-right">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Bespaard dit jaar</p>
                <p className="text-4xl font-black text-emerald-500">€2.840</p>
                <p className="text-sm text-slate-400">+€1.420 vs. gemiddelde woning</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* ACTION ITEMS - "What do I need to do?" */}
        {/* ============================================ */}
        <div className="bg-white">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Actie vereist</h2>
                  <p className="text-sm text-slate-400">{ACTION_ITEMS.length} items die uw aandacht nodig hebben</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {ACTION_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setExpandedAction(expandedAction === item.id ? null : item.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Priority indicator */}
                  <div className={`w-3 h-3 mt-2 flex-shrink-0 ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-amber-500' :
                    'bg-slate-300'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-black text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-400 flex-shrink-0">{item.dueDate}</span>
                    </div>
                    
                    {/* Saving highlight */}
                    <div className="flex items-center gap-2 mb-3">
                      <Euro className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-600">{item.saving}</span>
                    </div>
                    
                    {/* Expanded content */}
                    {expandedAction === item.id && item.provider && (
                      <div className="mt-4 p-4 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-bold text-slate-900">{item.provider}</p>
                            <p className="text-sm text-slate-400">Aanbevolen servicepartner</p>
                          </div>
                        </div>
                        <a 
                          href={item.actionUrl}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-[#93b9e6] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-4 h-4" />
                          Bel nu
                        </a>
                      </div>
                    )}
                    
                    {/* Action button */}
                    <button className="flex items-center gap-2 text-sm font-bold text-[#93b9e6] hover:text-slate-900 uppercase tracking-wider group">
                      {item.action}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* TWO COLUMN LAYOUT */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ============================================ */}
          {/* SYSTEM HEALTH - Traffic light overview */}
          {/* ============================================ */}
          <div className="bg-white">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Systeem gezondheid</h2>
                  <p className="text-sm text-slate-400">{healthPercentage}% optimaal</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {SYSTEMS.map((system) => (
                  <div 
                    key={system.name}
                    className={`p-4 border-l-4 ${
                      system.status === 'good' ? 'border-emerald-500 bg-emerald-50/50' :
                      system.status === 'warning' ? 'border-amber-500 bg-amber-50/50' :
                      'border-red-500 bg-red-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <system.icon className={`w-5 h-5 ${
                        system.status === 'good' ? 'text-emerald-600' :
                        system.status === 'warning' ? 'text-amber-600' :
                        'text-red-600'
                      }`} />
                      <span className="font-bold text-slate-900 text-sm">{system.name}</span>
                    </div>
                    <p className={`text-xs font-medium ${
                      system.status === 'good' ? 'text-emerald-600' :
                      system.status === 'warning' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>{system.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* UPCOMING COSTS - What to budget for */}
          {/* ============================================ */}
          <div className="bg-white">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Komende kosten</h2>
                  <p className="text-sm text-slate-400">Volgende 12 maanden</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {UPCOMING_COSTS.map((cost, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-12 text-sm font-black text-slate-400">{cost.month}</span>
                      <span className="text-sm font-medium text-slate-900">{cost.item}</span>
                    </div>
                    <span className={`text-sm font-black ${
                      cost.type === 'free' ? 'text-emerald-500' : 'text-slate-900'
                    }`}>
                      {cost.type === 'free' ? 'Gratis' : `€${cost.cost}`}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Totaal geschat</p>
                  <p className="text-2xl font-black text-white">€355</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Vs. benchmark</p>
                  <p className="text-lg font-black text-emerald-400">-42%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SAVINGS BREAKDOWN - Where's my money going? */}
        {/* ============================================ */}
        <div className="bg-white">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-wider">Waar bespaar je op?</h2>
                  <p className="text-sm text-slate-400">Jaarlijkse besparing breakdown</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Energie', amount: 1840, icon: Zap, color: 'bg-amber-500' },
                { label: 'Onderhoud', amount: 520, icon: Wrench, color: 'bg-blue-500' },
                { label: 'Preventie', amount: 320, icon: Shield, color: 'bg-purple-500' },
                { label: 'Subsidies', amount: 160, icon: Leaf, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="text-center p-6 bg-slate-50">
                  <div className={`w-12 h-12 ${item.color} mx-auto mb-4 flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-1">€{item.amount}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* AI INSIGHT - Smart tip of the day */}
        {/* ============================================ */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 lg:p-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-[#93b9e6] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-slate-900" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-[#93b9e6] uppercase tracking-wider mb-2">AI Inzicht</p>
              <h3 className="text-xl font-black text-white mb-3">
                Je thuisbatterij kan slimmer werken
              </h3>
              <p className="text-white/60 mb-4">
                Door de batterij te laden tijdens daluren (23:00-07:00) en te ontladen tijdens piekuren 
                kun je €180 extra per jaar besparen. Wil je dit automatisch instellen?
              </p>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-[#93b9e6] text-slate-900 font-black text-sm uppercase tracking-wider hover:bg-white transition-colors">
                  Ja, activeer
                </button>
                <button className="px-6 py-3 text-white/50 font-bold text-sm uppercase tracking-wider hover:text-white transition-colors">
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* LIFETIME VALUE */}
        {/* ============================================ */}
        <div className="bg-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                Geschatte levensduur besparing
              </p>
              <p className="text-5xl font-black text-slate-900">€112.800</p>
              <p className="text-sm text-slate-400 mt-2">
                Gebaseerd op 20 jaar eigendom en huidige energieprijzen
              </p>
            </div>
            <Link 
              href="/dashboard/documents"
              className="flex items-center gap-3 px-6 py-4 bg-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider hover:bg-[#93b9e6] transition-colors group"
            >
              <Shield className="w-5 h-5" />
              Bekijk certificaten
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
