'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/footer'
import { 
  Calendar, Clock, Video, ArrowRight, ArrowLeft, Check,
  Building2, Coffee, Home
} from 'lucide-react'

type Step = 'type' | 'time' | 'details' | 'confirm'

interface BookingData {
  consultationType: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  message: string
}

const CONSULTATION_TYPES = [
  {
    id: 'discovery',
    title: 'KENNISMAKING',
    subtitle: 'Vrijblijvend gesprek',
    duration: '30 min',
    price: 'Gratis',
    icon: Coffee,
    description: 'Maak kennis met Helder en ontdek of we bij u passen',
    features: ['Uw wensen bespreken', 'Proces uitleg', 'Eerste advies'],
  },
  {
    id: 'assessment',
    title: 'BOUWADVIES',
    subtitle: 'Uitgebreide intake',
    duration: '60 min',
    price: '€95',
    icon: Home,
    description: 'Diepgaand gesprek over uw bouwplannen en mogelijkheden',
    features: ['Budget analyse', 'Haalbaarheidscheck', 'Planning advies', 'Kavel tips'],
  },
  {
    id: 'design',
    title: 'ONTWERPGESPREK',
    subtitle: 'Voor wie al een kavel heeft',
    duration: '90 min',
    price: '€195',
    icon: Building2,
    description: 'Start met het ontwerp van uw droomhuis',
    features: ['Kavelbeoordeling', 'Wensen analyse', 'Stijl bepaling', 'Volgende stappen'],
  },
]

