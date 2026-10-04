# PRD — Le chat survit à la soirée

_2026-10-03 · Story 5.3_

## Résumé

L'app gagne une **barre de deux onglets** : **Accueil**, inchangé, et **Mes groupes**.
« Mes groupes » liste **tous les groupes** dont j'ai fait partie, celui de la semaine
compris, triés par **date du vendredi**, le plus récent en haut. Chaque ligne affiche la
date, le bar et les prénoms. Un tap ouvre **directement le chat** du groupe. J'y lis et
j'y écris sans limite de temps, avec les prénoms et les photos de chacun.

## Problème

Côté base, le chat ne se ferme jamais (story 5.1, exigence 20). Mais le seul chemin pour
y arriver est l'écran du groupe, et cet écran disparaît le **samedi 6 h** (story 4.1,
exigence 2). Le lundi, un groupe qui a accroché n'a plus aucun moyen de se reparler dans
l'app. Le chat existe toujours, mais personne ne peut l'ouvrir.

Même si on ajoutait un chemin, la page du chat resterait cassée hors de cette fenêtre :

- Elle trouve les auteurs des messages grâce à `get_my_group()`
  (`mobile/src/app/(app)/chat/[groupId].tsx`). Cette fonction ne renvoie rien après le
  samedi 6 h. Pendant la semaine suivante, elle renvoie le **nouveau** groupe, donc les
  prénoms d'un ancien chat seraient introuvables, voire faux.
- La policy storage `profile_photos_select_group` se base aussi sur `get_my_group()`.
  Une fois la fenêtre fermée, les photos ne se chargent plus.

`docs/SPEC.md` est clair : « le chat de groupe ne se ferme pas ». La seule métrique du MVP
est la **re-dispo dans les 3 semaines**, et un groupe qui continue de se parler est la
meilleure raison de revenir un vendredi.

## Objectif

Qu'un membre puisse retrouver n'importe lequel de ses groupes, passés ou en cours, et
continuer à y écrire.

**Succès :** le lundi, j'ouvre « Mes groupes », je touche le groupe de vendredi, je vois
les messages de la soirée avec les prénoms et les photos, et j'écris. Le jeudi suivant à
19 h, le nouveau groupe apparaît en haut de la liste, et l'ancien reste juste en dessous.

## Utilisateur et scénario

En tant que membre d'un groupe qui s'est bien passé, je veux garder l'accès au chat après
vendredi soir, afin que le groupe continue d'exister sans l'app.

## Exigences fonctionnelles

### La barre d'onglets

1. L'espace connecté gagne une barre de **deux onglets**, exactement : **Accueil** et
   **Mes groupes**. Pas d'onglet Profil : aucune story ne le demande.
2. **Accueil** reste tel quel : poser sa dispo, le compte à rebours, le groupe de la
   semaine. Cette story n'y change rien.
3. L'écran du groupe, la confirmation de dispo et le chat **s'ouvrent par-dessus** les
   onglets, sans barre visible, comme aujourd'hui. Le chat a besoin de toute la hauteur
   de l'écran pour le clavier (story 5.1, exigence 1).
4. Le tap sur une notification de message (story 5.2) ouvre **toujours le chat du
   groupe**, quel que soit l'onglet actif. Le retour depuis le chat ramène dans les
   onglets, pas sur un écran vide.

### La liste « Mes groupes »

5. La liste contient **tous** les groupes dont je suis membre, **sans filtre** : pas de
   tri entre les soirées « réussies » et les autres, puisque l'app n'a aucun moyen de le
   savoir. Le groupe de la semaine y figure dès que sa ligne existe en base, c'est-à-dire
   dès le passage du job du jeudi 19 h.
6. Le tri se fait par **date du vendredi**, du plus récent au plus ancien. Pas de tri par
   dernier message : l'ordre reste stable et ne bouge pas pendant qu'on le lit.
7. Chaque ligne affiche la **date du vendredi**, le **nom du bar** et les **prénoms** des
   membres. Pas de photo, pas d'aperçu du dernier message, pas de compteur.
8. Un tap sur une ligne ouvre **directement le chat** (`/chat/[groupId]`), pas l'écran du
   groupe. Après la soirée, le lieu et l'heure ne servent plus à rien.
9. La liste est **rechargée chaque fois que l'onglet reprend le focus**. Sinon, un groupe
   formé le jeudi pendant que l'app était ouverte n'apparaîtrait pas.
10. Si je n'ai encore **aucun groupe**, l'onglet affiche une phrase simple à la place de
    la liste (par exemple « Tes groupes apparaîtront ici après ton premier vendredi. »).
11. La liste suit les trois états déjà utilisés partout dans l'app : chargement, échec
    (« Une erreur, réessaie plus tard. »), prêt.

### Le chat hors fenêtre

