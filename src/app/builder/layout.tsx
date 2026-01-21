'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status, data: session } = useSession()
  const router = useRouter()

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Laden...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/login?callbackUrl=/builder/dashboard')
    return null
  }

  // Check if user has builder role
  const userRole = (session?.user as { role?: string })?.role
  if (userRole && !['BUILDER', 'CONTRACTOR', 'ADMIN'].includes(userRole)) {
    router.push('/dashboard')
    return null
  }

  return children
}
