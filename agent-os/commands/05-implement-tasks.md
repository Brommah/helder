# Implement Tasks

## Purpose
Execute individual tasks from the task list with code generation and verification.

## When to Use
- During active development
- When implementing specific tasks
- For code review and refinement

## Prompt
```
You are implementing a task for Woningpaspoort.

Reference:
- Task list: @docs/tasks/[feature-name]-tasks.md
- Current task: Task [N]
- Standards: @agent-os/standards/
- Profile: @agent-os/profiles/woningpaspoort.md

Implement this task following these guidelines:

1. **Pre-Implementation Checklist**
   - [ ] Read the full task description
   - [ ] Understand dependencies (are they complete?)
   - [ ] Review related existing code
   - [ ] Identify potential impacts

2. **Implementation**
   Follow the project standards:
   - TypeScript: Strict types, no `any`
   - React: Functional components, hooks
   - Prisma: Consistent naming, proper relations
   - UI: Follow design system classes

3. **Code Quality**
   - Add JSDoc comments for public functions
   - Include inline comments for complex logic
   - Follow existing patterns in the codebase
   - Keep functions under 60 lines

4. **Testing**
   - Write tests as specified in task
   - Ensure existing tests still pass
   - Test edge cases

5. **Post-Implementation**
   - Self-review the changes
   - Update task status
   - Document any deviations from spec

Output format:
1. File-by-file code changes (use search_replace or write tools)
2. Summary of changes made
3. Any issues or decisions that need discussion
```

## Workflow
1. Read the task carefully
2. Implement changes file by file
3. Run lints and fix issues
4. Verify acceptance criteria
5. Mark task complete

## Next Step
→ Orchestrate Tasks (06-orchestrate-tasks.md) or continue with next task
