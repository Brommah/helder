import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseMentions, createMentionsForIssue } from '@/services/mentions';
import { processMentions } from '@/services/mention-notifications';

/**
 * GET /api/issues - List issues for a project
 * Query params:
 *   - projectId: required - filter by project
 *   - status: optional - filter by status (open, in_progress, resolved, dismissed)
 *   - severity: optional - filter by severity (low, medium, high, critical)
 *   - phase: optional - filter by construction phase
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const phase = searchParams.get('phase');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Build filter conditions
    const where: any = {
      projectId,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (severity && severity !== 'all') {
      where.severity = severity;
    }

    if (phase && phase !== 'all') {
      where.phase = phase;
    }

    const issues = await db.issue.findMany({
      where,
      include: {
        document: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
            mimeType: true,
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
      orderBy: [
        { status: 'asc' }, // Open issues first
        { severity: 'desc' }, // Critical first
        { createdAt: 'desc' },
      ],
    });

    // Get counts for stats
    const [totalCount, openCount, resolvedCount, criticalCount] = await Promise.all([
      db.issue.count({ where: { projectId } }),
      db.issue.count({ where: { projectId, status: 'open' } }),
      db.issue.count({ where: { projectId, status: 'resolved' } }),
      db.issue.count({ where: { projectId, severity: 'critical', status: { not: 'resolved' } } }),
    ]);

    return NextResponse.json({
      issues,
      stats: {
        total: totalCount,
        open: openCount,
        resolved: resolvedCount,
        critical: criticalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/issues - Create a new issue
 * Body:
 *   - projectId: required
 *   - title: required
 *   - description: optional
 *   - severity: optional (default: medium)
 *   - documentId: optional - link to source photo
 *   - phase: optional
 *   - assignedTo: optional
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, description, severity, documentId, phase, assignedTo } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: 'projectId and title are required' },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create the issue
    const issue = await db.issue.create({
      data: {
        projectId,
        title,
        description: description || null,
        severity: severity || 'medium',
        status: 'open',
        documentId: documentId || null,
        phase: phase || null,
        assignedTo: assignedTo || null,
      },
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

    console.log('[Issues] Created new issue:', issue.id, issue.title);

    // Auto-parse @mentions from description and title
    const textToScan = `${title} ${description || ''}`;
    if (textToScan.includes('@') && issue.project.companyId) {
      try {
        const matches = await parseMentions(textToScan, issue.project.companyId);
        if (matches.length > 0) {
          const teamMemberIds = matches.map(m => m.teamMember.id);
          // Get base URL for notification links
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000';

          // Process mentions and send WhatsApp notifications
          const result = await processMentions(issue.id, teamMemberIds, baseUrl);
          console.log('[Issues] Auto-processed mentions:', result);
        }
      } catch (mentionError) {
        console.error('[Issues] Error processing mentions:', mentionError);
        // Don't fail the issue creation if mention processing fails
      }
    }

    // Refetch with updated mentions
    const updatedIssue = await db.issue.findUnique({
      where: { id: issue.id },
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

    return NextResponse.json({ issue: updatedIssue }, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    );
  }
}
