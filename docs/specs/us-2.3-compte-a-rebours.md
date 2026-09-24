# PRD — Compte à rebours

_2026-09-22 · Story 2.3_

## Résumé

Une fois sa dispo postée, l'utilisateur attend jeudi 19h sans aucun signal de
progression. Ajouter au composant `AvailabilityNoted` (écran d'accueil une fois la
dispo posée) un compte à rebours jusqu'à jeudi 19h et le nombre de personnes inscrites à
Lyon pour ce vendredi.

## Problème

Entre le moment où il pose sa dispo et jeudi 19h, l'utilisateur n'a que le message « C'est
noté, on te prévient jeudi 19h » (story 2.1) — six jours creux sans rien qui bouge. Il
risque d'oublier l'app pendant l'attente.

## Objectif

Donner un signal de progression (le compte à rebours) et une preuve sociale (le nombre
d'inscrits) pour que l'utilisateur reste engagé pendant l'attente.

**Succès :** le countdown décrémente tout seul sans quitter/rouvrir l'écran ; le nombre
affiché reflète la réalité au retour sur l'accueil.

## Utilisateur et scénario

En tant qu'utilisateur qui a posé sa dispo et attend les 6 jours creux avant la
formation des groupes, je veux voir combien de temps il reste et combien de personnes
sont déjà inscrites, afin de ne pas oublier l'app et de me sentir dans une dynamique
collective.

## Exigences fonctionnelles

1. Une fois ma dispo postée, l'écran d'accueil affiche un compte à rebours jusqu'à jeudi
   19h, en jours/heures/minutes.
2. Le compte à rebours décrémente tout seul tant que l'écran reste ouvert, sans que je
   quitte ni rouvre l'app.
3. L'écran affiche aussi le nombre de personnes inscrites à Lyon pour ce vendredi.
4. Ce nombre reflète la réalité à chaque retour sur l'écran d'accueil.
5. Le compteur est scopé par ville — Lyon seule aujourd'hui.

## Hors périmètre

- Mise à jour temps réel (push/realtime) du nombre d'inscrits pendant que l'écran reste
  ouvert.
- Notification si le nombre change.
- Comportement spécial au moment exact où le countdown atteint zéro.

## Risques / questions ouvertes

- La RLS actuelle sur `availabilities` limite un utilisateur à ses propres lignes → il
  faudra une fonction backend qui agrège le nombre d'inscrits par ville, plutôt qu'une
  lecture directe côté client.
