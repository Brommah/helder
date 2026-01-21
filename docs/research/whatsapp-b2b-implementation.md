# WhatsApp B2B Service - Implementation Plan

## TL;DR

WhatsApp integration for builders to upload construction photos/docs. Zero behavior change required - they already use WhatsApp. We just capture, structure, and verify the content automatically.

**Timeline:** 2-3 weeks for MVP
**Dependencies:** Twilio WhatsApp Business API account

---

## 1. Current State

### What Exists
| Component | Status |
|-----------|--------|
| Data model (Document, TimelineEvent, MaterialUsage) | ✅ Complete |
| User roles (builder, contractor, homeowner) | ✅ In schema |
| Company/ProjectContractor tables | ✅ Exists |
| Builder dashboard UI | 🟡 Mock data only |
| WhatsApp integration | ❌ Zero |
| Message handling | ❌ Zero |

### What's Missing
- Twilio SDK integration
- Webhook endpoint for incoming messages
- Message/phone number database tables
- Auto-document creation from media
- Builder dashboard wiring to real data

---

## 2. Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Builder Phone  │────▶│  Twilio WhatsApp │────▶│  Helder API     │
│  (WhatsApp)     │     │  Business API    │     │  /api/whatsapp  │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────────────────────┼─────────────────────┐
                        │                                 ▼                     │
                        │    ┌──────────────────────────────────────────┐       │
                        │    │           Message Handler                 │       │
                        │    │  1. Parse incoming message                │       │
                        │    │  2. Identify sender (phone → company)     │       │
                        │    │  3. Download media (if photo/video)       │       │
                        │    │  4. Create Document record                │       │
                        │    │  5. Link to active project                │       │
                        │    │  6. Update timeline event                 │       │
                        │    └──────────────────────────────────────────┘       │
                        │                                 │                     │
                        │    ┌────────────┬───────────────┼───────────────┐     │
                        │    ▼            ▼               ▼               ▼     │
                        │ ┌──────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐ │
                        │ │ S3   │  │ Document │  │ Timeline   │  │ Message  │ │
                        │ │Bucket│  │ Table    │  │ Event      │  │ Log      │ │
                        │ └──────┘  └──────────┘  └────────────┘  └──────────┘ │
                        │                                                       │
                        │                    PostgreSQL                         │
                        └───────────────────────────────────────────────────────┘
                                                  │
                                                  ▼
                        ┌───────────────────────────────────────────────────────┐
                        │                  Homeowner Dashboard                   │
                        │         (sees photos/docs in real-time)               │
                        └───────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Additions

Add to `prisma/schema.prisma`:

```prisma
// WhatsApp number linked to company/project
model WhatsAppNumber {
  id          String   @id @default(cuid())
  phoneNumber String   @unique // E.164 format: +31612345678
  companyId   String
  projectId   String?  // Optional: link to specific project
  verified    Boolean  @default(false)
  verifiedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  company     Company  @relation(fields: [companyId], references: [id])
  project     Project? @relation(fields: [projectId], references: [id])
  messages    Message[]
}

// Message log for audit trail
model Message {
  id              String   @id @default(cuid())
  twilioMessageId String   @unique // Twilio SID
  fromPhone       String
  toPhone         String
  direction       MessageDirection
  content         String?  // Text content
  mediaUrl        String?  // Original Twilio media URL
  mediaType       String?  // image/jpeg, video/mp4, etc.
  status          MessageStatus @default(RECEIVED)

  // Link to created document (if media was processed)
  documentId      String?
  document        Document? @relation(fields: [documentId], references: [id])

  // Link to sender
  whatsappNumberId String?
  whatsappNumber   WhatsAppNumber? @relation(fields: [whatsappNumberId], references: [id])

  metadata        Json?    // Raw Twilio payload
  processedAt     DateTime?
  createdAt       DateTime @default(now())

  @@index([fromPhone])
  @@index([createdAt])
}

enum MessageDirection {
  INCOMING
  OUTGOING
}

enum MessageStatus {
  RECEIVED
  PROCESSING
  PROCESSED
  FAILED
  SENT
  DELIVERED
  READ
}

// Notification preferences per project
model NotificationPreference {
  id              String  @id @default(cuid())
  companyId       String
  projectId       String

  whatsappEnabled Boolean @default(true)
  emailEnabled    Boolean @default(true)

  // What to notify about
  notifyPhaseChange   Boolean @default(true)
  notifyDocumentAdded Boolean @default(false)
  notifyMilestone     Boolean @default(true)

  company         Company @relation(fields: [companyId], references: [id])
  project         Project @relation(fields: [projectId], references: [id])

  @@unique([companyId, projectId])
}
```

---

## 4. API Routes

### 4.1 Webhook Endpoint (Receive Messages)

