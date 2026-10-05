# PRD — Signaler un membre de mon groupe

_2026-10-04 · Story 7.1_

## Résumé

Sur la page du groupe, chaque membre de la liste a un bouton « Signaler ». Après
confirmation, le signalement est enregistré immédiatement, sans modération : les deux
personnes ne seront **plus jamais dans le même groupe**. Dès que **deux personnes
différentes** ont signalé le même compte, ce compte est **banni** automatiquement. Il
est désactivé, retiré sur-le-champ de son groupe en cours, et son email ne peut plus
servir à se réinscrire.

## Problème

L'app fait se rencontrer des inconnus chaque vendredi. Si quelqu'un met mal à l'aise,
rien ne permet aujourd'hui de l'éviter : la formation des groupes est aléatoire et peut
remettre les deux personnes ensemble la semaine suivante. Rien non plus n'écarte un
comportement que plusieurs personnes ont déjà signalé.

## Objectif

Qu'un utilisateur mis mal à l'aise puisse se protéger seul, en un geste, sans attendre
personne, et qu'un comportement signalé deux fois sorte de l'app sans intervention
humaine.

**Succès :** deux personnes liées par un signalement ne sont jamais dans le même groupe.
Un compte signalé par deux personnes différentes est banni sans que Colin intervienne.

## Utilisateur et scénario

En tant qu'utilisateur mis mal à l'aise par quelqu'un, je veux le signaler, afin de ne
plus jamais me retrouver dans le même groupe que lui.

## Exigences fonctionnelles

### Signaler

1. Sur la page du groupe (story 4.1, et les groupes passés de la story 5.3), chaque
   membre **autre que moi** a un bouton **« Signaler »**. Il n'existe pas de fiche
   membre : le bouton vit sur la ligne du membre dans la liste.
2. Le bouton ouvre une **confirmation** qui explique la conséquence : « Vous ne serez
   plus jamais dans le même groupe. » Annuler ne fait rien.
3. Une fois confirmé, le signalement est **enregistré immédiatement**, sans validation
   manuelle. **Aucun motif n'est demandé.**
4. On ne peut signaler qu'une personne avec qui on **partage ou a partagé un groupe**.
   Le serveur le vérifie : l'app ne fait pas foi.
5. Signaler deux fois la même personne ne crée pas de second signalement et ne compte
   qu'une fois. Se signaler soi-même est impossible.
6. Un signalement est **définitif** : il ne peut pas être annulé depuis l'app.

### Ce que voit la personne qui signale

7. Après confirmation, l'app affiche explicitement que **le groupe de cette semaine ne
   change pas** et que le signalement s'applique aux groupes suivants. Seule exception :
   le bannissement (point 13).
8. Le membre signalé **reste affiché** dans la liste du groupe en cours. Son bouton
   indique qu'il a déjà été signalé et ne peut plus être pressé.

### Ce que voit la personne signalée

9. **Rien** tant qu'elle n'est pas bannie : ni notification, ni changement d'écran, ni
   indice dans la liste ou le chat.

### Ne plus jamais être ensemble

10. Un signalement lie les deux personnes **dans les deux sens** : A a signalé B, donc
    ni A ni B ne seront mis avec l'autre.
11. La formation des groupes (story 3.1) **respecte cette règle avant toute autre** :
    avant la taille des groupes et avant le fait de caser tout le monde. Le job
    remélange au hasard jusqu'à trouver une répartition valide. S'il n'en trouve pas,
    la ou les personnes qu'il ne peut pas placer **restent sans groupe cette semaine**
    et voient l'état habituel « pas assez de monde ».
12. Deux personnes liées par un signalement ne se retrouvent **jamais** dans le même
    groupe, même pour compléter un groupe trop petit.

### Le bannissement

13. Dès qu'un compte a été signalé par **deux personnes différentes**, quel que soit le
    temps écoulé entre les deux signalements, il est **banni immédiatement**, dans la
    même transaction que le second signalement.
14. Un compte banni :
    - est **retiré tout de suite** de son groupe en cours et de son chat. Les autres
      membres ne reçoivent aucune explication : il disparaît de la liste ;
    - n'est plus jamais placé dans un groupe, et sa dispo éventuelle est ignorée ;
    - ne reçoit plus aucune notification push ;
    - voit, à l'ouverture de l'app, un écran sobre **« Ton compte a été suspendu. »**,
      sans dire qui l'a signalé ni combien de fois.
15. Le groupe privé de ce membre **garde les membres restants**, même s'il tombe à
    deux. Il ne se dissout pas : le lieu, l'heure et le chat ne bougent pas.
16. L'**email** du compte banni est bloqué : une nouvelle inscription avec cet email,
    via Apple ou via Google, est refusée.
17. Le bannissement **conserve les données** (profil, signalements) pour qu'une erreur
    puisse être corrigée à la main dans Supabase. Aucun écran d'administration.

### Les données

18. Les signalements et les bannissements sont des tables **sans aucune policy de
    lecture** pour les utilisateurs. On les écrit uniquement par une fonction Postgres
    `security definer`, comme `get_my_group()` ou `get_group_members()`, qui applique
    les points 4, 5 et 13.
19. Un utilisateur ne peut jamais savoir, par aucune requête, qui l'a signalé ni s'il a
    été signalé.

## Hors périmètre

- **Un écran d'administration** ou une file de modération.
- **Un motif** de signalement, un champ texte ou des catégories.
- **Annuler** un signalement depuis l'app.
- **Prévenir les autres membres** du groupe qu'un membre a été retiré, ou pourquoi.
- **Faire appel** d'un bannissement : une erreur se corrige à la main dans Supabase.
- **Un bouton « Bloquer »** distinct du signalement.
- **Supprimer les messages** du compte banni dans les chats existants.
- **Signaler depuis le chat** : seule la liste des membres porte le bouton.

## Risques / questions ouvertes

- **`docs/SPEC.md` ne prévoit pas le bannissement.** Sa section _Sécurité_ ne parle que
  de « plus jamais dans le même groupe ». Le bannissement après deux signalements est
  une règle nouvelle. Le fichier n'est pas modifié tant que Colin ne l'a pas demandé.
- **Bloquer l'email à l'inscription** demande d'agir au moment où Supabase Auth crée
  l'utilisateur (hook d'auth ou trigger sur `auth.users`). C'est probablement une
  décision structurelle qui mérite son propre record dans `docs/adr/`.
- **« Masquer mon email » d'Apple** donne une adresse relais stable pour un même
  identifiant Apple. Le blocage tient donc pour le même compte Apple, mais un nouvel
  identifiant Apple ou Google le contourne. Limite acceptée pour le pilote.
- **Bloquer un compte banni côté serveur, pas seulement côté app.** L'écran
  « suspendu » ne suffit pas : les fonctions `definer` existantes (`get_my_group()`,
  `get_group_members()`, `get_my_groups()`, chat, dispo) doivent refuser un compte
  banni, sinon un client modifié continue de lire.
- **Un groupe de deux** contredit l'esprit du record `minimum-group-size-three`. Celui-ci
  est `proposed` et ne vise que la formation des groupes. Ici, le cas est volontairement
  toléré après coup.
- **Au volume du pilote (12 à 30 testeurs)**, quelques signalements croisés suffisent à
  rendre une répartition impossible. Le job doit borner ses tentatives de remélange
  plutôt que boucler sans fin.
- **Abus :** deux utilisateurs qui s'entendent peuvent faire bannir n'importe qui avec
  qui ils ont partagé un groupe. C'est le prix de « aucune modération ». Limite connue.
