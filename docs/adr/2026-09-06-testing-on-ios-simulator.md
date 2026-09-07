---
type: decision
status: accepted
date: 2026-09-06
tags: [mobile, process]
supersedes: [[2026-09-06-testing-on-expo-web]]
affects:
  [[docs/specs/us-1.1-connexion.md]], [[docs/specs/us-1.2-inscription.md]],
  [[mobile/src/lib/supabase.web.ts]], [[mobile/src/lib/auth/google.web.ts]]
---

# Testing platform — the iOS simulator

## Context

[[2026-09-06-testing-on-expo-web]] was written this morning and settled that every story
is built and verified in `npm run web`. It considered the iOS simulator and rejected it
in one line: _"same build chain, and it cannot use a camera at all"_.

The build chain half of that reason no longer holds. `mobile/ios/` exists, and
`npm run ios` puts the app on an iPhone 17 Pro simulator today. The cost the record was
avoiding has already been paid, so the browser is no longer the cheap option — it is
just the option that proves the least.

Its cost is also visible now. Keeping the web alive means a second code path per
feature: `supabase.web.ts` and `google.web.ts` exist only so the browser has something
to run, and `google.web.ts` in particular reimplements sign-in with Google Identity
Services — a flow the shipped app will never execute.

The pilot ends on real phones either way. The question is which of the two stand-ins is
worth the effort between now and then.

## Decision

The app is developed and verified on the **iOS simulator** (`npm run ios`). A story is
done when its behaviour is verified there.

The web is no longer a target: it is not run, not verified, not maintained.
`supabase.web.ts` and `google.web.ts` are deleted, and no new `.web.ts` variant is
written.

Android code is written alongside iOS but **verified later**, at the first EAS Android
build. Nothing Android-specific is claimed to work before that build has run.

The switch to a physical device happens at the first behaviour a simulator cannot
produce — push notifications (story 3.3) and the camera — and no later.

## Why not something else

- **Expo web, as decided this morning** — the record this one replaces. Its single
  advantage was skipping a native build, and that build now exists and costs one
  command. What is left is the bill: a duplicate code path per feature, and a platform
  the product never ships to.
- **The Android emulator instead** — Android carries the harder credentials chain
  (package name plus a signing fingerprint per key), so verifying it early has real
  value. But it means installing Android Studio and a Play-services system image now,
  while iOS runs on this machine already. Android's turn comes at its EAS build, not
  before.
- **Both simulators, every story** — doubles the verification work on a one-month build
  to catch platform-specific layout bugs, which are cheap to find and fix in one pass
  later.
- **A physical iPhone now** — needs a paid Apple Developer account and a provisioning
  chain, and buys nothing the simulator does not already give except the camera and push
  — which are precisely what triggers the switch later anyway.

## Consequences

- ✅ What gets verified is a real iOS app: native navigation, the real splash screen, the
  native modules, and the actual Google sign-in the app ships rather than a browser
  stand-in.
- ✅ One code path per feature. The `.web.ts` duplicates disappear instead of quietly
  rotting.
- ⚠️ Out of reach on a simulator: push notifications, the camera, real device
  performance, and how any of it feels in the hand.
- ⚠️ **Android stays unverified until its first EAS build.** The login story was ordered
  first to defuse exactly that risk — the Android signing fingerprint — and this record
  leaves it deferred, as the web record already did. It names the risk, it does not
  remove it.
- ⚠️ Nothing runs at all until Google sign-in is configured for iOS: an iOS OAuth client
  in Google Cloud, its reversed URL scheme in `app.json`, `iosClientId` in
  `GoogleSignin.configure()`, and the iOS client ID added to the Supabase Google
  provider. That is the first work this record generates, and it blocks the rest.
- ⚠️ Sign-in on iOS is what makes App Store rule 4.8 concrete: an app offering Google
  sign-in must also offer "Se connecter avec Apple". That is a product decision, not a
  testing one, but it stops being hypothetical the day this record is applied.
- → Generates: rewriting the manual checklist of `us-1.1-connexion.md` for the simulator
  and adding the iOS credentials to it; deleting `supabase.web.ts` and `google.web.ts`;
  a later story for the first Android EAS build and the device checklist it carries.

## Usage

```bash
cd mobile
npm run ios
```
