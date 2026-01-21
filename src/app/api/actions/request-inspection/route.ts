import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsAppMessage } from '@/services/whatsapp/twilio';

/**
 * POST /api/actions/request-inspection
 * Quick action to request an inspection for a project
 *
 * Body:
 *   - projectId: required - the project to request inspection for
 *   - type: optional - type of inspection (general, foundation, electrical, plumbing, final)
 *   - notes: optional - additional notes for the inspector
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type = 'general', notes } = body;

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

    // Determine inspection type label
    const inspectionTypes: Record<string, string> = {
      general: 'Algemene keuring',
      foundation: 'Funderingskeuring',
      electrical: 'Elektrakeuring',
      plumbing: 'Leidingkeuring',
      final: 'Eindoplevering keuring',
    };
    const inspectionLabel = inspectionTypes[type] || 'Keuring';

    // Create a timeline event for the inspection request
    const timelineEvent = await db.timelineEvent.create({
      data: {
        title: `${inspectionLabel} aangevraagd`,
        description: notes || `Keuring aangevraagd via Quick Actions`,
        occurredAt: new Date(),
        type: 'INSPECTION_COMPLETED', // Using closest available type
        verified: false,
        propertyId: project.propertyId,
        projectId: project.id,
        createdById: project.Property.ownerId,
      },
    });

    console.log('[QuickActions] Created inspection timeline event:', timelineEvent.id);

    // Try to notify relevant parties via WhatsApp
    const notificationsSent: string[] = [];

    // Check if there's a verified WhatsApp number linked to this project
    const linkedPhone = await db.whatsAppNumber.findFirst({
      where: {
        projectId,
        verified: true,
      },
    });

    if (linkedPhone) {
      const message = `Helder: ${inspectionLabel} is aangevraagd voor ${project.name}. We nemen spoedig contact op om een datum te plannen.`;

      try {
        const result = await sendWhatsAppMessage(linkedPhone.phoneNumber, message);
        if (result.success) {
          notificationsSent.push('eigenaar');
        }
      } catch (err) {
        console.error('[QuickActions] Failed to send WhatsApp notification:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${inspectionLabel} aangevraagd`,
      timelineEvent: {
        id: timelineEvent.id,
        title: timelineEvent.title,
      },
      notificationsSent,
    });
  } catch (error) {
    console.error('[QuickActions] Error requesting inspection:', error);
    return NextResponse.json(
      { error: 'Failed to request inspection' },
      { status: 500 }
    );
  }
}
