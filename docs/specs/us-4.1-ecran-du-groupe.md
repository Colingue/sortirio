# PRD — Voir mon groupe, son lieu et son heure

_2026-09-28 · Story 4.1_

## Résumé

Entre jeudi 19h et samedi 6h, l'accueil remplace son bloc d'attente par un **bloc
groupe** — l'heure, le nom du lieu, les photos des autres membres, et un bouton
« Voir mon groupe ». Ce bouton ouvre une **page dédiée** : nom du lieu, adresse
tappable qui ouvre l'app de cartes du téléphone, heure du rendez-vous, et la liste
des membres — moi compris — en photo, prénom et âge.

## Problème

Le groupe existe en base (story 3.1), il a un lieu (story 3.2) et l'utilisateur reçoit
une notification qui le lui annonce (story 3.3) — mais l'app ne montre rien. Taper la
notification ouvre l'accueil, qui affiche toujours un compte à rebours vers un jeudi 19h
déjà passé. Tout ce que le backend a construit depuis trois stories est invisible.

## Objectif

Qu'un membre de groupe sache, avant vendredi soir, où il va, à quelle heure, et avec qui.

**Succès :** vendredi soir, l'utilisateur arrive au bon bar à la bonne heure sans avoir
demandé à personne.

## Utilisateur et scénario

En tant que membre d'un groupe, je veux voir le lieu, l'adresse, l'heure et les visages
de ceux que je vais rencontrer, afin d'arriver vendredi soir sans appréhension et sans
me tromper de bar.

## Exigences fonctionnelles

### La fenêtre de visibilité

1. Le groupe est visible **dès que sa ligne existe** en base — c'est le job du jeudi 19h
   qui la crée, donc la borne basse est une donnée, pas une horloge. Un job en retard
   décale l'affichage, il ne le casse pas.
2. Il cesse d'être visible le **samedi 6h, heure de Paris**, du samedi qui suit son
   vendredi. À 2h du matin la soirée est encore en cours ; à 6h tout le monde est rentré.
   Passé cette heure, l'accueil repasse à son état normal (« pose ta dispo »).
3. Un vendredi n'a **jamais qu'un seul groupe visible** — la contrainte
   `group_members_user_friday_unique` le garantit déjà en base.
4. Un utilisateur dispo mais **non groupé** (moins de trois personnes dans sa ville)
   garde le bloc d'attente actuel. Cette story ne change rien pour lui.

### Le bloc sur l'accueil

5. Le bloc groupe occupe **exactement la place du bloc d'attente**, dont il prend la
   suite : les deux ne cohabitent jamais. Le compte à rebours pointait vers jeudi 19h,
   qui est passé, et annuler sa dispo n'a plus de sens une fois le groupe formé — le
   bouton d'annulation disparaît avec le bloc.
6. Le bloc affiche, au minimum :
   - l'heure et le jour : `Vendredi 20h` ;
   - le **nom du lieu** ;
   - les photos des **autres membres** en pastilles alignées — pas la mienne, je sais à
     quoi je ressemble ;
   - un bouton **« Voir mon groupe »**.
     Ni l'adresse, ni les prénoms, ni les âges : c'est le rôle de la page.
7. Taper la notification de la story 3.3 ouvre l'app sur l'accueil, comme un lancement
   normal — et le bloc groupe y est. **Aucun deep link n'est nécessaire** : le point
   laissé ouvert par la story 3.3 se referme ici sans code de routage.

### La page du groupe

8. Le bouton ouvre une page dédiée, qui affiche :
   - le **nom** du lieu ;
   - son **adresse** ;
   - l'**heure** du rendez-vous ;
   - la **liste des membres**, moi compris. Me voir dans la liste est la preuve que j'y
     suis bien.
9. Chaque membre n'est montré que par **photo, prénom et âge**. Rien d'autre du profil
   ne sort : ni la date de naissance exacte, ni la ville, ni le genre, ni le jeton push.
   L'âge est **calculé côté serveur** pour que la date de naissance ne quitte jamais la
   base ([[docs/SPEC]], profil volontairement pauvre).
