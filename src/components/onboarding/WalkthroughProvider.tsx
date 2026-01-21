'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Step, CallBackProps, STATUS } from 'react-joyride'

// Dynamic import to avoid SSR issues
const Joyride = dynamic(() => import('react-joyride'), { ssr: false })

// ============================================
// Tour Step Definitions
// ============================================

export const HOMEOWNER_TOUR_STEPS: Step[] = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Welkom bij Helder
        </h3>
        <p className="text-slate-600">
          Uw digitale woningpaspoort bevat alle documenten, materialen en 
          garanties van uw woning. Laten we u rondleiden.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard-hero"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Uw Woning
        </h3>
        <p className="text-slate-600">
          Hier ziet u in één oogopslag de status van uw woning, inclusief 
          bouwfase, energielabel en verificatiestatus.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="nav-documents"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Documenten
        </h3>
        <p className="text-slate-600">
          Alle bouwtekeningen, vergunningen, facturen en garantiebewijzen 
          zijn hier veilig opgeslagen en blockchain-beveiligd.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="nav-timeline"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Tijdlijn
        </h3>
        <p className="text-slate-600">
          Volg de volledige bouwgeschiedenis van uw woning. Elke mijlpaal 
          wordt automatisch gedocumenteerd.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="nav-materials"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Materialen
        </h3>
        <p className="text-slate-600">
          Bekijk welke materialen in uw woning zijn verwerkt, inclusief 
          merken, specificaties en garantietermijnen.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="nav-ai"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          AI Assistent
        </h3>
        <p className="text-slate-600">
          Stel vragen over uw woning, krijg onderhoudstips en ontvang 
          slimme aanbevelingen van onze AI.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="nav-share"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Delen
        </h3>
        <p className="text-slate-600">
          Deel uw woningpaspoort veilig met makelaars, kopers of 
          onderhoudsbedrijven via een beveiligde link.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Klaar om te starten!
        </h3>
        <p className="text-slate-600">
          U kunt deze rondleiding altijd opnieuw starten via Instellingen. 
          Veel plezier met uw digitale woningpaspoort!
        </p>
      </div>
    ),
    placement: 'center',
  },
]

export const BUILDER_TOUR_STEPS: Step[] = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Welkom bij Builder Portal
        </h3>
        <p className="text-slate-600">
          Beheer al uw bouwprojecten, documenteer met WhatsApp en 
          lever digitale woningpaspoorten af aan uw klanten.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="builder-stats"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Dashboard Overzicht
        </h3>
        <p className="text-slate-600">
          Zie direct hoeveel projecten actief zijn, hoeveel foto&apos;s er 
          deze week zijn toegevoegd en wat de gemiddelde kwaliteitsscore is.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="builder-projects"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Projecten
        </h3>
        <p className="text-slate-600">
          Alle lopende en afgeronde projecten. Klik op een project voor 
          details, foto&apos;s en voortgang.
        </p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="builder-whatsapp"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          WhatsApp Integratie
        </h3>
        <p className="text-slate-600">
          Koppel uw WhatsApp-nummer en stuur bouwfoto&apos;s direct naar 
          het project. Onze AI classificeert ze automatisch.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="builder-activity"]',
    content: (
      <div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Recente Activiteit
        </h3>
        <p className="text-slate-600">
          Volg in real-time wat er gebeurt: nieuwe foto&apos;s, 
          gedetecteerde issues en fase-wijzigingen.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
          Aan de slag!
        </h3>
        <p className="text-slate-600">
          Start met het toevoegen van foto&apos;s via WhatsApp of upload 
          documenten direct in een project. Succes!
        </p>
      </div>
    ),
    placement: 'center',
  },
]

// ============================================
// Context and Provider
// ============================================

interface WalkthroughContextType {
  startTour: (tourType: 'homeowner' | 'builder') => void
  endTour: () => void
  isRunning: boolean
}

const WalkthroughContext = createContext<WalkthroughContextType | null>(null)

export function useWalkthrough() {
  const context = useContext(WalkthroughContext)
  if (!context) {
    throw new Error('useWalkthrough must be used within WalkthroughProvider')
  }
  return context
}

interface WalkthroughProviderProps {
  children: React.ReactNode
}

export function WalkthroughProvider({ children }: WalkthroughProviderProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [stepIndex, setStepIndex] = useState(0)

  // Check if user has seen the tour
  useEffect(() => {
    const hasSeenHomeownerTour = localStorage.getItem('helder-homeowner-tour-complete')
    const hasSeenBuilderTour = localStorage.getItem('helder-builder-tour-complete')
    
    // Auto-start tour for new users based on current path
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path.startsWith('/dashboard') && !hasSeenHomeownerTour) {
        // Delay to let the page render
        setTimeout(() => startTour('homeowner'), 1000)
      } else if (path.startsWith('/builder') && !hasSeenBuilderTour) {
        setTimeout(() => startTour('builder'), 1000)
      }
    }
  }, [])

  const startTour = useCallback((tourType: 'homeowner' | 'builder') => {
    const tourSteps = tourType === 'homeowner' ? HOMEOWNER_TOUR_STEPS : BUILDER_TOUR_STEPS
    setSteps(tourSteps)
    setStepIndex(0)
    setIsRunning(true)
  }, [])

  const endTour = useCallback(() => {
    setIsRunning(false)
    setStepIndex(0)
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data
    const finishedStatuses: string[] = ['finished', 'skipped']

    if (finishedStatuses.includes(status as string)) {
      // Mark tour as complete
      const tourKey = steps === HOMEOWNER_TOUR_STEPS 
        ? 'helder-homeowner-tour-complete' 
        : 'helder-builder-tour-complete'
      localStorage.setItem(tourKey, 'true')
      endTour()
    }

    if (type === 'step:after') {
      setStepIndex(index + 1)
    }
  }

  return (
    <WalkthroughContext.Provider value={{ startTour, endTour, isRunning }}>
      {children}
      {isRunning && (
        <Joyride
          steps={steps}
          stepIndex={stepIndex}
          run={isRunning}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#93b9e6',
              textColor: '#1e293b',
              backgroundColor: '#ffffff',
              arrowColor: '#ffffff',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
            },
            tooltip: {
              borderRadius: 0,
              padding: '24px',
            },
            tooltipContainer: {
              textAlign: 'left',
            },
            tooltipTitle: {
              fontSize: '14px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
            tooltipContent: {
              fontSize: '14px',
              padding: '8px 0',
            },
            buttonNext: {
              backgroundColor: '#1e293b',
              borderRadius: 0,
              fontSize: '12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '12px 24px',
            },
            buttonBack: {
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
            buttonSkip: {
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 600,
            },
            spotlight: {
              borderRadius: 0,
            },
          }}
          locale={{
            back: 'Terug',
            close: 'Sluiten',
            last: 'Klaar',
            next: 'Volgende',
            skip: 'Overslaan',
          }}
        />
      )}
    </WalkthroughContext.Provider>
  )
}
