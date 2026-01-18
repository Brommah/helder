import { type ClassValue, clsx } from 'clsx'

// Utility for conditional classnames
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format currency (EUR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date in Dutch locale
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Vandaag'
  if (diffDays === 1) return 'Gisteren'
  if (diffDays < 7) return `${diffDays} dagen geleden`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`
  return formatDate(d)
}

// Calculate project progress from phases
export function calculateProgress(phases: { status: string }[]): number {
  if (phases.length === 0) return 0
  const completed = phases.filter(p => p.status === 'completed').length
  return Math.round((completed / phases.length) * 100)
}

// Generate document hash placeholder (would use crypto in real implementation)
export function generateDocumentHash(content: string): string {
  // Placeholder - real implementation would use SHA-256 or similar
  return `hash_${Date.now()}_${content.length}`
}

// Status labels in Dutch
export const statusLabels: Record<string, string> = {
  planning: 'Planning',
  design: 'Ontwerp',
  permit: 'Vergunning',
  construction: 'Bouw',
  inspection: 'Oplevering',
  completed: 'Afgerond',
  pending: 'Gepland',
  in_progress: 'Bezig',
  delayed: 'Vertraagd',
  todo: 'Te doen',
  review: 'Review',
}

// Get status color for styling
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planning: 'bg-gray-100 text-gray-800',
    design: 'bg-blue-100 text-blue-800',
    permit: 'bg-yellow-100 text-yellow-800',
    construction: 'bg-orange-100 text-orange-800',
    inspection: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    delayed: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
