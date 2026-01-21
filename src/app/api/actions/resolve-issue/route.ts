import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/actions/resolve-issue
 * Quick action to mark the most recent open issue as resolved
 *
 * Body:
 *   - projectId: required - the project to resolve issues for
 *   - issueId: optional - specific issue to resolve (if not provided, resolves the most critical open issue)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, issueId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    let issue;

    if (issueId) {
      // Resolve specific issue
      issue = await db.issue.findUnique({
        where: { id: issueId },
      });

      if (!issue) {
        return NextResponse.json(
          { error: 'Issue not found' },
          { status: 404 }
        );
      }

      if (issue.projectId !== projectId) {
        return NextResponse.json(
          { error: 'Issue does not belong to this project' },
          { status: 403 }
        );
      }
    } else {
      // Find the most critical open issue
      issue = await db.issue.findFirst({
        where: {
          projectId,
          status: { in: ['open', 'in_progress'] },
        },
        orderBy: [
          { severity: 'desc' }, // Critical > high > medium > low
          { createdAt: 'asc' }, // Oldest first
        ],
      });

      if (!issue) {
        return NextResponse.json({
          success: true,
          message: 'Geen open issues gevonden',
          resolved: false,
        });
      }
    }

    // Mark the issue as resolved
    const updatedIssue = await db.issue.update({
      where: { id: issue.id },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log('[QuickActions] Resolved issue:', updatedIssue.id, updatedIssue.title);

    return NextResponse.json({
      success: true,
      message: `"${updatedIssue.title}" opgelost`,
      resolved: true,
      issue: {
        id: updatedIssue.id,
        title: updatedIssue.title,
        severity: updatedIssue.severity,
      },
    });
  } catch (error) {
    console.error('[QuickActions] Error resolving issue:', error);
    return NextResponse.json(
      { error: 'Failed to resolve issue' },
      { status: 500 }
    );
  }
}
