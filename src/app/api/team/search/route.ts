import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/team/search - Search team members for @mention autocomplete
 * Query params:
 *   - companyId: required - filter by company
 *   - q: required - search query (matches name, role, specialties)
 *   - limit: optional - max results (default 5)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      )
    }

    if (!query || query.length < 1) {
      return NextResponse.json({ teamMembers: [] })
    }

    // Search active team members
    const teamMembers = await db.teamMember.findMany({
      where: {
        companyId,
        active: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { role: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        role: true,
        phone: true,
        specialties: true,
      },
      take: Math.min(limit, 20),
      orderBy: { name: 'asc' },
    })

    // Also check for specialty matches (Prisma doesn't support contains on arrays well)
    if (teamMembers.length < limit) {
      const specialtyMatches = await db.teamMember.findMany({
        where: {
          companyId,
          active: true,
          id: { notIn: teamMembers.map(m => m.id) },
          specialties: { hasSome: [query] },
        },
        select: {
          id: true,
          name: true,
          role: true,
          phone: true,
          specialties: true,
        },
        take: limit - teamMembers.length,
        orderBy: { name: 'asc' },
      })
      teamMembers.push(...specialtyMatches)
    }

    // Add special suggestions
    const suggestions = []
    const queryLower = query.toLowerCase()

    // @team and @all suggestions
    if ('team'.startsWith(queryLower) || 'all'.startsWith(queryLower) || 'iedereen'.startsWith(queryLower)) {
      suggestions.push({
        id: 'special:team',
        name: 'Heel het team',
        role: 'Iedereen notificeren',
        phone: null,
        specialties: [],
        isSpecial: true,
        mentionText: '@team',
      })
    }

    return NextResponse.json({
      teamMembers: teamMembers.map(m => ({
        ...m,
        isSpecial: false,
        mentionText: `@${m.name.split(' ')[0].toLowerCase()}`,
      })),
      suggestions,
    })
  } catch (error) {
    console.error('Error searching team members:', error)
    return NextResponse.json(
      { error: 'Failed to search team members' },
      { status: 500 }
    )
  }
}
