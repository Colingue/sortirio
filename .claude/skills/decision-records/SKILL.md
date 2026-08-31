---
name: decision-records
description: Read and write this project's decision records (ADRs) in docs/adr/. Use this skill BEFORE planning or implementing anything structural — stack, dependencies, project layout, data model, tooling, process, product mechanics — so you build on what was already settled instead of re-litigating it, and use it again the moment a new structural choice is made so the reasoning is captured while it is still fresh. Trigger it whenever the user mentions an ADR, an architecture decision, "why did we choose X", "record this decision", "document this choice", or proposes changing something an existing record already covers — even if they never say the word "ADR".
---

# Decision records

`docs/adr/` holds one file per settled decision. A record is **immutable**: it captures
what was true when the call was made, not what is true now.

That immutability is the whole point. It lets a reader six months later tell the
difference between "nobody thought of that" and "we thought of it and said no" — which
is exactly the distinction an agent cannot recover from the code alone.

Living state — what the product does today, what is still open — belongs in
`docs/SPEC.md` and `docs/ideas/`, not here. Keep the two apart or the records stop
being trustworthy.

## Before acting: read

Any task touching structure starts here. Stack, dependencies, project layout, data
model, tooling, process, core product mechanics — if getting it wrong would be
expensive to undo, it is structural.

1. **Read `docs/adr/INDEX.md`.** It lists every record, newest first, with its status
   and one line on what it settles — that is how you find the records that concern you
   without opening the whole directory. It also maps subjects to records under
   `## By subject`.
2. **Read the records touching your subject.** Skim `## Decision` first. Read
   `## Why not something else` before proposing any alternative — that section exists
   precisely to save you the trouble.
3. **Treat `status: accepted` as binding.** If your plan contradicts one, say so to the
   human explicitly and stop. Do not quietly route around it, and do not re-propose an
   option a record already rejected. An agent that silently reverses a settled decision
   costs more than one that asks.
4. **`status: superseded` is history, not law.** Read it for context, follow the record
   that supersedes it.
5. **Two accepted records that contradict each other** is a defect in the record set.
   Surface it to the human; do not pick a winner alone.

## When to write one

Write a record when a structural choice is settled **and alternatives were ruled out**.
The rejected options are what make the file worth keeping.

Do write one for: choosing a framework, a backend, a package manager; how the repo is
laid out; a process rule everyone must follow; a product mechanic that shapes the build.

Do **not** write one for: anything a single commit can reverse, naming a variable, a
library swap nobody would question, or restating something already obvious from the
code. A folder full of trivial records is worse than an empty one — it stops being
read.

## Writing a record

Copy `assets/decision-template.md` in this skill directory to
`docs/adr/YYYY-MM-DD-short-title.md`, using today's date and a short, speakable title
(`2026-08-31-backend-supabase.md`). Dashes, no spaces — these files get grepped and
passed to command-line tools.

**Then add its line to `docs/adr/INDEX.md`** — top of the table, plus its subject under
`## By subject`. The record is not written until it is indexed; nobody finds a file that
the index does not list. The index is living state, so unlike a record it is edited
freely.

Frontmatter:

```yaml
---
type: decision
status: proposed # proposed | accepted | superseded
date: YYYY-MM-DD
tags: [domain]
supersedes: # [[2026-01-04-old-decision]] (optional)
affects: # [[docs/SPEC.md]] (optional) — what to revisit if this is ever reversed
---
```

Then four sections, all four filled in:

- **Context** — the problem and the constraints at the time.
- **Decision** — what was settled, present tense, affirmative ("We use X", not "we
  could use X").
- **Why not something else** — the options considered and rejected, each with its
  reason. If you cannot name a rejected option, you are probably documenting a fact,
  not a decision.
- **Consequences** — trade-offs both ways, and what becomes work to do. Be honest about
  the negative ones; a record listing only upsides reads as marketing and gets ignored.

An optional **`## Usage`** section at the end is welcome when the decision changes how
you actually run things — the commands, the paths, the import alias. It is the fastest
way for a reader to act on the record instead of only understanding it.

Keep it short. A record nobody finishes reading protects nothing.

## Status flow

- **`proposed`** — you drafted it; the human has not signed off.
- **`accepted`** — the human validated it.
- **`superseded`** — replaced by a newer record.

**You propose, the human accepts.** Never write or flip a record to `accepted` on your
own authority, even when the human clearly agreed in conversation — say the file is in
`proposed` and ask them to confirm. The status field is their signature, not your
summary of the chat.

## Changing a settled decision

An `accepted` record is never edited to say something different. Editing it destroys
the only copy of the reasoning that was live at the time.

Instead:

1. Write a **new** record with `supersedes: [[old-file-name]]`.
2. Flip the old record's `status:` to `superseded` — that field, and only that field.
   Update both lines in `docs/adr/INDEX.md` accordingly.
3. Revisit everything the old record listed under `affects:`; the reversal usually
   makes some of it wrong.

Fixing a typo or clarifying wording in place is fine. Changing what the record decided
is not.

## Keeping the repo honest

When a change makes a statement in an existing record obsolete, updating that record is
part of the same work — not a follow-up task. A record that quietly stopped being true
is worse than no record, because it is still trusted.
