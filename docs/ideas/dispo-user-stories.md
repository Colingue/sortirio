# Dispo — User stories du MVP

_Dérivé de `docs/ideas/dispo-mvp.md` et `docs/SPEC.md` (2026-08-31)._

Priorités : **High** = sans elle le pilote du premier vendredi n'a pas lieu ·
**Medium** = le pilote a lieu mais dégradé · **Low** = confort.

---

## 1. Compte & profil

### 1.1

- **Title:** Connexion en un tap avec Google
- **Story:** En tant que nouvel arrivant qui vient de télécharger l'app, je veux me
  connecter avec mon compte Google, afin de commencer sans créer ni retenir un mot de
  passe.
- **Acceptance Criteria:**
  - Given je lance l'app sans être connecté, When l'écran de connexion s'affiche, Then je
    vois un seul bouton, « Continuer avec Google », et rien d'autre.
  - Given je lance l'app, When elle vérifie si j'ai une session, Then l'écran de démarrage
    reste affiché jusqu'à ce que ma destination soit connue — l'écran de connexion
    n'apparaît jamais, même une fraction de seconde, à quelqu'un qui est déjà connecté.
  - Given je lance l'app, When le démarrage se termine, Then j'arrive à l'un de ces trois
    endroits et à aucun autre : l'écran de connexion si je n'ai pas de session,
    l'inscription (page pour créer son profil) si j'ai une session mais pas encore de profil, l'accueil si j'ai les
    deux.
  - Given j'appuie sur le bouton et je choisis mon compte Google, When l'authentification
    réussit, Then une session Supabase est créée et je suis redirigé vers la création de
    profil.
  - Given je ferme l'app à n'importe quel moment de l'inscription, When je la rouvre,
    Then je **recommence l'inscription depuis le début**, écrans vides : rien n'est écrit
    en base avant le tout dernier bouton, il n'existe donc aucun profil incomplet.
  - Given je referme la fenêtre Google sans choisir de compte, When je reviens dans l'app,
    Then je retrouve l'écran de connexion inchangé, sans message d'erreur et sans session
    créée — annuler n'est pas une erreur.
  - Given l'authentification échoue réellement (réseau coupé, Google indisponible),
    When je reviens dans l'app, Then un message m'explique que ça n'a pas marché et me
    propose de réessayer.
- **Notes:**
  - **Doubles comptes assumés, pour plus tard.** Le jour où le bouton Apple arrive, un
    utilisateur déjà connecté en Google obtiendra un second compte vierge : aucun
    rattachement automatique par email, parce qu'Apple propose « Masquer mon adresse » et
    rend une partie des correspondances impossible. Sur un pilote de testeurs recrutés à
    la main, le cas est rare et se répare à la main.
  - **Pas de déconnexion, pas de suppression de compte dans le MVP.** Repartir d'un compte
    vierge pendant le développement se fait en supprimant l'utilisateur depuis Supabase.
    La suppression de compte in-app est exigée par la guideline Apple 5.1.1 (v) — sans
    fiche store, personne ne l'impose au pilote ; à traiter avant toute publication.
  - **C'est la story à faire tourner en premier sur un vrai téléphone.** Identifiants
    clients Google (Android + web) et empreinte de signature Android : rien de tout cela
    ne se teste dans Expo Go, il faut un build de développement EAS. En natif la connexion
    ne passe pas par une redirection web (le téléphone obtient un jeton que l'app remet à
    Supabase), donc pas d'URL de retour « localhost » à déclarer. L'empreinte de signature
    peut en revanche différer entre le build de dev et l'APK distribué aux testeurs.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v2-01-Connexion`
- **Priority:** High

### 1.2

_Fusion des anciennes stories 1.2 (profil) et 1.3 (ville), le 2026-09-06 : la ville
passant en premier, les deux ne se testent plus séparément. Réécrite le 2026-09-08 :
Lyon seule affichée, écran genre supprimé._

- **Title:** M'inscrire — ma ville, puis mon profil
- **Story:** En tant qu'utilisateur qui vient de se connecter, je veux dire où je veux
  sortir puis me présenter en trois questions, afin d'être plaçable dans un groupe et
  reconnaissable au bar.
