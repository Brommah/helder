'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Zap, X, Check, ClipboardCheck, MessageSquare, Camera, FileText,
  Plus, Loader2, CheckCircle, AlertCircle, Command
} from 'lucide-react'

// Action definitions
interface QuickAction {
  id: string
  icon: React.ElementType
  label: string
  shortcut?: string
  description: string
  contextPages?: string[] // Pages where this action is prominently shown
  action: () => void | Promise<void>
}

interface ToastState {
  show: boolean
  type: 'success' | 'error' | 'loading'
  message: string
}

// Demo project ID - in production this would come from context
const DEMO_PROJECT_ID = 'demo-project-1'

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' })
  const pathname = usePathname()
  const router = useRouter()

  // Show toast notification
  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ show: true, type, message })
    if (type !== 'loading') {
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
    }
  }, [])

  // Action handlers
  const handleResolveIssue = useCallback(async () => {
    // This would typically work with a selected issue from context
    // For now, show a message to select an issue first
    if (!pathname.includes('/issues')) {
      router.push('/dashboard/issues')
      showToast('success', 'Ga naar Problemen om een issue op te lossen')
      return
    }

    // In real implementation, would resolve the selected/first open issue
    try {
      setIsLoading('resolve')
      showToast('loading', 'Issue wordt opgelost...')

      const res = await fetch('/api/actions/resolve-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: DEMO_PROJECT_ID }),
      })

      if (!res.ok) throw new Error('Failed to resolve issue')
      const data = await res.json()

      showToast('success', data.message || 'Issue opgelost!')
      setIsOpen(false)
      // Refresh the page to show updated state
      router.refresh()
    } catch (error) {
      showToast('error', 'Kon issue niet oplossen')
    } finally {
      setIsLoading(null)
    }
  }, [pathname, router, showToast])

  const handleRequestInspection = useCallback(async () => {
    try {
      setIsLoading('inspection')
      showToast('loading', 'Keuring wordt aangevraagd...')

      const res = await fetch('/api/actions/request-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: DEMO_PROJECT_ID,
          type: 'general',
        }),
      })

      if (!res.ok) throw new Error('Failed to request inspection')
      const data = await res.json()

      showToast('success', data.message || 'Keuring aangevraagd!')
      setIsOpen(false)
    } catch (error) {
      showToast('error', 'Kon keuring niet aanvragen')
    } finally {
      setIsLoading(null)
    }
  }, [showToast])

  const handleNotifyOwner = useCallback(async () => {
    try {
      setIsLoading('notify')
      showToast('loading', 'Bericht wordt verzonden...')

      const res = await fetch('/api/actions/notify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: DEMO_PROJECT_ID,
          type: 'progress_update',
        }),
      })

      if (!res.ok) throw new Error('Failed to notify owner')
      const data = await res.json()

      showToast('success', data.message || 'Eigenaar op de hoogte gebracht!')
      setIsOpen(false)
    } catch (error) {
      showToast('error', 'Kon bericht niet verzenden')
    } finally {
      setIsLoading(null)
    }
  }, [showToast])

  const handleUploadPhoto = useCallback(() => {
    // Navigate to documents page with upload modal open
    if (pathname.includes('/documents')) {
      // If already on documents, trigger modal via URL param
      window.dispatchEvent(new CustomEvent('open-upload-modal'))
    } else {
      router.push('/dashboard/documents?upload=true')
    }
    setIsOpen(false)
    showToast('success', 'Upload foto via de documenten pagina')
  }, [pathname, router, showToast])

  const handleAddNote = useCallback(() => {
    // Navigate to timeline for adding milestone/note
    if (!pathname.includes('/timeline')) {
      router.push('/dashboard/timeline')
    }
    setIsOpen(false)
    showToast('success', 'Voeg een notitie toe aan de tijdlijn')
  }, [pathname, router, showToast])

  // All available actions
  const actions: QuickAction[] = [
    {
      id: 'resolve',
      icon: Check,
      label: 'Markeer opgelost',
      shortcut: 'R',
      description: 'Markeer een issue als opgelost',
      contextPages: ['/dashboard/issues'],
      action: handleResolveIssue,
    },
    {
      id: 'inspection',
      icon: ClipboardCheck,
      label: 'Vraag keuring aan',
      shortcut: 'I',
      description: 'Vraag een keuring aan voor het project',
      action: handleRequestInspection,
    },
    {
      id: 'notify',
      icon: MessageSquare,
      label: 'Stuur naar eigenaar',
      shortcut: 'S',
      description: 'Stuur update naar de huiseigenaar',
      action: handleNotifyOwner,
    },
    {
      id: 'upload',
      icon: Camera,
      label: 'Upload foto',
      shortcut: 'U',
      description: 'Voeg snel een foto toe',
      contextPages: ['/dashboard/documents'],
      action: handleUploadPhoto,
    },
    {
      id: 'note',
      icon: FileText,
      label: 'Notitie toevoegen',
      shortcut: 'N',
      description: 'Voeg een notitie of mijlpaal toe',
      contextPages: ['/dashboard/timeline'],
      action: handleAddNote,
    },
  ]

  // Sort actions by context relevance
  const sortedActions = [...actions].sort((a, b) => {
    const aRelevant = a.contextPages?.some(p => pathname.includes(p)) ? 1 : 0
    const bRelevant = b.contextPages?.some(p => pathname.includes(p)) ? 1 : 0
    return bRelevant - aRelevant
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle menu
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        return
      }

      // Only handle shortcuts when menu is open
      if (!isOpen) return

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }

      // Action shortcuts
      const key = e.key.toUpperCase()
      const action = actions.find(a => a.shortcut === key)
      if (action && !isLoading) {
        e.preventDefault()
        action.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, actions, isLoading])

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
          isOpen
            ? 'bg-slate-900 rotate-45'
            : 'bg-[#1a1a2e] hover:bg-[#93b9e6] hover:text-slate-900'
        }`}
        title="Snelle acties (Cmd+K)"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Zap className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Actions Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Card */}
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-white shadow-2xl border border-slate-200 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#93b9e6]" />
                <span className="text-xs font-black uppercase tracking-wider">Snelle Acties</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/50 font-bold">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Actions List */}
            <div className="py-2">
              {sortedActions.map((action) => {
                const isContextRelevant = action.contextPages?.some(p => pathname.includes(p))
                const ActionIcon = action.icon
                const loading = isLoading === action.id

                return (
                  <button
                    key={action.id}
                    onClick={() => !loading && action.action()}
                    disabled={loading}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                      loading
                        ? 'bg-slate-50 cursor-wait'
                        : 'hover:bg-slate-50'
                    } ${isContextRelevant ? 'border-l-4 border-[#93b9e6]' : ''}`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      isContextRelevant ? 'bg-[#93b9e6]' : 'bg-slate-100'
                    }`}>
                      {loading ? (
                        <Loader2 className={`w-5 h-5 animate-spin ${isContextRelevant ? 'text-slate-900' : 'text-slate-500'}`} />
                      ) : (
                        <ActionIcon className={`w-5 h-5 ${isContextRelevant ? 'text-slate-900' : 'text-slate-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                    {action.shortcut && (
                      <div className="flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-500 text-xs font-black">
                        {action.shortcut}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
                Druk op letter voor snelle actie
              </p>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 shadow-lg animate-fade-in ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-slate-900 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {toast.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
          <span className="font-bold text-sm uppercase tracking-wider">{toast.message}</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default QuickActions