**File:** `/src/app/api/whatsapp/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processIncomingMessage } from '@/services/whatsapp/message-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();

    // Twilio sends form-encoded data
    const messageSid = body.get('MessageSid') as string;
    const from = body.get('From') as string; // whatsapp:+31612345678
    const to = body.get('To') as string;
    const messageBody = body.get('Body') as string;
    const numMedia = parseInt(body.get('NumMedia') as string) || 0;

    // Extract media URLs if present
    const mediaUrls: string[] = [];
    const mediaTypes: string[] = [];
    for (let i = 0; i < numMedia; i++) {
      mediaUrls.push(body.get(`MediaUrl${i}`) as string);
      mediaTypes.push(body.get(`MediaContentType${i}`) as string);
    }

    // Clean phone number (remove 'whatsapp:' prefix)
    const phoneNumber = from.replace('whatsapp:', '');

    // Log message
    const message = await prisma.message.create({
      data: {
        twilioMessageId: messageSid,
        fromPhone: phoneNumber,
        toPhone: to.replace('whatsapp:', ''),
        direction: 'INCOMING',
        content: messageBody,
        mediaUrl: mediaUrls[0] || null,
        mediaType: mediaTypes[0] || null,
        status: 'RECEIVED',
        metadata: Object.fromEntries(body.entries()),
      },
    });

    // Process async (don't block webhook response)
    processIncomingMessage(message.id).catch(console.error);

    // Twilio expects 200 OK
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

// Twilio webhook validation (GET for setup)
export async function GET(req: NextRequest) {
  return new NextResponse('WhatsApp webhook active', { status: 200 });
}
```

### 4.2 Link Phone Number

**File:** `/src/app/api/whatsapp/link/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/services/whatsapp/twilio';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { phoneNumber, companyId, projectId } = await req.json();

  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Create or update WhatsApp number record
  const whatsappNumber = await prisma.whatsAppNumber.upsert({
    where: { phoneNumber },
    create: {
      phoneNumber,
      companyId,
      projectId,
      verified: false,
    },
    update: {
      companyId,
      projectId,
    },
  });

  // Store verification code (could use Redis for expiry)
  // For MVP, store in metadata or separate table

  // Send verification message
  await sendWhatsAppMessage(
    phoneNumber,
    `Helder verificatie code: ${verificationCode}\n\nStuur foto's naar dit nummer om ze automatisch toe te voegen aan je project.`
  );

  return NextResponse.json({
    success: true,
    message: 'Verification code sent',
    whatsappNumberId: whatsappNumber.id,
  });
}
```

### 4.3 Send Notification

**File:** `/src/app/api/whatsapp/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/services/whatsapp/twilio';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { phoneNumber, message, projectId } = await req.json();

  const result = await sendWhatsAppMessage(phoneNumber, message);

  return NextResponse.json({ success: true, messageSid: result.sid });
}
```

---

## 5. Services

### 5.1 Twilio Service

**File:** `/src/services/whatsapp/twilio.ts`

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // whatsapp:+14155238886

export async function sendWhatsAppMessage(to: string, body: string) {
  return client.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body,
  });
}

export async function downloadMedia(mediaUrl: string): Promise<Buffer> {
  const response = await fetch(mediaUrl, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64')}`,
    },
  });

  return Buffer.from(await response.arrayBuffer());
}
```

### 5.2 Message Handler Service

**File:** `/src/services/whatsapp/message-handler.ts`

```typescript
import { prisma } from '@/lib/prisma';
import { downloadMedia } from './twilio';
import { uploadToS3 } from '@/lib/s3';
import { DocumentType } from '@prisma/client';

