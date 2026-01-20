'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { 
  HelpCircle, MessageCircle, Book, Phone, Mail, 
  ChevronDown, ChevronRight, Search, ArrowLeft
} from 'lucide-react'

const FAQ = [
  {
    category: 'Woningpaspoort',
    questions: [
      {
        q: 'Wat is het Woningpaspoort?',
        a: 'Het Woningpaspoort is een digitaal dossier dat alle informatie over uw woning bevat: van bouwtekeningen en materiaalspecificaties tot onderhoudshistorie en garantiebewijzen. Alles wordt veilig en onveranderbaar vastgelegd.',
      },
      {
        q: 'Hoe krijg ik toegang tot mijn Woningpaspoort?',
        a: 'Na oplevering ontvangt u inloggegevens per e-mail. U kunt inloggen via onze website of app om uw complete woningdossier te bekijken.',
      },
      {
        q: 'Kan ik documenten toevoegen aan mijn Woningpaspoort?',
        a: 'Ja, u kunt zelf documenten uploaden zoals facturen van onderhoud of verbouwingen. Deze worden toegevoegd aan uw dossier maar worden apart gemarkeerd van de originele bouwdocumenten.',
      },
    ],
  },
  {
    category: 'Bouwproces',
    questions: [
      {
        q: 'Hoe kan ik de voortgang van mijn bouw volgen?',
        a: 'In uw dashboard ziet u een realtime tijdlijn met alle bouwfases. Bij elke mijlpaal ontvangt u foto\'s en een update van de projectleider.',
      },
      {
        q: 'Wat als er vertraging optreedt?',
        a: 'Bij vertraging wordt u direct geïnformeerd via uw dashboard en e-mail. We geven altijd een duidelijke uitleg en een bijgewerkte planning.',
      },
    ],
  },
  {
    category: 'Garantie & Onderhoud',
    questions: [
      {
        q: 'Welke garanties zijn er op mijn woning?',
        a: 'Uw woning heeft verschillende garanties: 10 jaar op constructie, 6 jaar op installaties, en specifieke fabrieksgaranties op materialen. Alle garantiebewijzen vindt u in uw Woningpaspoort.',
      },
      {
        q: 'Hoe meld ik een onderhoudsverzoek?',
        a: 'Via uw dashboard kunt u direct een onderhoudsverzoek indienen. Voeg foto\'s toe en beschrijf het probleem. We nemen binnen 24 uur contact met u op.',
      },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (q: string) => {
    setOpenQuestions(prev => 
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    )
  }

  const filteredFAQ = FAQ.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Terug naar dashboard</span>
            </Link>
            <Logo size="sm" variant="light" href="/" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#93b9e6] flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Hoe kunnen we helpen?</h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Vind antwoorden op veelgestelde vragen of neem contact met ons op.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Zoek in de veelgestelde vragen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/10 text-white placeholder-white/30 focus:border-[#93b9e6] focus:outline-none transition-colors text-lg"
          />
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-1 mb-12">
          {[
            { icon: Book, label: 'Handleidingen', href: '#' },
            { icon: MessageCircle, label: 'Live chat', href: '#' },
            { icon: Phone, label: 'Bel ons', href: 'tel:+31701234567' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 p-4 bg-slate-900 border border-white/10 hover:bg-slate-800 hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-[#93b9e6] transition-colors">
                <item.icon className="w-6 h-6 text-white/50 group-hover:text-slate-900 transition-colors" />
              </div>
              <span className="font-black text-white uppercase tracking-wider text-sm">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-white/20 ml-auto" />
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          {filteredFAQ.map((category) => (
            <div key={category.category}>
              <h2 className="text-sm font-black text-[#93b9e6] uppercase tracking-wider mb-4">{category.category}</h2>
              <div className="bg-slate-900 border border-white/10">
                {category.questions.map((item, index) => (
                  <div key={item.q} className={index > 0 ? 'border-t border-white/5' : ''}>
                    <button
                      onClick={() => toggleQuestion(item.q)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-bold text-white text-sm">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${openQuestions.includes(item.q) ? 'rotate-180' : ''}`} />
                    </button>
                    {openQuestions.includes(item.q) && (
                      <div className="px-4 pb-4">
                        <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-[#93b9e6] p-8">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Nog vragen?</h2>
          <p className="text-slate-900/60 mb-6">Ons team staat voor u klaar</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="tel:+31701234567"
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-5 h-5" />
              070 - 123 45 67
            </a>
            <a
              href="mailto:support@helder.nl"
              className="flex items-center gap-2 px-6 py-3 bg-transparent text-slate-900 font-black uppercase tracking-wider border-2 border-slate-900/30 hover:border-slate-900 transition-colors"
            >
              <Mail className="w-5 h-5" />
              support@helder.nl
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
