import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseMentions, createMentionsForIssue, getMentionsForIssue } from '@/services/mentions'
import { processMentions } from '@/services/mention-notifications'

/**
 * GET /api/issues/[id]/mention - Get all mentions for an issue
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if issue exists
    const issue = await db.issue.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    const mentions = await getMentionsForIssue(id)

    return NextResponse.json({
      mentions: mentions.map(m => ({
        id: m.id,
        teamMember: m.teamMember,
        notified: m.notified,
        notifiedAt: m.notifiedAt,
        createdAt: m.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching mentions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/issues/[id]/mention - Add mentions to an issue
 * Body options:
 *   - teamMemberIds: string[] - direct list of team member IDs
 *   - text: string - parse @mentions from text
 *   - notify: boolean - whether to send WhatsApp notifications (default: true)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { teamMemberIds, text, notify = true } = body

    // Get issue with project and company info
    const issue = await db.issue.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            Company: {
              select: { id: true },
            },
          },
        },
      },
    })

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    let memberIds: string[] = teamMemberIds || []

    // If text is provided, parse mentions from it
    if (text && issue.project.companyId) {
      const matches = await parseMentions(text, issue.project.companyId)
      const parsedIds = matches.map(m => m.teamMember.id)
      memberIds = [...new Set([...memberIds, ...parsedIds])]
    }

    if (memberIds.length === 0) {
      return NextResponse.json(
        { error: 'No team members to mention. Provide teamMemberIds or text with @mentions' },
        { status: 400 }
      )
    }

    // Get base URL for notification links
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000'

    if (notify) {
      // Create mentions and send notifications
      const result = await processMentions(id, memberIds, baseUrl)

      console.log('[Mentions] Processed mentions for issue:', id, result)

      // Get updated mention list
      const mentions = await getMentionsForIssue(id)

      return NextResponse.json({
        success: true,
        created: result.created,
        notified: result.notified,
        errors: result.errors,
        mentions: mentions.map(m => ({
          id: m.id,
          teamMember: m.teamMember,
          notified: m.notified,
          notifiedAt: m.notifiedAt,
        })),
      }, { status: 201 })
    } else {
      // Just create mentions without notifications
      const created = await createMentionsForIssue(id, memberIds)
      const mentions = await getMentionsForIssue(id)

      console.log('[Mentions] Created mentions for issue (no notify):', id, created.length)

      return NextResponse.json({
        success: true,
        created: created.length,
        notified: 0,
        errors: [],
        mentions: mentions.map(m => ({
          id: m.id,
          teamMember: m.teamMember,
          notified: m.notified,
          notifiedAt: m.notifiedAt,
        })),
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating mentions:', error)
    return NextResponse.json(
      { error: 'Failed to create mentions' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/issues/[id]/mention - Remove a mention from an issue
 * Query params:
 *   - mentionId: required - the mention to remove
 *   OR
 *   - teamMemberId: required - remove mention for this team member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const mentionId = searchParams.get('mentionId')
    const teamMemberId = searchParams.get('teamMemberId')

    if (!mentionId && !teamMemberId) {
      return NextResponse.json(
        { error: 'mentionId or teamMemberId is required' },
        { status: 400 }
      )
    }

    if (mentionId) {
      // Delete by mention ID
      await db.mention.delete({
        where: { id: mentionId },
      })
      console.log('[Mentions] Deleted mention:', mentionId)
    } else if (teamMemberId) {
      // Delete by issue + team member
      await db.mention.delete({
        where: {
          issueId_teamMemberId: {
            issueId: id,
            teamMemberId,
          },
        },
      })
      console.log('[Mentions] Deleted mention for team member:', teamMemberId, 'on issue:', id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting mention:', error)
    return NextResponse.json(
      { error: 'Failed to delete mention' },
      { status: 500 }
    )
  }
}
