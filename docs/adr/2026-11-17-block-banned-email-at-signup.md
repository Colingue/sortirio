---
type: decision
status: proposed # proposed | accepted | superseded
date: 2026-11-17
tags: [backend, auth, moderation]
supersedes:
affects: # [[docs/specs/us-7.1-signaler-un-membre.md]] (exigence 16), [[docs/specs/us-p2-supprimer-mon-compte.md]]
---

# Un email banni est refusé à l'inscription, par un hook Auth Postgres

## Context

La story 7.1 promet qu'un compte banni ne peut pas se réinscrire avec le même email
(exigence 16). Ce n'est pas livré : `bans` est liée à l'id du compte et rien ne contrôle
l'inscription. La story P2 (supprimer mon compte) rend le trou réel : un banni supprime
son compte, se réinscrit, et repart avec un nouvel id.

Il faut donc refuser, au moment où Supabase Auth crée l'utilisateur, un email présent
dans `bans`. Cela touche le schéma `auth`, géré par Supabase : le choix est structurel.

## Decision

Nous activons le hook Auth `before_user_created`, branché sur une fonction Postgres
(`pg-functions://`) qui refuse la création si l'email, mis en minuscules, est dans
`bans`. `bans` garde l'email du banni, et sa ligne survit à la suppression du compte.

## Why not something else

- **Vérifier dans l'app après l'inscription** — le client est contournable (la clé
  publique ouvre l'API), et le compte serait déjà créé.
- **Trigger sur `auth.users`** — ce schéma appartient à Supabase : y poser un trigger
  est fragile aux mises à jour, et l'insertion a déjà eu lieu.
- **Hook Auth en Edge Function HTTP** — le projet n'a aucune Edge Function. Un appel
  HTTP de plus sur chaque inscription, pour une simple requête SQL.
- **Ne rien faire** — un banni reviendrait en deux minutes, ce qui vide le
  bannissement de son sens.

## Consequences

- ✅ Refus côté serveur, avant la création du compte, pour Apple et Google.
- ✅ Du SQL versionné dans `supabase/migrations/`, testable dans `supabase/tests/`.
- ⚠️ Une erreur dans la fonction bloque **toutes** les inscriptions : elle doit rester
  courte et être testée.
- ⚠️ Le hook s'active dans `supabase/config.toml` en local, et à la main dans le
  dashboard Supabase pour le projet hébergé (réglage Auth, pas schéma).
- ⚠️ Limite acceptée : un autre email ou un autre compte Google contourne le blocage.
  Apple « Masquer mon e-mail » reste stable pour un même identifiant Apple.
- ⚠️ On garde l'email des bannis uniquement, jamais celui des autres personnes.
- → Generates: P2 (colonne `email` dans `bans`, fonction du hook, activation).
