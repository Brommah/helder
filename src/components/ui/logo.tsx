'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Show text next to logo */
  showText?: boolean
  /** Show subtitle */
  showSubtitle?: boolean
  /** Subtitle text */
  subtitle?: string
  /** Dark mode (white text) */
  dark?: boolean
  /** Link destination (default: /, pass null for no link) */
  href?: Route | null
  /** Custom className */
  className?: string
}

const sizes = {
  sm: { logo: 80, height: 24 },
  md: { logo: 100, height: 32 },
  lg: { logo: 140, height: 40 },
  xl: { logo: 180, height: 48 },
}

export function Logo({
  size = 'md',
  showText = true,
  showSubtitle = false,
  subtitle = 'Woningpaspoort',
  dark = false,
  href = '/' as Route,
  className = '',
}: LogoProps) {
  const { logo, height } = sizes[size]

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/helder-logo.png"
        alt="Helder"
        width={logo}
        height={height}
        className="object-contain"
        style={{ height: `${height}px`, width: 'auto' }}
        priority
      />
      {showSubtitle && subtitle && (
        <span className={`text-sm ${dark ? 'text-white/60' : 'text-slate-400'}`}>
          {subtitle}
        </span>
      )}
    </div>
  )

  if (href !== null && href !== undefined) {
    return (
      <Link href={href} className="flex items-center group">
        {content}
      </Link>
    )
  }

  return content
}

/** Compact icon-only version of the logo */
export function LogoIcon({
  size = 32,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/images/helder-logo.png"
        alt="Helder"
        width={size * 2}
        height={size}
        className="object-contain object-left"
        style={{ height: `${size}px`, width: 'auto' }}
      />
    </div>
  )
}

export default Logo
