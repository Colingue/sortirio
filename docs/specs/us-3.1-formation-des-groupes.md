# PRD — Formation des groupes

_2026-09-22 · Story 3.1_

## Résumé

Le jeudi à 19h (Europe/Paris), un job backend répartit automatiquement les utilisateurs
qui ont posé une dispo pour le vendredi en groupes de 3 à 6 personnes d'une même ville.
Composition aléatoire, aucun choix laissé à l'utilisateur.

## Problème

Les dispos (stories 2.1 et 2.2) et le compte à rebours (story 2.3) existent : l'écran
d'accueil annonce « on te prévient jeudi 19h » et décompte jusque-là. Rien ne se passe à
l'échéance — il n'y a pas de groupes.

## Objectif

Produire, à jeudi 19h, les groupes de la semaine, sans intervention humaine ni choix de
l'utilisateur.

**Succès :** à l'issue du job, chaque groupe créé compte 3 à 6 membres d'une même ville,
aucun utilisateur n'appartient à deux groupes, et relancer le job ne modifie rien.

## Utilisateur et scénario

En tant que système, je veux composer automatiquement les groupes le jeudi à 19h, afin
que l'utilisateur n'ait jamais à choisir avec qui il sort.

## Exigences fonctionnelles

1. Le job s'exécute le jeudi à 19h (Europe/Paris) sur les dispos posées pour le vendredi
   à venir.
2. Les utilisateurs sont groupés **par ville** — Lyon seule aujourd'hui
   ([[docs/adr/2026-08-31-matching-by-city]]). Deux utilisateurs de villes différentes
   ne sont jamais dans le même groupe.
3. Au sein d'une ville, la répartition forme **le plus grand nombre de groupes de 6
   possible, sous contrainte qu'aucun groupe ne compte moins de 3 membres**.
   - 12 → 6 + 6
   - 13 → 6 + 4 + 3
   - 20 → 6 + 6 + 5 + 3
   - 7 → 4 + 3
4. La composition d'un groupe est **purement aléatoire** parmi les utilisateurs dispo de
   la ville.
5. Un utilisateur n'appartient jamais à plus d'un groupe pour un vendredi donné.
6. Si une ville compte moins de 3 utilisateurs dispo, **aucun groupe n'est créé** pour
   cette ville. Un groupe de 1 ou de 2 n'existe dans aucun cas.
7. Le job est **idempotent** : relancé après avoir déjà formé les groupes d'un vendredi,
   il ne fait rien — les groupes existants ne sont ni écrasés ni complétés.

## Hors périmètre

- **Le critère d'âge.** Abandonné pour cette story ; les groupes ignorent l'âge.
- **L'écran d'accueil**, côté mobile : afficher son groupe, ou le message « pas assez de
  monde cette semaine » quand aucun groupe n'a été formé. Story séparée.
- **Éviter les re-matchs** : rien n'empêche deux personnes déjà sorties ensemble de se
  retrouver dans le même groupe.
- **L'attribution d'un lieu** au groupe.
- **Les notifications** annonçant la formation du groupe.
- Optimiser la répartition au-delà de la règle ci-dessus : toute répartition valide
  convient.

## Risques / questions ouvertes

- Le déclenchement à heure fixe reste à câbler côté Supabase (`pg_cron`), et le fuseau
  compte : 19h Europe/Paris, pas 19h UTC.
- La contrainte « un seul groupe par utilisateur et par vendredi » gagne à être portée
  par le schéma (contrainte d'unicité) plutôt que par le seul code du job.
- Au volume du pilote (12 à 30 testeurs), le cas « moins de 3 dispos » n'est pas
  théorique. Il est traité, mais volontairement sans sophistication.
