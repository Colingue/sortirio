# PRD — US5 (retours phase 1) : le minuteur ne bouge pas

_Écrit le 2026-11-13. Source : `docs/ideas/dispo-retours-phase1.md` (US5),
entretien avec Colin du même jour, spec `us-2.3-compte-a-rebours.md`._

## Le bug

Colin et sa copine sont inscrits pour le même vendredi, dans la même ville. Sur
leurs deux téléphones, le compte à rebours affiché après l'inscription montre **10 min
d'écart**, et **il reste figé**.

Sur le téléphone en retard, l'app tournait **en arrière-plan** depuis un moment.

## Ce qu'on sait

- **L'heure de fin est la même pour tous.** `group_formation_at` vient du serveur et
  dépend seulement du vendredi et de la ville. L'écart vient donc de l'app.
- **C'est le téléphone qui calcule.** `useCountdown` (`src/hooks/useCountdown.ts`)
  compare l'heure de fin à l'horloge du téléphone.
- **Le recalcul ne se fait qu'une fois par minute** (`TICK_MS = 60_000`). Au retour
  dans l'app, rien ne force un recalcul immédiat : l'écran garde l'ancienne valeur.
- **L'affichage s'arrête aux minutes** (`formatTimeRemaining` dans
  `src/features/availability/helpers/countdown.ts`). Même quand ça marche, on ne voit
  rien bouger pendant une minute.
- Un hook existe déjà pour le retour au premier plan :
  `src/hooks/useRunOnForeground.ts` (utilisé par le chat).
- `useCountdown` et `formatTimeRemaining` servent aussi aux cartes « Ce soir »
  (`tonight-card`) et « Inscription tardive » (`late-signup-card`). La correction les
  touche aussi.

## La correction

Uniquement dans l'app, rien côté serveur :

1. `useCountdown` recalcule **chaque seconde**.
2. `useCountdown` recalcule **tout de suite** quand l'app revient au premier plan.
3. `TimeRemaining` gagne un champ `seconds`, et `formatTimeRemaining` affiche les
   secondes **tout le temps** : `2 j 4 h 12 min 37 s`, `4 h 12 min 37 s`,
   `12 min 37 s`.

## Reproduire

1. Se déclarer dispo pour le vendredi.
2. Mettre l'app en arrière-plan (sans la fermer) pendant plusieurs minutes.
3. Revenir dans l'app et comparer avec un autre téléphone qui vient d'ouvrir l'app.

## Critères de réussite

1. Le minuteur affiche les secondes et défile chaque seconde, écran ouvert.
2. App en arrière-plan plusieurs minutes, puis retour → le minuteur affiche **tout de
   suite** la bonne valeur, sans attendre.
3. Deux téléphones inscrits pour le même vendredi dans la même ville affichent la même
   valeur à la seconde près (à l'écart d'horloge des téléphones près).
4. Au moment où le temps est écoulé, le minuteur disparaît, comme aujourd'hui.
5. Les tests de `countdown.test.ts` couvrent les secondes (calcul et affichage).
6. Vérifié sur iOS (TestFlight ou build de dev).
7. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Hors périmètre

- Le serveur et le calcul de `group_formation_at`.
- Le texte et le design des cartes (hors ajout des secondes).
- L'encadré orange de l'accueil (US6).
- Le décalage d'horloge entre téléphones (on se fie à l'horloge du téléphone).
