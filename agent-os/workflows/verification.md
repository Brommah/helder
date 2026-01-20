# Verification Workflow

## Purpose
Ensure code quality, consistency, and correctness before considering a task complete.

## Verification Checklist

### 1. Type Safety
```bash
# Run TypeScript compiler
npm run typecheck

# Expected: No errors
```

**Manual checks:**
- [ ] No `any` types used
- [ ] All functions have explicit return types
- [ ] Props interfaces defined for all components
- [ ] Zod schemas for all API inputs

### 2. Lint & Format
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**Manual checks:**
- [ ] No ESLint warnings or errors
- [ ] Consistent code formatting
- [ ] No unused imports or variables

### 3. Standards Compliance

**TypeScript Standards** (@agent-os/standards/typescript.md)
- [ ] Follows naming conventions
- [ ] Error handling patterns used
- [ ] Type definitions in correct location

**React Standards** (@agent-os/standards/react.md)
- [ ] Functional components only
- [ ] Hooks used correctly
- [ ] Component structure follows pattern

**Database Standards** (@agent-os/standards/database.md)
- [ ] Prisma schema follows conventions
- [ ] Queries optimized (select only needed fields)
- [ ] Indexes defined for query patterns

**UI Standards** (@agent-os/standards/ui-design.md)
- [ ] Uses design system classes
- [ ] Responsive design considered
- [ ] Dutch language used correctly

**Security Standards** (@agent-os/standards/security.md)
- [ ] Input validation present
- [ ] No secrets in code
- [ ] Authentication checked where needed

### 4. Testing
```bash
# Run test suite
npm run test

# With coverage
npm run test:coverage
```

**Coverage requirements:**
- Critical business logic: 80%+
- API procedures: 70%+
- UI components: 60%+

### 5. Functionality
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error states display correctly
- [ ] Loading states present

### 6. Performance
- [ ] No unnecessary re-renders
- [ ] Database queries optimized
- [ ] Images/assets optimized
- [ ] Bundle size reasonable

## Verification Report Template

```markdown
## Verification Report: [Feature/Task Name]

**Date**: YYYY-MM-DD
**Verified by**: AI/Human

### Automated Checks
| Check | Status | Notes |
|-------|--------|-------|
| TypeScript | ✅/❌ | |
| ESLint | ✅/❌ | |
| Tests | ✅/❌ | X/Y passing |

### Manual Checks
| Category | Status | Notes |
|----------|--------|-------|
| Standards | ✅/❌ | |
| Functionality | ✅/❌ | |
| Performance | ✅/❌ | |

### Issues Found
1. [Issue description] - [Resolution]

### Sign-off
- [ ] Ready for deployment
```
