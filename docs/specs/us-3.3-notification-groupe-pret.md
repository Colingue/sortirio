# PRD — Notification « ton groupe est prêt »

_2026-09-27 · Story 3.3_

## Résumé

Le jeudi à 19h, dans la même exécution que la formation des groupes et l'attribution des
lieux, le job envoie une notification push à chaque membre d'un groupe qui vient d'être
formé. Pour que ce soit possible, l'app enregistre en base le jeton push de l'appareil
au moment où l'utilisateur accepte la permission.

## Problème

Les groupes se forment (story 3.1) et reçoivent un lieu (story 3.2), mais l'app reste
muette au seul moment où elle existe vraiment. L'écran d'attente promet « on te prévient
jeudi 19h » (story 2.1) et cette promesse n'est aujourd'hui tenue par rien : il faut
ouvrir l'app au bon moment, de sa propre initiative, pour découvrir qu'un groupe existe.

## Objectif

Que jeudi à 19h, sans rien faire, l'utilisateur placé dans un groupe soit prévenu sur
son téléphone.

**Succès :** jeudi 19h, sur un build de développement EAS, la notification arrive sur le
téléphone sans avoir été déclenchée à la main.

## Utilisateur et scénario

En tant qu'utilisateur qui a posé sa dispo, je veux être prévenu le jeudi soir que mon
groupe est formé, afin de découvrir mon lieu et mes co-équipiers au seul moment où l'app
existe vraiment.

## Exigences fonctionnelles

1. L'app obtient un **jeton push Expo** (`ExponentPushToken[...]`) et l'écrit en base,
   rattaché au profil. Il est réécrit à chaque lancement de l'app : le jeton change sans
   prévenir (réinstallation, restauration de sauvegarde), et la dernière valeur vue est
   la seule qui vaille.
2. Le jeton n'est demandé qu'après un accord de l'utilisateur : la permission est
   demandée dans la story 2.1, juste après la première dispo posée. Cette story ne
   redemande rien, elle exploite le résultat.
3. Un profil peut n'avoir **aucun jeton** — permission refusée, ou jamais demandée. Ce
   n'est pas une anomalie, c'est un état normal traité au point 6.
4. À l'issue de la formation des groupes, chaque utilisateur **placé dans un groupe**
   reçoit une notification, et lui seul. Un utilisateur dispo mais non groupé (moins de
   3 personnes dans sa ville) n'en reçoit aucune.
5. Le texte est **fixe, identique pour tout le monde** :
   - Titre : `Ton groupe est prêt !`
   - Corps : `Ouvre l'app pour découvrir le lieu de rendez-vous et les personnes du groupe`

   Ni le nom du lieu, ni les prénoms des membres n'y figurent : ouvrir l'app pour les
   découvrir fait partie du moment.
6. Un envoi qui échoue — jeton absent, jeton périmé, service Expo indisponible —
   **n'interrompt rien** : les autres envois partent, les groupes et les lieux restent
   créés. L'utilisateur non notifié voit son groupe en ouvrant l'app.
7. L'envoi se fait dans la **même exécution du job** que la formation. Il suit
   l'idempotence de la story 3.1 : une ville dont les groupes existent déjà est ignorée,
   donc personne n'est notifié deux fois pour le même vendredi.
8. Taper la notification **ouvre l'app sur l'accueil**, comme un lancement normal.

## Hors périmètre

- **Le deep link vers l'écran du groupe.** Cet écran n'existe pas encore : story 4.1.
  Elle reprendra le point 8 pour router la notification vers le groupe.
- **La demande de permission**, faite dans la story 2.1.
- **Toute trace des envois** : pas de table de logs, pas de statut d'envoi, pas de
  tableau de bord. Au volume du pilote, l'information se récupère en demandant aux
  testeurs.
- **Le réessai** d'un envoi raté, et le nettoyage des jetons périmés côté base.
- **Plusieurs appareils par compte** : un profil, un jeton, le dernier vu.
- **Toute autre notification** : rappel du vendredi, message de chat, désistement.
- **Les notifications sur Expo Go**, qui ne les supporte pas — le test se fait sur un
  build de développement EAS ([[docs/specs/us-1.1-connexion]]).

## Risques / questions ouvertes

- **Rien ne se teste sans build EAS.** C'est la deuxième story après la 1.1 à l'exiger,
  et les identifiants FCM (Android) / APNs (iOS) doivent être en place côté projet EAS
  avant de pouvoir vérifier quoi que ce soit.
- **L'envoi depuis SQL.** Le job est une fonction Postgres appelée par `pg_cron` ; joindre
  l'API Expo depuis là demande `pg_net`. L'alternative — une Edge Function appelée par le
  job — n'a pas été retenue, mais rien de tel n'existe encore dans le projet : c'est le
  point le plus incertain de la story.
- **Le volume d'un appel Expo est plafonné** (envois par lots). Au pilote le cas ne se
  pose pas, mais la limite existe et n'est pas gérée ici.
