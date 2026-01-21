'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bell, Check, CheckCheck, FileText, Zap, AlertTriangle, 
  MessageSquare, Share2, Trophy, Wrench, Settings, ArrowLeft,
  Loader2, Trash2
} from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  DOCUMENT_UPLOADED: FileText,
  DOCUMENT_VERIFIED: Check,
  PHASE_COMPLETED: Zap,
  PHASE_STARTED: Zap,
  ISSUE_DETECTED: AlertTriangle,
  ISSUE_RESOLVED: Check,
  MESSAGE_RECEIVED: MessageSquare,
  SHARE_LINK_CREATED: Share2,
  MILESTONE_REACHED: Trophy,
  MAINTENANCE_DUE: Wrench,
  SYSTEM: Settings,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  DOCUMENT_UPLOADED: 'bg-blue-100 text-blue-600',
  DOCUMENT_VERIFIED: 'bg-emerald-100 text-emerald-600',
  PHASE_COMPLETED: 'bg-emerald-100 text-emerald-600',
  PHASE_STARTED: 'bg-[#93b9e6]/20 text-[#93b9e6]',
  ISSUE_DETECTED: 'bg-amber-100 text-amber-600',
  ISSUE_RESOLVED: 'bg-emerald-100 text-emerald-600',
  MESSAGE_RECEIVED: 'bg-purple-100 text-purple-600',
  SHARE_LINK_CREATED: 'bg-blue-100 text-blue-600',
  MILESTONE_REACHED: 'bg-amber-100 text-amber-600',
  MAINTENANCE_DUE: 'bg-orange-100 text-orange-600',
  SYSTEM: 'bg-slate-100 text-slate-600',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams()
      if (filter === 'unread') params.set('unread', 'true')
      
      const res = await fetch(`/api/notifications?${params}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      })
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('Alle meldingen gemarkeerd als gelezen')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Kon meldingen niet markeren')
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'Zojuist'
    if (diff < 3600) return `${Math.floor(diff / 60)} min geleden`
    if (diff < 86400) return `${Math.floor(diff / 3600)} uur geleden`
    if (diff < 604800) return `${Math.floor(diff / 86400)} dagen geleden`
    
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Meldingen
            </h1>
            <p className="text-slate-500 mt-1">
              {unreadCount > 0 
                ? `${unreadCount} ongelezen ${unreadCount === 1 ? 'melding' : 'meldingen'}`
                : 'Alle meldingen zijn gelezen'
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex bg-white border border-slate-200">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === 'unread' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Ongelezen
              </button>
            </div>

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-[#93b9e6] text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-[#7da8d9] transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Alles gelezen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Geen meldingen</h3>
            <p className="text-sm text-slate-500">
              {filter === 'unread' ? 'Alle meldingen zijn gelezen' : 'U heeft nog geen meldingen ontvangen'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || Bell
              const colorClass = NOTIFICATION_COLORS[notification.type] || 'bg-slate-100 text-slate-600'
              
              const content = (
                <div 
                  className={`flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-[#93b9e6]/5' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-bold text-slate-900 ${!notification.read ? '' : 'text-slate-700'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-400">{formatTime(notification.createdAt)}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#93b9e6] rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )

              if (notification.link) {
                return (
                  <Link key={notification.id} href={notification.link}>
                    {content}
                  </Link>
                )
              }

              return <div key={notification.id}>{content}</div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
