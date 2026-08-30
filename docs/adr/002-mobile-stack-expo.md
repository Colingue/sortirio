# ADR 002: Mobile stack — Expo SDK 57 and expo-router

## Context

The app targets iOS and Android from a single codebase, with a small team and the
intent to iterate quickly on an MVP. We had to choose a framework, a version, and a
navigation strategy.

## Decision

- **Expo SDK 57** with React Native 0.86 and React 19, managed workflow.
- **expo-router** for navigation, file-based routing from `mobile/src/app/`, with
  `typedRoutes` enabled.
- **TypeScript with `strict: true`**, import aliases `@/*` to `mobile/src/*` and
  `@/assets/*` to `mobile/assets/*`.
- **Node 24.20.0**, pinned in `mobile/.nvmrc`.
- **npm** as the package manager (`package-lock.json` is authoritative).
- The React Compiler is enabled (`experiments.reactCompiler`).

Application code lives under `mobile/src/`: `app/` (routes), `components/`,
`hooks/`, `constants/`.

## Consequences

- **Any Expo code must be written against the versioned v57 documentation**:
  <https://docs.expo.dev/versions/v57.0.0/>. Answers found online for earlier SDKs
  are treated as outdated.
- `expo-*` package versions stay aligned with the SDK; we upgrade with
  `npx expo install` rather than `npm install`, so Expo picks the compatible version.
- Adding a screen means adding a file under `mobile/src/app/`. No hand-written route
  table.
- The React Compiler requires following the Rules of React (no mutation of props or
  state, hooks called unconditionally); breaking them causes silently wrong behavior.
- A major SDK upgrade is a structural change: it updates this ADR.

## Usage

```bash
cd mobile
nvm use                    # Node 24.20.0
npm install
npm run ios                # or: npm run android, npm start
npx expo install <package> # add an SDK 57 compatible dependency
```

Import through the alias:

```ts
import { ThemedText } from '@/components/themed-text';
```
