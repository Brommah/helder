'use client'

import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  variant?: 'default' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animate?: boolean
}

export function Progress({
  value,
  max = 100,
  className = '',
  variant = 'default',
  size = 'md',
  showLabel = false,
  animate = true,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variants = {
    default: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Voortgang</span>
          <motion.span 
            className="font-medium"
            key={percentage}
            initial={animate ? { opacity: 0, y: -5 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        {animate ? (
          <motion.div
            className={`h-full rounded-full ${variants[variant]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-300 ${variants[variant]}`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}
