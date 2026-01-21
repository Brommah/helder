'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Animation Variants for consistent animations across the app
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * Page transition wrapper
 */
interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered list animation - wrap list items in this
 */
interface StaggerListProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function StaggerList({ children, className = '', delay = 0.1 }: StaggerListProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: { staggerChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered list item
 */
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hover scale animation wrapper
 */
interface HoverScaleProps extends HTMLMotionProps<'div'> {
  scale?: number
  children: ReactNode
  className?: string
}

export function HoverScale({ scale = 1.02, children, className = '', ...props }: HoverScaleProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animated number counter
 */
interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

export function AnimatedNumber({ 
  value, 
  duration = 1, 
  className = '',
  suffix = '',
  prefix = '',
}: AnimatedNumberProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {prefix}
        <motion.span
          initial={{ filter: 'blur(8px)' }}
          animate={{ filter: 'blur(0px)' }}
          transition={{ duration: duration * 0.5 }}
        >
          {value.toLocaleString('nl-NL')}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  )
}

/**
 * Pulse animation for highlights
 */
interface PulseProps {
  children: ReactNode
  className?: string
  active?: boolean
}

export function Pulse({ children, className = '', active = true }: PulseProps) {
  if (!active) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <motion.span
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  )
}

/**
 * Sparkle effect for AI-generated content
 */
export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{
        rotate: [0, 15, -15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      ✨
    </motion.span>
  )
}
