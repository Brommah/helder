'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, FileText, Zap, AlertTriangle, Check, MessageSquare, X } from 'lucide-react'

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
}

interface NotificationBellProps {
  variant?: 'light' | 'dark'
}

export function NotificationBell({ variant = 'light' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=5')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
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
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'Zojuist'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}u`
    return `${Math.floor(diff / 86400)}d`
  }

  const iconColor = variant === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-900'
  const badgeBg = variant === 'dark' ? 'bg-[#93b9e6]' : 'bg-red-500'
  const dropdownBg = 'bg-white'

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-colors relative ${iconColor}`}
        aria-label="Meldingen"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 w-5 h-5 ${badgeBg} text-white text-[10px] font-bold flex items-center justify-center`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 ${dropdownBg} shadow-xl border border-slate-200 z-50`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
              Meldingen
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Notifications */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Geen meldingen</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Bell
                
                const content = (
                  <div 
                    className={`flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-[#93b9e6]/5' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id)
                      if (notification.link) setIsOpen(false)
                    }}
                  >
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-600'} truncate`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">{formatTime(notification.createdAt)}</span>
                      {!notification.read && <div className="w-2 h-2 bg-[#93b9e6]" />}
                    </div>
                  </div>
                )

                if (notification.link) {
                  return (
                    <Link key={notification.id} href={notification.link as any}>
                      {content}
                    </Link>
                  )
                }

                return <div key={notification.id}>{content}</div>
              })
            )}
          </div>

          {/* Footer */}
          <Link 
            href="/dashboard/notifications" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-center text-xs font-bold text-[#93b9e6] hover:bg-slate-50 transition-colors uppercase tracking-wider border-t border-slate-100"
          >
            Alle meldingen bekijken
          </Link>
        </div>
      )}
    </div>
  )
}
