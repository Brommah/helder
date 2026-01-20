'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/navigation'
import { SharedFooter } from '@/components/layout/footer'
import { Cookie, ArrowLeft, Check, X } from 'lucide-react'

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true, // Always on
    analytics: true,
    marketing: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Save to localStorage or cookie consent system
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#93b9e6]/10">
              <Cookie className="w-8 h-8 text-[#93b9e6]" />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
              Instellingen
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-wider mb-4">
            Cookiebeleid
          </h1>
          <p className="text-lg text-slate-600">
            Beheer uw cookievoorkeuren en lees hoe wij cookies gebruiken.
          </p>
        </div>
      </section>

      {/* Cookie Preferences */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-slate-200 p-8 mb-12">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider mb-6">
              Uw cookievoorkeuren
            </h2>
            
            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between p-4 bg-slate-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">Noodzakelijke cookies</h3>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider">
                      Altijd actief
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Deze cookies zijn noodzakelijk voor het functioneren van de website. 
                    Zonder deze cookies werkt de site niet correct.
                  </p>
                </div>
                <div className="p-2 bg-emerald-100">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between p-4 bg-white border border-slate-200">
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Analytische cookies</h3>
                  <p className="text-sm text-slate-600">
                    Helpen ons te begrijpen hoe bezoekers de website gebruiken, zodat we 
                    de gebruikerservaring kunnen verbeteren.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                  className={`relative w-14 h-7 transition-colors ${
                    preferences.analytics ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white transition-transform ${
                      preferences.analytics ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between p-4 bg-white border border-slate-200">
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Marketing cookies</h3>
                  <p className="text-sm text-slate-600">
                    Worden gebruikt om bezoekers te volgen over websites heen om relevante 
                    advertenties te tonen.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                  className={`relative w-14 h-7 transition-colors ${
                    preferences.marketing ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white transition-transform ${
                      preferences.marketing ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 transition-colors"
              >
                Voorkeuren opslaan
              </button>
              {saved && (
                <span className="text-emerald-600 font-black uppercase tracking-wider text-sm flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Opgeslagen!
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Information */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2>Wat zijn cookies?</h2>
            <p>
              Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer 
              u onze website bezoekt. Ze helpen de website om informatie over uw bezoek te 
              onthouden, zoals uw taalvoorkeur en andere instellingen.
            </p>

            <h2>Welke cookies gebruiken wij?</h2>
            
            <h3>Noodzakelijke cookies</h3>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Doel</th>
                  <th>Bewaartermijn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>session_id</td>
                  <td>Houden uw sessie actief tijdens het browsen</td>
                  <td>Sessie</td>
                </tr>
                <tr>
                  <td>csrf_token</td>
                  <td>Beveiligen formulieren tegen misbruik</td>
                  <td>Sessie</td>
                </tr>
                <tr>
                  <td>cookie_consent</td>
                  <td>Onthouden uw cookievoorkeuren</td>
                  <td>1 jaar</td>
                </tr>
              </tbody>
            </table>

            <h3>Analytische cookies</h3>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Doel</th>
                  <th>Bewaartermijn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics - onderscheiden van gebruikers</td>
                  <td>2 jaar</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics - onderscheiden van gebruikers</td>
                  <td>24 uur</td>
                </tr>
              </tbody>
            </table>

            <h2>Cookies beheren</h2>
            <p>
              Naast het gebruik van de instellingen hierboven, kunt u ook cookies beheren via 
              uw browserinstellingen. U kunt cookies blokkeren of verwijderen, maar dit kan 
              invloed hebben op de functionaliteit van de website.
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
              <li><a href="https://support.mozilla.org/nl/kb/cookies-verwijderen" target="_blank" rel="noopener noreferrer">Firefox</a></li>
              <li><a href="https://support.apple.com/nl-nl/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/nl-nl/microsoft-edge/cookies-verwijderen-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
            </ul>

            <h2>Meer informatie</h2>
            <p>
              Voor meer informatie over hoe wij omgaan met uw gegevens, zie onze{' '}
              <Link href="/privacy" className="text-[#93b9e6] hover:underline font-bold">
                privacyverklaring
              </Link>
              . Heeft u vragen? Neem dan{' '}
              <Link href="/contact" className="text-[#93b9e6] hover:underline font-bold">
                contact
              </Link>
              {' '}met ons op.
            </p>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
