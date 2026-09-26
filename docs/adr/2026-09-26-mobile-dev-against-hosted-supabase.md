---
type: decision
status: accepted
date: 2026-09-26
tags: [mobile, backend, process]
affects:
  [[supabase/CLAUDE.md]], [[2026-09-06-testing-on-ios-simulator]],
  [[docs/specs/us-3.1-formation-des-groupes.md]]
---

# Mobile dev runs against the hosted Supabase project

## Context

[[2026-09-06-testing-on-ios-simulator]] settled that the app is built and verified on
the iOS simulator, and named Google sign-in as the thing that blocks everything else
until it is configured: an iOS OAuth client in Google Cloud, added to the Supabase
Google provider. That provider was configured on the **hosted** project
(`jkqnboxxxwxjmdoiaxpd.supabase.co`) — there is no Google provider set up on the local
stack (`npx supabase start`).

While verifying US 3.1's group formation job, `mobile/.env.local` was pointed at the
local stack (`http://127.0.0.1:54321`) to make the app show the fixture data seeded by
`supabase/seed.sql`. Sign-in broke immediately: [[2026-08-31-backend-supabase]] allows
only Google and Apple, no email/password, and the local stack has no Google provider to
complete that flow against.

## Decision

`mobile/.env.local` points at the hosted Supabase project. All manual testing in the
simulator — sign-in included — happens against hosted data, through a real Google
account.

## Why not something else

- **Configure a second Google OAuth client for the local stack** — rejected: a second
  redirect URI and client ID to keep in sync with the hosted one, for a stack that is
  torn down and recreated by every `db reset`.
- **Local stack, and skip sign-in during manual testing** — rejected: the app has no
  path past the sign-in screen, per [[2026-08-31-backend-supabase]] (Google/Apple only).
  There is nothing to test past that screen without it.

## Consequences

- ✅ Manual testing exercises the actual sign-in flow the pilot ships with, not a
  stand-in.
- ⚠️ `supabase/seed.sql`'s fake accounts exist only in the local stack — the app run
  against hosted never sees them. Verifying a backend-only job like
  `form_friday_groups()` end-to-end through the UI is not possible; it stays a SQL-only
  check (local Studio or `psql`), which is how `tasks/todo.md` already verifies it.
- ⚠️ Manual testing writes real rows to the hosted project, under a real Google account.
  No cleanup process exists yet for that data.
- → Generates: a line in `supabase/CLAUDE.md` telling apart the two workflows — local
  stack for migrations and SQL-only checks, hosted project for anything run through the
  app.
