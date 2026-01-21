import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { DocumentType, DocumentSource } from '@prisma/client';

/**
 * Get documents for the current user's property
 * GET /api/documents
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const projectId = searchParams.get('projectId');

    // Build query based on parameters
    const where: Record<string, unknown> = {};
    if (propertyId) {
      where.propertyId = propertyId;
    } else if (projectId) {
      where.projectId = projectId;
    } else if (session?.user?.id) {
      // Get user's properties
      const properties = await db.property.findMany({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      where.propertyId = { in: properties.map(p => p.id) };
    } else {
      // Demo fallback
      where.OR = [
        { propertyId: 'demo-property-1' },
        { projectId: 'proj_villa_zonneweide_ams' },
      ];
    }

    const documents = await db.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        mimeType: true,
        fileSize: true,
        fileUrl: true,
        verified: true,
        source: true,
        createdAt: true,
        extractedData: true,
      },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('[Documents API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Upload a new document
 * POST /api/documents
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const type = formData.get('type') as string;
    const propertyId = formData.get('propertyId') as string | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Validate document type
    if (!Object.values(DocumentType).includes(type as DocumentType)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const extension = file.name.split('.').pop() || 'bin';
    const filename = `${timestamp}_${randomStr}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create database record
    const document = await db.document.create({
      data: {
        id: `doc_${timestamp}_${randomStr}`,
        name,
        description: description || null,
        type: type as DocumentType,
        mimeType: file.type,
        fileSize: file.size,
        fileUrl: `/uploads/documents/${filename}`,
        propertyId: propertyId || null,
        projectId: projectId || null,
        uploadedById: session.user.id,
        source: DocumentSource.MANUAL,
        verified: false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        type: document.type,
        fileUrl: document.fileUrl,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error('[Documents API] Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

/**
 * Delete a document
 * DELETE /api/documents?id=xxx
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Check if user owns the document
    const document = await db.document.findFirst({
      where: {
        id: documentId,
        uploadedById: session.user.id,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete from database
    await db.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Documents API] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
