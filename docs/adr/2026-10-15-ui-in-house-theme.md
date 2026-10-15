---
type: decision
status: proposed
date: 2026-10-15
tags: [mobile, ui]
affects: [[mobile/src/constants/theme.ts]], [[mobile/src/components/]]
---

# UI — an in-house theme taken from Claude Design, no component library

## Context

The screens are designed in a Claude Design canvas ("Dispo — écrans du MVP", 20 phone
screens). They are HTML: no tool turns them into React Native, each screen is rewritten
by hand. The app still wore the Expo template theme (black/white, system font, light +
dark), with every screen reading its colors through `useTheme()` and `ThemedText`.

The canvas has no design system: the same dozen colors, radii and font sizes are
repeated inline in every screen.

## Decision

We style with React Native `StyleSheet` and an in-house theme: the canvas palette,
radii and Poppins type scale live in `src/constants/theme.ts`, and the few pieces the
screens repeat (button, card, pill…) live in `src/components/`. No UI component
library. The app is light only, like the mockups.

## Why not something else

- **Tamagui / React Native Paper** — bring their own look and component API; the
  mockups already define the look, so most of the library would be overridden.
- **NativeWind (Tailwind)** — a second styling system next to the 23 files already on
  `StyleSheet`, plus a Babel/Metro setup to maintain, for a dozen tokens.
- **A design system in Claude Design first** — tokens would live twice (canvas and
  code); the code is the one that ships.
- **Keep light + dark** — no dark mockup exists; a dark palette would be invented.

## Consequences

- ✅ Every screen already reads `useTheme()` / `ThemedText`: changing the theme restyles
  the whole app at once.
- ✅ No new dependency for styling.
- ⚠️ Each screen is ported by hand from its `.dc.html`.
- ⚠️ Dark mode, if wanted later, means designing a dark palette and restoring the
  `light`/`dark` split.
- → Generates: one port per screen, in canvas order.
