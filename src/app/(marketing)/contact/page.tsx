'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import { 
  ArrowRight, Phone, Mail, MapPin, Clock, 
  Send, CheckCircle, Loader2
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
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    setFormState('sent')
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[#93b9e6]" />
            <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.4em]">CONTACT</span>
          </div>
          <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-6">
            NEEM
            <br />
            <span className="text-[#93b9e6]">CONTACT OP</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl">
            Heeft u vragen over bouwen, uw project, of wilt u een vrijblijvend gesprek? 
            We helpen u graag verder.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                CONTACTGEGEVENS
              </h2>
              
              <div className="space-y-1">
                <a 
                  href="tel:+31701234567" 
                  className="flex items-start gap-4 p-6 bg-slate-50 hover:bg-slate-100 transition-all group"
                >
                  <div className="w-12 h-12 bg-[#93b9e6] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <Phone className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Telefoon</h3>
                    <p className="text-lg font-bold text-slate-600">070 - 123 45 67</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Ma-Vr 08:00 - 18:00</p>
                  </div>
                </a>

                <a 
                  href="mailto:info@helder.nl" 
                  className="flex items-start gap-4 p-6 bg-slate-50 hover:bg-slate-100 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <Mail className="w-6 h-6 text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">E-mail</h3>
                    <p className="text-lg font-bold text-slate-600">info@helder.nl</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Reactie binnen 24 uur</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-6 bg-slate-50">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Adres</h3>
                    <p className="text-lg font-bold text-slate-600">Groothertoginnelaan 33</p>
                    <p className="text-slate-500">2517 EB Den Haag</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-slate-50">
                  <div className="w-12 h-12 bg-slate-300 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">Openingstijden</h3>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>Maandag - Vrijdag: 08:00 - 18:00</p>
                      <p>Zaterdag: 09:00 - 13:00 (op afspraak)</p>
                      <p className="text-slate-400">Zondag: Gesloten</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick CTA */}
              <div className="mt-8 p-8 bg-slate-900">
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Liever direct advies?</h3>
                <p className="text-white/50 mb-6">
                  Doe de gratis bouwtest en ontdek direct of bouwen bij u past.
                </p>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-[#93b9e6] text-slate-900 font-black uppercase tracking-wider text-sm hover:bg-white transition-colors"
                >
                  Start de test
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                STUUR EEN BERICHT
              </h2>

              {formState === 'sent' ? (
                <div className="p-8 bg-emerald-500 text-center">
                  <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                    Bericht verzonden!
                  </h3>
                  <p className="text-white/70 mb-6">
                    Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.
                  </p>
                  <button
                    onClick={() => {
                      setFormState('idle')
                      setFormData({ name: '', email: '', phone: '', subject: 'algemeen', message: '' })
                    }}
                    className="text-white font-bold uppercase tracking-wider hover:underline"
                  >
                    Nog een bericht sturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                        Naam *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                        placeholder="Uw naam"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                        placeholder="u@voorbeeld.nl"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                        Telefoon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                        placeholder="06 - 1234 5678"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                        Onderwerp
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
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
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                      Bericht *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium resize-none"
                      placeholder="Hoe kunnen we u helpen?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-[#93b9e6] hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {formState === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        Verstuur bericht
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-sm text-slate-400 text-center">
                    Door dit formulier te versturen gaat u akkoord met onze{' '}
                    <Link href="/privacy" className="text-[#93b9e6] hover:text-slate-900 font-bold transition-colors">
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

      <Footer />
    </div>
  )
}
