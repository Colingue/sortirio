---
type: decision
status: accepted
date: 2026-08-31
tags: [backend]
supersedes:
affects: [[2026-08-30-repository-structure]], [[2026-08-30-code-quality]], [[docs/SPEC.md]]
---

# Backend — Supabase

## Context

[[2026-08-30-repository-structure]] reserved an `api/` directory without choosing a
stack. The MVP needs four things within a one-month delivery window:

- store profiles, weekly availabilities, groups and venues;
- authenticate users through Apple and Google;
- run a group chat in real time — it is the only mechanism that lets five strangers
  actually find each other in a bar, so it is load-bearing, not a nice-to-have;
- run a scheduled job every Thursday at 19:00 that forms the groups and assigns a venue
  to each.

## Decision

We use **Supabase** as the single backend for the MVP:

- **Postgres** for all application data, with Row Level Security enabled on every table.
- **Supabase Auth** with the Apple and Google providers only. No email/password, no
  magic link.
- **Supabase Realtime** for the group chat.
- **Supabase Storage** for profile photos.
- **`pg_cron`** for the Thursday 19:00 group formation, written as a SQL function. Edge
  Functions are used only for what SQL cannot do (sending push notifications).

The backend lives in a **`supabase/`** directory at the repository root, replacing the
`api/` directory originally reserved.

## Why not something else

- **Firebase** — equally mature for chat, but its document store is a poor fit for a
  matching algorithm that queries and joins over availabilities, ages and reported
  pairs. The chat is the easy half; the matching is the hard half.
- **A hand-written backend** — full control over the matching algorithm, but roughly a
  week of the month spent re-implementing auth, real-time and storage. That week is the
  difference between shipping and not shipping.
- **Email or magic-link auth** — one less provider to configure, but it adds a screen
  and a delivery dependency to an onboarding that should be one tap.

## Consequences

- ✅ One vendor covers data, auth, real time, storage and scheduling.
- ⚠️ **`api/` no longer exists**, which supersedes part of
  [[2026-08-30-repository-structure]] — that record was updated accordingly.
- ⚠️ Native Apple and Google sign-in requires native modules, so the app **no longer
  runs in Expo Go**: an EAS development build is mandatory from day one. Budget half a
  day of configuration.
- ⚠️ Offering Google sign-in on iOS requires **Sign in with Apple** as well (App Store
  guideline 4.8). Both providers ship together; this is not optional.
- ⚠️ The matching algorithm is written in SQL rather than application code. It is
  testable through `supabase db reset` against the seed data, but it is not covered by
  the mobile tooling of [[2026-08-30-code-quality]].
- ⚠️ Every schema change goes through a migration file. No change is made by hand in the
  Supabase dashboard, otherwise environments drift.
- ⚠️ RLS is the only thing standing between a user and someone else's data. A missing
  policy is a data leak, not a bug — every new table gets its policies in the same
  migration that creates it.
- ⚠️ We accept vendor lock-in on Supabase's hosted service. The data is plain Postgres,
  so an exit path exists if it ever becomes necessary.
- → Generates: the `supabase/` directory, the initial schema migration, the venue seed
  file, and the EAS development build setup.

## Usage

```bash
cd supabase
npx supabase start          # local stack (Postgres, Auth, Realtime, Storage)
npx supabase migration new <name>
npx supabase db reset       # replay migrations + seed
npx supabase db push        # apply migrations to the hosted project
```

From the app:

```ts
import { supabase } from '@/lib/supabase';
```
