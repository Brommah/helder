import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Get voice notes for a project
 * GET /api/voice-notes?projectId=xxx
 * Optional query params:
 * - search: Search in transcription text
 * - documentId: Filter by linked document
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const search = searchParams.get('search');
    const documentId = searchParams.get('documentId');

    // Build query
    const where: Record<string, unknown> = {};

    if (projectId) {
      where.projectId = projectId;
    } else if (session?.user?.id) {
      // Get user's company projects
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { Company: { include: { Project: { select: { id: true } } } } },
      });

      if (user?.Company?.Project) {
        where.projectId = { in: user.Company.Project.map((p) => p.id) };
      }
    } else {
      // Demo fallback
      where.projectId = 'proj_villa_zonneweide_ams';
    }

    // Add search filter
    if (search) {
      where.transcription = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filter by document
    if (documentId) {
      where.documentId = documentId;
    }

    const voiceNotes = await db.voiceNote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            name: true,
            type: true,
            fileUrl: true,
          },
        },
      },
    });

    // Format response
    const formattedNotes = voiceNotes.map((note) => ({
      id: note.id,
      projectId: note.projectId,
      projectName: note.project.name,
      documentId: note.documentId,
      linkedDocument: note.document
        ? {
            id: note.document.id,
            name: note.document.name,
            type: note.document.type,
            fileUrl: note.document.fileUrl,
          }
        : null,
      audioUrl: note.audioUrl,
      transcription: note.transcription,
      duration: note.duration,
      createdAt: note.createdAt,
      createdBy: note.createdBy,
    }));

    return NextResponse.json({
      voiceNotes: formattedNotes,
      total: formattedNotes.length,
    });
  } catch (error) {
    console.error('[Voice Notes API] Error:', error);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
