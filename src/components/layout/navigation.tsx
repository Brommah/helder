'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { ArrowRight, Menu, X, Sparkles, Shield, Brain, Lock } from 'lucide-react'

const NAV_LINKS = [
  { href: '/#werkwijze', label: 'Werkwijze', isHash: true, icon: Sparkles },
  { href: '/woningpaspoort', label: 'Woningpaspoort', isHash: false, icon: Shield },
  { href: '/ai-intelligence', label: 'AI', isHash: false, icon: Brain },
] as const

interface NavigationProps {
  variant?: 'default' | 'transparent' | 'solid'
}

export function Navigation({ variant = 'default' }: NavigationProps) {
  // Start with scrolled=true to show solid bg initially, preventing flash
  const [scrolled, setScrolled] = useState(true)
  const [enableTransition, setEnableTransition] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Disable transitions during navigation
    setEnableTransition(false)
    
    if (variant === 'solid') {
      setScrolled(true)
      return
    }
    
    // Check scroll position immediately
    const currentScrolled = window.scrollY > 50
    setScrolled(currentScrolled)
    
    // Re-enable transitions after state has settled
    const timer = setTimeout(() => setEnableTransition(true), 50)
    
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [variant, pathname])

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  const showSolidBg = scrolled || variant === 'solid'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl ${
        enableTransition ? 'transition-shadow duration-300' : ''
      } ${
        showSolidBg ? 'shadow-sm' : 'shadow-none'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />

            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon
                return link.isHash ? (
                  <a 
                    key={link.href}
                    href={link.href} 
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.href}
                    href={link.href as '/woningpaspoort' | '/ai-intelligence'} 
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive(link.href)
                        ? 'text-[#93b9e6]'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/auth/login" 
                className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                <Lock className="w-4 h-4" />
                Login
              </Link>
              <Link 
                href="/assessment" 
                className="group px-5 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-colors"
              >
                <span className="flex items-center gap-2">
                  Start
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl">
            <div className="px-6 py-4 space-y-2">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon
                return link.isHash ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href as '/woningpaspoort' | '/ai-intelligence'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-3 px-4 font-bold uppercase tracking-wider transition-colors ${
                      isActive(link.href)
                        ? 'text-[#93b9e6]'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                <Lock className="w-4 h-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
