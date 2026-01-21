'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AtSign, User, Users, Phone, Check, X, Loader2 } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string | null
  phone: string | null
  specialties: string[]
  isSpecial?: boolean
  mentionText: string
}

interface MentionInputProps {
  companyId: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onMentionsChange?: (memberIds: string[]) => void
  disabled?: boolean
}

interface Suggestion {
  id: string
  name: string
  role: string | null
  phone: string | null
  isSpecial: boolean
  mentionText: string
}

export function MentionInput({
  companyId,
  value,
  onChange,
  placeholder = 'Schrijf een bericht... Gebruik @ om teamleden te noemen',
  className = '',
  onMentionsChange,
  disabled = false,
}: MentionInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [specialSuggestions, setSpecialSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mentionStart, setMentionStart] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [mentionedIds, setMentionedIds] = useState<Set<string>>(new Set())

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Extract @mentions from text and track mentioned IDs
  const extractMentionedNames = useCallback((text: string) => {
    const mentionRegex = /@([a-zA-Z0-9_\-]+)/g
    const names: string[] = []
    let match
    while ((match = mentionRegex.exec(text)) !== null) {
      names.push(match[1].toLowerCase())
    }
    return names
  }, [])

  // Search for team members
  const searchTeamMembers = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setSuggestions([])
      setSpecialSuggestions([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/team/search?companyId=${companyId}&q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.teamMembers || [])
        setSpecialSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Error searching team members:', error)
    } finally {
      setLoading(false)
    }
  }, [companyId])

  // Debounced search
  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        searchTeamMembers(searchQuery)
      }, 150)
      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setSpecialSuggestions([])
    }
  }, [searchQuery, searchTeamMembers])

  // Handle text input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart

    onChange(newValue)

    // Check if user is typing a mention
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const atMatch = textBeforeCursor.match(/@([a-zA-Z0-9_\-]*)$/)

    if (atMatch) {
      const query = atMatch[1]
      setMentionStart(cursorPos - query.length - 1)
      setSearchQuery(query)
      setShowSuggestions(true)
      setSelectedIndex(0)
    } else {
      setShowSuggestions(false)
      setMentionStart(null)
      setSearchQuery('')
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    const allSuggestions = [...specialSuggestions, ...suggestions]

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        )
        break
      case 'Enter':
      case 'Tab':
        if (allSuggestions.length > 0) {
          e.preventDefault()
          selectSuggestion(allSuggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        break
    }
  }

  // Select a suggestion
  const selectSuggestion = (suggestion: Suggestion) => {
    if (mentionStart === null) return

    const textarea = textareaRef.current
    if (!textarea) return

    const beforeMention = value.slice(0, mentionStart)
    const afterMention = value.slice(textarea.selectionStart)
    const newValue = `${beforeMention}${suggestion.mentionText} ${afterMention}`

    onChange(newValue)
    setShowSuggestions(false)
    setMentionStart(null)
    setSearchQuery('')

    // Track mentioned ID (if not special)
    if (!suggestion.isSpecial) {
      const newMentionedIds = new Set(mentionedIds)
      newMentionedIds.add(suggestion.id)
      setMentionedIds(newMentionedIds)
      onMentionsChange?.(Array.from(newMentionedIds))
    }

    // Focus back and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = beforeMention.length + suggestion.mentionText.length + 1
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !textareaRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allSuggestions = [...specialSuggestions, ...suggestions]

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-10 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium resize-none transition-all min-h-[100px] disabled:bg-slate-50 disabled:cursor-not-allowed"
          rows={4}
        />
        <AtSign className="absolute top-3 right-3 w-5 h-5 text-slate-400" />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-900 shadow-lg max-h-64 overflow-y-auto"
        >
          {loading && (
            <div className="px-4 py-3 flex items-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Zoeken...</span>
            </div>
          )}

          {/* Special suggestions (like @team) */}
          {specialSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                selectedIndex === index
                  ? 'bg-[#93b9e6] text-slate-900'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="w-8 h-8 bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm uppercase tracking-wide truncate">
                  {suggestion.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {suggestion.role}
                </p>
              </div>
              <code className="text-xs bg-slate-100 px-2 py-1 font-mono">
                {suggestion.mentionText}
              </code>
            </button>
          ))}

          {/* Divider if both types present */}
          {specialSuggestions.length > 0 && suggestions.length > 0 && (
            <div className="border-t border-slate-200" />
          )}

          {/* Team member suggestions */}
          {suggestions.map((suggestion, index) => {
            const adjustedIndex = specialSuggestions.length + index
            return (
              <button
                key={suggestion.id}
                type="button"
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  selectedIndex === adjustedIndex
                    ? 'bg-[#93b9e6] text-slate-900'
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(adjustedIndex)}
              >
                <div className="w-8 h-8 bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {suggestion.name}
                  </p>
                  {suggestion.role && (
                    <p className="text-xs text-slate-500 truncate">
                      {suggestion.role}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {suggestion.phone && (
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <code className="text-xs bg-slate-100 px-2 py-1 font-mono">
                    {suggestion.mentionText}
                  </code>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* No results */}
      {showSuggestions && !loading && searchQuery && allSuggestions.length === 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 shadow-lg"
        >
          <div className="px-4 py-6 text-center">
            <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              Geen teamleden gevonden voor &quot;{searchQuery}&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Team member chips showing who's mentioned
 */
interface MentionChipsProps {
  mentions: {
    id: string
    teamMember: {
      id: string
      name: string
      role: string | null
      phone: string | null
    }
    notified: boolean
    notifiedAt: string | null
  }[]
  onRemove?: (mentionId: string) => void
  loading?: boolean
}

export function MentionChips({ mentions, onRemove, loading }: MentionChipsProps) {
  if (mentions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {mentions.map((mention) => (
        <div
          key={mention.id}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
            mention.notified
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{mention.teamMember.name}</span>

          {/* Notification status */}
          {mention.notified ? (
            <span className="flex items-center gap-1 text-[10px]" title={`Genotificeerd op ${mention.notifiedAt}`}>
              <Check className="w-3 h-3" />
            </span>
          ) : mention.teamMember.phone ? (
            <span className="flex items-center gap-1 text-[10px]" title="Notificatie in afwachting">
              <Loader2 className="w-3 h-3 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px]" title="Geen telefoonnummer">
              <Phone className="w-3 h-3 opacity-50" />
            </span>
          )}

          {onRemove && !loading && (
            <button
              type="button"
              onClick={() => onRemove(mention.id)}
              className="ml-1 p-0.5 hover:bg-black/10 transition-colors"
              title="Verwijder vermelding"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default MentionInput