const TIME_SLOTS = [
  { date: '2026-01-22', day: 'Woensdag', times: ['09:00', '10:00', '14:00', '15:30'] },
  { date: '2026-01-23', day: 'Donderdag', times: ['09:30', '11:00', '14:00', '16:00'] },
  { date: '2026-01-24', day: 'Vrijdag', times: ['09:00', '10:30', '13:00'] },
  { date: '2026-01-27', day: 'Maandag', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-01-28', day: 'Dinsdag', times: ['09:30', '11:00', '14:30', '16:00'] },
]

export default function ConsultationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('type')
  const [booking, setBooking] = useState<BookingData>({
    consultationType: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const steps: Step[] = ['type', 'time', 'details', 'confirm']
  const currentIndex = steps.indexOf(currentStep)

  const updateBooking = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    setBooking(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    const next = currentIndex + 1
    if (next < steps.length) {
      setCurrentStep(steps[next])
    }
  }

  const prevStep = () => {
    const prev = currentIndex - 1
    if (prev >= 0) {
      setCurrentStep(steps[prev])
    }
  }

  const selectedType = CONSULTATION_TYPES.find(t => t.id === booking.consultationType)
  const selectedSlot = TIME_SLOTS.find(s => s.date === booking.date)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `linear-gradient(#93b9e6 1px, transparent 1px), linear-gradient(90deg, #93b9e6 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 relative">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />

          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${
                  i <= currentIndex
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {i < currentIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${
                    i < currentIndex ? 'bg-slate-900' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Link 
            href="/assessment" 
            className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
          >
            Doe de test
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 relative">
        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          {currentStep === 'type' && (
            <TypeStep 
              booking={booking} 
              updateBooking={updateBooking}
              onNext={nextStep}
            />
          )}
          {currentStep === 'time' && (
            <TimeStep 
              booking={booking} 
              updateBooking={updateBooking}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 'details' && (
            <DetailsStep 
              booking={booking} 
              updateBooking={updateBooking}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 'confirm' && (
            <ConfirmStep 
              booking={booking}
              selectedType={selectedType}
              selectedSlot={selectedSlot}
            />
          )}
        </div>
      </main>

      {currentStep === 'confirm' && <Footer variant="minimal" />}
    </div>
  )
}

function TypeStep({ 
  booking, 
  updateBooking, 
  onNext 
}: { 
  booking: BookingData
  updateBooking: <K extends keyof BookingData>(key: K, value: BookingData[K]) => void
  onNext: () => void
}) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-2 h-2 bg-[#93b9e6]" />
          <span className="text-[#93b9e6] text-[10px] font-black uppercase tracking-[0.3em]">Plan een gesprek</span>
        </div>
        <h1 className="text-[2.5rem] lg:text-[4rem] font-black text-slate-900 leading-[0.9] tracking-[-0.02em] mb-6">
          WELK GESPREK
          <br />
          <span className="text-[#93b9e6]">PAST BIJ U?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Kies het type gesprek dat het beste aansluit bij waar u nu staat in uw bouwproces.
        </p>
      </div>

      <div className="space-y-px bg-slate-200 mb-8">
        {CONSULTATION_TYPES.map((type) => {
          const Icon = type.icon
          const isSelected = booking.consultationType === type.id
          return (
            <button
              key={type.id}
              onClick={() => {
                updateBooking('consultationType', type.id)
              }}
              className={`w-full p-6 lg:p-8 text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-[#93b9e6]'
                  : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-4 lg:gap-6">
                <div className={`w-14 h-14 flex items-center justify-center transition-colors flex-shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className={`text-xl font-black tracking-wider ${
                      isSelected ? 'text-slate-900' : 'text-slate-900'
                    }`}>{type.title}</h3>
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      isSelected
                        ? 'bg-slate-900/20 text-slate-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {type.duration}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      type.price === 'Gratis' 
                        ? isSelected ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white'
                        : isSelected ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {type.price}
                    </span>
                  </div>
                  <p className={`mb-4 ${isSelected ? 'text-slate-900/70' : 'text-slate-500'}`}>
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.features.map((feature, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1.5 text-xs font-bold ${
                          isSelected
                            ? 'bg-white/50 text-slate-900'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!booking.consultationType}
        className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-[#93b9e6] hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Kies datum en tijd
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function TimeStep({ 
  booking, 
  updateBooking, 
  onNext,
  onPrev 
}: { 
  booking: BookingData
  updateBooking: <K extends keyof BookingData>(key: K, value: BookingData[K]) => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onPrev}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-black uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug
      </button>

      <div className="text-center mb-12">
        <h2 className="text-[2.5rem] lg:text-[4rem] font-black text-slate-900 leading-[0.9] tracking-[-0.02em] mb-4">
          KIES EEN
          <br />
          <span className="text-[#93b9e6]">MOMENT</span>
        </h2>
        <p className="text-slate-500">
          Alle tijden zijn in lokale tijd (Amsterdam)
        </p>
      </div>

      <div className="space-y-px bg-slate-200 mb-8">
        {TIME_SLOTS.map((slot) => (
          <div key={slot.date} className="bg-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#93b9e6]" />
              </div>
              <div>
                <p className="font-black text-slate-900 uppercase tracking-wider">{slot.day}</p>
                <p className="text-sm text-slate-400">
                  {new Date(slot.date).toLocaleDateString('nl-NL', { 
                    day: 'numeric', month: 'long' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {slot.times.map((time) => {
                const isSelected = booking.date === slot.date && booking.time === time
                return (
                  <button
                    key={time}
                    onClick={() => {
                      updateBooking('date', slot.date)
                      updateBooking('time', time)
                    }}
                    className={`px-5 py-3 font-black text-sm transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-[#93b9e6] hover:text-slate-900'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!booking.date || !booking.time}
        className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-[#93b9e6] hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Vul uw gegevens in
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function DetailsStep({ 
  booking, 
  updateBooking, 
  onNext,
  onPrev 
}: { 
  booking: BookingData
  updateBooking: <K extends keyof BookingData>(key: K, value: BookingData[K]) => void
  onNext: () => void
  onPrev: () => void
}) {
  const canProceed = booking.name && booking.email && booking.phone

  return (
    <div className="animate-fade-in">
      <button
        onClick={onPrev}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-black uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug
      </button>

      <div className="text-center mb-12">
        <h2 className="text-[2.5rem] lg:text-[4rem] font-black text-slate-900 leading-[0.9] tracking-[-0.02em] mb-4">
          UW
          <br />
          <span className="text-[#93b9e6]">GEGEVENS</span>
        </h2>
        <p className="text-slate-500">
          We gebruiken deze alleen om contact met u op te nemen
        </p>
      </div>

      <div className="bg-white p-6 lg:p-8 space-y-6 mb-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Volledige naam
          </label>
          <input
            type="text"
            value={booking.name}
            onChange={(e) => updateBooking('name', e.target.value)}
            placeholder="Jan & Marie Janssen"
            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            E-mailadres
          </label>
          <input
            type="email"
            value={booking.email}
            onChange={(e) => updateBooking('email', e.target.value)}
            placeholder="jan@familie-janssen.nl"
            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Telefoonnummer
          </label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => updateBooking('phone', e.target.value)}
            placeholder="06 - 12 34 56 78"
            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Bericht (optioneel)
          </label>
          <textarea
            value={booking.message}
            onChange={(e) => updateBooking('message', e.target.value)}
            placeholder="Vertel ons alvast wat over uw plannen..."
            rows={4}
            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition-all resize-none text-slate-900 font-medium"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-[#93b9e6] hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Bevestig afspraak
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function ConfirmStep({ 
  booking,
  selectedType,
  selectedSlot
}: { 
  booking: BookingData
  selectedType: typeof CONSULTATION_TYPES[0] | undefined
  selectedSlot: typeof TIME_SLOTS[0] | undefined
}) {
  return (
    <div className="animate-fade-in text-center">
      <div className="w-20 h-20 bg-[#93b9e6] flex items-center justify-center mx-auto mb-8">
        <Check className="w-10 h-10 text-slate-900" />
      </div>

      <h2 className="text-[2.5rem] lg:text-[4rem] font-black text-slate-900 leading-[0.9] tracking-[-0.02em] mb-4">
        AFSPRAAK
        <br />
        <span className="text-[#93b9e6]">BEVESTIGD!</span>
      </h2>
      <p className="text-slate-500 mb-12">
        We hebben een bevestiging gestuurd naar {booking.email}
      </p>

      {/* Booking Summary */}
      <div className="bg-white p-6 lg:p-8 text-left mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Afspraak details</h3>
        
        <div className="space-y-px bg-slate-100">
          <div className="flex items-center gap-4 p-4 bg-white">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-slate-900">{selectedType?.title}</p>
              <p className="text-sm text-slate-400">{selectedType?.duration} • {selectedType?.price}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white">
            <div className="w-12 h-12 bg-[#93b9e6] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="font-black text-slate-900">
                {selectedSlot?.day}, {new Date(booking.date).toLocaleDateString('nl-NL', {
                  day: 'numeric', month: 'long'
                })}
              </p>
              <p className="text-sm text-slate-400">{booking.time} uur</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white">
            <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="font-black text-slate-900">Videogesprek</p>
              <p className="text-sm text-slate-400">Link volgt per email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-[#93b9e6] p-6 lg:p-8 text-left mb-8">
        <h3 className="text-[10px] font-black text-slate-900/50 uppercase tracking-[0.3em] mb-4">Voorbereiding</h3>
        <ul className="space-y-3 text-sm text-slate-900/70">
          <li className="flex items-start gap-3">
            <Check className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
            <span>Check uw email voor de bevestiging en videocall link</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
            <span>Denk na over uw wensen en vragen</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
            <span>Heeft u een kavel? Houd de gegevens bij de hand</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-px bg-slate-200">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-5 bg-white text-slate-900 text-sm font-black uppercase tracking-[0.15em] hover:bg-slate-50 transition-all"
        >
          Terug naar home
        </Link>
        <Link
          href="/calculator"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-5 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-[#93b9e6] hover:text-slate-900 transition-all"
        >
          Bereken budget
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
