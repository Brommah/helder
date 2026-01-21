'use client'

import { motion, useAnimation, Variants } from 'framer-motion'
import { useEffect } from 'react'

interface HouseBuilderProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

/**
 * Animated house that builds as project progresses from 0-100%
 */
export function HouseBuilder({ 
  progress, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: HouseBuilderProps) {
  const controls = useAnimation()

  const sizes = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 },
  }

  const { width, height } = sizes[size]

  // Calculate which parts should be visible based on progress
  const foundation = progress >= 10
  const walls = progress >= 25
  const roof = progress >= 50
  const windows = progress >= 65
  const door = progress >= 75
  const chimney = progress >= 85
  const details = progress >= 95

  useEffect(() => {
    if (animated) {
      controls.start('visible')
    }
  }, [progress, animated, controls])

  const partVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100"
        className="overflow-visible"
      >
        {/* Foundation */}
        <motion.rect
          x="15"
          y="85"
          width="70"
          height="10"
          fill={foundation ? '#64748b' : '#e2e8f0'}
          initial="hidden"
          animate={foundation ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Left Wall */}
        <motion.rect
          x="20"
          y="45"
          width="25"
          height="40"
          fill={walls ? '#93b9e6' : '#e2e8f0'}
          initial="hidden"
          animate={walls ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Right Wall */}
        <motion.rect
          x="55"
          y="45"
          width="25"
          height="40"
          fill={walls ? '#93b9e6' : '#e2e8f0'}
          initial="hidden"
          animate={walls ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Door section */}
        <motion.rect
          x="45"
          y="55"
          width="10"
          height="30"
          fill={walls ? '#7da8d9' : '#e2e8f0'}
          initial="hidden"
          animate={walls ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Roof */}
        <motion.polygon
          points="10,45 50,15 90,45"
          fill={roof ? '#1a1a2e' : '#e2e8f0'}
          initial="hidden"
          animate={roof ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Left Window */}
        <motion.rect
          x="27"
          y="55"
          width="10"
          height="10"
          fill={windows ? '#ffffff' : '#e2e8f0'}
          stroke={windows ? '#1a1a2e' : '#e2e8f0'}
          strokeWidth="1"
          initial="hidden"
          animate={windows ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Right Window */}
        <motion.rect
          x="63"
          y="55"
          width="10"
          height="10"
          fill={windows ? '#ffffff' : '#e2e8f0'}
          stroke={windows ? '#1a1a2e' : '#e2e8f0'}
          strokeWidth="1"
          initial="hidden"
          animate={windows ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Door */}
        <motion.g
          initial="hidden"
          animate={door ? 'visible' : 'hidden'}
          variants={partVariants}
        >
          <rect x="46" y="65" width="8" height="20" fill="#1a1a2e" />
          <circle cx="52" cy="75" r="1" fill="#93b9e6" />
        </motion.g>

        {/* Chimney */}
        <motion.rect
          x="65"
          y="20"
          width="8"
          height="15"
          fill={chimney ? '#64748b' : '#e2e8f0'}
          initial="hidden"
          animate={chimney ? 'visible' : 'hidden'}
          variants={partVariants}
        />

        {/* Smoke (animated) */}
        {details && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.circle
              cx="69"
              cy="15"
              r="3"
              fill="#e2e8f0"
              animate={{
                y: [-5, -15, -5],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.circle
              cx="69"
              cy="10"
              r="2"
              fill="#e2e8f0"
              animate={{
                y: [-5, -12, -5],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                delay: 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.g>
        )}

        {/* Sun (100% complete) */}
        {progress === 100 && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.circle
              cx="85"
              cy="15"
              r="8"
              fill="#fcd34d"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.line
                key={i}
                x1="85"
                y1="15"
                x2={85 + 12 * Math.cos(angle * Math.PI / 180)}
                y2={15 + 12 * Math.sin(angle * Math.PI / 180)}
                stroke="#fcd34d"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </motion.g>
        )}
      </svg>

      {showLabel && (
        <div className="text-center">
          <motion.p 
            className="text-2xl font-black text-slate-900"
            key={progress}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {progress}%
          </motion.p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            {progress === 100 ? 'Voltooid!' : progress >= 75 ? 'Bijna klaar' : progress >= 50 ? 'Halverwege' : progress >= 25 ? 'In aanbouw' : 'Gestart'}
          </p>
        </div>
      )}
    </div>
  )
}
