'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield,
  CheckCircle2, Sparkles, ChevronRight, AlertCircle, Loader2,
  Home, HardHat, UserCog
} from 'lucide-react'

// Quick login accounts for development
const QUICK_LOGINS = [
  { 
    role: 'Eigenaar', 
    email: 'completed@helder.nl', 
    password: 'Demo1234!',
    icon: Home, 
    color: 'bg-emerald-500',
    redirect: '/dashboard'
  },
  { 
    role: 'Bouwer', 
    email: 'builder@woningpaspoort.nl', 
    password: 'Demo1234!',
    icon: HardHat, 
    color: 'bg-amber-500',
    redirect: '/builder/dashboard'
  },
  { 
    role: 'Admin', 
    email: 'admin@woningpaspoort.nl', 
    password: 'Demo1234!',
    icon: UserCog, 
    color: 'bg-violet-500',
    redirect: '/dashboard'
  },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push(callbackUrl as '/dashboard')
        router.refresh()
      }
    } catch {
      setError('Er is iets misgegaan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (account: typeof QUICK_LOGINS[0]) => {
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: account.email,
        password: account.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push(account.redirect)
        router.refresh()
      }
    } catch {
      setError('Er is iets misgegaan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center justify-center mb-12">
        <Logo size="lg" href="/" />
      </div>

      <div className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
          WELKOM
          <br />
          <span className="text-[#93b9e6]">TERUG</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Log in om uw woningpaspoort te bekijken
        </p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
            E-mailadres
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="u@voorbeeld.nl"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
            Wachtwoord
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Uw wachtwoord"
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 border-2 border-slate-300 text-[#93b9e6] focus:ring-[#93b9e6]/20"
            />
            <span className="text-sm text-slate-600 font-medium">Onthoud mij</span>
          </label>
                        <Link
                          href="/auth/reset-password"
                          className="text-sm font-bold text-[#93b9e6] hover:text-slate-900 transition-colors uppercase tracking-wide"
                        >
                          Vergeten?
                        </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>INLOGGEN...</span>
            </>
          ) : (
            <>
              <span>INLOGGEN</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Sign up link */}
      <p className="text-center mt-8 text-slate-500 font-medium">
        Nog geen account?{' '}
        <Link
          href="/auth/register"
          className="font-black text-slate-900 hover:text-[#93b9e6] transition-colors uppercase"
        >
          Registreer
        </Link>
      </p>

      {/* Quick Login for Development */}
      <div className="mt-8 p-6 bg-slate-50 border-l-4 border-[#93b9e6]">
        <div className="flex items-center gap-2 text-slate-900 mb-3">
          <Sparkles className="w-4 h-4 text-[#93b9e6]" />
          <span className="font-black text-sm uppercase tracking-wider">Snelle toegang</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Log direct in als een van de demo accounts
        </p>
        <div className="flex gap-2">
          {QUICK_LOGINS.map((account) => {
            const Icon = account.icon
            return (
              <button
                key={account.email}
                onClick={() => handleQuickLogin(account)}
                disabled={isLoading}
                className={`group flex items-center gap-2 px-4 py-2.5 ${account.color} text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50`}
                title={`Login als ${account.role}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{account.role}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Link
            href="/share/demo"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#93b9e6] hover:text-slate-900 transition-colors uppercase tracking-wide"
          >
            Of bekijk demo zonder login
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#93b9e6]" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Decorative accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#93b9e6]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#93b9e6]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Logo size="lg" href="/" />

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.9] mb-6">
                HET COMPLETE
                <br />
                <span className="text-[#93b9e6]">DNA</span> VAN
                <br />
                UW WONING
              </h1>
              <p className="text-white/50 text-lg max-w-md">
                Veilig, transparant en altijd toegankelijk. Uw digitale woningpaspoort
                met cryptografische verificatie.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                'Alle documenten op één plek',
                'Onveranderbaar vastgelegd',
                'Veilig delen met derden',
                'Realtime bouwvoortgang',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#93b9e6] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  </div>
                  <span className="text-white/70 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-white/30 text-sm font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>End-to-end encryptie</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
