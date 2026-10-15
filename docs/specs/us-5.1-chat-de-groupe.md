# PRD — Chat de groupe en temps réel

_2026-10-01 · Story 5.1_

## Résumé

L'écran du groupe gagne un bouton **« Discuter »**, toujours visible, qui ouvre une
**page dédiée** : la conversation du groupe, du plus ancien message au plus récent, et un
champ de saisie. Un message envoyé par quelqu'un d'autre apparaît **sans action de ma
part, en moins de 2 secondes** (Supabase Realtime). Un message que j'envoie et qui ne
passe pas reste affiché, marqué **non envoyé**, et se réessaie d'un tap.

## Problème

L'app place cinq inconnus dans un bar bondé un vendredi à 20 h, sans réservation, sans
hôte et sans signe de reconnaissance. `docs/SPEC.md` l'écrit noir sur blanc : le groupe se
retrouve **via le chat**, « il n'existe aucun autre mécanisme, ce qui fait du chat une
brique critique du MVP et non un accessoire ». Aujourd'hui l'écran du groupe (story 4.1)
dit où et avec qui — et s'arrête là. Le soir même, personne ne peut écrire « je suis au
fond à gauche ». Sans cette story, le MVP place les gens au même endroit en espérant
qu'ils se reconnaissent.

## Objectif

Qu'un membre de groupe puisse écrire au groupe et lire le groupe, en direct, le vendredi
soir.

**Succès :** vendredi soir, quelqu'un écrit où il est assis et les autres le lisent dans
la seconde, sans rafraîchir l'écran.

## Utilisateur et scénario

En tant que membre d'un groupe, je veux échanger en direct avec les autres, afin de
réussir à les retrouver dans un bar bondé — c'est le seul mécanisme dont on dispose.

## Exigences fonctionnelles

### L'entrée dans le chat

1. Le chat est une **page séparée**, pas une section de l'écran du groupe. L'écran du
   groupe garde son rôle — où, quand, avec qui — et la conversation a besoin de toute la
   hauteur de l'écran plus le clavier.
2. L'écran du groupe affiche un bouton **« Discuter »**, visible **sans aucune
   condition** dès que l'écran s'affiche : pas de deadline, pas de présence à confirmer,
   pas de nombre de messages minimum. Si l'écran du groupe est là, le chat est
   accessible.
3. La page prend l'identifiant du groupe **en paramètre de route**
   (`/chat/[groupId]`), pas « mon groupe courant ». La story 5.3 veut rouvrir le chat
   d'un groupe passé depuis une liste : elle réutilisera cette page telle quelle, et
   côté base la règle d'accès est de toute façon « je suis membre de **ce** groupe », pas
   « c'est mon groupe de cette semaine ».
4. `get_my_group()` ne renvoie pas encore l'identifiant du groupe — elle devra le
   renvoyer, sinon l'écran du groupe n'a rien à passer au bouton. C'est le seul
   changement à la fonction de la story 4.1.

### La conversation

5. À l'ouverture, la page charge **tous les messages du groupe**, du plus ancien au plus
   récent, en une requête. Pas de pagination : cinq ou six personnes sur une soirée font
   quelques dizaines de messages, et une liste complète évite d'écrire — puis de
   déboguer — une fenêtre glissante qui ne servira à rien avant longtemps.
6. Chaque message affiche la **photo**, le **prénom** et l'**horodatage** de son auteur.
   Pas son âge : l'âge sert à se faire une idée de qui on va rencontrer, sur l'écran du
   groupe, pas à relire une conversation.
7. L'auteur est **résolu depuis les membres déjà chargés** par `get_my_group()` : la
   table des messages ne stocke qu'un `author_id`. Dénormaliser le prénom et la photo
   dans chaque message les figerait ; ouvrir `profiles` plus largement rendrait la ligne
   entière lisible, jeton push compris — exactement ce que la story 4.1 a refusé
   (exigence 13). Un auteur introuvable dans la liste est un cas à afficher sans planter.
