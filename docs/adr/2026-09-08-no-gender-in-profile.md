---
type: decision
status: accepted
date: 2026-09-08
tags: [product, data]
affects: [[docs/SPEC.md]], [[docs/specs/us-1.2-inscription.md]], [[supabase/migrations/20260902201111_profiles.sql]]
---

# The profile has no gender

## Context

[[2026-08-31-matching-by-city]] and `docs/SPEC.md` describe a profile of five fields:
first name, birthdate, gender, photo, city. The gender preference left the MVP on
2026-09-06 — the matching stopped reading the field — but the field itself stayed:
asked on its own sign-up screen, stored `not null` on `profiles`, and shown to nobody.

That left one column and one full screen whose only justification was a use nobody had
scheduled. The sign-up is meant to be short, and every screen in it is a place to drop
out. Sortirio is also not a dating app: a gender collected "for later" on a profile that
strangers see is exactly the signal the product does not want to send.

## Decision

The profile has **no gender**. It is not asked at sign-up, not stored on `profiles`,
and not read by anything. The sign-up is four screens: city, first name, birthdate,
photo.

## Why not something else

- **Keep asking and storing it, unused** — the situation this replaces. It buys the
  option of balancing groups by gender later, at the price of a screen every user pays
  now and a personal field held with no stated purpose. If the balance ever becomes a
  real requirement, asking twelve to thirty pilot testers is a message, not a migration.
- **Keep the column, drop the screen** — a `not null` column nothing writes breaks every
  insert; making it nullable leaves a field that means "we did not ask", which is worse
  to read later than no field at all.
- **Ask it later, in the profile screen (story 1.4)** — moves the cost instead of
  removing it, and story 1.4 would then need a rule for the users who never answered.

## Consequences

- ✅ The sign-up loses a screen: four questions instead of five.
- ✅ No personal attribute is collected without a use, which is also the cheaper answer
  on privacy.
- ⚠️ **Balancing groups by gender is out of reach** for the pilot. If a group of six men
  and one woman turns out to be a problem, the data to prevent it does not exist.
- ⚠️ A migration must drop `profiles.gender`, which is `not null` today. Any row already
  written in a dev project loses that value.
- → Generates: the `drop column` migration and the removal of the gender screen, both
  inside story 1.2.
