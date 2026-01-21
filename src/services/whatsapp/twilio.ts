import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

// Initialize Twilio client - WhatsApp Sandbox requires Account SID + Auth Token
let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
  // Account SID + Auth Token - required for WhatsApp Sandbox
  client = twilio(accountSid, authToken);
  console.log('[Twilio] Client initialized with Account SID + Auth Token');
} else if (apiKeySid && apiKeySecret && accountSid) {
  // API Key authentication (fallback, may not work with WhatsApp Sandbox)
  client = twilio(apiKeySid, apiKeySecret, { accountSid });
  console.log('[Twilio] Client initialized with API Key');
}

export interface SendMessageResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<SendMessageResult> {
  console.log(`[Twilio] Attempting to send message to ${to}`);
  
  if (!client) {
    console.warn('[Twilio] Client not initialized - missing credentials');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    // Ensure proper format
    const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    console.log(`[Twilio] Sending from ${whatsappNumber} to ${toNumber}`);
    console.log(`[Twilio] Message preview: ${body.substring(0, 100)}...`);

    const message = await client.messages.create({
      from: whatsappNumber,
      to: toNumber,
      body,
    });

    console.log(`[Twilio] Message sent successfully! SID: ${message.sid}`);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('[Twilio] Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a WhatsApp message with media
 */
export async function sendWhatsAppMediaMessage(
  to: string,
  body: string,
  mediaUrl: string
): Promise<SendMessageResult> {
  if (!client) {
    console.warn('Twilio client not initialized - missing credentials');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    const message = await client.messages.create({
      from: whatsappNumber,
      to: toNumber,
      body,
      mediaUrl: [mediaUrl],
    });

    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('Error sending WhatsApp media message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Download media from Twilio
 * Note: Twilio media requires Account SID + Auth Token (not API Key)
 */
export async function downloadTwilioMedia(mediaUrl: string): Promise<Buffer | null> {
  // Twilio media download requires Account SID + Auth Token
  if (!accountSid || !authToken) {
    console.warn('Twilio Account SID and Auth Token required for media download');
    return null;
  }

  try {
    const response = await fetch(mediaUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download media: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error('Error downloading Twilio media:', error);
    return null;
  }
}

/**
 * Validate Twilio webhook signature
 */
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const secret = authToken || apiKeySecret;
  if (!secret) {
    console.warn('Cannot validate signature - auth token not configured');
    return false;
  }

  return twilio.validateRequest(secret, signature, url, params);
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification code to a phone number
 */
export async function sendVerificationCode(
  phoneNumber: string,
  code: string
): Promise<SendMessageResult> {
  const message = `Helder verificatie code: ${code}\n\nStuur foto's naar dit nummer om ze automatisch toe te voegen aan je project.`;
  return sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Send a notification about a new document
 */
export async function sendDocumentNotification(
  phoneNumber: string,
  projectName: string,
  documentCount: number
): Promise<SendMessageResult> {
  const message = `Helder: ${documentCount} ${documentCount === 1 ? 'foto' : "foto's"} toegevoegd aan ${projectName}. Bekijk ze in je dashboard.`;
  return sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Send a phase change notification
 */
export async function sendPhaseChangeNotification(
  phoneNumber: string,
  projectName: string,
  phaseName: string
): Promise<SendMessageResult> {
  const message = `Helder: ${projectName} is nu in fase "${phaseName}". Bekijk de voortgang in je dashboard.`;
  return sendWhatsAppMessage(phoneNumber, message);
}
