'use client'

import { useState, useEffect } from 'react'
import {
  Users, Plus, Phone, Mail, Wrench, Search, X, Edit2, Trash2,
  CheckCircle, AlertCircle, MessageSquare, ChevronDown, RefreshCw,
  UserPlus, AtSign
} from 'lucide-react'

interface TeamMember {
  id: string
  companyId: string
  name: string
  role: string | null
  phone: string | null
  email: string | null
  specialties: string[]
  active: boolean
  createdAt: string
  updatedAt: string
  mentionCount: number
}

interface TeamStats {
  total: number
  active: number
  withPhone: number
}

// Dutch construction roles
const DUTCH_ROLES = [
  'Metselaar',
  'Timmerman',
  'Elektricien',
  'Loodgieter',
  'Stukadoor',
  'Schilder',
  'Dakdekker',
  'Installateur',
  'Tegelzetter',
  'Uitvoerder',
  'Voorman',
  'Projectleider',
]

// Demo company ID - in production this would come from context/session
const DEMO_COMPANY_ID = 'demo-company-1'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamStats>({ total: 0, active: 0, withPhone: 0 })
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(false)

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        companyId: DEMO_COMPANY_ID,
      })
      if (!showInactive) {
        params.append('active', 'true')
      }
      if (roleFilter !== 'all') {
        params.append('role', roleFilter)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const res = await fetch(`/api/team?${params}`)
      if (!res.ok) throw new Error('Failed to fetch team members')

      const data = await res.json()
      setTeamMembers(data.teamMembers)
      setStats(data.stats)
      setAvailableRoles(data.roles)
      setError(null)
    } catch (err) {
      console.error('Error fetching team members:', err)
      setError('Kon teamleden niet laden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [roleFilter, showInactive, searchQuery])

  // Delete (deactivate) team member
  const handleDeactivate = async (memberId: string) => {
    if (!confirm('Weet je zeker dat je dit teamlid wilt deactiveren?')) return

    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to deactivate team member')
      fetchTeamMembers()
    } catch (err) {
      console.error('Error deactivating team member:', err)
    }
  }

  // Reactivate team member
  const handleReactivate = async (memberId: string) => {
    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      })
      if (!res.ok) throw new Error('Failed to reactivate team member')
      fetchTeamMembers()
    } catch (err) {
      console.error('Error reactivating team member:', err)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-[#93b9e6]" />
              <span className="text-[#5a8fd4] text-[10px] font-black uppercase tracking-[0.3em]">ORGANISATIE</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Team
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Beheer je teamleden en @mentions voor issues
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[#93b9e6] hover:text-slate-900 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>TEAMLID TOEVOEGEN</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-px bg-slate-200">
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOTAAL</p>
                <p className="text-2xl font-black text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ACTIEF</p>
                <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#93b9e6] flex items-center justify-center">
                <Phone className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MET WHATSAPP</p>
                <p className="text-2xl font-black text-[#5a8fd4]">{stats.withPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-px bg-slate-200">
          {/* Search */}
          <div className="relative bg-white flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek op naam, rol of specialisme..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-slate-900 outline-none text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Role filter */}
          <div className="relative bg-white">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none px-4 py-4 pr-10 bg-white border-2 border-transparent focus:border-slate-900 outline-none cursor-pointer text-sm font-bold uppercase tracking-wider min-w-[200px]"
            >
              <option value="all">Alle rollen</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          {/* Show inactive toggle */}
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`px-4 py-4 bg-white font-bold text-sm uppercase tracking-wider transition-colors ${
              showInactive ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            {showInactive ? 'Alle leden' : 'Alleen actief'}
          </button>

          {/* Refresh button */}
          <button
            onClick={fetchTeamMembers}
            className="p-4 bg-white hover:bg-slate-50 transition-colors"
            title="Vernieuwen"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Team Members List */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-[#93b9e6] mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Laden...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-bold">{error}</p>
            <button
              onClick={fetchTeamMembers}
              className="mt-4 px-6 py-2 bg-slate-900 text-white font-bold uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">
              Geen teamleden gevonden
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery || roleFilter !== 'all'
                ? 'Probeer andere filters'
                : 'Voeg je eerste teamlid toe om te beginnen'}
            </p>
            {!searchQuery && roleFilter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-slate-900 text-white font-bold uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors"
              >
                Eerste teamlid toevoegen
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onEdit={() => setEditingMember(member)}
                onDeactivate={() => handleDeactivate(member.id)}
                onReactivate={() => handleReactivate(member.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingMember) && (
        <TeamMemberModal
          member={editingMember}
          onClose={() => {
            setShowAddModal(false)
            setEditingMember(null)
          }}
          onSaved={() => {
            setShowAddModal(false)
            setEditingMember(null)
            fetchTeamMembers()
          }}
        />
      )}
    </div>
  )
}

function TeamMemberCard({
  member,
  onEdit,
  onDeactivate,
  onReactivate,
}: {
  member: TeamMember
  onEdit: () => void
  onDeactivate: () => void
  onReactivate: () => void
}) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={`group bg-white border border-slate-200 hover:border-slate-900 transition-all overflow-hidden ${
        !member.active ? 'opacity-60' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={`w-14 h-14 flex-shrink-0 flex items-center justify-center font-black text-lg ${
              member.active ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  {member.name}
                </h3>
                {member.role && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Wrench className="w-3.5 h-3.5 text-[#5a8fd4]" />
                    <span className="text-xs font-bold text-[#5a8fd4] uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              {!member.active && (
                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                  Inactief
                </span>
              )}
            </div>

            {/* Contact info */}
            <div className="mt-3 space-y-1">
              {member.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-medium">{member.phone}</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">
                    WhatsApp
                  </span>
                </div>
              )}
              {member.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="font-medium truncate">{member.email}</span>
                </div>
              )}
            </div>

            {/* Specialties */}
            {member.specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {member.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mention stats */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AtSign className="w-3.5 h-3.5" />
            <span className="font-bold">{member.mentionCount} mentions</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-slate-100 transition-colors"
              title="Bewerken"
            >
              <Edit2 className="w-4 h-4 text-slate-600" />
            </button>
            {member.active ? (
              <button
                onClick={onDeactivate}
                className="p-2 hover:bg-red-50 transition-colors"
                title="Deactiveren"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            ) : (
              <button
                onClick={onReactivate}
                className="p-2 hover:bg-emerald-50 transition-colors"
                title="Heractiveren"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mention hint */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <MessageSquare className="w-3 h-3" />
          <span>@{member.name.split(' ')[0].toLowerCase()}</span>
        </div>
      </div>
    </div>
  )
}

function TeamMemberModal({
  member,
  onClose,
  onSaved,
}: {
  member: TeamMember | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEditing = !!member

  const [name, setName] = useState(member?.name || '')
  const [role, setRole] = useState(member?.role || '')
  const [phone, setPhone] = useState(member?.phone || '')
  const [email, setEmail] = useState(member?.email || '')
  const [specialties, setSpecialties] = useState<string[]>(member?.specialties || [])
  const [newSpecialty, setNewSpecialty] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Naam is verplicht')
      return
    }

    // Validate phone format if provided
    if (phone && !phone.match(/^\+[1-9]\d{6,14}$/)) {
      setError('Telefoonnummer moet in E.164 formaat zijn (bijv. +31612345678)')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const body = {
        companyId: DEMO_COMPANY_ID,
        name: name.trim(),
        role: role.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        specialties,
      }

      const res = await fetch(
        isEditing ? `/api/team/${member.id}` : '/api/team',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save team member')
      }

      onSaved()
    } catch (err) {
      console.error('Error saving team member:', err)
      setError(err instanceof Error ? err.message : 'Kon teamlid niet opslaan')
    } finally {
      setLoading(false)
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider mb-2">
          {isEditing ? 'Teamlid bewerken' : 'Teamlid toevoegen'}
        </h2>
        <p className="text-slate-500 mb-6">
          {isEditing
            ? 'Pas de gegevens van dit teamlid aan'
            : 'Voeg een nieuw teamlid toe aan je team'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Naam *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jan de Vries"
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Rol
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium cursor-pointer transition-all"
              >
                <option value="">Selecteer rol...</option>
                {DUTCH_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="other">Anders...</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            {role === 'other' && (
              <input
                type="text"
                value={role === 'other' ? '' : role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Vul rol in..."
                className="mt-2 w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
              />
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Telefoonnummer (WhatsApp)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+31612345678"
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">
              E.164 formaat voor WhatsApp notificaties
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan@voorbeeld.nl"
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Specialismen
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSpecialty()
                  }
                }}
                placeholder="Voeg specialisme toe..."
                className="flex-1 px-4 py-3 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#93b9e6]/20 text-[#5a8fd4] text-xs font-bold uppercase tracking-wider"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="hover:text-slate-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-3 px-6 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Bezig...' : isEditing ? 'Opslaan' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
