import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Construction phases in order
const CONSTRUCTION_PHASES = [
  { key: 'GRONDWERK', name: 'Grondwerk', order: 0 },
  { key: 'FUNDERING', name: 'Fundering', order: 1 },
  { key: 'RUWBOUW', name: 'Ruwbouw', order: 2 },
  { key: 'DAKCONSTRUCTIE', name: 'Dakconstructie', order: 3 },
  { key: 'GEVELWERK', name: 'Gevelwerk', order: 4 },
  { key: 'INSTALLATIES', name: 'Installaties', order: 5 },
  { key: 'AFBOUW', name: 'Afbouw', order: 6 },
  { key: 'OPLEVERING', name: 'Oplevering', order: 7 },
] as const;

// Milestone types mapped to phases
const MILESTONE_MAPPING: Record<string, string[]> = {
  'CONSTRUCTION_START': ['GRONDWERK'],
  'FOUNDATION_COMPLETE': ['FUNDERING'],
  'FRAMING_COMPLETE': ['RUWBOUW'],
  'ROOFING_COMPLETE': ['DAKCONSTRUCTIE'],
  'ELECTRICAL_COMPLETE': ['INSTALLATIES'],
  'PLUMBING_COMPLETE': ['INSTALLATIES'],
  'INSULATION_COMPLETE': ['GEVELWERK', 'DAKCONSTRUCTIE'],
  'DRYWALL_COMPLETE': ['AFBOUW'],
  'PAINTING_COMPLETE': ['AFBOUW'],
  'FLOORING_COMPLETE': ['AFBOUW'],
  'FINAL_INSPECTION': ['OPLEVERING'],
  'HANDOVER': ['OPLEVERING'],
};

interface PhaseData {
  key: string;
  name: string;
  order: number;
  status: 'completed' | 'current' | 'upcoming';
  startDate: string | null;
  endDate: string | null;
  photoCount: number;
  documentCount: number;
  avgQuality: number | null;
  photos: PhotoData[];
  milestones: MilestoneData[];
}

interface PhotoData {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  qualityScore: number | null;
  aiSummary: string | null;
  phase: string;
}

interface MilestoneData {
  id: string;
  title: string;
  description: string | null;
  occurredAt: string;
  type: string;
  verified: boolean;
}

