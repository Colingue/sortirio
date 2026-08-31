---
type: decision
status: accepted
date: 2026-08-31
tags: [product, matching]
supersedes:
affects: [[docs/SPEC.md]], [[docs/ideas/sortirio-user-stories.md]]
---

# Grouping key — declared city, not GPS radius

## Context

The MVP originally grouped people within a **10 km radius around the position read once
at sign-up**, using `expo-location`. Two problems surfaced before any code was written:

- The GPS answers "where are you right now". The question that matters for a Friday
  night out is "where do you want to go out" — a different answer for someone who has
  just moved, lives in the suburbs, or goes back to their parents' place at weekends.
- A radius cuts groups on an invisible boundary. Two people who would happily meet in
  the same bar can fall on either side of it, and nobody can see why.

The pilot runs in **Lyon only**, with a hard floor on volume: below roughly 6
availabilities on a given Thursday, the app has nothing to show. Anything that splits an
already small pool is a direct threat to the pilot.

## Decision

Users **pick their city from a list** at sign-up, right after creating their profile,
and the group formation job groups people **within the same city**. The city is stored
on the profile and editable from it.

**Lyon is the only open city.** Other cities appear in the list marked "bientôt": they
cannot be selected to take part, but the interest is recorded.

The app **does not use geolocation** — `expo-location` leaves the MVP stack.

## Why not something else

- **10 km radius around the GPS position** — the original design. Answers the wrong
  question, splits an already fragile pool on an invisible boundary, and costs a system
  permission during a sign-up that should be one tap.
- **Geolocation to pre-select the city, then confirm** — better UX on paper, but it
  keeps the native module, the permission prompt and the refusal path for a list that
  contains exactly one selectable entry. Worth revisiting when there are twenty cities.
- **Free-text city field** — no list to maintain, but "Lyon", "lyon", "Lyon 7e" and
  "Villeurbanne" become four different cities and the matching silently stops working.
- **Neighbourhood or postal code** — finer grained, but at pilot volume it would split
  the pool into groups too small to form at all.

## Consequences

- ✅ One less system permission at sign-up, and one less native module in the build.
- ✅ The matching criterion is a stable, readable column — a plain `city_id` equality in
  the Thursday SQL job, instead of a distance computation.
- ✅ The "bientôt" cities record where demand is, at no extra cost, which is the cheapest
  possible input for choosing the second city.
- ⚠️ A declared city can be wrong or stale. Nothing verifies it; a user who moves must
  change it by hand.
- ⚠️ Venues become **city-scoped**: the seed table needs a city per venue, and the job
  must draw a group's venue from its own city.
- ⚠️ Someone living between two cities has to pick one. Accepted at pilot scale.
- ⚠️ The interest recorded on closed cities creates an expectation. If we never open the
  city, those users are left waiting with no follow-up.
- → Generates: the city list and the `cities` table, the sign-up city screen and its
  edit from the profile (user stories 1.3 and 1.4), the city column on venues, and the
  city equality in the group formation job.
