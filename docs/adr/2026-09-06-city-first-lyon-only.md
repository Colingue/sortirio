---
type: decision
status: accepted
date: 2026-09-06
tags: [product, mobile]
supersedes: [[2026-08-31-matching-by-city]]
affects: [[docs/SPEC.md]], [[docs/specs/us-1.2-inscription.md]], [[docs/ideas/sortirio-user-stories.md]]
---

# City screen — first, and Lyon alone

## Context

[[2026-08-31-matching-by-city]] settled that the city is declared rather than
geolocated, and that the sign-up asks for it **right after the profile**, from a list
where Lyon is the only selectable entry and the other cities are shown as "bientôt" to
record where demand is.

Two things came out of building the sign-up screens.

**The order was backwards.** A user who is not in Lyon fills in a first name, a
birthdate, a gender and a photo before the app tells them there is nothing for them
here. The one piece of information that can end the conversation was asked last.

**The list of closed cities is a screen full of things that do nothing.** Nine entries
that cannot be taken, one that can. It sells a coverage the pilot does not have, and the
demand signal it buys is worth little at twelve to thirty hand-recruited testers — all
of them in Lyon by construction.

## Decision

The city is the **first screen of the sign-up**, before the profile, and it offers
**Lyon alone**. No "bientôt" entries, no closed-city selection, no interest recorded.

Everything else in [[2026-08-31-matching-by-city]] stands: the city is declared and not
geolocated, `expo-location` stays out of the stack, the city is stored on the profile,
editable from it, and the Thursday job groups within a city.

## Why not something else

- **Keep the ten-city list** — the option this replaces. It records demand for free, but
  at pilot scale the testers are recruited by hand and already in Lyon, so the signal is
  a list of people we told to sign up. It also makes the first screen of the app a menu
  of things you cannot have.
- **Keep the city after the profile** — lets a user out of Lyon complete a profile that
  is worth keeping for the day the city opens. That day is not in this month, and the
  cost is paid now, by every user, in four screens filled for nothing.
- **Drop the city screen entirely and hardcode Lyon** — one screen less, and honest:
  there is no choice to make. Rejected because story 1.4 lets a user change city from
  their profile, so the screen has to exist anyway; and a sign-up that never mentions a
  city makes "Lyon only" a surprise rather than a stated scope.

## Consequences

- ✅ Someone outside Lyon learns it in one tap, before giving anything.
- ✅ The sign-up has no dead controls: every option on screen can be taken.
- ✅ The `city` column and story 1.4 are untouched — reopening the list later is adding
  entries, not reworking a flow.
- ⚠️ **The demand signal is gone.** Choosing the second city will need something else —
  asking testers, or a waiting list on a landing page. Nothing in the app answers it any
  more.
- ⚠️ A one-option screen is a confirmation, not a choice. It needs to read as "Sortirio
  is in Lyon for now", not as a list with one row.
- → Generates: the city screen becomes the first route of the `(onboarding)` group;
  `docs/SPEC.md` needs its city paragraph and its "hors périmètre" line rewritten —
  **Colin's call, the file is untouched so far**.
