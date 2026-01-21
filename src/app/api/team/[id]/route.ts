import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/team/[id] - Get a single team member
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const teamMember = await db.teamMember.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        mentions: {
          include: {
            issue: {
              select: {
                id: true,
                title: true,
                status: true,
                severity: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/team/[id] - Update a team member
 * Body (all optional):
 *   - name: string
 *   - role: string
 *   - phone: string (E.164 format)
 *   - email: string
 *   - specialties: string[]
 *   - active: boolean
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, role, phone, email, specialties, active } = body

    // Check if team member exists
    const existing = await db.teamMember.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Validate phone format if provided
    if (phone !== undefined && phone !== null && phone !== '' && !phone.match(/^\+[1-9]\d{6,14}$/)) {
      return NextResponse.json(
        { error: 'Phone must be in E.164 format (e.g., +31612345678)' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}

    if (name !== undefined) {
      updateData.name = name.trim()
    }

    if (role !== undefined) {
      updateData.role = role?.trim() || null
    }

    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null
    }

    if (email !== undefined) {
      updateData.email = email?.trim() || null
    }

    if (specialties !== undefined) {
      updateData.specialties = specialties
    }

    if (active !== undefined) {
      updateData.active = active
    }

    // Update team member
    const teamMember = await db.teamMember.update({
      where: { id },
      data: updateData,
    })

    console.log('[Team] Updated team member:', teamMember.id, updateData)

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/team/[id] - Deactivate (soft delete) a team member
 * Use PATCH with active: false for soft delete
 * This hard deletes - use with caution
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get('hard') === 'true'

    // Check if team member exists
    const existing = await db.teamMember.findUnique({
      where: { id },
      include: {
        _count: {
          select: { mentions: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    if (hardDelete) {
      // Hard delete - removes team member and all their mentions
      await db.teamMember.delete({
        where: { id },
      })
      console.log('[Team] Hard deleted team member:', id)
    } else {
      // Soft delete - just deactivate
      await db.teamMember.update({
        where: { id },
        data: { active: false },
      })
      console.log('[Team] Deactivated team member:', id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
