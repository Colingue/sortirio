# ADR 001: Repository structure

## Context

Sortirio needs a mobile app (Expo / React Native) and a backend (group matching,
user accounts, venue list). We had to decide whether these two parts live in a
single repository or in two separate ones, and how the root directory is organized.

## Decision

A single repository, with one directory per deployable at the root:

- `mobile/` — the Expo / React Native app (the only installed package so far)
- `api/` — the backend (reserved directory, still empty)
- `docs/` — product specification (`SPEC.md`)
- `adr/` — architecture decisions (this directory)

There is **no** monorepo tooling (no npm/pnpm workspaces, no Turborepo, no Nx).
Each directory manages its own dependencies and its own scripts.

## Consequences

- Commands are run from the relevant directory, never from the root.
- No code sharing through an internal package for now. If code must be shared
  between `mobile/` and `api/` (API contract types, for example), that calls for a
  new decision — and therefore a new ADR.
- The backend stack has not been chosen yet; `api/` stays empty until then and will
  need its own ADR.

## Usage

```bash
cd mobile && npm install   # app dependencies
cd mobile && npm start     # run the app
```
