'use client'

import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, Lightbulb } from 'lucide-react'
import { ReactNode } from 'react'

interface AISparkleProps {
  children: ReactNode
  className?: string
  variant?: 'sparkle' | 'glow' | 'pulse' | 'brain'
  active?: boolean
}

/**
 * AI Sparkle Effect - Adds a subtle sparkle animation to AI-generated content
 */
export function AISparkle({ 
  children, 
  className = '', 
  variant = 'sparkle',
  active = true 
}: AISparkleProps) {
  if (!active) {
    return <span className={className}>{children}</span>
  }

  switch (variant) {
    case 'glow':
      return (
        <motion.span
          className={`relative inline-flex items-center ${className}`}
          animate={{
            filter: ['drop-shadow(0 0 2px #93b9e6)', 'drop-shadow(0 0 8px #93b9e6)', 'drop-shadow(0 0 2px #93b9e6)'],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {children}
        </motion.span>
      )

    case 'pulse':
      return (
        <motion.span
          className={`relative inline-flex items-center ${className}`}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {children}
        </motion.span>
      )

    case 'brain':
      return (
        <span className={`relative inline-flex items-center gap-1.5 ${className}`}>
          <motion.span
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Brain className="w-4 h-4 text-[#93b9e6]" />
          </motion.span>
          {children}
        </span>
      )

    case 'sparkle':
    default:
      return (
        <span className={`relative inline-flex items-center ${className}`}>
          {children}
          <motion.span
            className="ml-1"
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4 text-[#93b9e6]" />
          </motion.span>
        </span>
      )
  }
}

/**
 * AI Badge - Shows that content is AI-powered
 */
interface AIBadgeProps {
  label?: string
  variant?: 'default' | 'compact' | 'outline'
}

export function AIBadge({ label = 'AI', variant = 'default' }: AIBadgeProps) {
  if (variant === 'compact') {
    return (
      <motion.span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#93b9e6]/20 text-[#93b9e6]"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-3 h-3" />
      </motion.span>
    )
  }

  if (variant === 'outline') {
    return (
      <motion.span
        className="inline-flex items-center gap-1.5 px-2 py-1 border border-[#93b9e6]/30 text-[#93b9e6] text-[10px] font-bold uppercase tracking-wider"
        whileHover={{ borderColor: '#93b9e6' }}
      >
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.span>
        {label}
      </motion.span>
    )
  }

  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{ 
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-3 h-3" />
      </motion.span>
      {label}
    </motion.span>
  )
}

/**
 * AI Insight Card - Styled card for AI-generated insights
 */
interface AIInsightCardProps {
  title: string
  insight: string
  confidence?: number
  icon?: typeof Lightbulb
}

export function AIInsightCard({ 
  title, 
  insight, 
  confidence = 95,
  icon: Icon = Lightbulb 
}: AIInsightCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-br from-[#93b9e6]/10 to-[#93b9e6]/5 border border-[#93b9e6]/20 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: '#93b9e6' }}
    >
      {/* Background sparkles */}
      <div className="absolute top-2 right-2 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-20 h-20 text-[#93b9e6]" />
        </motion.div>
      </div>

      <div className="relative">
        <div className="flex items-start gap-3">
          <motion.div
            className="w-10 h-10 bg-[#93b9e6]/20 flex items-center justify-center flex-shrink-0"
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(147,185,230,0)', '0 0 0 8px rgba(147,185,230,0.1)', '0 0 0 0 rgba(147,185,230,0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="w-5 h-5 text-[#93b9e6]" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-slate-900">{title}</h4>
              <AIBadge variant="compact" />
            </div>
            <p className="text-sm text-slate-600">{insight}</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3 pt-3 border-t border-[#93b9e6]/10">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-bold">Zekerheid</span>
            <span className="font-bold text-[#93b9e6]">{confidence}%</span>
          </div>
          <div className="h-1 bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full bg-[#93b9e6]"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
