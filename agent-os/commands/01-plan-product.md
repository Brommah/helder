# Plan Product

## Purpose
Define the product vision, target users, and key features before implementation.

## When to Use
- Starting a new feature or major enhancement
- Pivoting product direction
- Quarterly planning sessions

## Prompt
```
You are helping plan a product feature for Woningpaspoort, a digital housing passport for nieuwbouw (new construction) in the Netherlands.

Context:
- Target segment: Families building homes on kavels, €400K-700K
- Key differentiator: Complete housing DNA + Wkb compliance
- Stack: Next.js 14, tRPC, Prisma, Tailwind CSS

For the requested feature, provide:

1. **Problem Statement**
   - What user pain point does this solve?
   - How does it relate to our core value proposition?

2. **User Stories**
   - As a [homeowner/builder], I want to [action] so that [benefit]
   - Include 3-5 key user stories

3. **Success Metrics**
   - How will we measure if this feature succeeds?
   - Define 2-3 quantifiable metrics

4. **Scope Definition**
   - What's IN scope for MVP?
   - What's explicitly OUT of scope?
   - What are the dependencies?

5. **Risk Assessment**
   - Technical risks
   - User adoption risks
   - Compliance risks (if applicable)

Output format: Structured markdown document suitable for team discussion.
```

## Output
A product planning document saved to `docs/planning/[feature-name].md`

## Next Step
→ Shape Spec (02-shape-spec.md)
