import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

/**
 * Proxy endpoint to fetch Twilio media with authentication
 * GET /api/media/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    // Find document
    const document = await db.document.findUnique({
      where: { id: documentId },
      select: { fileUrl: true, mimeType: true },
    });

    if (!document?.fileUrl) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Check if it's a Twilio URL
    if (document.fileUrl.includes('twilio.com')) {
      if (!accountSid || !authToken) {
        return new NextResponse('Twilio auth not configured', { status: 500 });
      }

      // Fetch with Basic Auth
      const response = await fetch(document.fileUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
      });

      if (!response.ok) {
        console.error('Twilio fetch failed:', response.status, response.statusText);
        return new NextResponse('Failed to fetch media', { status: response.status });
      }

      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': document.mimeType || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // Non-Twilio URL - redirect
    return NextResponse.redirect(document.fileUrl);
  } catch (error) {
    console.error('[Media Proxy] Error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
