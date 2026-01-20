'use client'

import { useState } from 'react'
import {
  Euro, TrendingUp, TrendingDown, AlertTriangle,
  Edit2, Check, X, PiggyBank, BarChart3
} from 'lucide-react'

// Cost categories as per PRD
const COST_CATEGORIES = [
  { id: 'KAVEL', label: 'KAVEL/GROND', icon: PiggyBank },
  { id: 'FOUNDATION', label: 'FUNDERING', icon: PiggyBank },
  { id: 'STRUCTURE', label: 'RUWBOUW', icon: PiggyBank },
  { id: 'ROOF_FACADE', label: 'DAK & GEVEL', icon: PiggyBank },
  { id: 'INSTALLATIONS', label: 'INSTALLATIES', icon: PiggyBank },
  { id: 'FINISHING', label: 'AFBOUW', icon: PiggyBank },
  { id: 'KITCHEN', label: 'KEUKEN', icon: PiggyBank },
  { id: 'BATHROOM', label: 'BADKAMER', icon: PiggyBank },
  { id: 'GARDEN', label: 'TUIN', icon: PiggyBank },
  { id: 'FEES', label: 'KOSTEN & LEGES', icon: PiggyBank },
  { id: 'OTHER', label: 'OVERIG', icon: PiggyBank },
]

// Mock data - in real app, this comes from API
const INITIAL_COSTS = [
  { id: '1', category: 'KAVEL', budgeted: 180000, actual: 175000 },
  { id: '2', category: 'FOUNDATION', budgeted: 45000, actual: 48500 },
  { id: '3', category: 'STRUCTURE', budgeted: 120000, actual: 115000 },
  { id: '4', category: 'ROOF_FACADE', budgeted: 65000, actual: 62000 },
  { id: '5', category: 'INSTALLATIONS', budgeted: 55000, actual: 58000 },
  { id: '6', category: 'FINISHING', budgeted: 85000, actual: 45000 },
  { id: '7', category: 'KITCHEN', budgeted: 25000, actual: 0 },
  { id: '8', category: 'BATHROOM', budgeted: 18000, actual: 0 },
  { id: '9', category: 'GARDEN', budgeted: 15000, actual: 0 },
  { id: '10', category: 'FEES', budgeted: 12000, actual: 11500 },
]

export default function CostsPage() {
  const [costs, setCosts] = useState(INITIAL_COSTS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState({ budgeted: 0, actual: 0 })

  const totalBudgeted = costs.reduce((sum, c) => sum + c.budgeted, 0)
  const totalActual = costs.reduce((sum, c) => sum + c.actual, 0)
  const totalDifference = totalBudgeted - totalActual
  const percentageUsed = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryInfo = (categoryId: string) => {
    return COST_CATEGORIES.find(c => c.id === categoryId) || { label: categoryId, icon: PiggyBank }
  }

  const startEditing = (cost: typeof costs[0]) => {
    setEditingId(cost.id)
    setEditValue({ budgeted: cost.budgeted, actual: cost.actual })
  }

  const saveEdit = (id: string) => {
    setCosts(costs.map(c =>
      c.id === id ? { ...c, ...editValue } : c
    ))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-[#93b9e6]" />
          <span className="text-[#93b9e6] text-[10px] font-black uppercase tracking-[0.3em]">FINANCIEEL</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
          Kostenanalyse
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Budget versus werkelijke kosten
        </p>
      </div>

      {/* Summary Cards - Brutalist style */}
      <div className="grid md:grid-cols-4 gap-px bg-slate-200 mb-8">
        <div className="bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <PiggyBank className="w-6 h-6 text-[#93b9e6]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOTAAL BUDGET</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(totalBudgeted)}</p>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Euro className="w-6 h-6 text-[#93b9e6]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">UITGEGEVEN</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(totalActual)}</p>
        </div>

        <div className={`p-6 ${totalDifference >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <div className="flex items-center gap-3 mb-4">
            {totalDifference >= 0 ? (
              <TrendingDown className="w-6 h-6 text-white/70" />
            ) : (
              <TrendingUp className="w-6 h-6 text-white/70" />
            )}
            <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">
              {totalDifference >= 0 ? 'ONDER BUDGET' : 'OVER BUDGET'}
            </span>
          </div>
          <p className="text-3xl font-black text-white">
            {totalDifference >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalDifference))}
          </p>
        </div>

        <div className="bg-slate-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-[#93b9e6]" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">VOORTGANG</span>
          </div>
          <p className="text-3xl font-black text-white">{percentageUsed.toFixed(0)}%</p>
          <div className="mt-3 h-1 bg-white/20 overflow-hidden">
            <div
              className={`h-full transition-all ${percentageUsed > 100 ? 'bg-red-500' : 'bg-[#93b9e6]'}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cost Breakdown Table - Brutalist */}
      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">KOSTENPOSTEN</h2>
          <p className="text-xs text-slate-500 mt-1">Klik op een regel om de bedragen aan te passen</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-left text-[10px] text-white/70 uppercase tracking-wider">
                <th className="px-6 py-4 font-black">Categorie</th>
                <th className="px-6 py-4 font-black text-right">Budget</th>
                <th className="px-6 py-4 font-black text-right">Werkelijk</th>
                <th className="px-6 py-4 font-black text-right">Verschil</th>
                <th className="px-6 py-4 font-black text-right">Status</th>
                <th className="px-6 py-4 font-black w-20"></th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => {
                const category = getCategoryInfo(cost.category)
                const difference = cost.budgeted - cost.actual
                const isEditing = editingId === cost.id
                const isOverBudget = cost.actual > cost.budgeted && cost.budgeted > 0

                return (
                  <tr
                    key={cost.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isEditing ? 'bg-[#93b9e6]/10' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">{category.label}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue.budgeted}
                          onChange={(e) => setEditValue({ ...editValue, budgeted: Number(e.target.value) })}
                          className="w-32 px-3 py-2 text-right border-2 border-slate-900 focus:border-[#93b9e6] outline-none font-bold"
                        />
                      ) : (
                        <span className="text-slate-700 font-medium">{formatCurrency(cost.budgeted)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue.actual}
                          onChange={(e) => setEditValue({ ...editValue, actual: Number(e.target.value) })}
                          className="w-32 px-3 py-2 text-right border-2 border-slate-900 focus:border-[#93b9e6] outline-none font-bold"
                        />
                      ) : (
                        <span className="text-slate-700 font-medium">{formatCurrency(cost.actual)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-black ${difference >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isOverBudget ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" />
                          OVER
                        </span>
                      ) : cost.actual === 0 ? (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GEPLAND</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                          <Check className="w-3 h-3" />
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(cost.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(cost)}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-black">
                <td className="px-6 py-4 uppercase tracking-wider text-sm">TOTAAL</td>
                <td className="px-6 py-4 text-right">{formatCurrency(totalBudgeted)}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(totalActual)}</td>
                <td className="px-6 py-4 text-right">
                  <span className={totalDifference >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {totalDifference >= 0 ? '+' : ''}{formatCurrency(totalDifference)}
                  </span>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Info Box - Brutalist */}
      <div className="mt-6 p-6 bg-[#93b9e6]">
        <p className="text-sm text-slate-900 font-bold">
          <span className="uppercase tracking-wider">TIP:</span> Uw aannemer kan kosten direct bijwerken via WhatsApp.
          Stuur een bericht naar ons nummer met de factuur en wij verwerken deze automatisch.
        </p>
      </div>
    </div>
  )
}
