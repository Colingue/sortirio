# PRD — US2 (retours phase 1) : présenter le principe de Dispo

_Écrit le 2026-11-14, revu le 2026-11-15. Source : `docs/ideas/dispo-retours-phase1.md`
(US2), entretiens avec Colin._

## Résumé

Trois écrans ultra simples expliquent le principe de Dispo : le verre du vendredi, le
groupe formé le jeudi à 19 h, le rendez-vous du vendredi. Chaque compte les voit une
fois : les nouveaux inscrits entre l'étape photo et l'accueil, les inscrits existants à
leur prochaine arrivée sur l'accueil. Un booléen sur le profil retient qu'ils ont été vus.

## Problème

Après l'inscription (ville → prénom → date de naissance → photo), on arrive directement
sur l'accueil sans explication. On ne comprend pas à quoi sert l'app ni quand ça se
passe. Les inscrits actuels n'ont jamais eu cette explication non plus.

## Objectif

Chaque utilisateur sait à quoi sert Dispo et quand ça se passe : inscription pour le
vendredi, groupe le jeudi 19 h, verre le vendredi 20 h.

## Utilisateurs et scénarios

- En tant que nouvel inscrit, je veux comprendre en quelques secondes comment marche
  Dispo, afin de savoir quoi faire sur l'accueil et ce que j'attends.
- En tant qu'inscrit existant, je veux la même explication à ma prochaine ouverture de
  l'app, une seule fois.

## Exigences fonctionnelles

### Donnée

1. Nouvelle colonne sur `profiles` : `onboarding_intro_seen boolean not null default false`.
   Le `default false` couvre les deux cas : les profils existants passent à `false` à la migration, les nouveaux profils sont créés à `false`.
2. Le tap sur « C'est parti » écrit `onboarding_intro_seen = true` sur son propre profil
   (politique `profiles_update_own` existante).

### Quand

3. Profil existant et `onboarding_intro_seen = false` → la présentation s'affiche à la place
   de l'accueil, quel que soit le chemin : fin d'inscription, lancement de l'app,
   reconnexion.
4. `onboarding_intro_seen = true` → l'accueil s'affiche directement, comme aujourd'hui.
5. Si l'app est tuée ou l'écriture échoue avant « C'est parti », la présentation revient
   au prochain lancement. C'est accepté.

### Contenu (maquettes « Présentation B » de Claude Design)

6. **Écran 1 · Les vendredis** — illustration : quatre personnes s'inscrivent chacune sur
   leur téléphone. Titre : « Chaque vendredi, un verre Dispo. » Texte : « Inscris-toi pour
   le prochain ! »
7. **Écran 2 · Le groupe** — illustration : avatars du groupe, pastille « Le bar du
   vendredi », extrait de chat. Titre : « Jeudi 19 h, on forme les groupes ». Texte :
   « Tu découvres ton groupe et votre bar. Le chat s'ouvre aussitôt pour faire
   connaissance avant le verre. »
8. **Écran 3 · Le verre** — photo : un groupe trinque en terrasse, pastille « Vendredi ·
   20 h · au bar ». Titre : « Vendredi, tu rejoins ton groupe ! » Texte : « Rendez-vous au
   bar à 20 h avec ton groupe. »

L'heure du rendez-vous, 20 h, est celle déjà écrite en dur dans l'app (`us-4.1`,
`us-6.1`). Les visuels sont exactement ceux des maquettes (illustration écran 1, cinq
photos d'avatars écran 2, photo écran 3), exportés de Claude Design et embarqués dans
`mobile/assets/`. Ce ne sont pas de vrais profils.

### Navigation

9. Bouton « Suivant » sur les écrans 1 et 2. « C'est parti » sur l'écran 3 : écrit le
   booléen puis mène à l'accueil.
10. Pas de bouton « Passer ».
11. Un indicateur montre l'écran en cours (trait long sur l'écran actif, points sinon).
12. Le retour arrière revient à l'écran précédent. Depuis l'écran 1, il ne mène nulle
    part (ni inscription, ni accueil).

### Style

13. Fond crème, titre en gras italique, bouton orange pleine largeur, comme les
    maquettes, réalisés avec le thème maison (`src/constants/theme.ts`), sans nouvelle
    dépendance.

## Notes d'implémentation

- **Renommage** : l'inscription actuelle, appelée `onboarding` dans le code (groupe
  `(onboarding)`, destination `'onboarding'`), devient `signup`. Le nom `onboarding`
  désigne désormais ces trois écrans.
- **Session** : `SessionProvider` charge déjà `hasProfile` au démarrage. Il charge aussi
  `onboardingIntroSeen` dans la même requête (`hasProfile` devient une lecture de
  `id, onboarding_intro_seen`), et expose un `markOnboardingIntroSeen()` sur le modèle de
  `profileCreated()`.
- **Routage** : `resolveDestination` gagne une destination `onboarding`
  (`hasProfile && !onboardingIntroSeen`). `RootNavigator` ajoute la garde correspondante
  avec les trois écrans, par exemple `(onboarding)/…`. Comme la garde remplace celle de
  `home`, l'accueil est inaccessible tant que la présentation n'est pas vue, et le
  retour depuis l'écran 1 ne mène nulle part.
- **Fin d'inscription** : rien à changer dans l'étape photo. Le profil est créé à
  `false`, `profileCreated()` met `hasProfile` à `true`, et le routage bascule seul sur
  la présentation. `profileCreated()` doit donc aussi poser `onboardingIntroSeen: false`.
- **« C'est parti »** : `update({ onboarding_intro_seen: true })` puis `markOnboardingIntroSeen()`,
  et le routage bascule sur `home`. En cas d'erreur réseau : message et bouton
  réessayable, sans quitter l'écran 3.
- `resolveDestination` a des tests : ajouter le cas `onboarding`.

## Critères de réussite

1. Nouvelle inscription → après « Terminer », l'écran 1 s'affiche, puis le 2, puis le 3,
   et « C'est parti » mène à l'accueil.
2. Compte existant avant la migration → au lancement, la présentation s'affiche avant
   l'accueil.
3. Après « C'est parti », relancer l'app ou se déconnecter/reconnecter → l'accueil
   s'affiche directement.
4. App tuée sur l'écran 2 → la présentation revient au prochain lancement.
5. Vérifié sur iOS (TestFlight ou build de dev).
6. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Hors périmètre

- **Aucun changement sur l'accueil.** La phrase de l'US2 sur l'accueil (« rendre clair
  qu'on s'inscrit et qu'on attend le jeudi 19 h ») est retirée le 2026-11-14.
- Pas de moyen de revoir la présentation plus tard.
- Pas d'animation complexe.
- Pas de texte spécial pour la fenêtre « Ce soir » (jeudi 19 h → vendredi 18 h, story
  10.1). L'écran 1 parle du prochain vendredi, et ça reste vrai.
