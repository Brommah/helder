import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processIncomingMessage } from '@/services/whatsapp/message-handler';
import { MessageDirection, MessageStatus } from '@prisma/client';
import twilio from 'twilio';

/**
 * Validate Twilio webhook signature
 */
function validateTwilioRequest(
  req: NextRequest,
  params: Record<string, string>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  // Skip validation in development if no auth token
  if (!authToken) {
    console.warn('[WhatsApp] No TWILIO_AUTH_TOKEN - skipping signature validation');
    return process.env.NODE_ENV === 'development';
  }

  const signature = req.headers.get('x-twilio-signature');
  if (!signature) {
    console.warn('[WhatsApp] Missing x-twilio-signature header');
    return false;
  }

  // Get the full URL for validation
  const url = req.url;

  try {
    return twilio.validateRequest(authToken, signature, url, params);
  } catch (error) {
    console.error('[WhatsApp] Signature validation error:', error);
    return false;
  }
}

/**
 * Twilio WhatsApp Webhook
 * Receives incoming messages from Twilio
 */
export async function POST(req: NextRequest) {
  try {
    // Clone request for validation (formData consumes the body)
    const clonedReq = req.clone();
    const body = await req.formData();
    
    // Convert FormData to plain object for validation and storage
    const params: Record<string, string> = {};
    body.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Validate Twilio signature in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = validateTwilioRequest(clonedReq, params);
      if (!isValid) {
        console.error('[WhatsApp] Invalid Twilio signature - rejecting request');
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // Extract data from params (already parsed above)
    const messageSid = params['MessageSid'];
    const from = params['From']; // whatsapp:+31612345678
    const to = params['To'];
    const messageBody = params['Body'];
    const numMedia = parseInt(params['NumMedia']) || 0;

    // Extract media URLs if present
    const mediaUrls: string[] = [];
    const mediaTypes: string[] = [];
    for (let i = 0; i < numMedia; i++) {
      const url = params[`MediaUrl${i}`];
      const type = params[`MediaContentType${i}`];
      if (url) mediaUrls.push(url);
      if (type) mediaTypes.push(type);
    }

    // Clean phone number (remove 'whatsapp:' prefix and normalize)
    let phoneNumber = from?.replace('whatsapp:', '').trim() || '';
    let toNumber = to?.replace('whatsapp:', '').trim() || '';

    // Ensure + prefix (URL encoding converts + to space)
    if (phoneNumber && !phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }
    if (toNumber && !toNumber.startsWith('+')) {
      toNumber = '+' + toNumber;
    }

    console.log(`[WhatsApp] Received message from ${phoneNumber}: ${messageBody || '[media]'}`);

    // Create unique message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log message to database
    const message = await db.whatsAppMessage.create({
      data: {
        id: messageId,
        twilioMessageId: messageSid,
        fromPhone: phoneNumber,
        toPhone: toNumber,
        direction: MessageDirection.INCOMING,
        content: messageBody || null,
        mediaUrl: mediaUrls[0] || null,
        mediaType: mediaTypes[0] || null,
        status: MessageStatus.RECEIVED,
        metadata: params,
      },
    });

    // Process async (don't block webhook response)
    processIncomingMessage(message.id).catch((error) => {
      console.error('[WhatsApp] Error processing message:', error);
    });

    // Twilio expects 200 OK with TwiML or empty response
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[WhatsApp] Webhook error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

/**
 * GET endpoint for Twilio webhook verification
 */
export async function GET() {
  return new NextResponse('WhatsApp webhook active', { status: 200 });
}
