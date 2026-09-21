# PRD — Annuler ma dispo

_2026-09-20 · Story 2.2 · Priorité High_

## Résumé

Un utilisateur qui a posé sa dispo pour vendredi doit pouvoir se rétracter avant que les
groupes ne se forment, sans laisser un groupe incomplet derrière lui.

## Problème

Aujourd'hui, poser sa dispo est irréversible. Un imprévu (le plus fréquent des cas)
oblige l'utilisateur à rester coché pour un vendredi qu'il ne fera pas — au mieux il
ignore l'app, au pire quatre inconnus l'attendent dans un bar.

## Objectif

Donner une sortie propre avant jeudi 19h, pour que seules des personnes réellement
disponibles entrent dans la formation des groupes.

**Succès :** aucun groupe formé avec un membre qui avait déjà annulé.

## Utilisateur et scénario

En tant qu'utilisateur dont le vendredi tombe à l'eau, je veux retirer ma disponibilité
avant la formation des groupes, afin de ne pas laisser une place vide dans un groupe.

## Exigences fonctionnelles

1. Tant qu'il est avant jeudi 19h et que j'ai une dispo posée, je peux demander à
   l'annuler.
2. L'annulation demande une confirmation explicite — ce n'est pas un tap unique comme
   pour se déclarer dispo, parce que l'effet retombe sur d'autres personnes.
3. Une fois confirmée, l'annulation est immédiate : je revois tout de suite le bouton
   pour me redéclarer dispo, sans avoir à rouvrir l'app.
4. Je peux me redéclarer puis annuler à nouveau autant de fois que je veux avant jeudi
   19h.
5. Passé jeudi 19h, l'annulation n'est plus proposée du tout — le seul recours devient
   « Je ne viens plus » (story 4.3), une fois le groupe formé.
6. Si j'avais déjà annulé, je ne reçois aucune notification ni aucune place dans un
   groupe le jeudi soir.

## Hors périmètre

- Se désister une fois le groupe formé → story 4.3.
- Expliquer ou justifier pourquoi on annule.
- Relancer ou notifier quiconque suite à une annulation.

## Risques / questions ouvertes

- Cas limite d'une annulation qui arrive au moment exact où les groupes se forment
  (jeudi 19h00) : traité comme un échec ordinaire, pas de comportement spécial prévu
  pour le pilote.
