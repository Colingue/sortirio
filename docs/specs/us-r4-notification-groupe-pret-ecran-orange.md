# PRD — US4 (retours phase 1) : la notification « groupe prêt » n'ouvre pas l'écran orange

_Écrit le 2026-11-13. Source : `docs/ideas/dispo-retours-phase1.md` (US4),
entretien avec Colin du même jour, specs `us-3.3-notification-groupe-pret.md` et
`us-9.1-modale-annonce-du-groupe.md`._

## Le bug

Un membre a l'app **en arrière-plan** (ouverte récemment, pas fermée) :

1. le groupe du vendredi est formé → il reçoit « Ton groupe est prêt ! » ;
2. il touche la notification → l'app revient sur l'accueil, **sans groupe et sans
   écran orange** ;
3. il doit tirer vers le bas pour rafraîchir → l'écran orange apparaît.

Personne ne sait qu'il faut tirer pour rafraîchir. Le membre rate l'annonce de son
groupe, c'est-à-dire le moment clé de l'app.

## Ce qu'on sait

- **La notif ne porte aucune donnée.** `send_group_ready_notifications` envoie juste
  `title` et `body` (pas de `groupId`, pas d'`url`). Au tap,
  `useOpenScreenFromNotification` ne trouve rien à ouvrir : l'app revient simplement
  au premier plan.
- **L'accueil ne recharge pas ses données au retour au premier plan.** Dans
  `src/app/(app)/(tabs)/index.tsx`, `loadFridayState`, `loadMyGroup` et
  `loadAttendanceQuestion` ne sont appelés qu'au montage et par le tir vers le bas
  (`usePullToRefresh`). L'accueil garde donc l'état d'avant la formation du groupe.
- **Dès que le groupe est chargé, l'écran orange marche déjà.** `GroupSummary` →
  `GroupAnnouncement` l'affiche si l'annonce n'a pas encore été vue
  (`isGroupAnnouncementPending`). Rien à changer là.
- **App complètement fermée : pas de bug.** Au démarrage, l'accueil charge des
  données fraîches.
- Un hook existe déjà pour ça : `src/hooks/useRunOnForeground.ts` (utilisé par le
  chat).
- Recharger ne fait pas clignoter l'accueil : `loadMyGroup` et `loadFridayState`
  gardent les données affichées et ne repassent pas par l'écran de chargement.

## La correction

Quand l'app revient au premier plan, l'accueil recharge les mêmes données que le tir
vers le bas. Ça couvre les deux cas d'un coup :

- tap sur la notification « groupe prêt » ;
- retour dans l'app via son icône, sans toucher la notif.

Si un nouveau groupe arrive, l'écran orange s'affiche tout seul, comme aujourd'hui
après un tir vers le bas.

## Reproduire

1. Se déclarer dispo pour le vendredi, sans groupe.
2. Mettre l'app en arrière-plan (sans la fermer).
3. Former les groupes (lancer la formation côté Supabase).
4. Toucher la notification « Ton groupe est prêt ! ».

## Critères de réussite

1. App en arrière-plan → groupe formé → tap sur la notif → **l'écran orange
   apparaît**, sans aucun geste en plus.
2. Même scénario, mais retour via l'icône de l'app au lieu de la notif → l'écran
   orange apparaît aussi.
3. L'écran orange ne s'affiche toujours qu'**une fois par groupe** : revenir au
   premier plan après l'avoir fermé ne le réaffiche pas.
4. Le tir vers le bas marche toujours.
5. Le retour au premier plan ne fait pas clignoter l'accueil (pas d'écran de
   chargement plein écran pendant le rechargement).
6. Vérifié sur iOS (TestFlight ou build de dev).
7. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Hors périmètre

- L'app complètement fermée (ça marche déjà).
- Les notifs de message (elles ouvrent déjà le chat).
- Le texte de la notification et ses données (pas besoin d'ajouter un `groupId`).
- Le contenu ou le design de l'écran orange.
