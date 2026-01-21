import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/team - List team members for a company
 * Query params:
 *   - companyId: required - filter by company
 *   - active: optional - filter by active status (true/false)
 *   - role: optional - filter by role
 *   - search: optional - search by name, role, or specialties
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const activeParam = searchParams.get('active')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      )
    }

    // Build filter conditions
    const where: any = {
      companyId,
    }

    // Filter by active status
    if (activeParam !== null) {
      where.active = activeParam === 'true'
    }

    // Filter by role
    if (role) {
      where.role = { contains: role, mode: 'insensitive' }
    }

    // Search across name, role, and specialties
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { specialties: { hasSome: [search] } },
      ]
    }

    const teamMembers = await db.teamMember.findMany({
      where,
      orderBy: [
        { active: 'desc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: {
            mentions: true,
          },
        },
      },
    })

    // Get unique roles for filtering options
    const allMembers = await db.teamMember.findMany({
      where: { companyId },
      select: { role: true },
      distinct: ['role'],
    })
    const roles = allMembers
      .map(m => m.role)
      .filter((r): r is string => r !== null)
      .sort()

    return NextResponse.json({
      teamMembers: teamMembers.map(m => ({
        ...m,
        mentionCount: m._count.mentions,
      })),
      roles,
      stats: {
        total: teamMembers.length,
        active: teamMembers.filter(m => m.active).length,
        withPhone: teamMembers.filter(m => m.phone).length,
      },
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/team - Create a new team member
 * Body:
 *   - companyId: required
 *   - name: required
 *   - role: optional
 *   - phone: optional (E.164 format for WhatsApp)
 *   - email: optional
 *   - specialties: optional (array of strings)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, name, role, phone, email, specialties } = body

    if (!companyId || !name) {
      return NextResponse.json(
        { error: 'companyId and name are required' },
        { status: 400 }
      )
    }

    // Verify company exists
    const company = await db.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Validate phone format (E.164)
    if (phone && !phone.match(/^\+[1-9]\d{6,14}$/)) {
      return NextResponse.json(
        { error: 'Phone must be in E.164 format (e.g., +31612345678)' },
        { status: 400 }
      )
    }

    // Create team member
    const teamMember = await db.teamMember.create({
      data: {
        companyId,
        name: name.trim(),
        role: role?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        specialties: specialties || [],
        active: true,
      },
    })

    console.log('[Team] Created team member:', teamMember.id, teamMember.name)

    return NextResponse.json({ teamMember }, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