8. Les messages sont du **texte seul**. Ni image, ni lieu partagé, ni pièce jointe.
9. L'ordre d'affichage est celui de l'**horodatage serveur**. Le téléphone ne décide
   jamais de la date d'un message : une horloge mal réglée déplacerait le message dans la
   liste de tout le monde.

### Le temps réel

10. Un message posté par un autre membre apparaît **en moins de 2 secondes, sans action
    de ma part**, par un abonnement **Supabase Realtime** aux insertions de la table des
    messages, filtré sur ce groupe. Le temps réel du chat est déjà tranché par
    [[docs/adr/2026-08-31-backend-supabase]] (`accepted`) : rien de structural à décider
    ici.
11. L'abonnement est **ouvert à l'ouverture de la page et fermé à sa fermeture**. Pas de
    canal qui survit à l'écran : un abonnement orphelin consomme une connexion et
    délivre des messages à un écran que personne ne regarde.
12. Un message que **j'envoie** s'affiche immédiatement, sans attendre l'aller-retour
    serveur. L'écho Realtime de ma propre insertion ne doit pas le dupliquer : la liste
    est **indexée par l'identifiant du message**, et l'insertion renvoie cet identifiant.

### L'envoi et son échec

13. L'envoi insère une ligne avec mon `author_id` et le groupe de la page. Le champ de
    saisie se vide **dès l'envoi**, pas à la confirmation : attendre le serveur pour
    rendre le champ fait buter l'utilisateur sur un mauvais réseau.
14. Un envoi qui échoue laisse le message **affiché et marqué « non envoyé »**, avec un
    **réessai en un tap**. C'est le seul écart au périmètre minimal, et il est délibéré :
    le réseau d'un bar bondé un vendredi soir est mauvais, et un message qui disparaît en
    silence casse précisément l'usage que cette story existe pour servir — l'utilisateur
    croit avoir dit où il est assis.
15. Un message vide ou fait d'espaces n'est **jamais envoyé** : le bouton reste inactif,
    et la base refuse aussi la ligne. Le texte a une **longueur maximale** côté base, pour
    qu'un client ne puisse pas écrire un roman dans la table.
16. La page suit les trois états déjà en place partout dans l'app : chargement, échec
    (« Une erreur, réessaie plus tard. »), prêt.

### La règle d'accès

17. La table des messages porte de **vraies policies RLS** — lire et écrire, pour
    `authenticated` — contrairement à `groups`, `group_members` et `venues`, qui gardent
    leur RLS sans aucune policy. Ce n'est pas une entorse à la story 4.1, c'est une
    nécessité : **Realtime autorise un abonnement en évaluant la policy `select` de la
    table**. Sans policy, personne ne lit, donc personne ne s'abonne, donc pas de temps
    réel. La porte unique en `security definer` reste le bon motif pour une lecture
    ponctuelle ; elle ne sait pas s'abonner.
18. La policy de lecture est « **je suis membre de ce groupe** », et celle d'écriture « je
    suis membre de ce groupe **et** l'auteur, c'est moi ». Un client ne peut donc pas
    poster sous le prénom d'un autre.
19. Ces deux policies ne peuvent pas interroger `group_members` elles-mêmes : elles
    s'exécutent avec les droits de l'appelant, et cette table n'a aucune policy de
    lecture — la jointure ne verrait rien. Il faut donc une **fonction `security
    definer`** qui répond « cet utilisateur est-il membre de ce groupe ? », réutilisée par
    les deux policies. `get_my_group()` ne peut pas jouer ce rôle : elle est bornée au
    samedi 6 h et ne connaît qu'un seul groupe.
20. Cette règle d'accès **n'a pas de fenêtre temporelle**, à la différence de celle de la
    story 4.1. `docs/SPEC.md` est explicite : « le chat de groupe ne se ferme pas ». Un
    membre lit et écrit dans le chat de son groupe indéfiniment. Ce qui disparaît le
    samedi 6 h, c'est l'écran du groupe — donc le seul chemin vers le chat jusqu'à la
    story 5.3.
