# Write Spec

## Purpose
Create a detailed technical specification that developers can implement without ambiguity.

## When to Use
- After shaping is complete
- Before creating implementation tasks
- When documentation is needed for complex features

## Prompt
```
You are writing a detailed technical specification for Woningpaspoort.

Reference:
- Shaped spec: @docs/specs/[feature-name]-shaped.md
- TypeScript standards: @agent-os/standards/typescript.md
- React standards: @agent-os/standards/react.md
- Database standards: @agent-os/standards/database.md
- UI standards: @agent-os/standards/ui-design.md

Create a comprehensive specification including:

1. **Overview**
   - Feature summary (1-2 paragraphs)
   - Key objectives
   - Success criteria

2. **Technical Design**
   
   ### Data Model
   ```prisma
   // Exact Prisma schema changes
   ```
   
   ### API Specification
   ```typescript
   // tRPC router definitions with input/output types
   ```
   
   ### Component Architecture
   - Component tree diagram
   - Props interfaces for key components
   - State management approach

3. **Implementation Details**
   
   ### Files to Create/Modify
   | File | Action | Description |
   |------|--------|-------------|
   | ... | CREATE/MODIFY | ... |
   
   ### Key Functions
   ```typescript
   // Function signatures with JSDoc
   ```

4. **UI Specification**
   - Wireframes or component mockups (describe)
   - Responsive breakpoints
   - Accessibility requirements

5. **Testing Requirements**
   - Unit test scenarios
   - Integration test scenarios
   - E2E test scenarios

6. **Migration Plan**
   - Database migrations needed
   - Data transformation steps
   - Rollback strategy

Output format: Detailed technical specification document.
```

## Output
A technical specification saved to `docs/specs/[feature-name]-spec.md`

## Next Step
→ Create Tasks (04-create-tasks.md)
