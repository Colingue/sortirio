# PRD — Répartir les groupes par âge

_2026-10-18 · Story 3.4_

## Résumé

Le job du jeudi 19 h **trie les dispos par date de naissance**, puis découpe la liste
triée en groupes consécutifs de 3 à 6 qui **minimisent l'écart d'âge**. Il ne crée un
groupe de plus que s'il fait gagner **au moins X ans d'écart** (seuil réglable, 5 ans au
départ) : des groupes de 6 quand les âges sont continus, des groupes plus petits quand il
y a un vrai trou d'âge. Un retardataire rejoint le groupe avec de la place **dont l'âge
moyen est le plus proche du sien**. Personne n'est jamais exclu à cause de son âge.

## Problème

Depuis la 3.1, la composition est purement aléatoire : à 12 dispos de 20 à 45 ans, un
23 ans peut tomber avec trois 40 ans. Le MVP parie sur « l'âge seul suffit à composer un
groupe qui accroche », mais l'âge n'est utilisé nulle part.

Minimiser l'écart sans contrepoids donnerait toujours des groupes de 3 (le minimum
mécanique). Or un groupe de 3 avec un absent devient un tête-à-tête entre inconnus, et le
pari le plus risqué du MVP est « les gens viennent vraiment ». Le seuil X arbitre entre
les deux.

## Objectif

Pas de groupe qui mélange des âges éloignés, sans morceler les groupes quand les âges
sont proches, et sans perdre une seule place.

**Succès :**

- 12 dispos de 22 à 28 ans, âges continus → **6 + 6**.
- 8 dispos de 22 à 26 ans et 4 de 40 à 45 ans → **3 groupes**, dont un avec les 4
  de 40 à 45 ans seuls, là où l'ancienne règle aurait fait 6 + 6 avec deux 25 ans parmi
  les 40 ans.

## Utilisateur et scénario

En tant qu'utilisateur, je veux sortir avec des gens d'un âge proche du mien, afin que
la conversation accroche, sans pour autant rester sans groupe à cause de mon âge.

## Exigences fonctionnelles

### Formation du jeudi 19 h (3.1)

1. Les dispos d'une ville sont **triées par date de naissance** au lieu de
   `order by random()`.
2. La liste triée est découpée en **groupes consécutifs de 3 à 6**. Le découpage retenu
   est celui qui minimise :

   **somme des écarts d'âge des groupes + X × nombre de groupes**

   où l'écart d'un groupe = date de naissance du plus jeune − celle du plus âgé, en
   années, et **X = 5 ans** au départ.
   - Lecture : on ne crée un groupe de plus que s'il fait gagner plus de X ans d'écart
     cumulé.
   - À coût égal, le découpage avec **le moins de groupes**.
3. X est **une seule constante**, ajustée après les premiers vendredis selon le taux
   d'absence (8.1). X très grand ≈ l'ancienne règle (le plus de groupes de 6) ; X = 0 ≈
   que des groupes de 3.
4. **Tout le monde est placé** : toute ville de 3 dispos ou plus a un découpage valide
   (3 = 3, 7 = 3 + 4, …). Pas d'écart maximum, aucune exclusion pour l'âge.
5. **Avec 3 à 5 dispos**, un seul groupe, quel que soit l'écart. **Avec 6**, un découpage
   3 + 3 est possible si les âges forment deux blocs nettement séparés (ex. trois 22 ans
   et trois 45 ans).
6. `compute_group_sizes` n'est plus utilisée par le job du jeudi (c'était son seul
   appelant).

### Retardataire (10.2)

7. Parmi les groupes compatibles (ville, ce vendredi, **moins de 6 membres**, aucun
   signalement croisé), le retardataire rejoint celui dont **l'âge moyen des membres**
   est le plus proche de son âge.
8. À égalité d'écart, le **moins rempli**, puis le plus ancien (règle actuelle).
9. Jamais plus de 6 membres : un groupe plein n'est pas candidat, même s'il est le plus
   proche en âge.

### Groupe de retardataires (10.3)

10. Inchangé : il se forme dès 3 retardataires compatibles, **sans regarder l'âge**.

## Hors périmètre

- Un écart d'âge maximum, des tranches d'âge fixes (25-30, 30-35…).
- Une préférence d'âge dans le profil.
- Une autre mesure que l'écart plus jeune / plus âgé (variance, médiane…).
- Rééquilibrer les groupes après les arrivées tardives.
- L'âge dans le groupe de retardataires (10.3) et dans l'alerte de la 10.4.
- Éviter les re-matchs d'une semaine à l'autre.

## Risques / questions ouvertes

- **Le tri rend la composition prévisible.** Deux personnes d'âge voisin qui se
  repostent chaque semaine se retrouveront presque toujours ensemble. Au volume du
  pilote, c'est probablement acceptable ; à surveiller.
- **Le job du jeudi n'exclut pas les paires signalées** (`form_friday_groups` n'appelle
  pas `has_report_between`), contrairement à la 7.1. Avec le tri, une paire signalée
  d'âge voisin sera regroupée quasi à coup sûr la semaine suivante, là où l'aléatoire
  laissait une chance. Hors de cette story, mais rendu plus visible par elle.
- **Plus de groupes de 3 quand il y a des trous d'âge** : plus fragiles face à un
  absent. C'est le prix assumé ; X se remonte si le taux d'absence est mauvais.
- **Plus de groupes = plus de lieux** (3.2) : ils seront réutilisés plus tôt.
- **Plus de groupes pas pleins** : plus de places pour les retardataires (10.2, 10.4).
- **La valeur de X n'est pas validée** : 5 ans est une intuition, pas une mesure.
- **Les stories 3.1, 10.2, 10.3, 10.4** parlent d'« âge compatible » comme d'une règle
  qui exclut. Elle n'existe pas : l'âge **répartit**, il n'exclut jamais.