10. Taper l'adresse ouvre l'**app de cartes par défaut du téléphone** (Plans sur iOS,
    Google Maps sur Android) avec l'adresse **en recherche**. Pas un itinéraire
    pré-calculé : `venues` ne stocke qu'une adresse texte, sans coordonnées, et l'app
    ignore le point de départ. L'utilisateur lance son itinéraire en un tap de plus.
11. L'heure du rendez-vous est **20h, en dur côté app**. Elle n'est stockée nulle part —
    la story 3.2 l'a explicitement laissée hors de la table des lieux.

### La lecture des données

12. L'app lit le groupe par **une seule fonction Postgres `security definer`**,
    `get_my_group()`, qui renvoie le lieu et les membres en une requête. Les tables
    `groups`, `group_members` et `venues` **gardent leur RLS sans aucune policy** :
    « personne ne lit » reste le bon défaut, et la fonction est la seule porte.
13. Cette fonction est le seul moyen d'exposer le profil des autres. `profiles` n'a que
    `profiles_select_own` : élargir cette policy aux co-équipiers donnerait accès à la
    **ligne entière** — jeton push compris. Une fonction `definer` expose exactement
    trois colonnes et rien de plus.
14. La fonction applique elle-même la fenêtre du point 2 : hors fenêtre, elle ne renvoie
    rien. La borne n'est pas une règle d'affichage côté app, c'est la règle d'accès.
15. Les photos vivent dans un bucket **privé** dont la seule policy de lecture est
    « mon propre dossier ». Il faut donc une **policy supplémentaire** autorisant la
    lecture des photos de mes co-équipiers, sur le même prédicat de fenêtre que la
    fonction ci-dessus, extrait dans une fonction `definer` réutilisée par les deux.
    L'app génère ensuite une URL signée par photo. Le commentaire de la migration
    `20260908205829_profile_photos` renvoyait explicitement cette décision à cette story.
16. L'écran suit les états déjà en place sur l'accueil : chargement, échec (« Une erreur,
    réessaie plus tard. »), prêt. Rien de nouveau à inventer.

## Hors périmètre

- **La liste des groupes passés.** Elle arrive avec le chat qui survit à la soirée,
  story 5.3. Ici, un groupe hors fenêtre disparaît, point.
- **Confirmer sa présence** avant vendredi 12h — story 4.2.
- **Se désister**, et ce que la liste des membres devient alors — story 4.3.
- **Le chat de groupe** et son bouton — stories 5.1 à 5.3.
- **Les rappels push du vendredi** — story 6.1.
- **Signaler ou bloquer un membre** depuis la liste.
- **Un itinéraire calculé, une carte intégrée, des coordonnées GPS** sur les lieux.
- **Rendre l'heure configurable** par ville, par lieu ou par groupe.
- **Rafraîchir l'écran tout seul** quand le groupe se forme pendant que l'app est
  ouverte : le cas demande d'être devant l'écran à 19h pile, et une relance de l'app
  le règle.

## Risques / questions ouvertes

- **L'accès aux photos est le vrai point de conception.** Une policy storage qui
  interroge `group_members` s'exécute à chaque objet lu ; le prédicat doit être extrait
  en fonction `definer` et rester court, sans quoi c'est une jointure par photo. Si le
  mécanisme retenu s'écarte des policies (URL signées générées côté serveur, bucket
  public, copie des photos ailleurs), c'est une décision structurelle et elle mérite son
  propre record dans `docs/adr/`.
- **Le fuseau.** Toutes les bornes sont en `Europe/Paris`, comme `group_formation_at`.
  Un téléphone réglé sur un autre fuseau ne doit pas décaler la fenêtre : elle est
  calculée en base, jamais côté app.
- **L'ouverture de l'app de cartes n'est pas testable en simulateur** de façon fiable —
  Plans y est présent, Google Maps non. La vérification Android attend le premier build
  EAS ([[docs/adr/2026-09-06-testing-on-ios-simulator]]).
- **Aucune donnée de test n'existe** : vérifier cet écran demande un groupe formé, donc
  trois profils dispos dans la même ville et un passage du job. Un script de seed sera
  probablement nécessaire avant de pouvoir regarder quoi que ce soit.
