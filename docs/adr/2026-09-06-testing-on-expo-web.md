---
type: decision
status: superseded
date: 2026-09-06
tags: [mobile, process]
supersedes:
affects: [[docs/specs/us-1.1-connexion.md]], [[docs/specs/us-1.2-profil.md]]
---

# Testing platform — Expo web first, a real device later

## Context

[[2026-08-30-mobile-stack-expo]] settled that the app targets iOS and Android from a
single Expo codebase. It said nothing about where the developer looks at the app while
building it, and the spec for the login story filled that silence with an assumption:
"the test phone is a physical Android".

That phone does not exist. There is no Android device, and buying, borrowing or setting
one up is a detour on a one-month build. Meanwhile the login story already ships a
working web path — `supabase.web.ts` and `google.web.ts` — so the app runs in a browser
today, Google sign-in included.

The pilot still ends on real phones: TestFlight and a closed Android track. The question
is only _when_ the switch happens, not _whether_.

## Decision

Until further notice, the app is developed and tested in **Expo web**
(`npm run web`). Every story is considered done when its behaviour is verified in the
browser.

The switch to a real device happens at the **first story whose behaviour cannot exist on
the web** — push notifications, story 3.3 — and no later. Everything before that is
built, reviewed and accepted on the web.

## Why not something else

- **A physical Android now** — the option the login spec assumed. It costs a device and
  an afternoon of Google Cloud, signing fingerprints and EAS builds, before a single
  screen exists. That chain has to work eventually, but paying for it on day 3 buys
  nothing that the browser does not already show.
- **An Android emulator** — closer to the target than a browser, but it needs Android
  Studio, a Play-services system image and a development build to run the native Google
  sign-in module. That is the whole chain the browser avoids, minus the confidence of a
  real device.
- **The iOS simulator** — same build chain, and it cannot use a camera at all, which is
  one of the things a device is supposed to prove.
- **Expo Go** — ruled out already: the native Google sign-in module does not run in it.

## Consequences

- ✅ No build chain between writing a line and seeing it. On a one-month schedule that is
  the difference between five iterations a day and one.
- ✅ The web path stays alive because it is the only path being exercised, instead of
  rotting silently.
- ⚠️ **The web proves less than a phone.** Out of reach until the switch: push
  notifications, camera capture, native date and photo pickers, the Android signing
  fingerprint, the splash screen, the system back gesture, and how any of it feels in
  the hand.
- ⚠️ The login story was deliberately ordered first to defuse one risk — discovering on
  day 20 that the Android signing chain is broken. **This record puts that risk back**,
  knowingly, and moves it to the day of the switch.
- ⚠️ Every feature now needs its web variant to work, not just to compile. A story that
  cannot run on the web at all is a signal to switch, not to skip the story.
- → Generates: rewriting the manual checklists of `us-1.1-connexion.md` and
  `us-1.2-profil.md` for the browser; a later story for the first EAS development build
  and the device checklist it carries.

## Usage

```bash
cd mobile
npm run web
```
