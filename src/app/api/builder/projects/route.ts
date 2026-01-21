import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DocumentType, ProjectStatus } from '@prisma/client';

/**
 * Get all projects for the builder's company
 * GET /api/builder/projects
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

    // Get query params for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build filter
    const where: Record<string, unknown> = {
      companyId: user.companyId,
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as ProjectStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { Property: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Fetch projects with related data
    const projects = await db.project.findMany({
      where,
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
          where: { status: 'IN_PROGRESS' },
          take: 1,
          orderBy: { order: 'asc' },
        },
        Document: {
          select: { id: true, type: true },
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

    // Get owner names in a separate query
    const ownerIds = Array.from(new Set(projects.map(p => p.Property.ownerId)));
    const owners = await db.user.findMany({
      where: { id: { in: ownerIds } },
      select: { id: true, name: true },
    });
    const ownerMap = new Map(owners.map(o => [o.id, o.name]));

    // Transform to dashboard format
    const formattedProjects = projects.map((project) => {
      // Calculate progress based on phases or estimated dates
      let progress = 0;
      if (project.status === ProjectStatus.COMPLETED) {
        progress = 100;
      } else if (project.plannedStart && project.plannedEnd) {
        const now = new Date();
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

      // Get address string
      const property = project.Property;
      let address = '';
      if (property.kavelNumber) {
        address = `Kavel ${property.kavelNumber}`;
        if (property.projectName) address += `, ${property.projectName}`;
        if (property.city) address += `, ${property.city}`;
      } else {
        const parts = [
          property.street,
          property.houseNumber,
          property.postcode,
          property.city,
        ].filter(Boolean);
        address = parts.join(' ');
      }

      // Count photos
      const photosCount = project.Document.filter(
        (d: { type: DocumentType }) => d.type === DocumentType.PHOTO
      ).length;

      // Get current phase name
      const currentPhase = project.ProjectPhase[0]?.name ||
        property.currentPhase?.replace(/_/g, ' ') ||
        mapStatusToPhase(project.status);

      // Get owner name
      const clientName = ownerMap.get(property.ownerId) || 'Geen eigenaar gekoppeld';

      return {
        id: project.id,
        name: project.name || property.name || 'Untitled Project',
        address,
        client: clientName,
        status: mapProjectStatus(project.status),
        progress,
        startDate: project.plannedStart?.toISOString().split('T')[0] || null,
        endDate: project.plannedEnd?.toISOString().split('T')[0] || null,
        phase: currentPhase,
        alerts: 0, // TODO: Calculate from actual alerts
        documentsCount: project._count.Document,
        photosCount,
        messagesCount: project._count.WhatsAppMessage,
        whatsappNumbers: project.WhatsAppNumber,
      };
    });

    // Calculate stats - count milestone events
    const milestoneEvents = [
      'CONSTRUCTION_START', 'FOUNDATION_COMPLETE', 'FRAMING_COMPLETE',
      'ROOFING_COMPLETE', 'FINAL_INSPECTION', 'HANDOVER'
    ];

    const stats = {
      activeProjects: projects.filter(
        (p) => !['COMPLETED', 'CANCELLED'].includes(p.status)
      ).length,
      verified: projects.reduce(
        (acc, p) => acc + p.WhatsAppNumber.filter((n: { verified: boolean }) => n.verified).length,
        0
      ),
      photos: projects.reduce(
        (acc, p) =>
          acc + p.Document.filter((d: { type: DocumentType }) => d.type === DocumentType.PHOTO).length,
        0
      ),
      milestones: await db.timelineEvent.count({
        where: {
          Project: { companyId: user.companyId },
          type: { in: milestoneEvents as any },
        },
      }),
    };

    return NextResponse.json({
      projects: formattedProjects,
      stats,
    });
  } catch (error) {
    console.error('[Builder Projects] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Map database ProjectStatus to dashboard status
 */
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

/**
 * Map status to phase name
 */
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