- **Acceptance Criteria:**
  - Given je viens de me connecter, When le premier écran de l'inscription s'affiche,
    Then c'est la ville, et **Lyon est la seule affichée** : aucune ville fermée, aucune
    mention « bientôt ».
  - Given ma ville est choisie, When je continue, Then je réponds à trois questions, une
    par écran : prénom, date de naissance, photo.
  - Given une réponse manque, When je regarde le bouton « Continuer », Then il est
    désactivé.
  - Given je réponds à une question, When je valide, Then **rien n'est encore
    enregistré** : ma réponse est gardée en mémoire et je passe à la suivante.
  - Given ma date de naissance donne un âge < 18 ans, When je valide, Then l'inscription
    est refusée avec un message explicite et aucun profil n'est créé.
  - Given je reviens en arrière, When un écran déjà rempli s'affiche, Then ma réponse
    précédente y est toujours.
  - Given j'ai terminé le dernier écran, When je valide, Then **tout est écrit d'un
    coup** : la photo part dans Supabase Storage, le profil et la ville sont enregistrés,
    et j'arrive sur l'écran « Se déclarer dispo ».
  - Given l'écriture échoue, When je reviens à l'app, Then un message me propose de
    réessayer, et **aucune ligne de profil incomplète n'existe**.
  - Given je ferme l'app avant le dernier bouton, When je la rouvre, Then je recommence
    l'inscription depuis la ville, écrans vides, et rien n'a été écrit.
  - Given l'app est installée, When je parcours l'inscription de bout en bout, Then
    aucune permission de localisation n'est demandée.
- **Notes:**
  - **Le genre sort entièrement du MVP** le 2026-09-08 : pas d'écran, pas de colonne,
    pas d'usage. La préférence de genre était déjà sortie le 2026-09-06.
  - **Une photo envoyée sans profil derrière n'est pas un problème** : l'app la
    supprime si elle le peut, et une nouvelle tentative écrit au même chemin. Pas de
    ménage côté serveur dans cette story.
  - **Modifier son profil est une autre story** (1.4, qui touche déjà le même écran pour
    la ville) : ici on ne fait que créer.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v2-02-Ville` · `v2-03-Prenom` · `v2-04-DateNaissance` · `v2-05-Photo`
- **Priority:** High

### 1.3

_Fusionnée dans la story 1.2 le 2026-09-06. Le numéro reste vide pour ne pas décaler la
suite de la liste._

---

## 2. Se déclarer dispo

### 2.1

- **Title:** Un bouton pour dire « vendredi, je suis chaud »
- **Story:** En tant qu'utilisateur, je veux me déclarer disponible pour le prochain
  vendredi en un seul tap, afin de n'avoir aucune décision à prendre (ni gens, ni lieu,
  ni heure).
- **Acceptance Criteria:**
  - Given je n'ai pas de dispo posée pour le prochain vendredi ouvert, When j'ouvre
    l'accueil, Then je vois sa date et un unique bouton « Je suis dispo ».
  - Given j'appuie sur ce bouton, When l'enregistrement réussit, Then ma disponibilité
    est créée pour ce vendredi et l'écran bascule sur l'état d'attente sans rechargement
    manuel.
  - Given j'ai déjà posé une dispo pour ce vendredi, When je rouvre l'app, Then le
    bouton « Je suis dispo » n'est plus proposé une seconde fois.
  - Given il est jeudi 19 h 01, que les groupes sont partis et que je n'avais rien posé,
    When j'ouvre l'accueil, Then le même bouton m'est proposé, avec la date du vendredi
    de la semaine suivante.
  - Given il est jeudi 19 h 01 et que j'avais posé ma dispo pour le vendredi qui vient
    d'être formé, When j'ouvre l'accueil, Then je garde l'état d'attente et aucun bouton
    ne m'est proposé jusqu'au samedi.
- **Notes:**
  - **La permission de notification est demandée ici**, juste après le tap (point
    ouvert tranché le 2026-09-15). Un refus ne bloque rien.
  - **Il n'y a pas de creux entre jeudi 19 h et samedi** : le critère qui rendait le
    bouton indisponible après jeudi 19 h a été retiré le 2026-09-15. Voir
    `docs/specs/us-2.1-se-declarer-dispo.md`.
  - **Remplacé en partie par la 10.1** (2026-10-17) : entre jeudi 19 h et vendredi
    18 h, le bouton vise le vendredi **de cette semaine** (inscription tardive), plus
    le suivant. Le critère « jeudi 19 h 01 → vendredi suivant » ne vaut plus qu'après
    vendredi 18 h.
  - **Le bouton ne revient qu'à qui n'a rien posé** (précisé le 2026-09-16). Celui qui a
    coché son vendredi garde « on te prévient jeudi 19 h » jusqu'au samedi : on ne lui
    propose pas le vendredi suivant pendant que le sien arrive.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `05-Accueil` · `v2-06-Accueil-Notifs` · `v2-07-ConfirmationDispo`
- **Priority:** High

### 2.2

- **Title:** Annuler ma disponibilité jusqu'au jeudi 19 h
- **Story:** En tant qu'utilisateur dont le vendredi tombe à l'eau, je veux retirer ma
  disponibilité avant la formation des groupes, afin de ne pas laisser un groupe se
  former autour d'une place vide.
- **Acceptance Criteria:**
  - Given j'ai une dispo posée et qu'il est avant jeudi 19 h, When j'appuie sur
    « Annuler ma dispo » et que je confirme, Then ma disponibilité est supprimée et
    l'accueil repropose le bouton « Je suis dispo ».
  - Given j'ai annulé, When la formation des groupes tourne le jeudi 19 h, Then je ne
    suis placé dans aucun groupe et je ne reçois aucune notification.
  - Given il est jeudi 19 h passé, When j'ouvre mon groupe, Then aucune option
    d'annulation de dispo n'est proposée. Pas de « Je ne viens plus » (4.3
    annulée) : on prévient le groupe dans le chat.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `06-Disponibilite`
- **Priority:** High

### 2.3

- **Title:** Écran d'attente : compte à rebours et nombre d'inscrits
- **Story:** En tant qu'utilisateur qui a posé sa dispo, je veux voir le temps restant
  avant la formation des groupes et combien de personnes sont déjà inscrites, afin de ne
  pas oublier l'app pendant les six jours où il ne se passe rien.
- **Acceptance Criteria:**
  - Given ma dispo est posée, When j'ouvre l'accueil, Then je vois un compte à rebours
    jusqu'au jeudi 19 h et le nombre de personnes inscrites pour ce vendredi.
  - Given je laisse l'écran ouvert une minute, When le temps s'écoule, Then le compte à
    rebours décrémente sans que je doive quitter et rouvrir l'écran.
  - Given le nombre d'inscrits change, When je reviens sur l'accueil, Then le compteur
    affiché correspond au nombre réel de dispos posées pour ce vendredi.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `06-Disponibilite`
- **Priority:** Medium

---

## 3. Formation des groupes (jeudi 19 h)

### 3.1

- **Title:** Former des groupes de 3 à 6 selon ville et âge
- **Story:** En tant que système, je veux composer automatiquement les groupes le jeudi
  à 19 h, afin que l'utilisateur n'ait jamais à choisir avec qui il sort.
- **Acceptance Criteria:**
  - Given des dispos posées pour le vendredi, When le job planifié s'exécute à jeudi
    19 h, Then chaque groupe créé compte entre 3 et 6 membres d'une même ville, et
    aucun utilisateur n'appartient à deux groupes.
  - Given deux utilisateurs n'ont pas la même ville, ou ont des âges incompatibles,
    When les groupes sont formés, Then ils ne sont pas placés dans le même groupe.
  - Given il reste moins de 3 personnes non groupées, When le job se termine, Then
    aucun groupe partiel n'est créé et ces utilisateurs deviennent des retardataires
    sans place : la formation au fil de l'eau de la 10.3 les compte (tranché le
    2026-10-17).
- **Notes:**
  - **« Âges incompatibles » n'exclut personne** (précisé le 2026-10-18) : l'âge
    répartit les gens entre les groupes, voir la 3.4.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — aucun écran (côté serveur)
- **Priority:** High

### 3.2

- **Title:** Un lieu distinct par groupe
- **Story:** En tant que membre d'un groupe, je veux qu'un lieu précis me soit attribué,
  afin de savoir où aller sans que personne n'ait à organiser quoi que ce soit.
- **Acceptance Criteria:**
  - Given un groupe vient d'être formé, When le job attribue les lieux, Then le groupe a
    exactement un lieu avec un nom et une adresse, tiré de la table de lieux **de la
    ville du groupe**.
  - Given plusieurs groupes sont formés le même vendredi et qu'il y a au moins autant de
    lieux que de groupes, When les lieux sont attribués, Then deux groupes du même soir
    n'ont jamais le même lieu.
  - Given il y a moins de lieux disponibles que de groupes formés, When le job
    s'exécute, Then tous les groupes sont quand même formés et les lieux sont réutilisés
    en étalant au maximum (jamais deux fois le même lieu avant que tous aient servi).
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v2-10-MonGroupe`
- **Priority:** High

