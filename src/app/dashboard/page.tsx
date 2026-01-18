'use client'

import Link from 'next/link'
import { formatDate, formatCurrency, getStatusColor, statusLabels } from '@/lib/utils'

// Mock data - would come from API
const mockProject = {
  id: '1',
  name: 'Villa Zonneweide',
  address: 'Zonneweidelaan 42',
  city: 'Utrecht',
  status: 'construction',
  progress: 45,
  budget: { spent: 185000, total: 450000 },
  lastActivity: new Date(),
}

const mockPhases = [
  { id: '1', name: 'Planning & Ontwerp', status: 'completed', progress: 100 },
  { id: '2', name: 'Vergunningen', status: 'completed', progress: 100 },
  { id: '3', name: 'Fundering', status: 'completed', progress: 100 },
  { id: '4', name: 'Ruwbouw', status: 'in_progress', progress: 60 },
  { id: '5', name: 'Dak & Gevel', status: 'pending', progress: 0 },
  { id: '6', name: 'Installaties', status: 'pending', progress: 0 },
  { id: '7', name: 'Afbouw', status: 'pending', progress: 0 },
  { id: '8', name: 'Oplevering', status: 'pending', progress: 0 },
]

const mockActivities = [
  { id: '1', action: 'Foto toegevoegd', description: 'Ruwbouw eerste verdieping', timestamp: new Date(), user: 'Aannemer BV' },
  { id: '2', action: 'Mijlpaal bereikt', description: 'Fundering afgerond', timestamp: new Date(Date.now() - 86400000), user: 'Systeem' },
  { id: '3', action: 'Document geüpload', description: 'Constructieberekening v2', timestamp: new Date(Date.now() - 172800000), user: 'Ingenieursbureau' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Woningpaspoort
          </Link>
          <nav className="flex gap-6">
            <Link href="/dashboard" className="text-primary-600 font-medium">Dashboard</Link>
            <Link href="/dashboard/documents" className="text-gray-600 hover:text-gray-900">Documenten</Link>
            <Link href="/dashboard/dossier" className="text-gray-600 hover:text-gray-900">Dossier</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{mockProject.name}</h1>
              <p className="text-gray-500">{mockProject.address}, {mockProject.city}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockProject.status)}`}>
              {statusLabels[mockProject.status]}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Voortgang</span>
              <span className="font-medium">{mockProject.progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className="h-full bg-primary-600 rounded-full transition-all"
                style={{ width: `${mockProject.progress}%` }}
              />
            </div>
          </div>

          {/* Budget */}
          <div className="mt-4 flex gap-8">
            <div>
              <span className="text-sm text-gray-500">Besteed</span>
              <p className="text-lg font-semibold">{formatCurrency(mockProject.budget.spent)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Budget</span>
              <p className="text-lg font-semibold">{formatCurrency(mockProject.budget.total)}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Phases */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Bouwfases</h2>
            <div className="space-y-3">
              {mockPhases.map((phase, index) => (
                <div key={phase.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    phase.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : phase.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {phase.status === 'completed' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className={phase.status === 'pending' ? 'text-gray-400' : ''}>{phase.name}</span>
                      <span className="text-sm text-gray-500">{phase.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1">
                      <div
                        className={`h-full rounded-full ${
                          phase.status === 'completed' ? 'bg-green-500' : 'bg-primary-600'
                        }`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recente activiteit</h2>
            <div className="space-y-4">
              {mockActivities.map(activity => (
                <div key={activity.id} className="border-l-2 border-gray-200 pl-4">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.user} • {formatDate(activity.timestamp)}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-primary-600 hover:underline">
              Bekijk alle activiteit →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <Link
            href="/dashboard/documents"
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-medium">Documenten</h3>
            <p className="text-sm text-gray-500">Bekijk alle bestanden</p>
          </Link>
          <Link
            href="/dashboard/photos"
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📸</div>
            <h3 className="font-medium">Foto's</h3>
            <p className="text-sm text-gray-500">Bouwvoortgang in beeld</p>
          </Link>
          <Link
            href="/dashboard/specifications"
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium">Specificaties</h3>
            <p className="text-sm text-gray-500">Materialen & afwerking</p>
          </Link>
          <Link
            href="/dashboard/dossier"
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📁</div>
            <h3 className="font-medium">Wkb Dossier</h3>
            <p className="text-sm text-gray-500">Consumentendossier</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
