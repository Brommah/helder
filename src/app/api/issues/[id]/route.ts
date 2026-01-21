import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseMentions } from '@/services/mentions';
import { processMentions } from '@/services/mention-notifications';

/**
 * GET /api/issues/[id] - Get a single issue
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const issue = await db.issue.findUnique({
      where: { id },
      include: {
        document: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
            mimeType: true,
            extractedData: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/issues/[id] - Update an issue
 * Body (all optional):
 *   - status: open, in_progress, resolved, dismissed
 *   - severity: low, medium, high, critical
 *   - assignedTo: string
 *   - description: string
 *   - title: string
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, severity, assignedTo, description, title } = body;

    // Check if issue exists
    const existingIssue = await db.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (status !== undefined) {
      updateData.status = status;
      // Set resolvedAt when marking as resolved
      if (status === 'resolved' && existingIssue.status !== 'resolved') {
        updateData.resolvedAt = new Date();
      }
      // Clear resolvedAt when reopening
      if (status !== 'resolved' && existingIssue.status === 'resolved') {
        updateData.resolvedAt = null;
      }
    }

    if (severity !== undefined) {
      updateData.severity = severity;
    }

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo || null;
    }

    // Update the issue
    const issue = await db.issue.update({
      where: { id },
      data: updateData,
      include: {
        document: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            companyId: true,
          },
        },
        mentions: {
          include: {
            teamMember: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    console.log('[Issues] Updated issue:', issue.id, updateData);

    // If description or title changed, parse for new @mentions
    if ((description !== undefined || title !== undefined) && issue.project.companyId) {
      const textToScan = `${issue.title} ${issue.description || ''}`;
      if (textToScan.includes('@')) {
        try {
          const matches = await parseMentions(textToScan, issue.project.companyId);
          if (matches.length > 0) {
            const teamMemberIds = matches.map(m => m.teamMember.id);
            // Get base URL for notification links
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000';

            // Process mentions and send WhatsApp notifications for new mentions only
            const result = await processMentions(issue.id, teamMemberIds, baseUrl);
            console.log('[Issues] Auto-processed mentions on update:', result);
          }
        } catch (mentionError) {
          console.error('[Issues] Error processing mentions on update:', mentionError);
        }
      }
    }

    // Refetch with updated mentions
    const updatedIssue = await db.issue.findUnique({
      where: { id },
      include: {
        document: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        mentions: {
          include: {
            teamMember: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ issue: updatedIssue });
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { error: 'Failed to update issue' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/issues/[id] - Delete an issue
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if issue exists
    const existingIssue = await db.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    await db.issue.delete({
      where: { id },
    });

    console.log('[Issues] Deleted issue:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json(
      { error: 'Failed to delete issue' },
      { status: 500 }
    );
  }
}
