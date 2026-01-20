'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import {
  Mail, Lock, User, Phone, ArrowRight, AlertCircle,
  Eye, EyeOff, Check, Shield, Loader2
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (formData.password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens zijn')
      return
    }

    if (!formData.acceptTerms) {
      setError('U moet de voorwaarden accepteren om door te gaan')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          acceptTerms: formData.acceptTerms,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registratie mislukt')
        return
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account aangemaakt, maar automatisch inloggen mislukt. Probeer handmatig in te loggen.')
      } else {
        router.push('/wizard')
        router.refresh()
      }
    } catch {
      setError('Er is iets misgegaan')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = () => {
    const { password } = formData
    if (password.length === 0) return null
    if (password.length < 8) return { label: 'Zwak', color: 'bg-red-500', width: '33%' }
    if (password.length < 12) return { label: 'Gemiddeld', color: 'bg-amber-500', width: '66%' }
    return { label: 'Sterk', color: 'bg-emerald-500', width: '100%' }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="p-6 bg-white border-b border-slate-200">
        <Logo size="md" href="/" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
              ACCOUNT
              <br />
              <span className="text-[#93b9e6]">AANMAKEN</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Start met uw digitale woningpaspoort
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
                Volledige naam
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jan van der Berg"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
                E-mailadres
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="uw@email.nl"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
                Telefoonnummer <span className="text-slate-400 font-normal">(optioneel)</span>
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12345678"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimaal 8 tekens"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
                Bevestig wachtwoord
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#93b9e6] transition-colors" />
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Herhaal uw wachtwoord"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-amber-900 font-black uppercase tracking-wider mb-2">
                    Beta versie
                  </p>
                  <p className="text-xs text-amber-700 mb-3">
                    Woningpaspoort is momenteel in beta. De documentatie en informatie in dit platform
                    is bedoeld ter ondersteuning en vervangt geen professioneel juridisch of bouwkundig advies.
                  </p>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 border-2 border-amber-400 mt-0.5"
                    />
                    <span className="text-sm text-amber-800 font-medium">
                      Ik begrijp dit en ga akkoord met de{' '}
                      <Link href="/voorwaarden" className="underline font-bold">algemene voorwaarden</Link>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.acceptTerms}
              className="group w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Aanmaken...</span>
                </>
              ) : (
                <>
                  <span>Account aanmaken</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Heeft u al een account?{' '}
            <Link
              href="/auth/login"
              className="font-black text-slate-900 hover:text-[#93b9e6] transition-colors uppercase"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
