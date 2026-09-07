# Decision records — index

Every structural decision taken on Sortirio, newest first. **Start here** before
planning anything structural: this table says which record covers your subject, so you
read one file instead of five.

A record is immutable — `accepted` means binding. Do not re-propose an option a record
already rejected under `## Why not something else`. A `proposed` line is a draft
waiting for Colin: it settles nothing, and nothing is built on it until he says so.

| Record                                                                         | Date       | Status     | What it settles                                                                                                                                                                              |
| ------------------------------------------------------------------------------ | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Testing platform — the iOS simulator](2026-09-06-testing-on-ios-simulator.md) | 2026-09-06 | accepted   | Stories are built and verified in `npm run ios`; the web target is dropped and its `.web.ts` files deleted; Android is verified only at its first EAS build. Supersedes the Expo web record. |
| [City screen — first, and Lyon alone](2026-09-06-city-first-lyon-only.md)      | 2026-09-06 | proposed   | The city is the first sign-up screen and offers Lyon only; no "bientôt" list, no demand signal. Would supersede the 2026-08-31 record on those two points.                                   |
| [Testing platform — Expo web first](2026-09-06-testing-on-expo-web.md)         | 2026-09-06 | superseded | History. Stories were built and verified in `npm run web`. Replaced by the iOS simulator record above.                                                                                       |
| [Mobile code layout — feature folders](2026-09-03-mobile-feature-folders.md)   | 2026-09-03 | accepted   | Business code grouped by subject in `mobile/src/features/<subject>/`, files flat inside; `src/lib/` reserved for technical setup. No DDD.                                                    |
| [Grouping key — declared city, not GPS radius](2026-08-31-matching-by-city.md) | 2026-08-31 | accepted   | Users pick their city from a list at sign-up; groups are formed within a city. Lyon only for the pilot, no geolocation, `expo-location` out of the stack.                                    |
| [Backend — Supabase](2026-08-31-backend-supabase.md)                           | 2026-08-31 | accepted   | Postgres + Auth (Apple/Google) + Realtime chat + Storage + `pg_cron` for the Thursday job, in a `supabase/` directory. Replaces the reserved `api/`.                                         |
| [Repository structure](2026-08-30-repository-structure.md)                     | 2026-08-30 | accepted   | One repository, one directory per deployable (`mobile/`, `supabase/`, `docs/`), no monorepo tooling.                                                                                         |
| [Mobile stack — Expo SDK 57 and expo-router](2026-08-30-mobile-stack-expo.md)  | 2026-08-30 | accepted   | Expo SDK 57, React Native 0.86, React 19, expo-router with typed routes, TypeScript strict, npm, Node 24.20.0.                                                                               |
| [Code quality — ESLint and Prettier](2026-08-30-code-quality.md)               | 2026-08-30 | accepted   | ESLint 9 flat config on `eslint-config-expo`, Prettier as the single formatting authority, checks local only (no hook, no CI yet).                                                           |

## By subject

- **Where the code lives, how the repo is laid out** → repository structure
- **Where a helper file goes inside `mobile/src`, features vs lib** → mobile code layout
- **Data, auth, chat, scheduled jobs, migrations** → backend Supabase
- **Navigation, TypeScript, package manager, Node version** → mobile stack
- **Linting, formatting, when checks run** → code quality
- **Where the app is tested, simulator vs web vs real device** → testing platform (iOS
  simulator), then the superseded Expo web record for the history
- **Who gets grouped with whom, cities, geolocation** → grouping key, then city screen

## Keeping this file honest

This index is **not** a record: it is living state, so it is edited freely — unlike the
records themselves.

Adding a record means adding its line here **in the same pass**. Superseding one means
updating its status here too, and pointing the line at the record that replaces it. An
index that lags behind the directory is worse than no index, because it is still
trusted.

Related living documents: `docs/SPEC.md` (what the product does today),
`docs/ideas/` (ideation notes and user stories) and `docs/specs/` (one build spec per
user story, written just before implementation).
