---
type: decision
status: accepted
date: 2026-09-24
tags: [product, matching]
affects: [[docs/SPEC.md]], [[docs/specs/us-3.1-formation-des-groupes.md]], [[supabase/migrations/20260923202104_compute_group_sizes.sql]]
---

# Jamais de groupe en dessous de trois personnes

## Context

S'il y a que deux personnes qui sont dispos que faire ?

## Decision

Un groupe n'est **jamais formé à moins de trois personnes**. Une ville à 1 ou 2 dispos ne
forme aucun groupe ; ces utilisateurs attendent la semaine suivante.

## Why not something else

- **Groupes de 2** — un duo est un date, pas une sortie entre amis : c'est la seule chose
  que le produit prétend ne pas être. Deux personnes portent seules la soirée, un
  désistement y met fin.
- **Le 2 en secours, quand le reliquat serait sinon abandonné** — même duo, plus une
  exception dans l'algorithme, pour deux personnes par ville et par semaine au maximum.
- **Borne à 4** — plus sûr face à un désistement, mais jette un vrai groupe chaque fois
  qu'une ville tombe exactement à 3. SPEC.md s'engage déjà sur « on sort quand même » à 3.

## Consequences

- ✅ Une règle sans exception, et c'est le cas de base de `compute_group_sizes()` : sous
  3, la récursion ne renvoie aucune ligne.
- ⚠️ **Certains utilisateurs ne sont pas placés** — un vendredi à 2 dispos ne produit
  aucun groupe. Au volume du pilote, cela arrivera.
- ⚠️ La borne ne tient **qu'à la formation** : SPEC.md accepte qu'un désistement ramène un
  groupe de 3 à 2 (story 4.3), et rien ne le recompose.
- → Génère l'état « personne n'a pu être groupé cette semaine » sur l'écran de dispo
  notée, et clôt le point « moins de 6 inscrits un jeudi » laissé « à confirmer » dans
  `docs/ideas/sortirio-user-stories.md`.
