import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage, sendWhatsAppMediaMessage } from '@/services/whatsapp/twilio';
import { MessageDirection, MessageStatus } from '@prisma/client';

/**
 * Send a WhatsApp message
 * POST /api/whatsapp/send
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, message, mediaUrl, projectId } = await req.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'phoneNumber and message are required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    let normalizedPhone = phoneNumber.replace(/\s+/g, '');
    if (!normalizedPhone.startsWith('+')) {
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '+31' + normalizedPhone.substring(1);
      } else {
        normalizedPhone = '+' + normalizedPhone;
      }
    }

    // Send the message
    let result;
    if (mediaUrl) {
      result = await sendWhatsAppMediaMessage(normalizedPhone, message, mediaUrl);
    } else {
      result = await sendWhatsAppMessage(normalizedPhone, message);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send message', details: result.error },
        { status: 500 }
      );
    }

    // Log outgoing message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.whatsAppMessage.create({
      data: {
        id: messageId,
        twilioMessageId: result.messageSid || messageId,
        fromPhone: process.env.TWILIO_WHATSAPP_NUMBER?.replace('whatsapp:', '') || '',
        toPhone: normalizedPhone,
        direction: MessageDirection.OUTGOING,
        content: message,
        mediaUrl: mediaUrl || null,
        status: MessageStatus.SENT,
        projectId: projectId || null,
      },
    });

    return NextResponse.json({
      success: true,
      messageSid: result.messageSid,
    });
  } catch (error) {
    console.error('[WhatsApp Send] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
