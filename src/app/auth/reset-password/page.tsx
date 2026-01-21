'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import {
  Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2, 
  AlertCircle, Loader2, Eye, EyeOff
} from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<'request' | 'reset'>(token ? 'reset' : 'request')

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (success && step === 'request') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-emerald-100 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
          E-MAIL VERZONDEN
        </h2>
        <p className="text-slate-500 mb-8">
          Als er een account bestaat met dit e-mailadres, ontvangt u binnen enkele 
          minuten een link om uw wachtwoord te resetten.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-[#93b9e6] hover:text-slate-900 font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar login
        </Link>
      </div>
    )
  }

  if (success && step === 'reset') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-emerald-100 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
          WACHTWOORD GEWIJZIGD
        </h2>
        <p className="text-slate-500 mb-8">
          Uw wachtwoord is succesvol gewijzigd. U wordt doorgestuurd naar de login pagina...
        </p>
        <Loader2 className="w-6 h-6 animate-spin text-[#93b9e6] mx-auto" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center justify-center mb-12">
        <Logo size="lg" href="/" />
      </div>

      <div className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
          {step === 'request' ? 'WACHTWOORD' : 'NIEUW'}
          <br />
          <span className="text-[#93b9e6]">{step === 'request' ? 'VERGETEN' : 'WACHTWOORD'}</span>
        </h2>
        <p className="text-slate-500 font-medium">
          {step === 'request'
            ? 'Vul uw e-mailadres in om een reset link te ontvangen'
            : 'Kies een nieuw wachtwoord voor uw account'}
        </p>
      </div>

      <form onSubmit={step === 'request' ? handleRequestReset : handleResetPassword} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {step === 'request' ? (
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
        ) : (
          <>
            <div>
              <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
                Nieuw wachtwoord
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                  required
                  minLength={8}
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

            <div>
              <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
                Bevestig wachtwoord
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Herhaal wachtwoord"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>BEZIG...</span>
            </>
          ) : (
            <>
              <span>{step === 'request' ? 'VERSTUUR LINK' : 'WACHTWOORD WIJZIGEN'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar login
        </Link>
      </div>
    </div>
  )
}

function ResetPasswordFallback() {
  return (
    <div className="w-full max-w-md flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#93b9e6]" />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
