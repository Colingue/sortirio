# ADR 003: Code quality — ESLint and Prettier

## Context

Code is written both by hand and by agents. Without automatically enforced rules,
style drifts and reviews fill up with formatting remarks that add nothing.

## Decision

- **ESLint 9** in flat config (`mobile/eslint.config.js`), based on
  `eslint-config-expo`.
- **Prettier** is the single source of truth for formatting, wired into ESLint via
  `eslint-plugin-prettier` and `eslint-config-prettier` (which disables ESLint's own
  stylistic rules).
- These checks are **local**: there is no pre-commit hook and no CI pipeline yet.

## Consequences

- Formatting is not up for discussion in review: whatever Prettier produces wins.
- Lint and format must pass before a change is considered done; until this is
  automated, it relies on manual discipline.
- Adding CI or a pre-commit hook will update this ADR.
- No test framework is installed so far. Introducing one is a decision in its own
  right, and therefore a new ADR.

## Usage

```bash
cd mobile
npm run lint          # check
npm run fix-lint      # fix what is auto-fixable
npm run format        # write Prettier formatting
npm run format:check  # check without writing
```
