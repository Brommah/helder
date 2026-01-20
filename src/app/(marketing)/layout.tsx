import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Helder | Bouw uw droomhuis met complete transparantie',
  description: 'Sinds 1956 bouwen wij droomhuizen met 100% transparantie. Elk materiaal, elke keuze, elk detail - gedocumenteerd in uw persoonlijke Woningpaspoort.',
  keywords: ['helder', 'droomhuis bouwen', 'nieuwbouw', 'kavel', 'woningpaspoort', 'custom home'],
  openGraph: {
    title: 'Helder | Bouw uw droomhuis met complete transparantie',
    description: 'Van eerste tekening tot sleuteloverdraging - wij maken bouwen helder.',
    type: 'website',
    locale: 'nl_NL',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
