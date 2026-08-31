---
type: decision
status: accepted
date: 2026-08-30
tags: [repo]
supersedes:
affects: [[2026-08-31-backend-supabase]]
---

# Repository structure

## Context

Sortirio needs a mobile app (Expo / React Native) and a backend (group matching, user
accounts, venue list). We had to decide whether these two parts live in a single
repository or in two separate ones, and how the root directory is organized.

## Decision

A single repository, with one directory per deployable at the root:

- `mobile/` — the Expo / React Native app
- `supabase/` — the backend: SQL migrations, seed data, Edge Functions
  (see [[2026-08-31-backend-supabase]])
- `docs/` — product specification (`SPEC.md`) and ideation notes (`ideas/`)
- `docs/adr/` — decision records (this directory)

There is **no** monorepo tooling. Each directory manages its own dependencies and its
own scripts.

## Why not something else

- **Two separate repositories** — app and backend change together on almost every
  feature; two repos would mean two pull requests and a version dance for a team of
  one.
- **Monorepo tooling (npm/pnpm workspaces, Turborepo, Nx)** — it earns its keep when
  packages are shared between deployables. Here there is exactly one npm package
  (`mobile/`); the tooling would be pure overhead.

## Consequences

- ✅ One clone, one branch, one pull request per feature.
- ⚠️ Commands are run from the relevant directory, never from the root.
- ⚠️ No code sharing through an internal package. If code must be shared between
  `mobile/` and `supabase/` (API contract types, for example), that calls for a new
  decision — and therefore a new record.

## Usage

```bash
cd mobile && npm install   # app dependencies
cd mobile && npm start     # run the app
```
