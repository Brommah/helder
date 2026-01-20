'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { MapPin, Phone, Mail } from 'lucide-react'

interface FooterProps {
  variant?: 'full' | 'minimal'
}

export function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className="py-8 bg-slate-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-white/30">© 2026 HELDER WONINGBOUW</p>
            <div className="flex items-center gap-6 text-sm text-white/30">
              <Link href="/privacy" className="hover:text-[#93b9e6] transition-colors">Privacy</Link>
              <Link href="/voorwaarden" className="hover:text-[#93b9e6] transition-colors">Voorwaarden</Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="py-16 bg-slate-900">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-white/30 text-sm mb-4">
              Sinds 1956 bouwen wij dromen met complete transparantie.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/20">
              <MapPin className="w-4 h-4" />
              <span>Groothertoginnelaan 33, Den Haag</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-sm">Diensten</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/assessment" className="hover:text-[#93b9e6] transition-colors">Bouw assessment</Link></li>
              <li><Link href="/calculator" className="hover:text-[#93b9e6] transition-colors">Budget calculator</Link></li>
              <li><Link href="/woningpaspoort" className="hover:text-[#93b9e6] transition-colors">Woningpaspoort</Link></li>
              <li><Link href="/ai-intelligence" className="hover:text-[#93b9e6] transition-colors">AI Intelligence</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-sm">Bedrijf</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/about" className="hover:text-[#93b9e6] transition-colors">Over ons</Link></li>
              <li><Link href="/contact" className="hover:text-[#93b9e6] transition-colors">Contact</Link></li>
              <li><a href="mailto:vacatures@helder.nl" className="hover:text-[#93b9e6] transition-colors">Vacatures</a></li>
              <li><Link href="/internal" className="hover:text-[#93b9e6] transition-colors">Interne docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <a href="tel:+31701234567" className="hover:text-[#93b9e6] transition-colors">070 - 123 45 67</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@helder.nl" className="hover:text-[#93b9e6] transition-colors">info@helder.nl</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2026 HELDER WONINGBOUW
          </p>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-[#93b9e6] transition-colors">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-[#93b9e6] transition-colors">Voorwaarden</Link>
            <Link href="/cookies" className="hover:text-[#93b9e6] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer as SharedFooter }
