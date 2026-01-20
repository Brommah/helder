# TypeScript Standards

## Type Safety
- Enable strict mode in `tsconfig.json`
- Never use `any` type - use `unknown` and type guards instead
- Use explicit return types for all functions
- Prefer interfaces over types for object shapes
- Use discriminated unions for state management

## Naming Conventions
```typescript
// Interfaces: PascalCase with descriptive names
interface PropertyDocument {
  id: string;
  name: string;
  category: DocumentCategory;
}

// Types: PascalCase
type DocumentCategory = 'tekeningen' | 'berekeningen' | 'materialen';

// Enums: PascalCase with UPPER_SNAKE values
enum PropertyStatus {
  PLANNING = 'PLANNING',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  COMPLETED = 'COMPLETED',
}

// Functions: camelCase, verb-first
function getPropertyById(id: string): Promise<Property | null>
function validateDocument(doc: unknown): doc is PropertyDocument

// Constants: UPPER_SNAKE_CASE
const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024;
const WKB_RETENTION_YEARS = 20;
```

## File Organization
```
src/
├── types/           # Shared type definitions
│   ├── index.ts     # Barrel export
│   ├── property.ts  # Property-related types
│   └── document.ts  # Document-related types
├── lib/             # Utilities and helpers
│   ├── validators/  # Zod schemas
│   └── utils/       # Pure functions
└── server/          # Server-side code
    └── trpc.ts      # tRPC configuration
```

## Zod Validation
```typescript
// Always validate external input with Zod
import { z } from 'zod';

const PropertyInputSchema = z.object({
  name: z.string().min(1).max(100),
  postcode: z.string().regex(/^\d{4}\s?[A-Z]{2}$/),
  woonoppervlakte: z.number().min(50).max(1000),
});

type PropertyInput = z.infer<typeof PropertyInputSchema>;
```

## Error Handling
```typescript
// Use custom error classes
class PropertyNotFoundError extends Error {
  constructor(id: string) {
    super(`Property not found: ${id}`);
    this.name = 'PropertyNotFoundError';
  }
}

// Return Result types for fallible operations
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```