### 3.3

- **Title:** Notification « ton groupe est prêt »
- **Story:** En tant qu'utilisateur qui a posé sa dispo, je veux être prévenu le jeudi
  soir que mon groupe est formé, afin de découvrir mon lieu et mes co-équipiers au seul
  moment où l'app existe vraiment.
- **Acceptance Criteria:**
  - Given je suis placé dans un groupe, When le job du jeudi 19 h se termine, Then je
    reçois une notification push annonçant que mon groupe et mon lieu sont disponibles.
  - Given je tape sur cette notification, When l'app s'ouvre, Then j'arrive directement
    sur l'écran de mon groupe, pas sur l'accueil.
  - Given je n'ai pas autorisé les notifications, When j'ouvre l'app après jeudi 19 h,
    Then mon groupe est quand même visible depuis l'accueil.
  - Given je n'ai été placé dans aucun groupe, When le job se termine, Then je ne reçois
    aucune notification.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v2-08-GroupePret` · `v2-10-MonGroupe`
- **Priority:** High

### 3.4

_Ajoutée le 2026-10-18. L'âge répartit, il n'exclut jamais._

- **Title:** Répartir les groupes par âge
- **Story:** En tant qu'utilisateur, je veux sortir avec des gens d'un âge proche du
  mien, afin que la conversation accroche, sans pour autant rester sans groupe à cause
  de mon âge.
- **Acceptance Criteria:**
  - Given 12 dispos de 22 à 28 ans aux âges continus, When le job du jeudi 19 h
    s'exécute, Then il forme deux groupes de 6, les plus jeunes ensemble.
  - Given 8 dispos de 22 à 26 ans et 4 de 40 à 45 ans, When le job s'exécute, Then il
    forme 3 groupes, et les 4 de 40 à 45 ans sont ensemble, sans personne de 22 à 26 ans.
  - Given 3 à 5 dispos dans une ville, When le job s'exécute, Then tout le monde est dans
    le même groupe, quel que soit l'écart d'âge.
  - Given n'importe quel nombre de dispos ≥ 3, When le job s'exécute, Then tout le monde
    est placé dans un groupe de 3 à 6.
  - Given plusieurs groupes ont de la place, When un retardataire s'inscrit, Then il
    rejoint celui dont l'âge moyen est le plus proche du sien ; à égalité, le moins
    rempli.
  - Given le groupe le plus proche en âge compte déjà 6 membres, When un retardataire
    s'inscrit, Then il n'y est pas ajouté.
- **Notes:**
  - **Tri par date de naissance, puis découpage en groupes de 3 à 6** qui minimise
    « somme des écarts d'âge + X × nombre de groupes », X = 5 ans au départ. Un groupe
    de plus seulement s'il fait gagner plus de X ans d'écart. Pas d'écart max, pas de
    tranches.
  - **X se règle** après les premiers vendredis, selon le taux d'absence (8.1) : un
    groupe de 3 avec un absent devient un tête-à-tête.
  - **Le groupe de retardataires (10.3) ignore l'âge.**
  - Voir `docs/specs/us-3.4-repartition-par-age.md`.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — aucun écran (côté serveur)
- **Priority:** Medium

---

## 4. L'écran du groupe et la présence

### 4.1

- **Title:** Voir mon groupe, mon lieu et mon heure
- **Story:** En tant que membre d'un groupe, je veux voir le lieu, l'adresse, l'heure et
  les visages de ceux que je vais rencontrer, afin d'arriver vendredi soir sans
  appréhension et sans me tromper de bar.
- **Acceptance Criteria:**
  - Given mon groupe est formé, When j'ouvre l'écran du groupe, Then je vois le nom du
    lieu, son adresse, l'heure du rendez-vous et la liste des membres.
  - Given je regarde un membre, When la liste s'affiche, Then je vois uniquement sa
    photo, son prénom et son âge — aucune autre donnée de profil.
  - Given je tape sur l'adresse, When l'action se déclenche, Then l'app ouvre
    l'itinéraire dans l'application de cartes du téléphone.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v2-10-MonGroupe`
