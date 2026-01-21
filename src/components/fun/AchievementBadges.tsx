'use client'

import { motion } from 'framer-motion'
import { 
  FileText, CheckCircle2, Zap, Leaf, Shield, 
  Trophy, Star, Clock, Camera, Share2 
} from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: typeof Trophy
  color: string
  bgColor: string
  earned: boolean
  earnedAt?: string
}

const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-document',
    name: 'Eerste Document',
    description: 'Upload je eerste document',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    earned: true,
    earnedAt: '2025-08-15',
  },
  {
    id: 'timeline-complete',
    name: 'Geschiedschrijver',
    description: 'Vul de volledige tijdlijn in',
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    earned: true,
    earnedAt: '2025-10-22',
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Bereik A++ energielabel',
    icon: Leaf,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    earned: true,
    earnedAt: '2025-11-30',
  },
  {
    id: 'verified',
    name: 'Geverifieerd',
    description: 'Alle documenten geverifieerd',
    icon: Shield,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    earned: true,
    earnedAt: '2025-12-01',
  },
  {
    id: 'photo-pro',
    name: 'Foto Pro',
    description: 'Upload 100+ bouwfoto\'s',
    icon: Camera,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    earned: false,
  },
  {
    id: 'share-master',
    name: 'Share Master',
    description: 'Deel je paspoort 5x',
    icon: Share2,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    earned: false,
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Een van de eerste 100 gebruikers',
    icon: Star,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    earned: true,
    earnedAt: '2025-07-01',
  },
  {
    id: 'complete-passport',
    name: 'Compleet Paspoort',
    description: '100% woningpaspoort',
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    earned: true,
    earnedAt: '2026-01-15',
  },
]

interface BadgeItemProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
}

export function BadgeItem({ badge, size = 'md' }: BadgeItemProps) {
  const Icon = badge.icon
  
  const sizes = {
    sm: { icon: 'w-6 h-6', container: 'w-12 h-12' },
    md: { icon: 'w-8 h-8', container: 'w-16 h-16' },
    lg: { icon: 'w-10 h-10', container: 'w-20 h-20' },
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div 
        className={`
          ${sizes[size].container} ${badge.earned ? badge.bgColor : 'bg-slate-100'}
          flex items-center justify-center relative
          ${!badge.earned ? 'opacity-40 grayscale' : ''}
        `}
      >
        <Icon className={`${sizes[size].icon} ${badge.earned ? badge.color : 'text-slate-400'}`} />
        {badge.earned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 flex items-center justify-center"
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
      <div className="text-center">
        <p className={`text-xs font-bold uppercase tracking-wider ${badge.earned ? 'text-slate-900' : 'text-slate-400'}`}>
          {badge.name}
        </p>
        {badge.earned && badge.earnedAt && (
          <p className="text-[10px] text-slate-400">
            {new Date(badge.earnedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </motion.div>
  )
}

interface AchievementBadgesProps {
  showAll?: boolean
  maxDisplay?: number
}

export function AchievementBadges({ showAll = false, maxDisplay = 4 }: AchievementBadgesProps) {
  const displayBadges = showAll 
    ? AVAILABLE_BADGES 
    : AVAILABLE_BADGES.filter(b => b.earned).slice(0, maxDisplay)

  const earnedCount = AVAILABLE_BADGES.filter(b => b.earned).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Achievements
        </h3>
        <span className="text-xs font-bold text-[#93b9e6]">
          {earnedCount}/{AVAILABLE_BADGES.length}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BadgeItem badge={badge} size="sm" />
          </motion.div>
        ))}
      </div>

      {!showAll && earnedCount > maxDisplay && (
        <p className="text-xs text-slate-400 text-center">
          +{earnedCount - maxDisplay} meer achievements
        </p>
      )}
    </div>
  )
}

export { AVAILABLE_BADGES }
