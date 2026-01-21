import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateVerificationCode, sendVerificationCode } from '@/services/whatsapp/twilio';

/**
 * Link a WhatsApp number to a company/project
 * POST /api/whatsapp/link
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, companyId: requestCompanyId, projectId } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'phoneNumber is required' },
        { status: 400 }
      );
    }

    // Resolve companyId - if 'current', get from user session
    let companyId = requestCompanyId;
    if (!companyId || companyId === 'current') {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { companyId: true },
      });
      companyId = user?.companyId;
    }

    if (!companyId) {
      return NextResponse.json(
        { error: 'No company associated with user' },
        { status: 400 }
      );
    }

    // Normalize phone number (ensure E.164 format)
    let normalizedPhone = phoneNumber.replace(/\s+/g, '');
    if (!normalizedPhone.startsWith('+')) {
      // Assume Dutch number if no country code
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '+31' + normalizedPhone.substring(1);
      } else {
        normalizedPhone = '+' + normalizedPhone;
      }
    }

    // Verify company exists
    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // If projectId provided, verify project exists and belongs to company
    if (projectId) {
      const project = await db.project.findFirst({
        where: { id: projectId, companyId },
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found or does not belong to company' },
          { status: 404 }
        );
      }
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verifyExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create or update WhatsApp number record
    const whatsappNumber = await db.whatsAppNumber.upsert({
      where: { phoneNumber: normalizedPhone },
      create: {
        id: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        phoneNumber: normalizedPhone,
        companyId,
        projectId: projectId || null,
        verified: false,
        verifyCode: verificationCode,
        verifyExpiry,
      },
      update: {
        companyId,
        projectId: projectId || null,
        verified: false,
        verifyCode: verificationCode,
        verifyExpiry,
      },
    });

    // Send verification message
    const result = await sendVerificationCode(normalizedPhone, verificationCode);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send verification code', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      whatsappNumberId: whatsappNumber.id,
      phoneNumber: normalizedPhone,
    });
  } catch (error) {
    console.error('[WhatsApp Link] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Resend verification code
 * PUT /api/whatsapp/link
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { whatsappNumberId } = await req.json();

    if (!whatsappNumberId) {
      return NextResponse.json(
        { error: 'whatsappNumberId is required' },
        { status: 400 }
      );
    }

    const whatsappNumber = await db.whatsAppNumber.findUnique({
      where: { id: whatsappNumberId },
    });

    if (!whatsappNumber) {
      return NextResponse.json({ error: 'WhatsApp number not found' }, { status: 404 });
    }

    if (whatsappNumber.verified) {
      return NextResponse.json(
        { error: 'Number already verified' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verifyExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await db.whatsAppNumber.update({
      where: { id: whatsappNumberId },
      data: {
        verifyCode: verificationCode,
        verifyExpiry,
      },
    });

    // Send verification message
    const result = await sendVerificationCode(whatsappNumber.phoneNumber, verificationCode);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send verification code', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'New verification code sent',
    });
  } catch (error) {
    console.error('[WhatsApp Link Resend] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get linked WhatsApp numbers for a company
 * GET /api/whatsapp/link?companyId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let companyId = searchParams.get('companyId');

    // Resolve 'current' to user's company
    if (!companyId || companyId === 'current') {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { companyId: true },
      });
      companyId = user?.companyId || null;
    }

    if (!companyId) {
      return NextResponse.json(
        { error: 'No company associated with user' },
        { status: 400 }
      );
    }

    const numbers = await db.whatsAppNumber.findMany({
      where: { companyId },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ numbers });
  } catch (error) {
    console.error('[WhatsApp Link GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete a linked WhatsApp number
 * DELETE /api/whatsapp/link
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const whatsappNumberId = searchParams.get('id');

    if (!whatsappNumberId) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    await db.whatsAppNumber.delete({
      where: { id: whatsappNumberId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Link DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
