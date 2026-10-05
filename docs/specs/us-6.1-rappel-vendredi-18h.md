# PRD — Rappel push du vendredi 18 h

_2026-10-04 · Story 6.1_

## Résumé

Le vendredi à 18 h (heure de Paris), un job envoie un seul push à chaque membre d'un
groupe du soir : « C'est ce soir ! [lieu], 20 h ». Il reprend la mécanique de la
notification « groupe prêt » (story 3.3) : `pg_cron`, puis un appel à Expo via `pg_net`.

## Problème

Entre l'annonce du jeudi 19 h et le rendez-vous du vendredi 20 h, il se passe une journée
de travail. Celui qui oublie laisse le reste du groupe, des inconnus, l'attendre. Ce
rappel est un des deux garde-fous de la venue effective prévus par SPEC.md.

## Objectif

Qu'à la sortie du boulot, chaque membre ait sous les yeux où et à quelle heure il doit
être le soir même.

**Succès :** vendredi 18 h, sur un build de développement EAS, le push arrive sans être
déclenché à la main, avec le nom du lieu du groupe et « 20 h ».

## Utilisateur et scénario

En tant que membre d'un groupe, je veux être rappelé le jour même à la sortie du boulot,
afin de ne pas laisser quatre inconnus m'attendre parce que j'ai oublié.

## Exigences fonctionnelles

1. **Un seul push**, envoyé le vendredi à **18 h, heure de Paris**, été comme hiver.
   `pg_cron` ne planifie qu'en UTC : même approche que la story 3.1, deux créneaux
   (16 h et 17 h UTC), et celui qui tombe à la mauvaise heure ne fait rien.
2. Le reçoivent **tous les membres d'un groupe de ce vendredi** qui ont un jeton push.
   Personne n'est filtré : le désistement n'existe pas encore.
3. Un utilisateur **sans groupe ce vendredi** (pas dispo, ou dispo mais non groupé) ne
   reçoit rien.
4. Le texte :
   - Titre : `C'est ce soir !`
   - Corps : `[nom du lieu], 20 h`

   Le lieu est celui du groupe du membre. L'heure, **20 h, est écrite en dur** : c'est la
   même pour tous les groupes au MVP, et aucune colonne ne la stocke.
5. **Personne n'est notifié deux fois** pour le même vendredi, même si les deux créneaux
   s'exécutent.
6. Un envoi qui échoue (jeton absent ou périmé, Expo indisponible) **n'interrompt rien**,
   comme dans la story 3.3.
7. Taper le push **ouvre l'écran du groupe** (`/group`) : le lieu, l'adresse et l'accès au
   chat. Le routage actuel envoie vers le chat tout push qui porte un `groupId` (story
   5.2) : le rappel ne doit pas tomber dedans.

## Hors périmètre

- **Le rappel du vendredi matin** : il fait doublon avec l'annonce du jeudi 19 h.
- **Le désistement** : pas de filtre, pas de bouton « je ne viens plus ». À faire après
  le MVP.
- **Une heure de rendez-vous par groupe** : on ajoutera une colonne quand les heures
  varieront.
- Toute trace des envois, le réessai, le nettoyage des jetons périmés (même décision que
  la story 3.3).
- Les notifications sur Expo Go.

## Risques / questions ouvertes

- **SPEC.md n'est plus aligné** : il prévoit un rappel « vendredi matin, puis 18 h ».
  Cette story n'en garde qu'un. SPEC.md reste inchangé tant que Colin ne demande pas de
  le modifier.
- **Idempotence (point 5)** : rien en base ne trace aujourd'hui un envoi. Le créneau qui
  ne doit pas envoyer doit se reconnaître à l'heure de Paris, comme dans
  `form_friday_groups`.
