---
type: decision
status: accepted
date: 2026-08-30
tags: [mobile, process]
supersedes:
affects:
---

# Code quality — ESLint and Prettier

## Context

Code is written both by hand and by agents. Without automatically enforced rules, style
drifts and reviews fill up with formatting remarks that add nothing.

## Decision

- **ESLint 9** in flat config (`mobile/eslint.config.js`), based on `eslint-config-expo`.
- **Prettier** is the single source of truth for formatting, wired into ESLint via
  `eslint-plugin-prettier` and `eslint-config-prettier` (which disables ESLint's own
  stylistic rules).
- These checks are **local**: there is no pre-commit hook and no CI pipeline yet.

## Why not something else

- **Biome** — faster and a single tool, but `eslint-config-expo` carries the React
  Native and Expo rules we would otherwise have to re-derive by hand.
- **ESLint's own stylistic rules instead of Prettier** — two tools with an opinion on
  formatting means conflicts to arbitrate on every file. One winner is simpler.
- **A pre-commit hook or CI right away** — worth having, but it is setup time taken out
  of a one-month MVP. Deliberately deferred, at the cost noted below.

## Consequences

- ✅ Formatting is not up for discussion in review: whatever Prettier produces wins.
- ⚠️ Lint and format must pass before a change is considered done; until this is
  automated, it relies on manual discipline — which will occasionally fail.
- ⚠️ Prettier only covers `mobile/`. Files under `docs/` are formatted by hand.
- ⚠️ No test framework is installed so far. Introducing one is a decision in its own
  right, and therefore a new record.
- → Generates: adding CI or a pre-commit hook, which supersedes this record.

## Usage

```bash
cd mobile
npm run lint          # check
npm run fix-lint      # fix what is auto-fixable
npm run format        # write Prettier formatting
npm run format:check  # check without writing
```
