# Rules for `docs/`

Everything about this directory lives here, and nowhere else.

## `SPEC.md` — do not touch without explicit agreement

`SPEC.md` is the contract for what ships in one month. **The subject does not change.**

Never edit it — not a section, not a bullet, not a typo — without Colin saying so in
that same conversation. This holds even when a decision plainly contradicts it: say what
would have to change and leave the file alone. An answer to a question is not a signed
decision.

## `ideas/` and `specs/` — the working space

These you may edit directly: ideation notes, user stories, and the build spec written
just before implementing a story. Announce what moved, no validation round-trip needed.

## `adr/` — decision records

Structural decisions live in `docs/adr/`, one file per decision, named
`YYYY-MM-DD-short-title.md`. They are **immutable**: an accepted record is superseded,
never rewritten.

**Start with `docs/adr/INDEX.md`.** It lists every record with its status and what it
settles — read it before planning anything structural, then open the records that touch
your subject. Treat `status: accepted` as binding: do not re-propose an option a record
already rejected. If a change makes a statement in a record obsolete, update that
record as part of the same work.

If a change calls for a **new** decision, use the `decision-records` skill: it holds the
format, the template (`assets/decision-template.md`) and the status flow. New records
are created with `status: proposed` — only I flip them to `accepted`. A new record is
only finished once its line is added to `docs/adr/INDEX.md`, in the same pass.

A record **you** write is created with `status: proposed`, and its `INDEX.md` line says
`proposed` too. Never write `accepted` yourself.

**A `proposed` record binds nothing.** As long as it is not `accepted`, it does not
enter the code, a `CLAUDE.md`, a plan, a spec, or a task list, and it is not quoted as
a reason for anything. Write it, index it, tell me it is waiting for me, and keep
working the way the accepted records describe until I answer.
