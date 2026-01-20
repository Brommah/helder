# React Standards for Woningpaspoort

## Component Structure
```typescript
// Functional components only - no class components
// Props interface defined above component
interface PropertyCardProps {
  property: Property;
  onSelect?: (id: string) => void;
  variant?: 'compact' | 'full';
}

export function PropertyCard({ 
  property, 
  onSelect,
  variant = 'full' 
}: PropertyCardProps) {
  // Hooks first
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Derived state
  const progress = calculateProgress(property);
  
  // Event handlers
  const handleClick = () => {
    onSelect?.(property.id);
  };
  
  // Early returns for loading/error states
  if (!property) return null;
  
  // Main render
  return (
    <div className="card" onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}
```

## File Naming
- Components: `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-property.ts`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Pages: `page.tsx` (Next.js App Router convention)

## Component Organization
```
src/components/
├── ui/                    # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   └── index.ts           # Barrel export
├── dashboard/             # Dashboard-specific components
│   ├── PropertyOverview.tsx
│   └── TimelineWidget.tsx
└── wizard/                # Wizard-specific components
    ├── StepIndicator.tsx
    └── LocationStep.tsx
```

## State Management
```typescript
// Local state: useState for component-specific state
const [isOpen, setIsOpen] = useState(false);

// Server state: tRPC/React Query
const { data: property, isLoading } = trpc.property.getById.useQuery({ id });

// Form state: controlled components with validation
const [formData, setFormData] = useState<PropertyForm>({
  name: '',
  postcode: '',
});
```

## Custom Hooks
```typescript
// Extract reusable logic into custom hooks
export function useProperty(id: string) {
  const query = trpc.property.getById.useQuery({ id });
  const mutation = trpc.property.update.useMutation();
  
  return {
    property: query.data,
    isLoading: query.isLoading,
    update: mutation.mutate,
    isUpdating: mutation.isLoading,
  };
}
```

## Performance
- Use `memo()` for expensive renders
- Use `useMemo()` for expensive computations
- Use `useCallback()` for stable function references passed to children
- Avoid inline object/array creation in JSX props

## Accessibility
- Use semantic HTML elements
- Include `aria-label` for icon-only buttons
- Ensure keyboard navigation works
- Test with screen readers
