---
description: Plan a task while taking the project's ADRs into account
argument-hint: [task description]
---

Plan a new task:

- Consult CLAUDE.md for the list of current ADRs.
- The task: $ARGUMENTS
- Before planning this task, read any relevant ADRs in `docs/adr/`.
- If this plan would make any statement in those ADRs obsolete, include the ADR
  update in the plan.
- If this plan requires a new ADR, confirm with me before creating it. A new ADR is
  created by copying `docs/adr/000-template.md` under the next available number, and
  is added to the list in CLAUDE.md.
