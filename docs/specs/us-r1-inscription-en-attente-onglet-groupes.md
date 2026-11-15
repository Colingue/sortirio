# PRD — US1 (retours phase 1) : afficher l'inscription en attente dans l'onglet Groupes

_Écrit le 2026-11-15. Source : `docs/ideas/dispo-retours-phase1.md` (US1),
entretien avec Colin du même jour._

## Le problème

Un membre s'inscrit au prochain vendredi. Tant que son groupe n'est pas formé,
l'onglet **Groupes** est vide (« Tes groupes apparaîtront ici après ton premier
vendredi. »). Un testeur s'est inscrit, voulait son groupe tout de suite et ne
comprenait pas pourquoi il n'avait rien.

Même problème pour un membre qui a déjà d'anciens groupes : rien ne montre que le
prochain arrive.

## Ce qu'on sait

- `src/app/(app)/(tabs)/groups.tsx` affiche une seule liste (`useMyGroups` →
  RPC `get_my_groups`), triée par vendredi décroissant. Chaque ligne est un
  `MyGroupsRow`, cliquable vers `/past-group/[groupId]`.
- `get_my_groups` renvoie tous mes groupes, y compris celui du vendredi qui
  vient s'il est déjà formé. La colonne `friday` permet de séparer « à venir » et
  « passés ».
- L'état d'inscription vient de `loadFridayState` (`useAvailabilityScreen`) :
  `postedFriday`, `nextOpenFriday`, `signupFriday`, `groupFormationAt`. L'accueil
  s'en sert déjà pour choisir entre `WaitingCard` (inscrit, groupe formé jeudi
  19 h) et `LateSignupCard` (« En attente »).
- `useMyGroups` recharge à chaque focus de l'onglet (`useFocusEffect`).

## Ce qu'on construit

L'onglet Groupes passe à **deux sections** :

### 1. À venir (en haut)

Au plus **un** item, pour le vendredi qui vient :

| Situation | Item |
|---|---|
| Inscrit, avant jeudi 19 h, pas de groupe | Carte d'attente : « Ton groupe de vendredi {date} sera formé jeudi à 19 h » |
| Inscrit, après jeudi 19 h, toujours pas de groupe | Carte d'attente : « En attente d'un groupe, on te prévient dès qu'il est prêt » |
| Groupe formé | La carte de groupe habituelle (`MyGroupsRow`) |
| Pas inscrit | Rien : section masquée, titre compris |

**Carte d'attente :**
- orange (`Colors.accent`, texte `onAccent`) ;
- même taille qu'une carte de groupe ;
- **non cliquable** ;
- le même texte, que la section « Passés » soit vide ou non.

### 2. Passés (en dessous)

Les groupes des vendredis passés, comme la liste actuelle. Section masquée s'il n'y
en a aucun.

### Bascule à venir → passés

Un groupe passe dans « Passés » le **samedi à 0 h** (heure locale), juste après sa
soirée. Le vendredi soir, il est encore dans « À venir ».

## Cas limites

- **Vendredi passé sans groupe** (`isNoGroupTonightShown`) : après samedi 0 h, la
  carte d'attente disparaît. Rien dans « À venir », sauf si le membre est déjà
  inscrit au vendredi suivant.
- **Aucun groupe et pas inscrit** : les deux sections sont masquées. On garde le
  texte vide actuel (« Tes groupes apparaîtront ici après ton premier vendredi. »).
- **Groupe formé pendant que l'onglet est affiché** : il apparaît au prochain
  focus de l'onglet, comme aujourd'hui. Pas de temps réel.

## Critères de réussite

1. Inscrit, pas de groupe, avant jeudi 19 h → « À venir » montre la carte orange
   avec le texte « formé jeudi à 19 h ».
2. Même chose avec d'anciens groupes → carte d'attente dans « À venir », anciens
   groupes dans « Passés ».
3. Inscrit, après jeudi 19 h, pas de groupe → carte orange « En attente d'un
   groupe… ».
4. Groupe formé → la carte de groupe remplace la carte d'attente dans « À venir ».
5. Samedi 0 h → le groupe du vendredi passe dans « Passés ».
6. Pas inscrit → pas de section « À venir ».
7. Toucher la carte d'attente ne fait rien.
8. La logique de tri à venir / passés / carte d'attente est couverte par un test
   unitaire.
9. Vérifié sur iOS.
10. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Hors périmètre

- Compte à rebours dans l'onglet Groupes (il reste sur l'accueil).
- Incitation à s'inscrire dans l'onglet Groupes.
- Modifier l'accueil ou ses cartes orange.
- Modifier le design de la carte de groupe (`MyGroupsRow`).
- Mise à jour en temps réel de l'onglet.
