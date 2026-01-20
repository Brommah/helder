# Database Standards (Prisma)

## Schema Conventions
```prisma
// Models: PascalCase, singular
model Property {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Required fields first
  name      String
  status    PropertyStatus @default(PLANNING)
  
  // Optional fields
  description String?
  
  // Relations at the end
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String
  documents Document[]
  
  // Indexes
  @@index([ownerId])
  @@index([status])
}

// Enums: PascalCase
enum PropertyStatus {
  PLANNING
  UNDER_CONSTRUCTION
  COMPLETED
}
```

## Naming Conventions
- Tables: PascalCase, singular (`Property`, not `properties`)
- Columns: camelCase (`createdAt`, not `created_at`)
- Foreign keys: `{relation}Id` (`ownerId`, `propertyId`)
- Join tables: `{Model1}{Model2}` alphabetically (`PropertyTag`)

## Common Fields
Every model should include:
```prisma
model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ... other fields
}
```

## Query Patterns
```typescript
// Always select only needed fields for lists
const properties = await db.property.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    _count: { select: { documents: true } },
  },
  where: { ownerId: userId },
  orderBy: { createdAt: 'desc' },
});

// Include relations when needed
const property = await db.property.findUnique({
  where: { id },
  include: {
    documents: { orderBy: { uploadDate: 'desc' } },
    owner: { select: { name: true, email: true } },
  },
});

// Use transactions for related operations
await db.$transaction([
  db.property.update({ where: { id }, data: { status: 'COMPLETED' } }),
  db.timelineEntry.create({ data: { propertyId: id, event: 'COMPLETED' } }),
]);
```

## Migrations
```bash
# Development: Push schema changes directly
npm run db:push

# Production: Create migration files
npm run db:migrate

# Never edit migration files after deployment
```

## Soft Deletes (when needed)
```prisma
model Document {
  // ...
  deletedAt DateTime?
  
  @@index([deletedAt])
}
```

```typescript
// Query non-deleted records
const docs = await db.document.findMany({
  where: { propertyId, deletedAt: null },
});

// Soft delete
await db.document.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```
