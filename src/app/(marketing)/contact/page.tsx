'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { SharedFooter } from '@/components/layout/footer'
import { 
  ArrowRight, Phone, Mail, MapPin, Clock, 
  Send, CheckCircle, Building2
} from 'lucide-react'

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'algemeen',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    
    // Simulate sending (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setFormState('sent')
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size="lg" />
            <Link 
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-[#1a1a2e] transition-colors"
            >
              ← Terug naar home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] mb-6">
              Neem contact op
            </h1>
            <p className="text-xl text-slate-600">
              Heeft u vragen over bouwen, uw project, of wilt u een vrijblijvend gesprek? 
              We helpen u graag verder.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">
                Contactgegevens
              </h2>
              
              <div className="space-y-6">
                <a 
                  href="tel:+31701234567" 
                  className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#93b9e6]300 hover:shadow-lg transition-all group"
                >
                  <div className="p-3 bg-[#93b9e6]100 rounded-xl group-hover:bg-[#93b9e6]200 transition-colors">
                    <Phone className="w-6 h-6 text-[#93b9e6]600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">Telefoon</h3>
                    <p className="text-lg text-slate-600">070 - 123 45 67</p>
                    <p className="text-sm text-slate-500 mt-1">Ma-Vr 08:00 - 18:00</p>
                  </div>
                </a>

                <a 
                  href="mailto:info@helder.nl" 
                  className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#93b9e6]300 hover:shadow-lg transition-all group"
                >
                  <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">E-mail</h3>
                    <p className="text-lg text-slate-600">info@helder.nl</p>
                    <p className="text-sm text-slate-500 mt-1">Reactie binnen 24 uur</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">Adres</h3>
                    <p className="text-lg text-slate-600">Bouwlaan 123</p>
                    <p className="text-slate-600">2512 AB Den Haag</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">Openingstijden</h3>
                    <div className="text-slate-600 space-y-1">
                      <p>Maandag - Vrijdag: 08:00 - 18:00</p>
                      <p>Zaterdag: 09:00 - 13:00 (op afspraak)</p>
                      <p>Zondag: Gesloten</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick CTA */}
              <div className="mt-10 p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl text-white">
                <Building2 className="w-10 h-10 text-[#93b9e6]400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Liever direct advies?</h3>
                <p className="text-white/70 mb-4">
                  Doe de gratis bouwtest en ontdek direct of bouwen bij u past.
                </p>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a2e] font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Start de test
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">
                Stuur een bericht
              </h2>

              {formState === 'sent' ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                    Bericht verzonden!
                  </h3>
                  <p className="text-emerald-700 mb-6">
                    Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.
                  </p>
                  <button
                    onClick={() => {
                      setFormState('idle')
                      setFormData({ name: '', email: '', phone: '', subject: 'algemeen', message: '' })
                    }}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Nog een bericht sturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Naam *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#93b9e6]500 focus:border-[#93b9e6]500 transition-all"
                        placeholder="Uw naam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#93b9e6]500 focus:border-[#93b9e6]500 transition-all"
                        placeholder="u@voorbeeld.nl"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Telefoon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#93b9e6]500 focus:border-[#93b9e6]500 transition-all"
                        placeholder="06 - 1234 5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Onderwerp
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#93b9e6]500 focus:border-[#93b9e6]500 transition-all"
                      >
                        <option value="algemeen">Algemene vraag</option>
                        <option value="nieuwbouw">Nieuwbouw project</option>
                        <option value="woningpaspoort">Woningpaspoort</option>
                        <option value="offerte">Offerte aanvraag</option>
                        <option value="klacht">Klacht of feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bericht *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#93b9e6]500 focus:border-[#93b9e6]500 transition-all resize-none"
                      placeholder="Hoe kunnen we u helpen?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-semibold rounded-xl hover:bg-[#16213e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {formState === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        Verstuur bericht
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-sm text-slate-500 text-center">
                    Door dit formulier te versturen gaat u akkoord met onze{' '}
                    <Link href="/privacy" className="text-[#93b9e6]600 hover:underline">
                      privacyverklaring
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
