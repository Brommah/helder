'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from '@/components/ui/logo'
import {
  Home, Clock, FileText, Package, Share2, Settings, LogOut,
  Menu, X, ChevronRight, Bell, Shield, HelpCircle, Sparkles, Loader2, Euro, Brain, Lock, HardHat
} from 'lucide-react'

// Property context to share property data across dashboard
interface PropertyData {
  id: string
  name: string
  city: string
  status: 'ACTIVE' | 'UNDER_CONSTRUCTION' | 'RENOVATION' | string
  progress: number
  currentPhase?: string
  isCompleted: boolean
}

const PropertyContext = createContext<PropertyData | null>(null)
export const useProperty = () => useContext(PropertyContext)

// Mock property data based on user email
// In production, this would come from an API call
function getPropertyDataForUser(email?: string | null): PropertyData {
  if (email === 'completed@helder.nl') {
    return {
      id: 'property-completed-1',
      name: 'Villa Zonneweide',
      city: 'Almere Haven',
      status: 'ACTIVE',
      progress: 100,
      isCompleted: true,
    }
  }
  if (email === 'building@helder.nl') {
    return {
      id: 'property-building-1',
      name: 'Kavel 24 - De Buitenplaats',
      city: 'Almere Poort',
      status: 'UNDER_CONSTRUCTION',
      progress: 65,
      currentPhase: 'Gevel & Dak',
      isCompleted: false,
    }
  }
  // Default for other users (legacy demo)
  return {
    id: 'demo-property-1',
    name: 'Villa Zonneweide',
    city: 'Amsterdam',
    status: 'ACTIVE',
    progress: 100,
    isCompleted: true,
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [property, setProperty] = useState<PropertyData | null>(null)

  // Get property data when session loads
  useEffect(() => {
    if (session?.user?.email) {
      setProperty(getPropertyDataForUser(session.user.email))
    }
  }, [session?.user?.email])

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  // Navigation items - AI is conditionally enabled
  const navigation = [
    { href: '/dashboard' as const, icon: Home, label: 'OVERZICHT', exact: true },
    { 
      href: '/dashboard/ai' as const, 
      icon: Brain, 
      label: 'AI INTELLIGENCE', 
      badge: property?.isCompleted ? 'LIVE' : undefined,
      disabled: !property?.isCompleted,
    },
    { href: '/dashboard/timeline' as const, icon: Clock, label: 'TIJDLIJN' },
    { href: '/dashboard/documents' as const, icon: FileText, label: 'DOCUMENTEN' },
    { href: '/dashboard/costs' as const, icon: Euro, label: 'KOSTEN' },
    { href: '/dashboard/share' as const, icon: Share2, label: 'DELEN' },
  ]

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#93b9e6] mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Laden...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/login?callbackUrl=/dashboard')
    return null
  }

  const userInitials = session?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `linear-gradient(#93b9e6 1px, transparent 1px), linear-gradient(90deg, #93b9e6 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          
          <Logo size="sm" href="/dashboard" />

          <button className="p-2 hover:bg-slate-100 transition-colors relative">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#93b9e6]" />
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900
        transform transition-transform duration-300 ease-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Logo size="md" href="/dashboard" />
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>
          </div>

          {/* Property Card */}
          <div className="p-4">
            {property?.isCompleted ? (
              // Completed property card - green
              <div className="bg-emerald-500 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                    <Home className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase">{property.name}</p>
                    <p className="text-xs text-slate-900/60 font-medium">{property.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-900/20 overflow-hidden">
                    <div className="h-full w-full bg-slate-900" />
                  </div>
                  <span className="text-xs font-black text-slate-900">100%</span>
                </div>
                <p className="text-[10px] text-slate-900/50 mt-2 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Opgeleverd • AI actief
                </p>
              </div>
            ) : (
              // Under construction card - blue
              <div className="bg-[#93b9e6] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                    <HardHat className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase">{property?.name || 'Laden...'}</p>
                    <p className="text-xs text-slate-900/60 font-medium">{property?.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-900/20 overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 transition-all" 
                      style={{ width: `${property?.progress || 0}%` }} 
                    />
                  </div>
                  <span className="text-xs font-black text-slate-900">{property?.progress || 0}%</span>
                </div>
                <p className="text-[10px] text-slate-900/50 mt-2 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  In aanbouw • {property?.currentPhase}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href, item.exact)
                const isDisabled = 'disabled' in item && item.disabled
                
                if (isDisabled) {
                  // Disabled navigation item (greyed out)
                  return (
                    <div
                      key={item.href}
                      className="group flex items-center gap-3 px-4 py-3 font-bold text-sm tracking-wider text-white/20 cursor-not-allowed"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-white/10 text-white/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        NA OPLEVERING
                      </span>
                    </div>
                  )
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 font-bold text-sm tracking-wider transition-all duration-200
                      ${active 
                        ? 'bg-[#93b9e6] text-slate-900' 
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
                    <span className="flex-1">{item.label}</span>
                    {'badge' in item && item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        active ? 'bg-slate-900 text-[#93b9e6]' : 'bg-emerald-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {active && !('badge' in item) && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">
                Overig
              </p>
              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors font-bold text-sm tracking-wider"
                >
                  <Settings className="w-5 h-5" />
                  <span>INSTELLINGEN</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-3 px-4 py-3 text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors font-bold text-sm tracking-wider"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>HELP</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 bg-[#93b9e6] flex items-center justify-center text-slate-900 font-black text-sm">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-white text-sm truncate">{session?.user?.name || 'Gebruiker'}</p>
                <p className="text-xs text-white/40 truncate uppercase tracking-wider">Eigenaar</p>
              </div>
              <LogOut className="w-5 h-5 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen relative">
        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between px-8 h-20 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#93b9e6]">
              <Shield className="w-4 h-4 text-slate-900" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Blockchain Verified</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-slate-100 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#93b9e6]" />
            </button>
            <div className="w-px h-8 bg-slate-200" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-2 hover:bg-slate-100 transition-colors"
            >
              <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                {userInitials}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        <PropertyContext.Provider value={property}>
          {children}
        </PropertyContext.Provider>
      </main>
    </div>
  )
}