- **Priority:** High

### 4.2 ANNULE : raison, pas MVP. on a pas besoin de confirmer de toute facon ça ne changera rien au nombre de personne dans le groupe

- **Title:** Confirmer ma présence avant vendredi 12 h
- **Story:** En tant que membre d'un groupe, je veux confirmer que je viens, afin que
  les autres sachent sur qui compter vendredi soir.
- **Acceptance Criteria:**
  - Given je n'ai pas encore confirmé et qu'il est avant vendredi 12 h, When j'ouvre
    l'écran du groupe, Then un bouton « Je confirme » est affiché.
  - Given j'appuie sur « Je confirme », When l'enregistrement réussit, Then mon statut
    passe à « confirmé » et les autres membres voient ce statut sur ma vignette.
  - Given il est vendredi 12 h 01, When j'ouvre l'écran du groupe, Then le bouton
    « Je confirme » n'est plus proposé et mon statut reste celui atteint avant la
    deadline.
  - Given un membre n'a jamais confirmé, When vendredi 20 h arrive, Then il reste
    affiché dans le groupe avec un statut « non confirmé » et n'est pas remplacé.
- **Priority:** High

### 4.3 : raison, pas MVP. on a pas besoin de confirmer de toute facon ça ne changera rien au nombre de personne dans le groupe

- **Title:** « Je ne viens plus » se dit tout seul dans le chat
- **Story:** En tant que membre qui se désiste, je veux le signaler en un tap, afin que
  le groupe ne reste pas à attendre quelqu'un qui ne viendra pas.
