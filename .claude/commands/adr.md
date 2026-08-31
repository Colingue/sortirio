---
description: Plan a task while taking the project's decision records into account
argument-hint: [task description]
---

Plan a new task, using the `decision-records` skill.

- The task: $ARGUMENTS
- Read `docs/adr/INDEX.md` first, then the records it lists that touch this subject,
  before planning anything. Treat `status: accepted` as binding.
- If this plan would make any statement in those records obsolete, include the record
  update in the plan.
- If this plan requires a new decision record, confirm with me before writing it,
  create it with `status: proposed`, and add its line to `docs/adr/INDEX.md`.
