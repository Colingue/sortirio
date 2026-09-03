---
type: decision
status: accepted
date: 2026-09-03
tags: [mobile, repo]
supersedes:
affects: [[2026-08-30-mobile-stack-expo]]
---

# Mobile code layout — feature folders

## Context

[[2026-08-30-mobile-stack-expo]] settled that application code lives under
`mobile/src/` with `app/`, `components/`, `hooks/` and `constants/`. It said nothing
about where a helper function goes, so `src/lib/` absorbed everything that was not a
route or a component.

After the login story, `src/lib/auth/` held four files of four different natures: a
network read (`profile.ts`), a pure decision (`destination.ts`), a third-party SDK
wrapper (`google.ts`) and a React context (`session-provider.tsx`). One of them,
`hasProfile`, is not even about authentication. Nothing in the layout told the next
person — or the next agent — where a fifth file should go, and the default answer was
always `lib/`.

## Decision

Business code is grouped by **subject**, in `mobile/src/features/<subject>/`.
`src/lib/` is reserved for technical setup with no product knowledge.

The rule is about the name of the thing, not the technology behind it: if the name
talks about the product (a profile, a city, an outing, a session) it goes in
`features/`; if it talks about a tool (Supabase, storage, a polyfill) it goes in
`lib/`. When in doubt, `features/`.

Inside a feature, files sit flat and each one is named after the subject it covers and
holds every function covering it — several functions per file is fine, several subjects
per file is not. No `utils.ts`, no barrel `index.ts`, no file holding three unrelated
functions. A feature is split into sub-folders only once it holds more files than a
reader can scan at a glance.

`app/` imports from `features/`; `features/` never imports from `app/`.

A function that only decides — no network, no React, no SDK — lives in its own file,
takes its inputs as arguments, and keeps its test next to it.

The operative rules are written in `mobile/CLAUDE.md`.

## Why not something else

- **Keep everything in `lib/`** (the situation that prompted this) — `lib/` becomes the
  drawer where anything that is not a screen lands. It gives no answer to "where does
  this new file go", so the folder only ever grows.
- **Group by nature: `api/`, `domain/`, `services/`, `providers/`** — technically
  tidier, but one subject ends up scattered across four folders. Today authentication
  alone would sit in four places, and reading a feature would mean opening the whole
  tree.
- **Feature folders with `api/` `model/` `ui/` sub-layers inside each** — the same
  scattering, one level down, for a codebase where each sub-folder would currently hold
  a single file. The flat rule above allows adopting this inside one feature later,
  without reversing this record.
- **Domain-Driven Design (entities, value objects, repositories, bounded contexts)** —
  DDD pays when business rules are numerous and tangled. Here the entire business logic
  is `destinationFor`, three lines. Repositories and value objects would add more code
  than there are rules to protect. Keeping decision functions pure and free of I/O
  leaves the door open if the domain ever grows.

## Consequences

- ✅ Opening `src/` says what the app is about, not which libraries it uses.
- ✅ Where a new helper goes is answered by one question about its name, so the layout
  survives an agent writing files unattended.
- ✅ Pure decisions stay testable without a server or a React renderer.
- ⚠️ The boundary between two subjects is a judgment call, and some files will be
  argued over. The tie-breaker is the product's vocabulary, not the code's.
- ⚠️ Cross-feature imports are allowed, so nothing mechanically prevents a tangle. The
  signal to watch: the same direction of import happening twice means the shared piece
  needs its own feature.
- ⚠️ The `src/` folder list in [[2026-08-30-mobile-stack-expo]] no longer enumerates
  everything; that record stays as written and this one extends it.
- → Generates: moving the four files out of `src/lib/auth/` and updating their imports.

## Usage

```
mobile/src/
  app/          route files only, one screen per route
  features/
    auth/       session-provider.tsx, sign-in-with-google.ts
    profile/    has-profile.ts
    routing/    destination.ts, destination.test.ts
  components/   presentational, reused across features
  hooks/        generic, no product knowledge
  constants/    theme, static values
  lib/          supabase.ts, polyfills — technical only
```

```ts
import { hasProfile } from '@/features/profile/has-profile';
```