export async function processIncomingMessage(messageId: string) {
  const message = await prisma.message.update({
    where: { id: messageId },
    data: { status: 'PROCESSING' },
    include: {
      whatsappNumber: {
        include: {
          company: true,
          project: true,
        },
      },
    },
  });

  try {
    // Find linked WhatsApp number
    const whatsappNumber = await prisma.whatsAppNumber.findUnique({
      where: { phoneNumber: message.fromPhone },
      include: {
        company: true,
        project: true,
      },
    });

    if (!whatsappNumber?.verified) {
      // Unknown sender - could send onboarding message
      console.log('Message from unverified number:', message.fromPhone);
      return;
    }

    // If message has media, process it
    if (message.mediaUrl && message.mediaType) {
      const document = await processMedia(message, whatsappNumber);

      // Update message with document link
      await prisma.message.update({
        where: { id: messageId },
        data: {
          documentId: document.id,
          whatsappNumberId: whatsappNumber.id,
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });
    } else {
      // Text-only message - could be used for commands
      await prisma.message.update({
        where: { id: messageId },
        data: {
          whatsappNumberId: whatsappNumber.id,
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await prisma.message.update({
      where: { id: messageId },
      data: { status: 'FAILED' },
    });
  }
}

async function processMedia(
  message: any,
  whatsappNumber: any
): Promise<any> {
  // Download media from Twilio
  const mediaBuffer = await downloadMedia(message.mediaUrl);

  // Determine document type from media type
  const docType = getDocumentType(message.mediaType);

  // Upload to S3
  const s3Key = `projects/${whatsappNumber.projectId}/whatsapp/${message.id}`;
  const s3Url = await uploadToS3(mediaBuffer, s3Key, message.mediaType);

  // Create document record
  const document = await prisma.document.create({
    data: {
      name: `WhatsApp ${new Date().toISOString()}`,
      type: docType,
      url: s3Url,
      fileSize: mediaBuffer.length,
      mimeType: message.mediaType,
      projectId: whatsappNumber.projectId,
      uploadedById: whatsappNumber.company.userId, // or create system user
      source: 'WHATSAPP',
      metadata: {
        originalMediaUrl: message.mediaUrl,
        senderPhone: message.fromPhone,
        messageContent: message.content,
      },
    },
  });

  // Optionally create timeline event
  if (docType === 'PHOTO' || docType === 'VIDEO') {
    await prisma.timelineEvent.create({
      data: {
        projectId: whatsappNumber.projectId,
        type: 'PHOTO_ADDED',
        title: 'Nieuwe foto toegevoegd',
        description: message.content || 'Via WhatsApp',
        timestamp: new Date(),
        documents: {
          connect: { id: document.id },
        },
      },
    });
  }

  return document;
}

function getDocumentType(mimeType: string): DocumentType {
  if (mimeType.startsWith('image/')) return 'PHOTO';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType === 'application/pdf') return 'PERMIT';
  return 'OTHER';
}
```

---

## 6. Environment Variables

Add to `.env`:

```env
# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# For production, use your own WhatsApp Business number
# TWILIO_WHATSAPP_NUMBER=whatsapp:+31xxxxxxxxx
```

---

## 7. Package Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "twilio": "^5.0.0"
  }
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Install Twilio SDK
- [ ] Add database schema (migrate)
- [ ] Create webhook endpoint
- [ ] Test with Twilio sandbox

### Phase 2: Document Ingestion (Week 1-2)
- [ ] Download media from Twilio
- [ ] Upload to S3
- [ ] Create Document records
- [ ] Link to project/timeline

### Phase 3: Builder UX (Week 2)
- [ ] Phone verification flow
- [ ] Wire builder dashboard to real data
- [ ] Show incoming messages/photos
- [ ] Project selector for builders with multiple projects

### Phase 4: Notifications (Week 2-3)
- [ ] Outbound message templates
- [ ] Phase change notifications
- [ ] Missing document reminders
- [ ] Milestone alerts

---

## 9. Testing Checklist

### Twilio Sandbox Testing
1. [ ] Join sandbox: Send "join <sandbox-word>" to Twilio number
2. [ ] Send text message → appears in Message table
3. [ ] Send photo → Document created, S3 upload works
4. [ ] Send video → Document created with VIDEO type

### Production Testing
1. [ ] WhatsApp Business API approved
2. [ ] Custom number configured
3. [ ] Webhook URL set in Twilio console
4. [ ] Phone verification flow works
5. [ ] Photos appear in homeowner dashboard

---

## 10. Security Considerations

- [ ] Validate Twilio webhook signature
- [ ] Rate limit webhook endpoint
- [ ] Sanitize message content before storing
- [ ] Don't expose S3 URLs directly (use signed URLs)
- [ ] Log all messages for audit trail
- [ ] GDPR: Document consent for message storage

---

## 11. Builder Dashboard Wiring

### Current State
`/src/app/builder/dashboard/page.tsx` uses mock data

### Required Changes
1. Replace mock data with tRPC queries
2. Fetch projects by companyId
3. Show real documents/photos
4. Add WhatsApp number linking UI
5. Show message history

### Key Queries Needed
```typescript
// Get builder's projects
const projects = await prisma.project.findMany({
  where: {
    contractors: {
      some: {
        companyId: session.user.companyId,
      },
    },
  },
  include: {
    documents: { orderBy: { createdAt: 'desc' }, take: 10 },
    timelineEvents: { orderBy: { timestamp: 'desc' }, take: 5 },
  },
});

// Get recent WhatsApp messages
const messages = await prisma.message.findMany({
  where: {
    whatsappNumber: {
      companyId: session.user.companyId,
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
  include: { document: true },
});
```

---

## 12. Success Metrics

| Metric | Target (Week 4) |
|--------|-----------------|
| Builders linked | 5 |
| Photos via WhatsApp | 50 |
| Auto-documents created | 50 |
| Webhook uptime | 99.9% |
| Processing time | < 5 sec |

---

*Created: January 2026*
