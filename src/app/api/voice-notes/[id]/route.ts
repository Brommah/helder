import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Get a single voice note by ID
 * GET /api/voice-notes/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const voiceNote = await db.voiceNote.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        document: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            fileUrl: true,
            mimeType: true,
            extractedData: true,
            createdAt: true,
          },
        },
      },
    });

    if (!voiceNote) {
      return NextResponse.json(
        { error: 'Voice note niet gevonden' },
        { status: 404 }
      );
    }

    // Format response
    const response = {
      id: voiceNote.id,
      projectId: voiceNote.projectId,
      project: {
        id: voiceNote.project.id,
        name: voiceNote.project.name,
        status: voiceNote.project.status,
      },
      documentId: voiceNote.documentId,
      linkedDocument: voiceNote.document
        ? {
            id: voiceNote.document.id,
            name: voiceNote.document.name,
            description: voiceNote.document.description,
            type: voiceNote.document.type,
            fileUrl: voiceNote.document.fileUrl,
            mimeType: voiceNote.document.mimeType,
            extractedData: voiceNote.document.extractedData,
            createdAt: voiceNote.document.createdAt,
          }
        : null,
      audioUrl: voiceNote.audioUrl,
      transcription: voiceNote.transcription,
      duration: voiceNote.duration,
      createdAt: voiceNote.createdAt,
      createdBy: voiceNote.createdBy,
    };

    return NextResponse.json({ voiceNote: response });
  } catch (error) {
    console.error('[Voice Note API] Error:', error);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}

/**
 * Delete a voice note
 * DELETE /api/voice-notes/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
    }

    const { id } = await params;

    // Check if voice note exists
    const voiceNote = await db.voiceNote.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            Company: {
              include: {
                User: { where: { id: session.user.id }, select: { id: true } },
              },
            },
          },
        },
      },
    });

    if (!voiceNote) {
      return NextResponse.json(
        { error: 'Voice note niet gevonden' },
        { status: 404 }
      );
    }

    // Check authorization (user must belong to the company that owns the project)
    if (voiceNote.project.Company.User.length === 0) {
      return NextResponse.json(
        { error: 'Geen toegang tot deze voice note' },
        { status: 403 }
      );
    }

    // Delete the voice note
    await db.voiceNote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Voice note verwijderd' });
  } catch (error) {
    console.error('[Voice Note API] Delete error:', error);
    return NextResponse.json(
      { error: 'Kon voice note niet verwijderen' },
      { status: 500 }
    );
  }
}
