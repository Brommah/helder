'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  User, Bell, Shield, Eye, Palette, Globe, 
  ChevronRight, Check, Loader2
} from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Instellingen</h1>
        <p className="text-slate-600">Beheer uw account en voorkeuren</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a1a2e]">Profiel</h2>
              <p className="text-sm text-slate-500">Uw persoonlijke gegevens</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Naam</label>
              <input
                type="text"
                defaultValue={session?.user?.name || ''}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a1a2e]/10 focus:border-[#1a1a2e] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                defaultValue={session?.user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a1a2e]">Notificaties</h2>
              <p className="text-sm text-slate-500">Hoe wilt u op de hoogte gehouden worden?</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'E-mail notificaties', desc: 'Ontvang updates per e-mail' },
              { key: 'push', label: 'Push notificaties', desc: 'Browser notificaties' },
              { key: 'updates', label: 'Nieuwsbrief', desc: 'Tips en nieuws over woningbouw' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-[#1a1a2e]">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a1a2e]">Beveiliging</h2>
              <p className="text-sm text-slate-500">Account beveiliging instellingen</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
              <span className="font-medium text-[#1a1a2e]">Wachtwoord wijzigen</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
              <span className="font-medium text-[#1a1a2e]">Twee-factor authenticatie</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#2a2a3e] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Opslaan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
