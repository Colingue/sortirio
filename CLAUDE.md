# Project description

Sortirio: a mobile app (iOS + Android, Expo / React Native) for making **friends**
in a new city. Not a dating app.

# Expo documentation

Expo has changed -> Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Decision records (ADRs)

Structural decisions live in `docs/adr/`, one file per decision, named
`YYYY-MM-DD-short-title.md`. They are **immutable**: an accepted record is superseded,
never rewritten.

**Start with `docs/adr/INDEX.md`.** It lists every record with its status and what it
settles — read it before planning anything structural, then open the records that touch
your subject. Treat `status: accepted` as binding: do not re-propose an option a record
already rejected. If a change makes a statement in a record obsolete, update that
record as part of the same work.

If a change calls for a **new** decision, use the `decision-records` skill: it holds the
format, the template (`assets/decision-template.md`) and the status flow. New records
are created with `status: proposed` — only I flip them to `accepted`. A new record is
only finished once its line is added to `docs/adr/INDEX.md`, in the same pass.
