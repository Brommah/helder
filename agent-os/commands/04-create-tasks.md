# Create Tasks

## Purpose
Break down the technical specification into implementable tasks with clear acceptance criteria.

## When to Use
- After technical specification is complete
- Before starting implementation
- When planning sprints/iterations

## Prompt
```
You are creating implementation tasks for Woningpaspoort.

Reference:
- Technical spec: @docs/specs/[feature-name]-spec.md
- Profile: @agent-os/profiles/woningpaspoort.md

Create a task breakdown following these principles:
- Each task should be completable in 1-4 hours
- Tasks should be independently testable
- Dependencies should be explicit
- Acceptance criteria must be verifiable

For each task, provide:

## Task Template
```markdown
### Task [N]: [Title]

**Type**: Feature | Bug | Refactor | Test | Docs
**Effort**: XS | S | M | L
**Dependencies**: Task [X], Task [Y]

**Description**
Brief description of what needs to be done.

**Files to Touch**
- `src/path/to/file.ts` - Description of changes

**Implementation Steps**
1. Step one
2. Step two
3. Step three

**Acceptance Criteria**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Testing**
- Unit: What to test
- Integration: What to test (if applicable)
```

## Task Organization
Group tasks into phases:
1. **Foundation** - Database, types, utilities
2. **Backend** - API procedures, business logic
3. **Frontend** - Components, pages, hooks
4. **Integration** - End-to-end flows, polish
5. **Testing** - Test coverage, documentation

Output format: Numbered task list with full details.
```

## Output
A task list saved to `docs/tasks/[feature-name]-tasks.md`

## Next Step
→ Implement Tasks (05-implement-tasks.md)
