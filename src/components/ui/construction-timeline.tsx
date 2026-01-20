'use client'

import { CheckCircle2, Circle, Clock, Camera, FileText, Thermometer } from 'lucide-react'
import { VerifiedBadge } from './verified-badge'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface TimelineEvent {
  id: string
  phase: string
  title: string
  description?: string
  date: Date
  status: 'completed' | 'in_progress' | 'planned'
  photos?: number
  verified?: boolean
  blockchainTx?: string
  weather?: {
    temp: number
    condition: string
  }
}

interface ConstructionTimelineProps {
  events: TimelineEvent[]
  onEventClick?: (event: TimelineEvent) => void
}

export function ConstructionTimeline({ events, onEventClick }: ConstructionTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-300 to-slate-200" />
      
      <div className="space-y-6">
        {events.map((event, index) => (
          <TimelineItem 
            key={event.id} 
            event={event} 
            isLast={index === events.length - 1}
            onClick={() => onEventClick?.(event)}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ 
  event, 
  isLast,
  onClick,
}: { 
  event: TimelineEvent
  isLast: boolean
  onClick?: () => void
}) {
  const StatusIcon = {
    completed: CheckCircle2,
    in_progress: Clock,
    planned: Circle,
  }[event.status]

  const statusColors = {
    completed: 'bg-success-500 text-white ring-success-100',
    in_progress: 'bg-primary-500 text-white ring-primary-100 animate-pulse-slow',
    planned: 'bg-slate-200 text-slate-400 ring-slate-100',
  }

  return (
    <div 
      className={`relative pl-16 ${!isLast ? 'pb-2' : ''} group cursor-pointer`}
      onClick={onClick}
    >
      {/* Status dot */}
      <div className={`absolute left-4 w-5 h-5 rounded-full ring-4 flex items-center justify-center
        ${statusColors[event.status]} transition-transform group-hover:scale-110`}>
        <StatusIcon className="w-3 h-3" />
      </div>

      {/* Content card */}
      <div className={`card p-4 transition-all duration-200 
        group-hover:shadow-lg group-hover:border-primary-200
        ${event.status === 'in_progress' ? 'border-primary-300 bg-primary-50/30' : ''}`}>
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-900">{event.title}</h4>
              {event.verified && (
                <VerifiedBadge verified={true} size="sm" />
              )}
            </div>
            
            {event.description && (
              <p className="text-sm text-slate-600 mt-1">{event.description}</p>
            )}
          </div>
          
          {/* Date */}
          <div className="text-right shrink-0">
            <div className="text-sm font-medium text-slate-900">
              {format(event.date, 'd MMM yyyy', { locale: nl })}
            </div>
            <div className="text-xs text-slate-500">
              {format(event.date, 'HH:mm')}
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
          {event.photos && event.photos > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Camera className="w-4 h-4" />
              <span>{event.photos} foto's</span>
            </div>
          )}
          
          {event.weather && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Thermometer className="w-4 h-4" />
              <span>{event.weather.temp}°C, {event.weather.condition}</span>
            </div>
          )}
          
          {event.blockchainTx && (
            <div className="flex items-center gap-1.5 text-sm text-verified-600">
              <FileText className="w-4 h-4" />
              <code className="font-mono text-xs">{event.blockchainTx}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface PhaseProgressProps {
  phases: Array<{
    id: string
    name: string
    icon: string
    progress: number
    status: 'completed' | 'current' | 'pending'
  }>
  currentPhaseId: string
}

export function PhaseProgress({ phases, currentPhaseId }: PhaseProgressProps) {
  return (
    <div className="space-y-3">
      {phases.map((phase, index) => {
        const isCompleted = phase.status === 'completed'
        const isCurrent = phase.status === 'current'
        
        return (
          <div key={phase.id} className="flex items-center gap-4">
            {/* Phase icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
              ${isCompleted ? 'bg-success-100' : isCurrent ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-slate-100'}`}>
              {phase.icon}
            </div>
            
            {/* Phase info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium ${isCompleted ? 'text-success-700' : isCurrent ? 'text-primary-700' : 'text-slate-500'}`}>
                  {phase.name}
                </span>
                <span className={`text-sm font-medium ${isCompleted ? 'text-success-600' : isCurrent ? 'text-primary-600' : 'text-slate-400'}`}>
                  {phase.progress}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out
                    ${isCompleted ? 'bg-success-500' : isCurrent ? 'bg-gradient-to-r from-primary-600 to-primary-400' : 'bg-slate-300'}`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
            </div>
            
            {/* Status indicator */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center
              ${isCompleted ? 'bg-success-500 text-white' : isCurrent ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