- **Acceptance Criteria:**
  - Given je suis membre d'un groupe, When j'appuie sur « Je ne viens plus » et que je
    confirme, Then un message automatique est posté dans le chat du groupe avec mon
    prénom.
  - Given je me suis désisté, When les autres membres ouvrent l'écran du groupe, Then
    mon statut affiché est « ne vient plus ».
  - Given je me suis désisté, When les rappels du vendredi partent, Then je ne reçois
    plus aucun rappel pour cette soirée.
  - Given je me suis désisté, When j'ouvre le chat, Then j'y ai toujours accès (le
    groupe n'est pas fermé pour moi).
- **Priority:** High

---

## 5. Le chat de groupe

### 5.1

- **Title:** Chat de groupe en temps réel
- **Story:** En tant que membre d'un groupe, je veux échanger en direct avec les autres,
  afin de réussir à les retrouver dans un bar bondé — c'est le seul mécanisme dont on
  dispose.
- **Acceptance Criteria:**
  - Given mon groupe est formé, When j'ouvre l'écran du groupe, Then le chat m'est
    accessible sans aucune condition.
  - Given un autre membre envoie un message, When mon chat est ouvert, Then le message
    apparaît en moins de 2 secondes sans action de ma part.
  - Given j'envoie un message, When il est enregistré, Then il s'affiche avec ma photo,
    mon prénom et son horodatage pour tous les membres.
  - Given je ne suis pas membre de ce groupe, When j'essaie d'accéder à ses messages,
    Then la requête est refusée par les règles RLS.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `10-Chat`
- **Priority:** High

### 5.2

- **Title:** Être notifié d'un nouveau message
- **Story:** En tant que membre d'un groupe, je veux recevoir une notification quand
  quelqu'un écrit, afin de ne pas rater un « je suis au fond à gauche » alors que je
  cherche le groupe dans le bar.
- **Acceptance Criteria:**
  - Given l'app est fermée ou en arrière-plan, When un membre poste un message, Then je
    reçois une notification push avec son prénom et le début du message.
  - Given je tape sur la notification, When l'app s'ouvre, Then j'arrive directement
    dans le chat du groupe concerné.
  - Given le chat est déjà ouvert à l'écran, When un message arrive, Then aucune
    notification n'est affichée.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `10-Chat`
- **Priority:** Medium

### 5.3

- **Title:** Le chat survit à la soirée
- **Story:** En tant que membre d'un groupe qui s'est bien passé, je veux garder l'accès
  au chat après vendredi soir, afin que le groupe continue d'exister sans l'app.
- **Acceptance Criteria:**
  - Given la soirée est passée, When j'ouvre l'app le lundi suivant, Then le chat du
    groupe est toujours accessible et je peux y écrire.
  - Given j'ai participé à plusieurs vendredis, When j'ouvre la liste de mes groupes,
    Then tous mes chats passés sont listés du plus récent au plus ancien.
  - Given un nouveau groupe est formé le jeudi suivant, When il apparaît, Then il
    s'ajoute à la liste sans fermer ni masquer les précédents.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `11-Groupes`
- **Priority:** Medium

---

## 6. Rappels du jour J

### 6.1

- **Title:** Rappels push le vendredi matin et à 18 h
- **Story:** En tant que membre d'un groupe, je veux être rappelé le jour même, afin de
  ne pas laisser quatre inconnus m'attendre parce que j'ai oublié.
- **Acceptance Criteria:**
  - Given je suis membre d'un groupe et que je ne me suis pas désisté, When il est
    vendredi matin, Then je reçois un rappel mentionnant la soirée du soir.
  - Given il est vendredi 18 h, When le rappel part, Then il contient le nom du lieu et
    l'heure du rendez-vous.
  - Given je me suis désisté ou je n'ai aucun groupe cette semaine, When les rappels
    partent, Then je n'en reçois aucun.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — aucun écran (côté serveur)
- **Priority:** Medium

---

## 7. Sécurité — signaler un membre

### 7.1

- **Title:** Signaler un membre de mon groupe
- **Story:** En tant qu'utilisateur mis mal à l'aise par quelqu'un, je veux le signaler,
  afin de ne plus jamais me retrouver dans le même groupe que lui.
- **Acceptance Criteria:**
  - Given j'ouvre la fiche d'un membre de mon groupe, When j'appuie sur « Signaler » et
    que je confirme, Then le signalement est enregistré immédiatement, sans validation
    manuelle.
  - Given j'ai signalé quelqu'un, When la formation des groupes s'exécute les semaines
    suivantes, Then nous ne sommes jamais placés dans le même groupe.
  - Given j'ai signalé un membre du groupe en cours, When je reviens sur l'écran du
    groupe, Then le groupe de la semaine reste inchangé (le signalement n'agit que sur
    les groupes futurs) et l'app me le dit explicitement.
  - Given la personne signalée ouvre l'app, When elle consulte son groupe, Then rien ne
    lui indique qu'elle a été signalée.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `12-ProfilMembre` · `13-Signalement` · `16-CompteBanni`
- **Priority:** High

---

## 8. Mesure

### 8.1

- **Title:** La question du samedi matin
- **Story:** En tant qu'équipe produit, je veux demander à chaque participant « tu y es
  allé ? » le samedi matin, afin de connaître le taux de présence réel — le principal
  risque du concept.
- **Acceptance Criteria:**
  - Given j'étais membre d'un groupe la veille, When j'ouvre l'app le samedi, Then une
    question unique « Tu y es allé ? » s'affiche avec deux réponses : Oui / Non.
  - Given je réponds, When la réponse est enregistrée, Then la question disparaît
    définitivement pour cette soirée et rien d'autre ne m'est demandé (pas de note, pas
    de commentaire).
  - Given je ne réponds pas samedi, When j'ouvre l'app avant jeudi 19 h, Then la
    question est toujours là (« Tu y es allé vendredi soir ? »).
  - Given je n'ai pas répondu, When jeudi 19 h passe, Then la question n'est plus posée
    et la réponse est comptée comme absente de la mesure.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `09-QuestionSamedi`
- **Priority:** High

### 8.2

- **Title:** Suivre le repositionnement d'une dispo à 3 semaines
- **Story:** En tant qu'équipe produit, je veux pouvoir mesurer si un utilisateur repose
  une dispo dans les 3 semaines qui suivent sa première soirée, afin de disposer de la
  métrique de référence du MVP.
- **Acceptance Criteria:**
  - Given un utilisateur pose une disponibilité, When elle est enregistrée, Then la date
    de création et l'utilisateur sont conservés en base.
  - Given un utilisateur a participé à une soirée, When on interroge la base, Then une
    requête SQL suffit à dire s'il a reposé une dispo dans les 21 jours suivants.
  - Given le pilote tourne depuis 3 semaines, When on lance la requête, Then elle rend
    un taux par cohorte de première soirée, sans traitement manuel.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — aucun écran (côté serveur)
- **Priority:** Medium

---

## Hypothèses et points ouverts

- **Heure du rendez-vous fixée à 20 h** pour tous les groupes (question ouverte dans
  `docs/SPEC.md`) : les stories 4.1 et 6.1 supposent une heure unique.
- **Moins de 6 inscrits un jeudi** : la story 3.1 tranche par « aucun groupe partiel,
  message d'accueil explicite ». À confirmer — le MVP dit que l'app ne peut rien
  afficher en dessous de 6.
- **Âge minimum 18 ans** (story 1.2) : non écrit dans le MVP, ajouté ici parce que
  l'app fait se rencontrer des inconnus. À valider.
- **Villes « bientôt »** (story 1.2) : afficher les villes fermées et enregistrer
  l'intérêt n'est pas strictement nécessaire au pilote. C'est le moyen le moins cher de
  savoir où ouvrir ensuite — à couper si le mois est serré, en ne laissant que Lyon.
- **Permission de notification** — _tranché le 2026-09-15_ : demandée au tap sur
  « Je suis dispo », après l'écriture, une seule fois, et un refus ne bloque rien. Pas à
  la connexion : sans contexte, le refus est quasi certain, et sans push l'utilisateur
  ne saura jamais que son groupe est formé (story 3.3). Écrit dans la story 2.1.
- **Où se retient « j'ai déjà vu l'annonce »** (story 9.1) : stockage local du
  téléphone ou colonne en base. Le local ne survit pas à une réinstallation, la base
  demande une migration. À trancher avant d'implémenter la 9.1.
- **Ouverture depuis une notification** : la story 3.3 exige d'arriver directement sur
  l'écran du groupe. Ça n'est vrai que si le routage de démarrage de la story 1.1 ne
  s'interpose pas pendant qu'il vérifie la session.

---

## 9. L'annonce du groupe

### 9.1

_Ajoutée le 2026-09-29, après la 4.1 : l'écran existait, l'annonce manquait._

- **Title:** Une modale annonce le groupe, une seule fois
- **Story:** En tant que membre d'un groupe qui ouvre l'app, je veux être accueilli par
  une annonce que mon groupe est là, afin de ne pas passer à côté de la seule nouvelle
  de la semaine — sans qu'elle me soit répétée à chaque ouverture.
- **Acceptance Criteria:**
  - Given mon groupe est formé et je n'ai pas encore ouvert l'app depuis, When j'arrive
    sur l'accueil, Then une modale m'annonce que mon groupe est prêt.
  - Given la modale est affichée, When je la lis, Then elle est **purement
    informative** : un seul bouton pour la fermer, aucune autre action — ni confirmer sa
    présence, ni se désister, ni annuler sa dispo.
  - Given j'ai fermé la modale, When je reviens sur l'accueil pendant la même fenêtre
    (jusqu'au samedi 6 h), Then elle ne réapparaît pas.
  - Given j'ai fermé la modale, When je tue l'app et la relance, Then elle ne réapparaît
    pas : l'avoir vue survit au redémarrage.
  - Given un nouveau groupe est formé le jeudi suivant, When j'ouvre l'app, Then la
    modale réapparaît — c'est une fois **par groupe**, pas une fois pour toutes.
  - Given je n'ai aucun groupe visible (pas assez de monde dans ma ville, ou samedi 6 h
    passé), When j'ouvre l'accueil, Then aucune modale n'apparaît.
  - Given le groupe se forme pendant que l'app est déjà ouverte sur l'accueil, When je
    ne relance pas l'app, Then aucune modale n'apparaît avant la prochaine ouverture —
    même limite que la 4.1, qui ne rafraîchit pas l'accueil tout seul.
- **Notes:**
  - **« Déjà vue » se retient par groupe**, pas par période : la clé est l'identité du
    groupe. C'est ce qui fait réapparaître la modale le jeudi suivant sans code de date.
  - **Où cette mémoire vit est le point de conception** : sur le téléphone, c'est une
    ligne de stockage local et zéro migration, mais réinstaller l'app ou changer de
    téléphone fait réapparaître la modale. En base, c'est exact sur tous les appareils
    au prix d'une colonne ou d'une table. À trancher dans la spec.
  - **Doublon assumé avec la notification de la 3.3** : celui qui a autorisé les
    notifications apprend deux fois la même chose. La modale existe pour les autres —
    un refus de notification ne bloque rien (story 2.1), et l'annonce ne doit pas
    dépendre du push.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v2-08-GroupePret` · `v2-09-Accueil-GroupePret`
- **Priority:** Low

---

## 10. Inscription tardive — « sors ce soir, sans prévoir »

_Ajoutée le 2026-10-17. Décidé : groupes formés jeudi soir comme avant (3 à 6), chat
ouvert dès la formation, inscription possible jusqu'au vendredi 18 h._

### 10.1

- **Title:** M'inscrire pour ce soir, jusqu'au vendredi 18 h
- **Story:** En tant qu'utilisateur qui se décide au dernier moment, je veux pouvoir me
  déclarer dispo après la formation des groupes, afin de sortir ce soir sans avoir
  prévu.
- **Acceptance Criteria:**
  - Given il est entre jeudi 19 h et vendredi 18 h et je n'ai pas de dispo pour ce
    vendredi, When j'ouvre l'accueil, Then le bouton « Je suis dispo » vise **ce
    vendredi**, avec « Inscriptions jusqu'à 18 h » et le temps restant.
  - Given il est vendredi 18 h 01, When j'ouvre l'accueil, Then le bouton vise le
    vendredi suivant.
  - Given je me suis inscrit en retard, When l'inscription réussit, Then la story 10.2
    s'applique immédiatement. Tant que la 10.2 n'existe pas, je vois l'état d'attente
    « On te cherche un groupe », recherche jusqu'à 18 h.
  - Given il est jeudi 19 h passé et j'avais posé ma dispo avant, When j'ouvre
    l'accueil, Then rien ne change pour moi : pas d'annulation (2.2), pas de second
    bouton.
- **Notes:**
  - **Précisé le 2026-10-18** : la maquette `v3-01` est abandonnée au profit de
    `v3-01b`. Son alerte « places libres » relève de la 10.4, pas de la 10.1.
  - **La formation du jeudi 19 h ne change pas** : elle forme toujours le vendredi qui
    vient, même si la fenêtre d'inscription court désormais jusqu'au vendredi 18 h.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v3-01b-Accueil-Places` (sans l'alerte) · `v3-06-Attente`
- **Priority:** High

### 10.2

- **Title:** Rejoindre un groupe pas plein
- **Story:** En tant que retardataire, je veux être placé tout de suite dans un groupe
  qui a de la place, afin de rejoindre la soirée et son chat sans attendre.
- **Acceptance Criteria:**
  - Given je me suis inscrit en retard, When j'ouvre l'accueil, Then aucune option
    d'annulation ne m'est proposée, groupe ou pas (tranché le 2026-10-17). Pour prévenir
    le groupe, j'écris dans le chat.
  - Given il existe un groupe de ma ville, d'âge compatible, de moins de 6 membres, et
    sans personne que j'ai signalé ou qui m'a signalé, When je m'inscris, Then j'y suis
    ajouté.
  - Given j'ai rejoint un groupe, When j'ouvre l'app, Then je vois l'écran du groupe
    (lieu, heure, membres) et j'ai accès au chat, historique compris.
  - Given je rejoins un groupe, When l'ajout est fait, Then je reçois la notification
    « ton groupe est prêt » (story 3.3) et les membres voient un nouveau membre.
  - Given j'ai rejoint un groupe en retard, When j'ouvre le chat ou l'écran du groupe,
    Then je vois « Tu as rejoint le groupe à 15 h 13 » et les autres voient un badge
    « Nouveau » sur ma vignette.
  - Given plusieurs groupes ont de la place, When je m'inscris, Then je rejoins le
    moins rempli.
  - Given je fais partie des moins de 3 restés sans groupe à la formation du jeudi,
    When elle se termine, Then je suis traité comme un retardataire sans place : je
    vois l'état d'attente et la 10.3 me compte avec les autres.
  - Given aucun groupe compatible n'a de place, When je m'inscris, Then je vois un état
    d'attente jusqu'à vendredi 18 h (story 10.3).
- **Notes:**
  - **Chat : tout l'historique.** Les règles RLS des messages se basent sur
    l'appartenance au groupe, sans filtre sur la date d'arrivée.
  - **`joined_at` sur l'appartenance au groupe** : nécessaire pour « Tu as rejoint à… »
    et le badge « Nouveau ».
  - **« Retardataire » se déduit** : dispo créée après jeudi 19 h. Pas de colonne.
  - **« Le moins rempli » devient le départage** (2026-10-18) : la 3.4 place d'abord
    selon l'âge moyen le plus proche.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v3-03-GroupeRejoint` · `v3-04-MonGroupe-Tardif` · `v3-05-Chat-NouveauMembre` · `v3-06-Attente`
- **Priority:** High

### 10.3

_Réécrite le 2026-10-18 : plus de job à 18 h, plus de « prioritaire »._

- **Title:** Un groupe de retardataires se forme dès 3 personnes
- **Story:** En tant que retardataire sans place, je veux qu'un groupe se forme dès
  qu'on est assez, afin de sortir ce soir sans attendre une heure fixe.
- **Acceptance Criteria:**
  - Given une inscription tardive ne trouve aucun groupe avec de la place, When au
    moins 3 personnes compatibles (ville, âge, signalements) sont sans groupe pour ce
    vendredi, Then un groupe se forme **tout de suite**, avec un lieu (3.2), et ses
    membres sont notifiés (3.3).
  - Given ce groupe compte moins de 6 membres, When un autre retardataire compatible
    s'inscrit, Then il le rejoint via la 10.2, sans règle de plus.
  - Given deux retardataires s'inscrivent à la même seconde, When la formation tourne,
    Then un seul groupe est créé et personne n'est placé deux fois.
  - Given il est vendredi 18 h passé et je n'ai aucun groupe, When j'ouvre l'accueil,
    Then je vois « Pas de groupe ce soir ». La recherche s'arrête à 18 h dans tous les
    cas.
- **Notes:**
  - **Formation au fil de l'eau** : une fonction appelée à chaque dispo tardive, en plus
    du job du jeudi.
  - **Concurrence** : un verrou par ville et par vendredi (advisory lock) ou une
    transaction sérialisée.
  - **Attribution du lieu (3.2) en fonction réutilisable**, appelable à tout moment le
    vendredi, qui évite les lieux déjà pris ce soir-là.
  - **« Sans groupe ce soir » se déduit** : dispo pour ce vendredi, aucune appartenance
    à un groupe, heure > 18 h. Pas de colonne.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v3-06-Attente` · `v3-07-GroupeRetardataires` · `v3-08-PasDeGroupe`
- **Priority:** High

### 10.4

_Ajoutée le 2026-10-18._

- **Title:** « Des groupes ont encore de la place ce soir »
- **Story:** En tant qu'utilisateur sans dispo ce vendredi, je veux savoir qu'un groupe
  peut encore m'accueillir, afin de me décider à sortir ce soir.
- **Acceptance Criteria:**
  - Given il est entre jeudi 19 h et vendredi 18 h et je n'ai pas de dispo, When un
    groupe a une place **pour moi** (ma ville, âge compatible, aucun signalement
    croisé), Then l'accueil affiche « Des groupes ont encore de la place ce soir ».
  - Given aucun groupe n'a de place pour moi, When j'ouvre l'accueil, Then l'alerte
    n'apparaît pas — on ne promet pas une place pour me mettre ensuite en attente.
  - Given l'alerte s'affiche, When je regarde l'écran, Then aucun nombre de places ni
    de groupes n'est affiché.
- **Notes:**
  - **RPC `security definer` qui renvoie un booléen** : la RLS empêche de lire les
    autres groupes, et aucune donnée de comptage n'est exposée au client.
  - **Une seule fonction SQL de compatibilité** (ville, âge, signalements), utilisée
    par le job du jeudi, l'ajout tardif (10.2 / 10.3) et cette alerte.
- **Écrans:** [maquettes](https://claude.ai/artifact/RVTYr6ZV3F1rN49sSpK3zk#page-dcb81aee8d83) — `v3-01b-Accueil-Places`
- **Priority:** Medium

### Points ouverts de la section 10

- **Notification à 18 h « pas de groupe ce soir »** : si oui, un petit job à 18 h qui
  ne sert plus qu'à notifier.
- **Message système dans le chat** (« X a rejoint le groupe ») : si on le garde, la
  table des messages a besoin d'un type (système / utilisateur).
- **Rappel de 18 h (6.1)** pour un groupe formé juste avant (ex. 17 h 59) : rappel en
  plus de la notification « ton groupe est prêt », ou pas ?
- **`docs/SPEC.md`** contredit ces décisions (dispos jusqu'au jeudi 19 h) : à mettre à
  jour avec ton accord.
