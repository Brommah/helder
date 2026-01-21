'use client'

import { Toaster } from 'sonner'

/**
 * Toast Provider Component
 * Provides toast notifications throughout the app using sonner
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: 0,
          fontFamily: 'Inter, sans-serif',
        },
        classNames: {
          toast: 'font-medium',
          title: 'font-bold text-sm',
          description: 'text-sm',
          success: 'bg-emerald-50 border-l-4 border-emerald-500',
          error: 'bg-red-50 border-l-4 border-red-500',
          warning: 'bg-amber-50 border-l-4 border-amber-500',
          info: 'bg-blue-50 border-l-4 border-[#93b9e6]',
        },
      }}
    />
  )
}

// Re-export toast for convenience
export { toast } from 'sonner'
