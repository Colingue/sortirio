# PRD — Page de confirmation après « Je suis dispo »

_2026-09-26 · Story 2.4_

## Résumé

Après le tap sur « Je suis dispo », l'app ouvre une page de confirmation dédiée, fermée
par un bouton « J'ai compris ». L'écran d'accueil, lui, perd le message « C'est noté » :
il devient un état d'attente centré sur le compte à rebours, strictement identique au
retour de la page de confirmation et à chaque ouverture de l'app.

## Problème

Aujourd'hui, « C'est noté ✅, on te prévient jeudi 19 h » reste affiché en permanence tant
que la dispo est posée (`AvailabilityNotedSummary`, stories 2.1 et 2.3). Un accusé de
réception s'adresse au geste qui vient d'être fait ; répété six jours, il ne veut plus
rien dire. Jeudi 18 h, l'utilisateur qui rouvre l'app lit encore « C'est noté » alors que
son groupe se forme dans une heure.

## Objectif

Séparer les deux moments : la **confirmation du geste** (une fois, juste après le tap) et
l'**état d'attente** (permanent, jusqu'à jeudi 19 h).

**Succès :** après le tap, l'utilisateur voit une page qui dit ce qui vient d'être
enregistré et ce qui va se passer ; à toute réouverture de l'app, l'accueil montre
exactement le même écran d'attente, sans message de confirmation.

## Utilisateur et scénario

En tant qu'utilisateur qui vient de se déclarer dispo, je veux une confirmation claire de
mon geste, puis à chaque retour dans l'app voir le temps restant avant la formation des
groupes, afin de savoir où j'en suis sans relire le même message pendant six jours.

## Exigences fonctionnelles

1. Le tap sur « Je suis dispo » enregistre la dispo, puis ouvre une **page de
   confirmation** dédiée.
2. Cette page dit, en substance : « Bravo, tu es inscrit pour vendredi prochain ! On forme
   les groupes jeudi 19 h, et on t'envoie une notification dès que ton groupe est prêt. »
   Tutoiement, comme le reste de l'app.
3. Un bouton **« J'ai compris »** ramène à l'écran d'accueil. C'est la sortie prévue de la
   page ; il n'y a rien d'autre à y faire.
4. La page ne se ferme **pas** toute seule : aucune temporisation.
5. Elle s'affiche **à chaque déclaration de dispo** — un utilisateur qui annule (story
   2.2) puis se redéclare la revoit.
6. Elle ne s'affiche **jamais** à l'ouverture de l'app, y compris si l'app a été fermée
   pendant qu'elle était affichée.
7. L'écran d'accueil « dispo posée » n'affiche plus « C'est noté ». Il affiche :
   - la phrase « On forme les groupes dans : » suivie du compte à rebours en
     jours / heures / minutes,
   - le nombre de personnes inscrites à Lyon pour ce vendredi,
   - le lien « Annuler ma dispo », tant que la story 2.2 l'autorise.
8. Cet écran est **identique** dans les deux chemins : retour depuis la page de
   confirmation, et ouverture de l'app avec une dispo déjà posée.

## Hors périmètre

- **La notification** du jeudi 19 h elle-même (story 3.3) — la page de confirmation la
  promet, elle ne l'implémente pas.
- **Ce qu'affiche l'accueil après jeudi 19 h** : groupe formé, ou « pas assez de monde
  cette semaine ». Story séparée.
- **L'écran d'accueil avant déclaration** (bouton « Je suis dispo »), inchangé.
- **Les règles d'annulation** (story 2.2), inchangées.
- **Le calcul** du compte à rebours et du nombre d'inscrits (story 2.3), réutilisé tel
  quel — seule sa présentation change.
- Animation ou illustration de célébration sur la page de confirmation.

## Risques / questions ouvertes

- **Page vs modale** : c'est une page (route expo-router), pas une modale. Reste à
  décider si elle s'empile sur l'accueil ou le remplace — dans les deux cas, on ne doit
  pas pouvoir y revenir une fois « J'ai compris » tapé. -> Colin ; je veux qu'elle s'empile à l'accueil
- **Retour système** (geste iOS, bouton retour Android) : doit se comporter comme
  « J'ai compris », jamais laisser l'utilisateur coincé ni le ramener sur la page
- **Échec d'enregistrement** : la page ne s'ouvre que si la dispo est bien posée. Sinon,
  on reste sur l'accueil avec l'erreur.
- Le composant s'appelle aujourd'hui `AvailabilityNotedSummary` : le nom ne décrit plus
  ce qu'il affiche une fois « C'est noté » retiré. -> oui fais les adaptations au niveau des noms des composantes et fichiers
