# Security Standards

## Environment Variables
```bash
# Never commit secrets to git
# Use .env.local for local development
# Use environment variables in production

# Required environment variables
DATABASE_URL=           # Prisma database connection
NEXTAUTH_SECRET=        # NextAuth.js secret
NEXTAUTH_URL=           # Base URL for auth callbacks

# Optional integrations
CERE_API_KEY=           # Cere Network API key
KADASTER_API_KEY=       # Kadaster integration
```

## Input Validation
```typescript
// Always validate at API boundaries
import { z } from 'zod';

// Define strict schemas
const CreatePropertySchema = z.object({
  name: z.string().min(1).max(100),
  postcode: z.string().regex(/^\d{4}\s?[A-Z]{2}$/, 'Ongeldige postcode'),
  woonoppervlakte: z.number().positive().max(10000),
});

// Use in tRPC procedures
export const propertyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreatePropertySchema)
    .mutation(async ({ input, ctx }) => {
      // Input is already validated
    }),
});
```

## Authentication & Authorization
```typescript
// Use NextAuth for authentication
// Always check session in protected routes

// tRPC protected procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { session: ctx.session } });
});

// Resource authorization
async function canAccessProperty(userId: string, propertyId: string) {
  const property = await db.property.findFirst({
    where: {
      id: propertyId,
      OR: [
        { ownerId: userId },
        { shares: { some: { userId } } },
      ],
    },
  });
  return !!property;
}
```

## Data Protection
```typescript
// Never expose sensitive data in API responses
const publicPropertySelect = {
  id: true,
  name: true,
  status: true,
  // Exclude: ownerId, financials, etc.
};

// Sanitize user-generated content
import DOMPurify from 'isomorphic-dompurify';
const sanitized = DOMPurify.sanitize(userInput);

// Hash sensitive data
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 12);
```

## File Upload Security
```typescript
// Validate file types
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function validateFile(file: File): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Ongeldig bestandstype');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Bestand te groot (max 50MB)');
  }
  return true;
}

// Generate safe filenames
function safeFilename(original: string): string {
  const ext = original.split('.').pop()?.toLowerCase();
  return `${crypto.randomUUID()}.${ext}`;
}
```

## Rate Limiting
```typescript
// Implement rate limiting for sensitive endpoints
// Use middleware or tRPC context

const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimiter.get(ip);
  
  if (!record || record.resetAt < now) {
    rateLimiter.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    throw new Error('Te veel verzoeken');
  }
  
  record.count++;
  return true;
}
```

## Audit Logging
```typescript
// Log sensitive operations
async function logAuditEvent(event: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}) {
  await db.auditLog.create({
    data: {
      ...event,
      timestamp: new Date(),
      ip: getCurrentIP(),
    },
  });
}

// Usage
await logAuditEvent({
  userId: ctx.session.user.id,
  action: 'DOCUMENT_DOWNLOAD',
  resourceType: 'Document',
  resourceId: documentId,
});
```
