'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  User, Bell, Shield, ChevronRight, Check, Loader2
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Instellingen</h1>
        <p className="text-slate-500 text-sm">Beheer uw account en voorkeuren</p>
      </div>

      <div className="space-y-1">
        {/* Profile Section */}
        <section className="bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#93b9e6] flex items-center justify-center">
              <User className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Profiel</h2>
              <p className="text-xs text-slate-500">Uw persoonlijke gegevens</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Naam</label>
              <input
                type="text"
                defaultValue={session?.user?.name || ''}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#93b9e6] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
              <input
                type="email"
                defaultValue={session?.user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-500"
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Notificaties</h2>
              <p className="text-xs text-slate-500">Hoe wilt u op de hoogte gehouden worden?</p>
            </div>
          </div>

          <div className="space-y-0">
            {[
              { key: 'email', label: 'E-mail notificaties', desc: 'Ontvang updates per e-mail' },
              { key: 'push', label: 'Push notificaties', desc: 'Browser notificaties' },
              { key: 'updates', label: 'Nieuwsbrief', desc: 'Tips en nieuws over woningbouw' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`w-12 h-6 transition-colors relative ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Beveiliging</h2>
              <p className="text-xs text-slate-500">Account beveiliging instellingen</p>
            </div>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
              <span className="font-bold text-slate-900 text-sm">Wachtwoord wijzigen</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
              <span className="font-bold text-slate-900 text-sm">Twee-factor authenticatie</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-[#93b9e6] hover:text-slate-900 transition-colors disabled:opacity-50"
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
