'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { ArrowRight, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/#werkwijze', label: 'Werkwijze', isHash: true },
  { href: '/woningpaspoort', label: 'Woningpaspoort', isHash: false },
  { href: '/ai-intelligence', label: 'AI', isHash: false },
] as const

interface NavigationProps {
  variant?: 'default' | 'transparent' | 'solid'
}

export function Navigation({ variant = 'default' }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (variant === 'solid') {
      setScrolled(true)
      return
    }
    
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [variant])

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || variant === 'solid' 
          ? 'bg-white/95 backdrop-blur-xl shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Logo size="lg" />

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                link.isHash ? (
                  <a 
                    key={link.href}
                    href={link.href} 
                    className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.href}
                    href={link.href as '/woningpaspoort' | '/ai-intelligence'} 
                    className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                      isActive(link.href)
                        ? 'text-[#93b9e6] border-b-2 border-[#93b9e6]'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/auth/login" 
                className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                Login
              </Link>
              <Link 
                href="/assessment" 
                className="group px-6 py-3 bg-slate-900 text-white text-sm font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-colors"
              >
                <span className="flex items-center gap-2">
                  Start
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          <div className="fixed top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl">
            <div className="px-6 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                link.isHash ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href as '/woningpaspoort' | '/ai-intelligence'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 font-bold uppercase tracking-wider transition-colors ${
                      isActive(link.href)
                        ? 'text-[#93b9e6]'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
