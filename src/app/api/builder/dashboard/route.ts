import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DocumentType, ProjectStatus } from '@prisma/client';

// Types for extracted data from AI classification
interface QualityData {
  score?: number;
  issues?: string[];
}

interface AIClassification {
  phase?: string;
  quality?: QualityData;
  attentionPoints?: string[];
  materials?: string[];
}

interface ExtractedData {
  aiClassification?: AIClassification;
}

/**
 * Builder Dashboard Aggregation API
 * GET /api/builder/dashboard
 *
 * Returns aggregated stats, recent activity, and project overview for builders
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's company
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true },
    });

    if (!user?.companyId) {
      return NextResponse.json({ error: 'No company associated' }, { status: 403 });
    }

    const companyId = user.companyId;

    // Calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch all projects for this company with comprehensive data
    const projects = await db.project.findMany({
      where: { companyId },
      include: {
        Property: {
          select: {
            id: true,
            name: true,
            street: true,
            houseNumber: true,
            postcode: true,
            city: true,
            kavelNumber: true,
            projectName: true,
            currentPhase: true,
            ownerId: true,
          },
        },
        ProjectPhase: {
          orderBy: { order: 'asc' },
        },
        Document: {
          select: {
            id: true,
            type: true,
            name: true,
            createdAt: true,
            extractedData: true,
            fileUrl: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        WhatsAppNumber: {
          select: {
            id: true,
            phoneNumber: true,
            verified: true,
          },
        },
        _count: {
          select: {
            Document: true,
            WhatsAppMessage: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Get owner names
    const ownerIds = Array.from(new Set(projects.map(p => p.Property.ownerId)));
    const owners = await db.user.findMany({
      where: { id: { in: ownerIds } },
      select: { id: true, name: true },
    });
    const ownerMap = new Map(owners.map(o => [o.id, o.name]));

    // Aggregate stats
    const activeProjects = projects.filter(
      p => !['COMPLETED', 'CANCELLED'].includes(p.status)
    ).length;

    // Photos this week
    const allPhotos = projects.flatMap(p =>
      p.Document.filter(d => d.type === DocumentType.PHOTO)
    );
    const photosThisWeek = allPhotos.filter(
      d => new Date(d.createdAt) >= oneWeekAgo
    ).length;

    // Calculate quality scores and issues
    let totalQualityScore = 0;
    let qualityScoreCount = 0;
    let totalIssues = 0;
    const allIssues: Array<{
      projectId: string;
      projectName: string;
      issue: string;
      documentId: string;
      createdAt: Date;
    }> = [];

    projects.forEach(project => {
      project.Document.forEach(doc => {
        const extracted = doc.extractedData as ExtractedData | null;
        const aiClass = extracted?.aiClassification;

        if (aiClass?.quality?.score) {
          totalQualityScore += aiClass.quality.score;
          qualityScoreCount++;
        }

        if (aiClass?.quality?.issues) {
          aiClass.quality.issues.forEach(issue => {
            totalIssues++;
            allIssues.push({
              projectId: project.id,
              projectName: project.name || project.Property.name || 'Onbekend',
              issue,
              documentId: doc.id,
              createdAt: doc.createdAt,
            });
          });
        }

        if (aiClass?.attentionPoints) {
          aiClass.attentionPoints.forEach(point => {
            allIssues.push({
              projectId: project.id,
              projectName: project.name || project.Property.name || 'Onbekend',
              issue: point,
              documentId: doc.id,
              createdAt: doc.createdAt,
            });
          });
        }
      });
    });

    const avgQualityScore = qualityScoreCount > 0
      ? Math.round(totalQualityScore / qualityScoreCount)
      : null;

    // Transform projects for dashboard
    const projectOverview = projects.map(project => {
      // Calculate progress
      let progress = 0;
      if (project.status === ProjectStatus.COMPLETED) {
        progress = 100;
      } else if (project.plannedStart && project.plannedEnd) {
        const start = new Date(project.plannedStart);
        const end = new Date(project.plannedEnd);
        if (now >= end) {
          progress = 95;
        } else if (now <= start) {
          progress = 5;
        } else {
          const total = end.getTime() - start.getTime();
          const elapsed = now.getTime() - start.getTime();
          progress = Math.min(95, Math.round((elapsed / total) * 100));
        }
      }

      // Build address
      const property = project.Property;
      let address = '';
      if (property.kavelNumber) {
        address = `Kavel ${property.kavelNumber}`;
        if (property.projectName) address += `, ${property.projectName}`;
        if (property.city) address += `, ${property.city}`;
      } else {
        const parts = [property.street, property.houseNumber, property.city].filter(Boolean);
        address = parts.join(' ');
      }

      // Photo count
      const photos = project.Document.filter(d => d.type === DocumentType.PHOTO);
      const photoCount = photos.length;

      // Quality metrics
      let projectQualitySum = 0;
      let projectQualityCount = 0;
      let projectIssueCount = 0;

      project.Document.forEach(doc => {
        const extracted = doc.extractedData as ExtractedData | null;
        const aiClass = extracted?.aiClassification;

        if (aiClass?.quality?.score) {
          projectQualitySum += aiClass.quality.score;
          projectQualityCount++;
        }
        if (aiClass?.quality?.issues) {
          projectIssueCount += aiClass.quality.issues.length;
        }
        if (aiClass?.attentionPoints) {
          projectIssueCount += aiClass.attentionPoints.length;
        }
      });

      const avgProjectQuality = projectQualityCount > 0
        ? Math.round(projectQualitySum / projectQualityCount)
        : null;

      // Determine status indicator
      let statusIndicator: 'on-track' | 'attention-needed' | 'issues' = 'on-track';
      if (projectIssueCount > 5 || (avgProjectQuality && avgProjectQuality < 60)) {
        statusIndicator = 'issues';
      } else if (projectIssueCount > 0 || (avgProjectQuality && avgProjectQuality < 80)) {
        statusIndicator = 'attention-needed';
      }

      // Get current phase
      const currentPhase = project.ProjectPhase.find(p => p.status === 'IN_PROGRESS')?.name ||
        property.currentPhase?.replace(/_/g, ' ') ||
        mapStatusToPhase(project.status);

      return {
        id: project.id,
        name: project.name || property.name || 'Onbekend project',
        address,
        client: ownerMap.get(property.ownerId) || 'Geen eigenaar',
        phase: currentPhase,
        photoCount,
        qualityScore: avgProjectQuality,
        issueCount: projectIssueCount,
        statusIndicator,
        progress,
        status: mapProjectStatus(project.status),
        hasWhatsApp: project.WhatsAppNumber.some(n => n.verified),
      };
    });

    // Recent activity feed
    const recentPhotos = allPhotos
      .filter(d => new Date(d.createdAt) >= oneDayAgo)
      .slice(0, 10)
      .map(d => {
        const project = projects.find(p => p.Document.some(doc => doc.id === d.id));
        return {
          type: 'photo' as const,
          documentId: d.id,
          name: d.name,
          projectId: project?.id,
          projectName: project?.name || project?.Property.name || 'Onbekend',
          timestamp: d.createdAt,
          fileUrl: d.fileUrl,
        };
      });

    const recentIssues = allIssues
      .filter(i => new Date(i.createdAt) >= oneDayAgo)
      .slice(0, 10)
      .map(i => ({
        type: 'issue' as const,
        ...i,
        timestamp: i.createdAt,
      }));

    // Phase changes (from timeline events)
    const phaseChangeEvents = await db.timelineEvent.findMany({
      where: {
        Project: { companyId },
        type: { in: ['CONSTRUCTION_START', 'FOUNDATION_COMPLETE', 'FRAMING_COMPLETE', 'ROOFING_COMPLETE', 'FINAL_INSPECTION', 'HANDOVER'] },
        createdAt: { gte: oneWeekAgo },
      },
      include: {
        Project: {
          select: { id: true, name: true, Property: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentPhaseChanges = phaseChangeEvents.map(e => ({
      type: 'phase_change' as const,
      eventId: e.id,
      eventType: e.type,
      title: e.title,
      projectId: e.Project?.id,
      projectName: e.Project?.name || e.Project?.Property?.name || 'Onbekend',
      timestamp: e.createdAt,
    }));

    // Combine and sort activity feed
    const activityFeed = [...recentPhotos, ...recentIssues, ...recentPhaseChanges]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return NextResponse.json({
      stats: {
        activeProjects,
        photosThisWeek,
        avgQualityScore,
        openIssues: totalIssues,
      },
      projects: projectOverview,
      activityFeed,
      recentIssues: allIssues.slice(0, 10),
    });
  } catch (error) {
    console.error('[Builder Dashboard] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function mapProjectStatus(
  status: ProjectStatus
): 'planning' | 'construction' | 'finishing' | 'handover' | 'completed' {
  switch (status) {
    case ProjectStatus.PLANNING:
    case ProjectStatus.PERMIT_PENDING:
    case ProjectStatus.APPROVED:
      return 'planning';
    case ProjectStatus.IN_PROGRESS:
      return 'construction';
    case ProjectStatus.ON_HOLD:
      return 'construction';
    case ProjectStatus.INSPECTION:
      return 'handover';
    case ProjectStatus.COMPLETED:
      return 'completed';
    case ProjectStatus.CANCELLED:
      return 'completed';
    default:
      return 'planning';
  }
}

function mapStatusToPhase(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.PLANNING:
      return 'Planning';
    case ProjectStatus.PERMIT_PENDING:
      return 'Vergunning';
    case ProjectStatus.APPROVED:
      return 'Goedgekeurd';
    case ProjectStatus.IN_PROGRESS:
      return 'In uitvoering';
    case ProjectStatus.ON_HOLD:
      return 'In wacht';
    case ProjectStatus.INSPECTION:
      return 'Keuring';
    case ProjectStatus.COMPLETED:
      return 'Voltooid';
    case ProjectStatus.CANCELLED:
      return 'Geannuleerd';
    default:
      return 'Onbekend';
  }
}
