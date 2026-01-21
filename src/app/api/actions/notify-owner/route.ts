import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsAppMessage } from '@/services/whatsapp/twilio';

/**
 * POST /api/actions/notify-owner
 * Quick action to send a project update to the property owner
 *
 * Body:
 *   - projectId: required - the project to notify about
 *   - type: optional - type of notification (progress_update, milestone, issue_resolved, photo_added)
 *   - customMessage: optional - custom message to send
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type = 'progress_update', customMessage } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Get project details
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        Property: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get linked WhatsApp number
    const linkedPhone = await db.whatsAppNumber.findFirst({
      where: {
        projectId,
        verified: true,
      },
    });

    if (!linkedPhone) {
      return NextResponse.json({
        success: false,
        message: 'Geen WhatsApp nummer gekoppeld',
        error: 'No verified WhatsApp number linked to this project',
      });
    }

    // Get project statistics
    const currentPhase = project.Property.currentPhase || 'In aanbouw';

    // Get recent activity counts
    const [recentDocs, openIssues, resolvedIssues] = await Promise.all([
      db.document.count({
        where: {
          projectId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      db.issue.count({
        where: {
          projectId,
          status: { in: ['open', 'in_progress'] },
        },
      }),
      db.issue.count({
        where: {
          projectId,
          status: 'resolved',
          resolvedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calculate a rough progress percentage based on phase
    const phaseProgress: Record<string, number> = {
      GRONDWERK: 10,
      FUNDERING: 20,
      RUWBOUW: 35,
      DAKCONSTRUCTIE: 50,
      GEVELWERK: 65,
      INSTALLATIES: 75,
      AFBOUW: 90,
      OPLEVERING: 100,
    };
    const progress = phaseProgress[currentPhase as string] || 50;

    // Build message based on type
    let message: string;

    if (customMessage) {
      message = customMessage;
    } else {
      switch (type) {
        case 'milestone':
          message = `Helder: Nieuw mijlpaal bereikt voor ${project.name}! De ${currentPhase} fase is afgerond. Voortgang: ${progress}%. Bekijk de details in uw dashboard.`;
          break;

        case 'issue_resolved':
          message = `Helder: Goed nieuws! ${resolvedIssues > 0 ? resolvedIssues : 'Een'} issue(s) ${resolvedIssues === 1 ? 'is' : 'zijn'} opgelost bij ${project.name}. ${openIssues > 0 ? `Nog ${openIssues} open.` : 'Alle issues zijn opgelost!'} Bekijk de details in uw dashboard.`;
          break;

        case 'photo_added':
          message = `Helder: ${recentDocs > 0 ? recentDocs : 'Nieuwe'} foto${recentDocs !== 1 ? "'s" : ''} toegevoegd aan ${project.name}. Voortgang: ${progress}%. Bekijk ze in uw dashboard.`;
          break;

        case 'progress_update':
        default:
          message = `Helder: Update voor ${project.name}\n\nFase: ${currentPhase}\nVoortgang: ${progress}%${recentDocs > 0 ? `\nNieuwe foto's: ${recentDocs}` : ''}${openIssues > 0 ? `\nOpen issues: ${openIssues}` : ''}\n\nBekijk de details in uw Helder dashboard.`;
          break;
      }
    }

    // Send WhatsApp message
    const result = await sendWhatsAppMessage(linkedPhone.phoneNumber, message);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Bericht kon niet worden verzonden',
        error: result.error,
      });
    }

    console.log('[QuickActions] Notified owner:', linkedPhone.phoneNumber, 'for project:', projectId);

    return NextResponse.json({
      success: true,
      message: 'Eigenaar is op de hoogte gebracht',
      notification: {
        type,
        sentTo: linkedPhone.phoneNumber.replace(/\d{4}$/, '****'), // Mask last 4 digits
        messageSid: result.messageSid,
      },
    });
  } catch (error) {
    console.error('[QuickActions] Error notifying owner:', error);
    return NextResponse.json(
      { error: 'Failed to notify owner' },
      { status: 500 }
    );
  }
}
