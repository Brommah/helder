import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/session-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import { WalkthroughProvider } from '@/components/onboarding/WalkthroughProvider'
import { KonamiCodeEasterEgg } from '@/components/fun/KonamiCode'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://helder.nl'),
  title: {
    default: 'Helder | Bouw uw droomhuis met complete transparantie',
    template: '%s | Helder',
  },
  description: 'Sinds 1956 bouwen wij droomhuizen met 100% transparantie. Elk materiaal, elke keuze, elk detail - gedocumenteerd in uw persoonlijke Woningpaspoort.',
  keywords: [
    'helder',
    'woningpaspoort',
    'droomhuis bouwen',
    'nieuwbouw',
    'kavel',
    'custom home',
    'transparant bouwen',
    'wkb compliant',
  ],
  authors: [{ name: 'Helder Woningbouw' }],
  creator: 'Helder',
  publisher: 'Helder Woningbouw',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://helder.nl',
    siteName: 'Helder',
    title: 'Helder | Bouw uw droomhuis met complete transparantie',
    description: 'Sinds 1956 bouwen wij droomhuizen met 100% transparantie. Elk materiaal, elke keuze, elk detail - gedocumenteerd in uw persoonlijke Woningpaspoort.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Helder - Bouw helder. Bouw met DNA.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Helder | Bouw uw droomhuis met complete transparantie',
    description: 'Sinds 1956 bouwen wij droomhuizen met 100% transparantie.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <WalkthroughProvider>
            {children}
            <ToastProvider />
            <KonamiCodeEasterEgg />
          </WalkthroughProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
