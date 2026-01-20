# Orchestrate Tasks

## Purpose
Coordinate multi-task implementation, handle dependencies, and ensure cohesive delivery.

## When to Use
- When implementing a full feature (multiple tasks)
- When tasks have complex dependencies
- For end-to-end feature completion

## Prompt
```
You are orchestrating the implementation of a feature for Woningpaspoort.

Reference:
- Task list: @docs/tasks/[feature-name]-tasks.md
- Standards: @agent-os/standards/
- Profile: @agent-os/profiles/woningpaspoort.md

Orchestrate the implementation:

1. **Task Status Review**
   | Task | Status | Blockers |
   |------|--------|----------|
   | 1    | ✅/🔄/⏸️ | None/[Blocker] |

2. **Dependency Graph**
   ```mermaid
   graph TD
     T1[Task 1] --> T3[Task 3]
     T2[Task 2] --> T3
     T3 --> T4[Task 4]
   ```

3. **Execution Plan**
   - **Parallel batch 1**: Tasks that can run simultaneously
   - **Parallel batch 2**: Tasks dependent on batch 1
   - Continue until all tasks complete

4. **Integration Points**
   - Where do components connect?
   - What needs end-to-end testing?
   - What documentation needs updating?

5. **Risk Monitoring**
   - Technical debt introduced
   - Scope creep detected
   - Performance concerns

For each batch:
1. Implement tasks in parallel where possible
2. Verify integration between completed tasks
3. Run full test suite
4. Update documentation
5. Proceed to next batch

Output format:
- Execution progress report
- Issues encountered and resolutions
- Final integration verification checklist
```

## Completion Checklist
- [ ] All tasks implemented
- [ ] All tests passing
- [ ] Integration verified
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Ready for deployment

## Next Step
→ Feature complete! Return to Plan Product for next feature.
