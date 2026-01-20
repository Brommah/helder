# Next.js 14 Standards

## App Router Structure
```
src/app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Home page
├── globals.css             # Global styles
├── (auth)/                 # Route group for auth pages
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── page.tsx            # Dashboard home
│   └── [propertyId]/       # Dynamic property routes
│       └── page.tsx
└── api/
    └── trpc/[trpc]/route.ts  # tRPC handler
```

## Server vs Client Components
```typescript
// Default: Server Components (no directive needed)
// src/app/dashboard/page.tsx
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const properties = await db.property.findMany();
  return <PropertyList properties={properties} />;
}

// Client Components: Add 'use client' directive
// src/components/dashboard/PropertyFilters.tsx
'use client';

import { useState } from 'react';

export function PropertyFilters() {
  const [filter, setFilter] = useState('all');
  // Interactive logic...
}
```

## Data Fetching
```typescript
// Server Components: Direct database access
async function getProperty(id: string) {
  return db.property.findUnique({ where: { id } });
}

// Client Components: tRPC hooks
const { data } = trpc.property.getById.useQuery({ id });

// Static Generation (build time)
export async function generateStaticParams() {
  const properties = await db.property.findMany();
  return properties.map((p) => ({ id: p.id }));
}

// Revalidation
export const revalidate = 3600; // Revalidate every hour
```

## Metadata
```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Dashboard | Woningpaspoort',
  description: 'Beheer uw woningpaspoort',
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await getProperty(params.id);
  return {
    title: `${property.name} | Woningpaspoort`,
  };
}
```

## Route Handlers (API)
```typescript
// src/app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Process upload...
  
  return NextResponse.json({ success: true });
}
```

## Error Handling
```typescript
// src/app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Er ging iets mis</h2>
      <button onClick={reset}>Probeer opnieuw</button>
    </div>
  );
}

// src/app/not-found.tsx
export default function NotFound() {
  return <h2>Pagina niet gevonden</h2>;
}
```

## Middleware
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth check, redirects, etc.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/builder/:path*'],
};
```