21. La table doit être **ajoutée à la publication Realtime** pour que ses insertions
    soient diffusées. C'est une ligne de migration, pas un réglage dans la console : le
    projet se reconstruit depuis `supabase/migrations/`.

## Hors périmètre

- **Les notifications push d'un nouveau message** — story 5.2. Ici, le chat ne prévient
  que l'écran ouvert.
- **La survie du chat après la soirée et la liste des groupes passés** — story 5.3. La
  règle d'accès posée ici (exigence 20) la rend possible sans migration ; il manquera la
  liste, et une porte sur les prénoms et photos hors fenêtre.
- **La pagination, le défilement infini, l'archivage** d'un chat devenu long.
- **Modifier ou supprimer** un message, pour soi ou pour tous.
- **Les images, la position partagée, les pièces jointes, les réactions.**
- **Les indicateurs de frappe, les accusés de lecture, le compteur de non-lus.**
- **Les messages automatiques** (« je ne viens plus ») : la story 4.3 est annulée.
- **Signaler un message ou un membre depuis le chat** — story 7.1.
- **Un rafraîchissement de la liste après une perte de connexion** : voir les risques.

## Risques / questions ouvertes

- **L'AC 1 de la story ne tient plus.** `docs/ideas/dispo-user-stories.md` dit « quand
  j'ouvre l'écran du groupe, le chat est déjà ouvert et accessible ». Le choix d'une page
  séparée (exigence 1) la contredit : ce qui est garanti, c'est un **accès inconditionnel**
  depuis l'écran du groupe (exigence 2), pas un chat déjà à l'écran. La story est à
  corriger dans ce sens.
- **Le trou de la reconnexion est le vrai manque connu.** Si le socket Realtime tombe —
  app en arrière-plan, réseau coupé, tunnel du métro — les messages postés pendant la
  coupure ne sont jamais reçus, et rien ne va les chercher : la liste est chargée une
  fois, à l'ouverture. Un rechargement au retour au premier plan règle le cas en quelques
  lignes, mais c'est une exigence de plus, donc hors du périmètre minimal retenu. **À
  trancher avant de dire la story finie** : c'est le scénario du vendredi soir, pas un cas
  limite.
- **Le jeton de l'abonnement.** Realtime n'applique la RLS que si le canal porte le jeton
  de l'utilisateur. `supabase-js` v2 le pose depuis la session et le rafraîchit sur les
  événements d'auth, et `mobile/src/lib/supabase.ts` gère déjà le cycle `AppState`. À
  **vérifier sur le terrain** plutôt qu'à supposer : si le jeton manque, l'abonnement ne
  livre rien et l'écran reste silencieux sans erreur visible.
- **Le coût de la policy de lecture.** Elle s'évalue par ligne lue, et Realtime l'évalue
  par message et par abonné. La fonction `definer` de l'exigence 19 doit rester une
  lecture d'index sur la clé primaire de `group_members`, sans jointure.
- **Les photos des auteurs dépendent d'une fenêtre qui se ferme.** La policy storage
  `profile_photos_select_group` autorise la lecture d'une photo de co-équipier **tant que
  `get_my_group()` renvoie son groupe** — donc jusqu'au samedi 6 h. Après, l'accès aux
  messages reste ouvert mais les photos ne se signent plus. Invisible dans cette story
  (le chemin passe par l'écran du groupe), bloquant pour la 5.3.
- **Rien n'est testable sans données.** Vérifier un chat demande **deux sessions dans le
  même groupe** : deux comptes, deux profils dispos dans la même ville, un passage du job
  du jeudi, et deux appareils ou un appareil plus un client SQL. Le script de seed
  annoncé par la story 4.1 devient ici une condition de vérification, plus un confort.
