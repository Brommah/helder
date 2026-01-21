import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ConstructionPhase } from '@prisma/client';
import {
  analyzePhaseProgress,
  autoAdvancePhase,
  getPhaseStatus,
  mapDetailedToDbPhase,
  CONSTRUCTION_PHASES_ORDERED,
  type DetailedPhase,
} from '@/services/ai/phase-detection';

/**
 * GET /api/projects/[id]/phase
 * Returns current phase analysis for a project
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;

    // Verify user has access to this project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        Company: {
          select: { id: true },
        },
        Property: {
          select: {
            id: true,
            currentPhase: true,
            ownerId: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check user has access (either property owner or company member)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true },
    });

    const hasAccess =
      project.Property.ownerId === session.user.id ||
      (user?.companyId && user.companyId === project.companyId);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get phase status and analysis
    const phaseStatus = await getPhaseStatus(projectId);

    // Get phase history from timeline events
    const phaseTransitions = await db.timelineEvent.findMany({
      where: {
        projectId,
        metadata: {
          path: ['phaseTransition'],
          equals: true,
        },
      },
      orderBy: { occurredAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        occurredAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({
      projectId,
      currentPhase: phaseStatus.currentPhase,
      dbPhase: phaseStatus.dbPhase,
      phaseProgress: phaseStatus.phaseProgress,
      phases: phaseStatus.phases,
      analysis: {
        confidence: phaseStatus.analysis.currentPhaseConfidence,
        detectedPhases: phaseStatus.analysis.detectedPhases,
        completionIndicators: phaseStatus.analysis.phaseCompletionIndicators,
        readyToAdvance: phaseStatus.analysis.readyToAdvance,
        suggestedNextPhase: phaseStatus.analysis.suggestedNextPhase,
        advanceReason: phaseStatus.analysis.advanceReason,
        photosAnalyzed: phaseStatus.analysis.recentPhotosAnalyzed,
      },
      phaseHistory: phaseTransitions.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        occurredAt: t.occurredAt,
        fromPhase: (t.metadata as Record<string, unknown>)?.fromPhase,
        toPhase: (t.metadata as Record<string, unknown>)?.toPhase,
        confidence: (t.metadata as Record<string, unknown>)?.confidence,
      })),
    });
  } catch (error) {
    console.error('[Phase API] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/phase
 * Manually advance or set project phase (override)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    const body = await req.json();
    const { action, targetPhase, reason } = body as {
      action: 'advance' | 'set' | 'revert';
      targetPhase?: DetailedPhase;
      reason?: string;
    };

    // Verify user has access to this project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        Company: {
          select: { id: true },
        },
        Property: {
          select: {
            id: true,
            currentPhase: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check user is company member (builders can change phase)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true, role: true },
    });

    if (!user?.companyId || user.companyId !== project.companyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const phaseNames: Record<DetailedPhase, string> = {
      GRONDWERK: 'Grondwerk',
      FUNDERING: 'Fundering',
      RUWBOUW: 'Ruwbouw',
      DAKCONSTRUCTIE: 'Dakconstructie',
      GEVELWERK: 'Gevelwerk',
      INSTALLATIES: 'Installaties',
      AFBOUW: 'Afbouw',
      OPLEVERING: 'Oplevering',
    };

    if (action === 'advance') {
      // Auto-advance based on AI analysis
      const analysis = await analyzePhaseProgress(projectId);

      if (!analysis.readyToAdvance) {
        return NextResponse.json(
          {
            error: 'Phase not ready to advance',
            analysis: {
              currentPhase: analysis.currentPhase,
              confidence: analysis.currentPhaseConfidence,
              completionIndicators: analysis.phaseCompletionIndicators,
            },
          },
          { status: 400 }
        );
      }

      const result = await autoAdvancePhase(projectId, analysis, session.user.id);

      if (!result.advanced) {
        return NextResponse.json(
          { error: result.message || 'Failed to advance phase' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.message,
        newPhase: result.newPhase,
        phaseName: result.newPhase ? phaseNames[result.newPhase] : null,
      });
    } else if (action === 'set' && targetPhase) {
      // Manually set phase (override)
      if (!CONSTRUCTION_PHASES_ORDERED.includes(targetPhase)) {
        return NextResponse.json({ error: 'Invalid phase' }, { status: 400 });
      }

      const dbPhase = mapDetailedToDbPhase(targetPhase);
      const previousPhase = project.Property.currentPhase;

      // Update property phase
      await db.property.update({
        where: { id: project.Property.id },
        data: { currentPhase: dbPhase },
      });

      // Create timeline event for manual phase change
      await db.timelineEvent.create({
        data: {
          id: `evt_phase_manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'CUSTOM',
          title: `Fase handmatig ingesteld: ${phaseNames[targetPhase]}`,
          description: `Project fase handmatig gewijzigd naar ${phaseNames[targetPhase]}.${reason ? `\n\nReden: ${reason}` : ''}`,
          occurredAt: new Date(),
          propertyId: project.Property.id,
          projectId,
          createdById: session.user.id,
          metadata: {
            phaseTransition: true,
            manual: true,
            fromPhase: previousPhase,
            toPhase: targetPhase,
            reason: reason || 'Handmatige aanpassing',
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Fase ingesteld op ${phaseNames[targetPhase]}`,
        previousPhase,
        newPhase: targetPhase,
        phaseName: phaseNames[targetPhase],
      });
    } else if (action === 'revert') {
      // Find previous phase from history
      const lastTransition = await db.timelineEvent.findFirst({
        where: {
          projectId,
          metadata: {
            path: ['phaseTransition'],
            equals: true,
          },
        },
        orderBy: { occurredAt: 'desc' },
        select: {
          metadata: true,
        },
      });

      if (!lastTransition) {
        return NextResponse.json(
          { error: 'No phase history found' },
          { status: 400 }
        );
      }

      const previousPhase = (lastTransition.metadata as Record<string, unknown>)?.fromPhase as DetailedPhase | undefined;

      if (!previousPhase) {
        return NextResponse.json(
          { error: 'Previous phase not found in history' },
          { status: 400 }
        );
      }

      const dbPhase = mapDetailedToDbPhase(previousPhase);

      // Update property phase
      await db.property.update({
        where: { id: project.Property.id },
        data: { currentPhase: dbPhase },
      });

      // Create timeline event for revert
      await db.timelineEvent.create({
        data: {
          id: `evt_phase_revert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'CUSTOM',
          title: `Fase teruggedraaid naar: ${phaseNames[previousPhase]}`,
          description: `Project fase teruggedraaid naar ${phaseNames[previousPhase]}.${reason ? `\n\nReden: ${reason}` : ''}`,
          occurredAt: new Date(),
          propertyId: project.Property.id,
          projectId,
          createdById: session.user.id,
          metadata: {
            phaseTransition: true,
            revert: true,
            fromPhase: project.Property.currentPhase,
            toPhase: previousPhase,
            reason: reason || 'Fase correctie',
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Fase teruggedraaid naar ${phaseNames[previousPhase]}`,
        newPhase: previousPhase,
        phaseName: phaseNames[previousPhase],
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[Phase API] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]/phase
 * Update phase detection settings
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    const body = await req.json();
    const { autoAdvanceEnabled, notifyOnPhaseChange } = body as {
      autoAdvanceEnabled?: boolean;
      notifyOnPhaseChange?: boolean;
    };

    // Verify user has access
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { companyId: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true },
    });

    if (!user?.companyId || user.companyId !== project.companyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update notification preferences if they exist
    if (notifyOnPhaseChange !== undefined) {
      await db.notificationPreference.upsert({
        where: {
          companyId_projectId: {
            companyId: user.companyId,
            projectId,
          },
        },
        update: {
          notifyPhaseChange: notifyOnPhaseChange,
        },
        create: {
          companyId: user.companyId,
          projectId,
          notifyPhaseChange: notifyOnPhaseChange,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated',
    });
  } catch (error) {
    console.error('[Phase API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
