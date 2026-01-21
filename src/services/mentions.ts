/**
 * Mention Detection Service
 *
 * Parses text for @mentions and matches against TeamMembers by:
 * - Name (case-insensitive, partial match)
 * - Role (case-insensitive, partial match)
 * - Special keywords: @team (all active members), @all (same as @team)
 */

import { db } from '@/lib/db'

export interface TeamMember {
  id: string
  companyId: string
  name: string
  role: string | null
  phone: string | null
  email: string | null
  specialties: string[]
  active: boolean
}

export interface MentionMatch {
  original: string      // The original @mention text (e.g., "@jan")
  teamMember: TeamMember
  matchType: 'name' | 'role' | 'specialty' | 'team'
}

// Dutch construction roles for matching
export const DUTCH_ROLES = [
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
] as const

/**
 * Extract @mentions from text
 * Matches patterns like @jan, @elektricien, @team
 */
export function extractMentions(text: string): string[] {
  // Match @word patterns (alphanumeric, underscores, hyphens)
  const mentionRegex = /@([a-zA-Z0-9_\-]+)/g
  const matches: string[] = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    matches.push(match[1].toLowerCase())
  }

  return [...new Set(matches)] // Remove duplicates
}

/**
 * Parse text for @mentions and resolve to TeamMembers
 */
export async function parseMentions(
  text: string,
  companyId: string
): Promise<MentionMatch[]> {
  const mentions = extractMentions(text)

  if (mentions.length === 0) {
    return []
  }

  // Fetch all active team members for the company
  const teamMembers = await db.teamMember.findMany({
    where: {
      companyId,
      active: true,
    },
  })

  const matches: MentionMatch[] = []
  const matchedMemberIds = new Set<string>()

  for (const mention of mentions) {
    // Special case: @team or @all - mention everyone
    if (mention === 'team' || mention === 'all' || mention === 'iedereen') {
      for (const member of teamMembers) {
        if (!matchedMemberIds.has(member.id)) {
          matches.push({
            original: `@${mention}`,
            teamMember: member,
            matchType: 'team',
          })
          matchedMemberIds.add(member.id)
        }
      }
      continue
    }

    // Try to match by name (case-insensitive, partial match)
    for (const member of teamMembers) {
      if (matchedMemberIds.has(member.id)) continue

      const nameLower = member.name.toLowerCase()
      const firstName = nameLower.split(' ')[0]

      // Match full name or first name
      if (nameLower.includes(mention) || firstName === mention) {
        matches.push({
          original: `@${mention}`,
          teamMember: member,
          matchType: 'name',
        })
        matchedMemberIds.add(member.id)
        break // Only match one member per mention for name matching
      }
    }

    // If no name match, try role match (all members with that role)
    if (!matches.some(m => m.original === `@${mention}`)) {
      for (const member of teamMembers) {
        if (matchedMemberIds.has(member.id)) continue

        const roleLower = member.role?.toLowerCase() || ''

        // Match role
        if (roleLower && roleLower.includes(mention)) {
          matches.push({
            original: `@${mention}`,
            teamMember: member,
            matchType: 'role',
          })
          matchedMemberIds.add(member.id)
          // Don't break - include all members with this role
        }
      }
    }

    // If still no match, try specialty match
    if (!matches.some(m => m.original === `@${mention}`)) {
      for (const member of teamMembers) {
        if (matchedMemberIds.has(member.id)) continue

        const hasMatchingSpecialty = member.specialties.some(
          s => s.toLowerCase().includes(mention)
        )

        if (hasMatchingSpecialty) {
          matches.push({
            original: `@${mention}`,
            teamMember: member,
            matchType: 'specialty',
          })
          matchedMemberIds.add(member.id)
        }
      }
    }
  }

  return matches
}

/**
 * Get team members that match a search query (for autocomplete)
 */
export async function searchTeamMembers(
  query: string,
  companyId: string,
  limit: number = 5
): Promise<TeamMember[]> {
  const queryLower = query.toLowerCase()

  const teamMembers = await db.teamMember.findMany({
    where: {
      companyId,
      active: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { role: { contains: query, mode: 'insensitive' } },
        { specialties: { hasSome: [query] } },
      ],
    },
    take: limit,
    orderBy: { name: 'asc' },
  })

  return teamMembers
}

/**
 * Highlight mentions in text for display
 * Returns HTML string with mentions wrapped in spans
 */
export function highlightMentions(
  text: string,
  mentionedMembers: { name: string }[]
): string {
  let highlighted = text
  const memberNames = mentionedMembers.map(m => m.name.toLowerCase())

  // Find all @mentions and wrap matching ones in spans
  highlighted = highlighted.replace(/@([a-zA-Z0-9_\-]+)/g, (match, mention) => {
    const mentionLower = mention.toLowerCase()

    // Check if this mention matches any team member
    const isMatched = memberNames.some(name => {
      const firstName = name.split(' ')[0]
      return name.includes(mentionLower) || firstName === mentionLower
    }) || mentionLower === 'team' || mentionLower === 'all' || mentionLower === 'iedereen'

    if (isMatched) {
      return `<span class="mention-highlight">${match}</span>`
    }
    return match
  })

  return highlighted
}

/**
 * Create mentions for an issue and return created mention records
 */
export async function createMentionsForIssue(
  issueId: string,
  teamMemberIds: string[]
): Promise<{ id: string; teamMemberId: string; notified: boolean }[]> {
  if (teamMemberIds.length === 0) return []

  // Use upsert to avoid duplicates
  const mentions = await Promise.all(
    teamMemberIds.map(async (teamMemberId) => {
      return db.mention.upsert({
        where: {
          issueId_teamMemberId: {
            issueId,
            teamMemberId,
          },
        },
        create: {
          issueId,
          teamMemberId,
          notified: false,
        },
        update: {}, // Don't update if exists
        select: {
          id: true,
          teamMemberId: true,
          notified: true,
        },
      })
    })
  )

  return mentions
}

/**
 * Get all mentions for an issue with team member details
 */
export async function getMentionsForIssue(issueId: string) {
  return db.mention.findMany({
    where: { issueId },
    include: {
      teamMember: {
        select: {
          id: true,
          name: true,
          role: true,
          phone: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}
