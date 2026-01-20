# Shape Spec

## Purpose
Transform product requirements into a shaped technical specification with clear boundaries and implementation approach.

## When to Use
- After product planning is approved
- Before detailed technical specification
- When exploring solution approaches

## Prompt
```
You are shaping a technical specification for Woningpaspoort.

Reference:
- Product plan: @docs/planning/[feature-name].md
- Standards: @agent-os/standards/
- Profile: @agent-os/profiles/woningpaspoort.md

Shape this feature by defining:

1. **Solution Approach**
   - High-level technical approach
   - Key architectural decisions
   - Integration points with existing system

2. **Boundaries**
   - Fixed elements (must have)
   - Variable elements (can be adjusted)
   - Rabbit holes to avoid

3. **UI/UX Rough Design**
   - Key screens/components needed
   - User flow diagram (mermaid)
   - Interaction patterns to follow

4. **Data Model Changes**
   - New models or fields needed
   - Relationship changes
   - Migration considerations

5. **API Surface**
   - New endpoints/procedures needed
   - Input/output shapes
   - Authentication requirements

6. **Effort Estimate**
   - T-shirt size (S/M/L/XL)
   - Key complexity drivers
   - Potential parallelization

Output format: Shaped spec document with diagrams where helpful.
```

## Output
A shaped specification saved to `docs/specs/[feature-name]-shaped.md`

## Next Step
→ Write Spec (03-write-spec.md)
