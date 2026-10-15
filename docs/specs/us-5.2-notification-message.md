# PRD — Être notifié d'un nouveau message

_2026-10-02 · Story 5.2_

## Résumé

Chaque message posté dans le chat d'un groupe envoie une notification push aux **autres**
membres. Le titre est le **prénom de l'auteur** et le corps le **début du message**. Taper la
notification ouvre **directement le chat de ce groupe**. Si le destinataire a déjà ce chat à
l'écran, la notification arrive quand même sur le téléphone, mais l'app ne l'affiche pas :
ni bannière, ni son.

## Problème

Le chat (story 5.1) ne prévient que l'écran ouvert. Le vendredi soir, le téléphone est dans
la poche, et un « je suis au fond à gauche » posté pendant qu'on cherche le groupe dans le
bar passe inaperçu. Le seul moyen de retrouver le groupe ne sert à rien si personne ne lit
le message au moment où il compte.

## Objectif

Qu'un membre dont l'app est fermée ou en arrière-plan sache qu'on vient d'écrire au groupe,
et qu'il puisse lire le message en un tap.

**Succès :** sur un build de développement EAS, A écrit dans le chat. B, app fermée ou en
arrière-plan, reçoit la notification « A » avec le début du message. B tape dessus et
arrive dans le chat du groupe.

## Utilisateur et scénario

En tant que membre d'un groupe, je veux recevoir une notification quand quelqu'un écrit,
afin de ne pas rater un « je suis au fond à gauche » alors que je cherche le groupe dans le
bar.

## Exigences fonctionnelles

### Qui reçoit quoi

1. Chaque insertion dans `group_messages` déclenche **un envoi** vers tous les membres du
   groupe **sauf l'auteur**, à condition qu'ils aient un `expo_push_token`. Un membre sans
   jeton ne reçoit rien, et ce n'est pas une anomalie (même règle que dans la story 3.3).
2. **Une notification par message.** Pas de regroupement ni de limite en cas de rafale :
   avec des groupes de 3 à 6 personnes, le volume reste faible, et un message important ne
   doit pas disparaître dans un résumé.
3. Contenu :
   - **Titre :** le prénom de l'auteur, seul. Pas de nom de groupe ni de lieu : on n'est
     que dans un seul groupe à la fois, et le contexte est évident le soir même.
   - **Corps :** le message, coupé à **100 caractères** avec « … » s'il est plus long.
   - **Données :** l'identifiant du groupe (`groupId`), qui sert au routage (exigence 7)
     et au masquage (exigence 9).

   Exemple :

   ```
   Léa
   je suis au fond à gauche, table près de la fenêtre…
   ```

### L'envoi

4. L'envoi part d'un **trigger `after insert`** sur `group_messages`, qui appelle une
   fonction d'envoi construite comme `send_group_ready_notifications` (story 3.3) : **un
   seul `net.http_post`** vers l'API Expo avec le tableau des messages, et **aucun appel**
   s'il n'y a aucun destinataire, car Expo refuse un tableau vide.
5. La fonction d'envoi est en **`security definer`** : l'insertion vient d'un client
   `authenticated`, qui ne peut lire ni `group_members` ni les jetons dans `profiles`.
   Son `execute` est retiré à tous les rôles clients, comme dans la story 3.3.
6. **Un envoi raté ne bloque jamais le message.** Jeton périmé, Expo indisponible, ou
   aucun destinataire : le message reste enregistré et visible dans le chat. Le trigger ne
   doit pouvoir faire échouer l'insertion dans aucun cas.

### Le tap

7. Taper une notification de message ouvre l'app sur **`/chat/[groupId]`**, que l'app ait
   été fermée (démarrage à froid) ou en arrière-plan. C'est le premier routage par
   notification de l'app : la story 4.1 n'en avait pas eu besoin.
8. Une notification sans `groupId`, comme celle de la story 3.3, garde son comportement
   actuel : l'app s'ouvre sur l'accueil.

### Le chat déjà ouvert

9. Si l'utilisateur a **déjà à l'écran le chat du groupe** de la notification, l'app ne
   l'affiche pas : ni bannière, ni son, ni ligne dans la liste des notifications. Le
   message arrive déjà en direct par Realtime (story 5.1). Le serveur, lui, envoie quand
   même : il ne sait pas qui regarde quoi.
10. Dans tous les autres cas où l'app est au premier plan (accueil, écran du groupe…),
    la notification s'affiche comme aujourd'hui (`showNotificationsInForeground`).

## Hors périmètre

- **Le suivi de présence côté serveur** pour ne pas envoyer du tout quand le chat est
  ouvert. L'exigence 9 donne le même résultat pour l'utilisateur, sans cette brique.
- **Le regroupement ou la limite** des notifications en rafale.
- **Couper les notifications** d'un groupe, ou un réglage de notifications en général.
- **Le badge** et le compteur de messages non lus.
- **Le réessai** d'un envoi raté, les traces d'envoi et le nettoyage des jetons périmés.
- **Plusieurs appareils par compte** : un profil, un jeton.
- **Les notifications sur Expo Go**, qui ne les supporte pas.

## Risques / questions ouvertes

- **Le critère 3 de la story est à reformuler.** `docs/ideas/dispo-user-stories.md` dit
  « aucune notification push n'est **envoyée** ». Avec l'exigence 9, ce qui est garanti,
  c'est qu'aucune notification n'est **affichée**.
- **L'ADR `pg_net` est toujours `proposed`.**
  [[docs/adr/2026-09-27-outbound-http-from-postgres]] attend une décision. Cette story
  ajoute un deuxième usage de `pg_net`, déclenché cette fois par un message et non par le
  job du jeudi : c'est le moment de la trancher.
- **Le trigger s'exécute dans la transaction de l'insertion.** `net.http_post` ne fait
  que mettre la requête en file, donc il ne ralentit pas l'envoi. Mais une erreur levée
  dans la fonction annulerait le message (exigence 6) : le code ne doit lever aucune
  erreur, ou les intercepter toutes.
- **Le message s'affiche sur l'écran verrouillé.** Le corps contient le texte en clair.
  C'est voulu (on doit voir « je suis au fond à gauche » sans déverrouiller), mais c'est
  un choix à garder en tête.
- **La coupure à 100 caractères en SQL** compte des caractères, pas ce que l'œil voit
  comme un caractère : un emoji composé peut être coupé en deux. Sans gravité, mais à
  vérifier sur un cas réel.
- **Savoir quel chat est à l'écran.** Le gestionnaire de notifications au premier plan
  est global (posé dans `_layout.tsx`). Il doit pouvoir lire le `groupId` du chat ouvert,
  qui n'est connu que de la page `/chat/[groupId]`.
- **Rien ne se teste sans build EAS et sans deux comptes dans le même groupe**, comme
  pour les stories 3.3 et 5.1.
