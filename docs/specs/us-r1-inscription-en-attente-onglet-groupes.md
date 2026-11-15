# PRD — US1 (retours phase 1) : afficher l'inscription en attente dans l'onglet Groupes

_Écrit le 2026-11-15. Source : `docs/ideas/dispo-retours-phase1.md` (US1),
entretien avec Colin du même jour. Maquettes : projet Design « Dispo — écrans du
MVP » (https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk), écrans
`gB3bis-Groupes`, `gB4bis-Groupes` et `gB5-Groupes`._

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
- `MyGroupsItem` n'expose que `fridayLabel` (texte formaté). Pour trier entre
  « à venir » et « passés », il faut garder aussi la date brute `friday`, que
  `get_my_groups` renvoie déjà.

## Déjà en place : à réutiliser, pas à refaire

- **La carte de groupe `MyGroupsRow`** : photos des membres (`GroupFaces`), date,
  bar, nombre de membres, aperçu et heure du dernier message. Elle sert telle quelle
  pour le groupe formé (`gB5`) et pour les groupes passés.
- **`formatFridayLabel`** pour la date de la carte d'attente.
- **Les couleurs** de `constants/theme.ts` (`accent`, `accentDark`, `onAccent`,
  `border`, `textSecondary`, `AvatarColors`).
- **`react-native-reanimated`** est déjà installé, pour le point qui pulse.
- **L'état d'inscription** via `loadFridayState`. On ne crée ni requête ni
  migration.

## Ce qu'on construit

L'onglet Groupes passe à **deux sections**. L'en-tête ne change pas : titre
« Mes groupes » et sous-titre « Les chats restent ouverts après la soirée. »,
y compris quand seule la carte d'attente est affichée.

### Titres de section

- « À venir » puis « Passés ». Police 18 px, `Fonts.bold`.
- À droite du titre, une **pastille avec le nombre d'items** : fond `Colors.border`,
  texte `textSecondary` en 13 px semi-gras, hauteur 24, `minWidth` 24, arrondi 12.
  La carte d'attente compte pour 1.
- Marges : 22 px au-dessus de « À venir », 28 px au-dessus de « Passés », 12 px
  sous chaque titre. 10 px entre deux cartes.

### 1. À venir (en haut)

Au plus **un** item, pour le vendredi qui vient :

| Situation | Item | Maquette |
|---|---|---|
| Inscrit, avant jeudi 19 h, pas de groupe | Carte d'attente, texte « Ton groupe sera formé jeudi à 19 h » | `gB3bis` |
| Inscrit, après jeudi 19 h, toujours pas de groupe | Carte d'attente, texte « On te prévient dès qu'il est prêt » | `gB4bis` |
| Groupe formé | La carte de groupe habituelle (`MyGroupsRow`) | `gB5` |
| Pas inscrit | Rien : section masquée, titre compris | — |

**Carte d'attente** (même gabarit que `MyGroupsRow`) :
- **hauteur fixe de 98 px**, arrondi 14, padding 14/16, espace de 14 entre les
  visages et le texte ;
- fond `Colors.accent`, texte `onAccent` ;
- **non cliquable** : une simple `View`, pas de `Pressable`. Rôle d'accessibilité
  « note » ou équivalent ;
- **à gauche** : deux ronds « ? » qui se chevauchent, à la place des photos. Même
  disposition que `GroupFaces` (bloc 52 × 52, ronds de 34). Fond
  `AvatarColors[0]` (`#FCE9E0`), « ? » en `accent` 16 px gras, bordure de 2 px en
  `accent` ;
- **ligne 1** : la date, « Vendredi 20 novembre » (`formatFridayLabel`), 16 px
  semi-gras ;
- **ligne 2** : badge « En attente ». Fond blanc, texte `accentDark` en 11 px
  semi-gras, en forme de pilule. Il contient un **point orange de 6 px qui
  pulse** (échelle 1 → 1,7 → 1, opacité 1 → 0,35 → 1, en 1,8 s, en boucle). Pas
  d'animation si l'option « Réduire les animations » est activée
  (`useReducedMotion` de Reanimated) ;
- **ligne 3** : le texte de l'état, 14 px blanc, sur une ligne, coupé avec « … »
  si trop long ;
- le badge et la mise en page sont identiques avant et après jeudi 19 h. Seule la
  ligne 3 change ;
- le même texte, que la section « Passés » soit vide ou non.

**Groupe formé** : la carte `MyGroupsRow` actuelle, sans changement.

### 2. Passés (en dessous)

Les groupes des vendredis passés, avec la carte `MyGroupsRow` actuelle. Section
masquée s'il n'y en a aucun.

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

1. Inscrit, pas de groupe, avant jeudi 19 h → « À venir » montre la carte orange :
   date, badge « En attente », texte « Ton groupe sera formé jeudi à 19 h »
   (comme `gB3bis`).
2. Même chose avec d'anciens groupes → carte d'attente dans « À venir », anciens
   groupes dans « Passés ».
3. Inscrit, après jeudi 19 h, pas de groupe → même carte, texte « On te
   prévient dès qu'il est prêt » (comme `gB4bis`).
4. Groupe formé → la carte de groupe remplace la carte d'attente dans « À venir »
   (comme `gB5`).
5. Samedi 0 h → le groupe du vendredi passe dans « Passés ».
6. Pas inscrit → pas de section « À venir ».
7. Chaque titre de section affiche une pastille avec le bon nombre d'items.
8. La carte d'attente fait la même hauteur qu'une carte de groupe (98 px).
9. Toucher la carte d'attente ne fait rien.
10. Le point du badge pulse, sauf si « Réduire les animations » est activé.
11. La logique de tri à venir / passés / carte d'attente est couverte par un test
    unitaire.
12. Vérifié sur iOS.
13. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Hors périmètre

- Compte à rebours dans l'onglet Groupes (il reste sur l'accueil).
- Incitation à s'inscrire dans l'onglet Groupes.
- Modifier l'accueil ou ses cartes orange.
- Toucher à la carte de groupe (`MyGroupsRow`). Le compteur « 2 » et l'heure en
  orange de la maquette `gB5` ne font pas partie de cette US.
- Mise à jour en temps réel de l'onglet.
