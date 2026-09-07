# Sortirio — User stories du MVP

_Dérivé de `docs/ideas/sortirio-mvp.md` et `docs/SPEC.md` (2026-08-31)._

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
- **Priority:** High

### 1.2

_Fusion des anciennes stories 1.2 (profil) et 1.3 (ville), le 2026-09-06 : la ville
passant en premier, les deux ne se testent plus séparément._

- **Title:** M'inscrire — ma ville, puis mon profil
- **Story:** En tant qu'utilisateur qui vient de se connecter, je veux dire où je veux
  sortir puis me présenter en quatre questions, afin d'être plaçable dans un groupe et
  reconnaissable au bar.
- **Acceptance Criteria:**
  - Given je viens de me connecter, When le premier écran de l'inscription s'affiche,
    Then c'est le choix de la ville : une liste où seule **Lyon** est sélectionnable,
    les autres étant marquées « bientôt ».
  - Given je sélectionne une ville marquée « bientôt », When je valide, Then l'app me dit
    tout de suite qu'elle n'est pas encore ouverte — avant de m'avoir fait remplir quoi
    que ce soit — et je peux quand même continuer, sinon je n'aurais jamais de profil et
    l'app me renverrait indéfiniment à l'inscription. Je ne pourrai pas poser de
    disponibilité.
  - Given ma ville est choisie, When je continue, Then je réponds à quatre questions, une
    par écran : prénom, date de naissance, genre, photo.
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
    réessayer, et il n'existe **ni ligne de profil incomplète, ni fichier orphelin**.
  - Given je ferme l'app avant le dernier bouton, When je la rouvre, Then je recommence
    l'inscription depuis la ville, écrans vides, et rien n'a été écrit.
  - Given l'app est installée, When je parcours l'inscription de bout en bout, Then
    aucune permission de localisation n'est demandée.
- **Notes:**
  - **La préférence de genre est sortie du MVP** le 2026-09-06 : ni demandée, ni
    utilisée par le matching.
  - **Modifier son profil est une autre story** (1.4, qui touche déjà le même écran pour
    la ville) : ici on ne fait que créer.
- **Priority:** High

### 1.3

_Fusionnée dans la story 1.2 le 2026-09-06. Le numéro reste vide pour ne pas décaler la
suite de la liste._

### 1.4

- **Title:** Changer de ville depuis mon profil
- **Story:** En tant qu'utilisateur qui déménage ou qui s'est trompé, je veux changer ma
  ville depuis mon profil, afin d'être groupé au bon endroit dès le vendredi suivant.
- **Acceptance Criteria:**
  - Given je suis inscrit, When j'ouvre mon profil, Then ma ville actuelle est affichée
    et modifiable via la même liste qu'à l'inscription.
  - Given je change de ville, When la formation des groupes s'exécute le jeudi suivant,
    Then je suis groupé dans ma nouvelle ville.
  - Given je change de ville alors qu'un groupe est déjà formé pour moi, When je rouvre
    l'écran du groupe, Then ce groupe et son lieu restent inchangés.
- **Priority:** Medium

---

## 2. Se déclarer dispo

### 2.1

- **Title:** Un bouton pour dire « vendredi, je suis chaud »
- **Story:** En tant qu'utilisateur, je veux me déclarer disponible pour le prochain
  vendredi en un seul tap, afin de n'avoir aucune décision à prendre (ni gens, ni lieu,
  ni heure).
- **Acceptance Criteria:**
  - Given nous sommes entre samedi et jeudi 19 h et que je n'ai pas de dispo posée,
    When j'ouvre l'accueil, Then je vois la date du prochain vendredi et un unique
    bouton « Je suis dispo ».
  - Given j'appuie sur ce bouton, When l'enregistrement réussit, Then ma disponibilité
    est créée pour ce vendredi et l'écran bascule sur l'état d'attente sans rechargement
    manuel.
  - Given j'ai déjà posé une dispo pour ce vendredi, When je rouvre l'app, Then le
    bouton « Je suis dispo » n'est plus proposé une seconde fois.
  - Given il est jeudi 19 h 01, When j'ouvre l'accueil, Then le bouton est indisponible
    et l'écran annonce le prochain vendredi ouvert aux inscriptions.
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
    d'annulation de dispo n'est proposée — seul « Je ne viens plus » existe.
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
    aucun groupe partiel n'est créé et ces utilisateurs voient sur l'accueil qu'il n'y
    avait pas assez de monde cette semaine.
- **Priority:** High

### 3.2

- **Title:** Un lieu distinct par groupe
- **Story:** En tant que membre d'un groupe, je veux qu'un lieu précis me soit attribué,
  afin de savoir où aller sans que personne n'ait à organiser quoi que ce soit.
- **Acceptance Criteria:**
  - Given un groupe vient d'être formé, When le job attribue les lieux, Then le groupe a
    exactement un lieu avec un nom et une adresse, tiré de la table de lieux **de la
    ville du groupe**.
  - Given plusieurs groupes sont formés le même vendredi, When les lieux sont attribués,
    Then deux groupes du même soir n'ont jamais le même lieu.
  - Given il y a moins de lieux disponibles que de groupes formés, When le job
    s'exécute, Then les groupes en excès ne sont pas créés et l'erreur est tracée côté
    backend.
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
- **Priority:** High

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
- **Priority:** High

### 4.2

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

### 4.3

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
  - Given mon groupe est formé, When j'ouvre l'écran du groupe, Then le chat est déjà
    ouvert et accessible.
  - Given un autre membre envoie un message, When mon chat est ouvert, Then le message
    apparaît en moins de 2 secondes sans action de ma part.
  - Given j'envoie un message, When il est enregistré, Then il s'affiche avec ma photo,
    mon prénom et son horodatage pour tous les membres.
  - Given je ne suis pas membre de ce groupe, When j'essaie d'accéder à ses messages,
    Then la requête est refusée par les règles RLS.
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
    notification push n'est envoyée.
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
  - Given je ne réponds pas, When j'ouvre l'app le dimanche, Then la question n'est plus
    posée et la réponse est comptée comme absente de la mesure.
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
- **Permission de notification** : ne pas la demander à la connexion — sans contexte, le
  refus est quasi certain, et sans push l'utilisateur ne saura jamais que son groupe est
  formé (story 3.3). Le bon moment est le tap sur « Je suis dispo » (« on te prévient
  jeudi 19 h »). À trancher, puis à écrire dans la story 2.1.
- **Ouverture depuis une notification** : la story 3.3 exige d'arriver directement sur
  l'écran du groupe. Ça n'est vrai que si le routage de démarrage de la story 1.1 ne
  s'interpose pas pendant qu'il vérifie la session.
