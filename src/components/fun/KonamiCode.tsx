'use client'

import { useEffect, useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Sparkles } from 'lucide-react'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

/**
 * Easter Egg: Konami Code
 * Enter the classic Konami Code to trigger a fun animation!
 * ↑ ↑ ↓ ↓ ← → ← → B A
 */
export function KonamiCodeEasterEgg() {
  const [index, setIndex] = useState(0)
  const [activated, setActivated] = useState(false)

  const triggerConfetti = useCallback(() => {
    // Fire confetti from both sides
    const defaults = {
      origin: { y: 0.7 },
      spread: 100,
      ticks: 100,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#93b9e6', '#1a1a2e', '#16a34a', '#d97706', '#ffffff']
    }

    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.2, y: 0.7 }
    })

    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.8, y: 0.7 }
    })

    // Fire house emojis
    setTimeout(() => {
      confetti({
        particleCount: 20,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0.6 },
        shapes: ['circle'],
        colors: ['#93b9e6'],
        scalar: 2,
      })
    }, 300)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      
      if (key === KONAMI_CODE[index]) {
        const nextIndex = index + 1
        setIndex(nextIndex)
        
        if (nextIndex === KONAMI_CODE.length) {
          // Code complete!
          setActivated(true)
          triggerConfetti()
          
          // Reset after animation
          setTimeout(() => {
            setActivated(false)
            setIndex(0)
          }, 5000)
        }
      } else {
        // Reset if wrong key
        setIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, triggerConfetti])

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            className="bg-slate-900 text-white px-12 py-8 shadow-2xl"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Home className="w-12 h-12 text-[#93b9e6]" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider">
                  Geheime Code!
                </h2>
                <p className="text-slate-400 text-sm">
                  Je hebt de Konami Code ontdekt!
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <p className="text-[#93b9e6] text-sm font-bold uppercase tracking-wider">
              ↑ ↑ ↓ ↓ ← → ← → B A
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