/**
 * Get timeline data for a project
 * GET /api/timeline?projectId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const propertyId = searchParams.get('propertyId');

    // Build the query for documents
    const documentWhere: Record<string, unknown> = {
      type: { in: ['PHOTO', 'VIDEO', 'SMART_GLASSES_CAPTURE'] },
    };

    if (projectId) {
      documentWhere.projectId = projectId;
    } else if (propertyId) {
      documentWhere.propertyId = propertyId;
    } else if (session?.user?.id) {
      // Get user's properties
      const properties = await db.property.findMany({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      documentWhere.propertyId = { in: properties.map(p => p.id) };
    } else {
      // Demo fallback - use demo project
      documentWhere.OR = [
        { projectId: 'proj_villa_zonneweide_ams' },
        { propertyId: 'demo-property-1' },
      ];
    }

    // Fetch all photo documents with AI classification data
    const documents = await db.document.findMany({
      where: documentWhere,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        fileUrl: true,
        createdAt: true,
        extractedData: true,
        verified: true,
      },
    });

    // Fetch timeline events (milestones)
    const timelineEventWhere: Record<string, unknown> = {};
    if (projectId) {
      timelineEventWhere.projectId = projectId;
    } else if (propertyId) {
      timelineEventWhere.propertyId = propertyId;
    } else {
      timelineEventWhere.OR = [
        { projectId: 'proj_villa_zonneweide_ams' },
        { propertyId: 'demo-property-1' },
      ];
    }

    const timelineEvents = await db.timelineEvent.findMany({
      where: timelineEventWhere,
      orderBy: { occurredAt: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        occurredAt: true,
        verified: true,
        metadata: true,
      },
    });

    // Get current phase from property if available
    let currentPhaseKey: string | null = null;
    if (propertyId) {
      const property = await db.property.findUnique({
        where: { id: propertyId },
        select: { currentPhase: true },
      });
      currentPhaseKey = property?.currentPhase || null;
    }

    // Group documents by phase
    const phasePhotos: Record<string, PhotoData[]> = {};
    CONSTRUCTION_PHASES.forEach(phase => {
      phasePhotos[phase.key] = [];
    });

    documents.forEach(doc => {
      const extractedData = doc.extractedData as Record<string, unknown> | null;
      const aiClassification = extractedData?.aiClassification as Record<string, unknown> | null;
      const phase = (aiClassification?.phase as string) || 'UNKNOWN';
      const qualityScore = (aiClassification?.qualityScore as number) || null;
      const aiSummary = (aiClassification?.summary as string) || null;

      const photoData: PhotoData = {
        id: doc.id,
        name: doc.name,
        fileUrl: doc.fileUrl,
        createdAt: doc.createdAt.toISOString(),
        qualityScore,
        aiSummary,
        phase,
      };

      if (phasePhotos[phase]) {
        phasePhotos[phase].push(photoData);
      } else {
        // Unknown phase - add to most recent active phase or GRONDWERK
        phasePhotos['GRONDWERK'].push(photoData);
      }
    });

    // Group milestones by phase
    const phaseMilestones: Record<string, MilestoneData[]> = {};
    CONSTRUCTION_PHASES.forEach(phase => {
      phaseMilestones[phase.key] = [];
    });

    timelineEvents.forEach(event => {
      const eventType = event.type as string;
      const matchingPhases = MILESTONE_MAPPING[eventType] || [];

      const milestoneData: MilestoneData = {
        id: event.id,
        title: event.title,
        description: event.description,
        occurredAt: event.occurredAt.toISOString(),
        type: eventType,
        verified: event.verified,
      };

      // Add to all matching phases
      matchingPhases.forEach(phaseKey => {
        if (phaseMilestones[phaseKey]) {
          phaseMilestones[phaseKey].push(milestoneData);
        }
      });

      // If no matching phase, add to relevant phase based on event type
      if (matchingPhases.length === 0) {
        phaseMilestones['OPLEVERING'].push(milestoneData);
      }
    });

    // Build phase data with status calculation
    const phases: PhaseData[] = CONSTRUCTION_PHASES.map(phase => {
      const photos = phasePhotos[phase.key];
      const milestones = phaseMilestones[phase.key];

      // Calculate date range
      const allDates = [
        ...photos.map(p => new Date(p.createdAt)),
        ...milestones.map(m => new Date(m.occurredAt)),
      ].sort((a, b) => a.getTime() - b.getTime());

      const startDate = allDates.length > 0 ? allDates[0].toISOString() : null;
      const endDate = allDates.length > 1 ? allDates[allDates.length - 1].toISOString() : startDate;

      // Calculate average quality score
      const qualityScores = photos
        .map(p => p.qualityScore)
        .filter((s): s is number => s !== null);
      const avgQuality = qualityScores.length > 0
        ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length * 10) / 10
        : null;

      // Determine status
      let status: 'completed' | 'current' | 'upcoming' = 'upcoming';

      if (currentPhaseKey) {
        // Use property's current phase to determine status
        const currentPhaseOrder = CONSTRUCTION_PHASES.find(p => p.key === currentPhaseKey)?.order ?? -1;
        if (phase.order < currentPhaseOrder) {
          status = 'completed';
        } else if (phase.order === currentPhaseOrder) {
          status = 'current';
        } else {
          status = 'upcoming';
        }
      } else {
        // Infer from photos and milestones
        const hasCompletionMilestone = milestones.some(m =>
          m.type.includes('COMPLETE') || m.type === 'HANDOVER'
        );

        if (hasCompletionMilestone) {
          status = 'completed';
        } else if (photos.length > 0 || milestones.length > 0) {
          // Has activity but no completion - check if any later phase has activity
          const laterPhasesHaveActivity = CONSTRUCTION_PHASES
            .filter(p => p.order > phase.order)
            .some(p => phasePhotos[p.key].length > 0 || phaseMilestones[p.key].length > 0);

          status = laterPhasesHaveActivity ? 'completed' : 'current';
        }
      }

      return {
        key: phase.key,
        name: phase.name,
        order: phase.order,
        status,
        startDate,
        endDate,
        photoCount: photos.length,
        documentCount: photos.length, // Could be expanded to include other doc types
        avgQuality,
        photos: photos.slice(0, 20), // Limit photos returned
        milestones,
      };
    });

    // Calculate overall statistics
    const totalPhotos = documents.length;
    const completedPhases = phases.filter(p => p.status === 'completed').length;
    const currentPhase = phases.find(p => p.status === 'current');

    // Calculate overall progress percentage
    let progressPercent = 0;
    if (completedPhases === CONSTRUCTION_PHASES.length) {
      progressPercent = 100;
    } else {
      const baseProgress = (completedPhases / CONSTRUCTION_PHASES.length) * 100;
      // Add partial progress for current phase based on photo count expectation
      if (currentPhase) {
        const expectedPhotosPerPhase = 10; // Estimated
        const currentPhaseProgress = Math.min(currentPhase.photoCount / expectedPhotosPerPhase, 1);
        progressPercent = Math.round(baseProgress + (currentPhaseProgress * (100 / CONSTRUCTION_PHASES.length)));
      } else {
        progressPercent = Math.round(baseProgress);
      }
    }

    // Key milestones summary
    const keyMilestones = [
      { key: 'START', name: 'Start', date: phases[0]?.startDate, completed: phases[0]?.status !== 'upcoming' },
      { key: 'FOUNDATION', name: 'Fundering Klaar', date: phases[1]?.endDate, completed: phases[1]?.status === 'completed' },
      { key: 'RUWBOUW', name: 'Ruwbouw Klaar', date: phases[2]?.endDate, completed: phases[2]?.status === 'completed' },
      { key: 'WATERDICHT', name: 'Waterdicht', date: phases[4]?.endDate, completed: phases[4]?.status === 'completed' },
      { key: 'OPLEVERING', name: 'Oplevering', date: phases[7]?.endDate, completed: phases[7]?.status === 'completed' },
    ];

    return NextResponse.json({
      phases,
      summary: {
        totalPhotos,
        completedPhases,
        totalPhases: CONSTRUCTION_PHASES.length,
        currentPhase: currentPhase?.name || null,
        currentPhaseKey: currentPhase?.key || null,
        progressPercent,
      },
      milestones: keyMilestones,
    });
  } catch (error) {
    console.error('[Timeline API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
