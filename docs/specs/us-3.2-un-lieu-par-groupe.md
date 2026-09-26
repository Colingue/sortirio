# PRD — Un lieu distinct par groupe

_2026-09-26 · Story 3.2_

## Résumé

Le jeudi à 19h, dans la même exécution que la formation des groupes, le job attribue à
chaque groupe un lieu — nom et adresse — pioché dans une liste de lieux de la ville du
groupe, gérée à la main en SQL. Deux groupes du même soir ne partagent un lieu que s'il
y a moins de lieux que de groupes.

## Problème

Les groupes se forment déjà (story 3.1) mais ne mènent nulle part : un groupe sans lieu
ne sert à rien, personne ne sait où aller. Et rien ne doit obliger un membre à
organiser, proposer ou voter pour un bar — c'est exactement l'effort que l'app supprime.

## Objectif

Qu'un groupe formé sache où aller, sans intervention humaine le soir même.

**Succès :** à l'issue du job, chaque groupe a exactement un lieu de sa ville, et au sein
d'une même ville et d'un même vendredi, le nombre de groupes par lieu ne varie jamais de
plus de 1.

## Utilisateur et scénario

En tant que membre d'un groupe, je veux qu'un lieu précis me soit attribué, afin de
savoir où aller sans que personne n'ait à organiser quoi que ce soit.

## Exigences fonctionnelles

1. Une table de lieux existe, avec au minimum une ville, un nom et une adresse. Elle est
   **remplie à la main en SQL** : pas d'intégration, pas de réservation automatique
   ([[docs/SPEC]], mécanisme principal, point 5).
2. Chaque groupe créé reçoit **exactement un lieu**, dans la même exécution du job que
   sa création. Un groupe sans lieu n'existe à aucun moment, pas même transitoirement.
3. Le lieu est tiré parmi les lieux **de la ville du groupe**. Un groupe lyonnais ne
   reçoit jamais un lieu d'une autre ville
   ([[docs/adr/2026-08-31-matching-by-city]]).
4. Deux groupes du même vendredi et de la même ville ne partagent un lieu **que si** la
   ville compte moins de lieux que de groupes formés.
5. Dans ce cas, les lieux sont réutilisés en **étalant au maximum** : la liste est
   mélangée, puis distribuée en tourniquet. 7 groupes pour 5 lieux → 2, 2, 1, 1, 1.
   **Aucun groupe n'est sacrifié** : tous les groupes formés par la story 3.1 existent.
6. Si une ville n'a **aucun** lieu, aucun groupe n'y est créé — un groupe sans lieu est
   impossible par construction. C'est une erreur de configuration, pas un cas
   fonctionnel : la liste doit être remplie avant le jeudi.
7. Le tirage est aléatoire à chaque vendredi. Rien n'empêche un lieu de resservir la
   semaine suivante.
8. L'idempotence est celle de la story 3.1 : une ville qui a déjà ses groupes est
   ignorée, donc un lieu attribué ne change jamais après coup.

## Hors périmètre

- **L'affichage du lieu côté mobile** — écran du groupe avec lieu, adresse, heure et
  membres. Story 4.1.
- **La notification** annonçant le groupe et son lieu. Story 3.3.
- **L'heure du rendez-vous** : 20h est fixe pour le MVP et n'est pas stockée ici.
- **La vraie liste de lieux de prod.** Colin l'insère à la main ; cette story ne livre
  que la table et un jeu de lieux lyonnais plausibles dans `seed.sql`, pour les tests
  locaux.
- **Réservation, partenariat, prévenir le bar** — aucun lieu n'est au courant.
- **Éviter qu'un lieu resserve** d'un vendredi sur l'autre.
- Toute finesse sur le lieu : horaires d'ouverture, capacité, catégorie, distance aux
  membres, désactivation temporaire.

## Risques / questions ouvertes

- La règle « deux groupes du même soir, deux lieux différents » **ne peut pas** être une
  contrainte d'unicité en base, puisque le partage devient légitime dès que la liste est
  courte. Elle reste portée par le code du job, et donc par ses tests.
- Le lien groupe → lieu étant obligatoire, un environnement local non seedé ne forme
  plus aucun groupe. Le `seed.sql` devient une dépendance des tests de la story 3.1.
- La liste de prod est vide aujourd'hui. Tant qu'elle l'est, le job ne produit rien :
  c'est un point de vigilance avant le premier vendredi, pas un cas à coder.