12. La page du chat ne s'appuie plus sur `get_my_group()` pour connaître les auteurs.
    Elle charge les membres **du groupe passé en paramètre**, sans limite de temps. C'est
    ce qui permet à un chat vieux de trois semaines d'afficher les bons prénoms.
13. Chaque message garde la **photo** et le **prénom** de son auteur (story 5.1,
    exigence 6), y compris des semaines après la soirée.
14. Le reste de la page ne change pas : temps réel, envoi, messages non envoyés et
    réessai fonctionnent pareil, que le groupe ait trois heures ou trois mois.

### La règle d'accès

15. **Lister mes groupes** passe par une fonction `security definer` (par exemple
    `get_my_groups()`). Pour chaque groupe dont je suis membre, elle renvoie
    l'identifiant, le vendredi, le nom du bar et les prénoms des membres. On garde le
    même principe que la story 4.1 : `groups`, `group_members` et `venues` n'ont toujours
    **aucune policy**, et `profiles` n'est pas ouvert plus largement (le jeton push reste
    privé).
16. **Lire les membres d'un groupe** passe par une seconde fonction `security definer`
    (par exemple `get_group_members(group_id)`). Elle renvoie l'identifiant, le prénom et
    le chemin de photo des membres, **uniquement si j'appartiens à ce groupe**, en
    s'appuyant sur `is_member_of_group()`. Pas d'âge : il ne sert pas dans le chat.
17. La lecture des **photos** est élargie : je peux lire la photo de quiconque partage, ou
    a partagé, **un groupe** avec moi. Il n'y a plus de fenêtre jusqu'au samedi 6 h. La
    policy `profile_photos_select_group` est remplacée dans ce sens par une migration.
18. Aucune de ces règles n'a de **fenêtre temporelle**. Elles suivent celle du chat : si
    j'ai le droit d'écrire dans un groupe, j'ai le droit de voir qui y est.
19. `get_my_group()` **ne change pas**. Elle continue d'alimenter l'Accueil et l'écran du
    groupe, avec sa fenêtre qui se ferme le samedi 6 h.

## Hors périmètre

- **Trier par dernier message**, mettre en avant les groupes actifs.
- **La pastille « non lu »**, le compteur de messages, l'aperçu du dernier message.
- **Quitter, masquer, archiver ou mettre en sourdine** un groupe.
- **Changer les notifications** de la story 5.2. Elles continuent d'arriver pour les
  anciens groupes, exactement comme aujourd'hui.
- **Un onglet Profil**, ou tout autre onglet.
- **Rouvrir l'écran du groupe** (lieu, heure, âges) pour un groupe passé.
- **Signaler ou bloquer** un ancien co-équipier : story 7.1.
- **La pagination** de la liste ou d'un chat devenu long.

## Risques / questions ouvertes

- **Des notifications pendant des semaines.** La story 5.2 notifie chaque message, sans
  limite de temps. Un ancien groupe très actif peut devenir bruyant, et sans mise en
  sourdine (hors périmètre), la seule issue est de couper les notifications de toute
  l'app. On l'accepte pour le MVP, à surveiller.
- **L'accès aux photos devient permanent.** Après la story 4.1, la photo d'un inconnu
  n'était visible qu'une soirée. Avec cette story, elle reste visible pour toujours par
  tous ses anciens co-équipiers. Ça découle de « le chat ne se ferme pas », mais c'est une
  ouverture de vie privée qui doit être assumée, et la story 7.1 (signaler) gagne en
  importance.
- **Le coût de la policy photos.** Elle s'évalue à chaque signature d'URL. Son prédicat
  (« ce chemin appartient-il à un co-équipier, passé ou présent ? ») doit rester une
  requête indexée sur `group_members`, calculée une fois par requête, comme
  `get_my_group()` aujourd'hui.
- **Les onglets changent la navigation racine.** `RootNavigator` déclare toutes les pages
  connectées dans un seul `Stack` protégé. Les onglets s'insèrent dedans comme un groupe
  de routes. Le choix entre les onglets natifs et les onglets JS d'expo-router se fait au
  plan, d'après la doc Expo SDK 57. Le cadre lui-même est déjà réglé par
  [[docs/adr/2026-08-30-mobile-stack-expo]] (`accepted`).
- **Le deep link de la notification.** Il faut vérifier sur un build de développement que
  le tap sur une notification ouvre le chat par-dessus les onglets, et que « Retour »
  ramène dans les onglets, app ouverte comme app fermée.
- **Rien n'est testable sans au moins deux vendredis.** Pour vérifier le tri et la
  survie, il faut un compte membre de deux groupes à des vendredis différents, dont un
  passé. Le script de seed attendu depuis la story 4.1 doit pouvoir créer un groupe
  « vendredi dernier ».
