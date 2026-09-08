# Sortirio — Spec produit (MVP)

## Concept

Application mobile (iOS + Android, Expo / React Native) pour se faire des **amis**
dans une nouvelle ville. Pas une app de dating — l'objectif est purement amical :
rencontrer des gens qui se ressemblent un minimum (âge) et se retrouver IRL.

Positionnement par rapport aux concurrents étudiés :

- **Knockk** : communautés par centre d'intérêt + événements — pas notre approche
- **Timeleft** : algorithme qui compose des groupes selon âge/personnalité pour des
  dîners réservés — c'est le mécanisme le plus proche, mais on simplifie (pas de
  réservation de restaurant, format plus léger)
- **Bumble BFF** : swipe 1:1 façon dating — pas notre approche

## Utilisateur cible

Une personne de **25 à 35 ans qui vient d'emménager** dans la ville — moins de
12 mois sur place (mutation, nouveau job, études). Elle n'a pas de réseau local.

C'est le segment retenu parce que la douleur a une date de début identifiable
(« j'ai emménagé en septembre »), ce qui donne un déclencheur clair de
téléchargement. Conséquence assumée : cet utilisateur _guérit_. S'il réussit, il
n'a plus besoin de l'app à 6 mois — l'acquisition de nouveaux arrivants doit donc
être continue.

## Mesure du succès

Une seule métrique de référence pour le MVP : **l'utilisateur repose une
disponibilité dans les 3 semaines** qui suivent sa première soirée.

C'est la seule métrique mesurable dès la première semaine, et c'est un proxy
honnête de « la soirée était bien ». Les métriques de fond (le lien survit à
l'app, « j'ai un groupe d'amis ici » à 6 mois) sont le vrai objectif, mais ne
sont pas exploitables comme boussole à court terme.

Une seconde mesure, purement instrumentale : le **samedi matin, une question à un
tap — « tu y es allé ? »**. Elle ne sert pas à noter la soirée mais à connaître le
taux de présence réel, qui est le principal risque du concept (voir _Venue
effective_).

## Contrainte de livraison

**Un mois** pour une première version installable, livrée en **TestFlight (iOS)
et piste de test fermé (Android)** — pas de fiche store publique.

Ce choix évite deux blocages qui mangeraient le mois :

- **Google Play** impose aux nouveaux comptes développeur personnels un test
  fermé avec ≥ 12 testeurs pendant 14 jours avant l'accès production.
- **App Store, guideline 1.2 (UGC)** exige, pour une app mettant des inconnus en
  contact, un dispositif de signalement et de blocage dès la v1. En TestFlight
  _interne_ (≤ 100 testeurs via App Store Connect), aucune review Apple n'est
  requise.

Le signalement est quand même implémenté (voir _Sécurité_), non par obligation
store mais parce que l'app fait se rencontrer des inconnus.

## Connexion et profil

La connexion se fait par **« Continuer avec Apple » ou « Continuer avec Google »**.
Pas de mot de passe, pas d'inscription par email. Conséquence assumée : l'app ne
tourne plus dans Expo Go, un **build de développement EAS** est nécessaire dès le
début (voir _Stack technique_).

Le profil est volontairement pauvre : **photo, prénom, date de naissance**, et
la **ville** choisie à l'inscription. C'est tout ce que les autres membres du
groupe verront — et encore, seulement photo, prénom et âge.

### Le choix de la ville

L'utilisateur **choisit sa ville dans une liste** au **tout début de
l'inscription**, avant son profil : une seule ville est ouverte, autant le dire
avant de faire remplir quoi que ce soit. Pas de géolocalisation : le GPS répond « où es-tu maintenant », alors que la
question utile est « où veux-tu sortir le vendredi soir » — ce n'est pas la même
chose pour quelqu'un qui vient d'emménager, qui habite en périphérie ou qui rentre
chez ses parents le week-end. Une ville déclarée est aussi un critère de matching
stable et lisible, là où un rayon de 10 km découpe les groupes sur une frontière
invisible.

**Lyon est la seule ville ouverte pour le pilote, et la seule affichée.** Aucune
ville fermée n'apparaît dans la liste : l'écran annonce la couverture au lieu de
proposer des choix qui n'en sont pas. La ville est modifiable depuis le profil
(déménagement), sans effet sur les groupes déjà formés.

Conséquence : `expo-location` sort de la stack du MVP, et avec lui une permission
système à l'inscription. Voir `docs/adr/2026-08-31-matching-by-city.md` (index des
décisions : `docs/adr/INDEX.md`).

## Mécanisme principal

1. **Un créneau unique pour le MVP : le vendredi soir.** Un seul soir concentre
   les utilisateurs et permet aux groupes de se remplir. D'autres créneaux
   pourront être ajoutés quand le volume le permettra.
2. Pas d'événement ni de lieu affiché à l'avance.
3. L'utilisateur se déclare disponible sur le créneau (« je suis chaud pour
   rencontrer du monde à ce moment »), puis attend.
4. Un **algorithme forme des groupes de 3 à 6 personnes** à partir des personnes
   disponibles sur ce créneau.
5. L'algorithme **assigne à chaque groupe un lieu distinct** (bar, parc...)
   pioché dans une **liste gérée manuellement** (pas d'intégration ni de
   réservation automatique pour le MVP). Deux groupes du même soir vont dans deux
   lieux différents.

### Effectif insuffisant

S'il y a moins de monde que prévu, **on sort quand même** : un groupe de 3
personnes est formé et la soirée a lieu. Pas d'annulation, pas de report, pas de
seuil de déclenchement. Le risque assumé est qu'un désistement ramène le groupe
à 2.

## Critères de matching (MVP)

- **Âge** (critère principal)
- **Créneau choisi**
- **Ville** (choisie par l'utilisateur, une seule ouverte au pilote : Lyon)

Volontairement simple pour le MVP : pas de genre, pas de centres d'intérêt, pas
de langue, pas de personnalité.

## Déroulé d'une semaine

| Moment                     | Ce qui se passe                                                                   |
| -------------------------- | --------------------------------------------------------------------------------- |
| Samedi → jeudi 19 h        | Les utilisateurs se déclarent disponibles pour le vendredi                        |
| **Jeudi 19 h**             | Les groupes sont formés et annoncés : chacun découvre son groupe et son lieu      |
| Jeudi 19 h → vendredi 12 h | Chat de groupe ouvert, chacun confirme sa présence                                |
| Vendredi 18 h              | Rappel push : « c'est ce soir, [lieu], 20 h »                                     |
| **Vendredi 20 h**          | La rencontre a lieu                                                                |
| Samedi matin               | Une question à un tap : « tu y es allé ? »                                        |
| Après                      | Le chat du groupe **reste ouvert**                                                |

Entre le samedi et le jeudi, l'écran d'accueil n'est pas vide : il affiche un
compte à rebours jusqu'au prochain vendredi et le nombre de personnes déjà
inscrites. C'est le seul contenu de l'app pendant six jours sur sept, et il évite
que l'utilisateur oublie l'app entre deux soirées.

## Après la formation du groupe

- **Chat de groupe** ouvert entre les membres dès l'annonce du jeudi 19 h
- Chaque membre voit les profils des autres : **photo, prénom, âge** — rien
  d'autre
- Chaque invité doit **valider sa présence**
- **Deadline de validation : vendredi 12 h**
- Pas de remplacement automatique en cas de désistement/non-validation — **le
  groupe se retrouve avec qui est disponible**, même à moins de monde

### Se retrouver sur place

Il n'y a **ni réservation, ni hôte, ni signe de reconnaissance**. Le groupe se
retrouve **via le chat** (« je suis au fond à gauche »). C'est un choix assumé :
il n'existe aucun autre mécanisme, ce qui fait du chat une brique critique du MVP
et non un accessoire. C'est aussi le premier point à observer sur le terrain le
soir du premier vendredi.

### Venue effective

Rien ne force personne à venir : c'est gratuit, sans réservation, avec des
inconnus. Deux garde-fous, et pas un de plus pour le MVP :

- un **rappel push le jour J** (vendredi matin, puis 18 h) ;
- un bouton **« je ne viens plus »** qui poste automatiquement un message dans le
  chat, pour que le groupe ne reste pas à attendre quelqu'un qui ne viendra pas.

Pas de sanction, pas de blocage du vendredi suivant : on mesure d'abord le taux de
présence réel (question du samedi) avant de punir qui que ce soit.

## Après la soirée

Le **chat de groupe ne se ferme pas**. Le groupe continue d'exister et peut se
redonner rendez-vous de lui-même, sans passer par l'app.

C'est le choix le plus aligné avec la métrique de succès : ce qui doit rester
après une soirée réussie, c'est un groupe, pas un souvenir. Contrepartie connue :
au bout de plusieurs soirées, l'utilisateur accumule des chats ouverts — il
faudra prévoir une façon de les archiver.

## Sécurité

Chaque utilisateur peut **signaler un membre de son groupe**. La conséquence est
automatique et immédiate : les deux personnes ne seront **plus jamais placées
dans le même groupe**. Aucune modération manuelle n'est requise pour ce
mécanisme.

## Stack technique

- **Expo** (managed workflow) — SDK 57, React Native 0.86, React 19
- **Expo Router** pour la navigation (file-based routing)
- **TypeScript**
- Build/déploiement iOS & Android via **EAS Build**
- Modules Expo prévus : `expo-image-picker` (photo de profil),
  `expo-notifications` (rappels deadline / groupe formé),
  `expo-apple-authentication` et connexion Google. Pas d'`expo-location` : la ville
  est déclarée, pas géolocalisée
- **Build de développement EAS obligatoire** (la connexion Apple/Google ne
  fonctionne pas dans Expo Go)
- Backend : **Supabase** — Postgres, Auth (Apple + Google), Realtime pour le chat,
  Storage pour les photos, `pg_cron` pour la formation des groupes du jeudi 19 h.
  Voir `docs/adr/2026-08-31-backend-supabase.md`, et `docs/adr/INDEX.md` pour
  l'ensemble des décisions structurelles

## Hors périmètre du MVP

- **Archivage des chats de groupe** — un testeur en accumulera 4 au maximum sur la
  durée du pilote
- **Autres créneaux que le vendredi** et **toute ville autre que Lyon** — aucune
  autre ville n'est affichée à l'inscription
- **Le genre** — retiré entièrement le 2026-09-08 : ni demandé à l'inscription, ni
  stocké, ni utilisé par le matching. La préférence de genre était déjà sortie le
  2026-09-06
- **Centres d'intérêt, personnalité, langue** dans le matching
- **Remplacement automatique** en cas de désistement
- **Réservation ou partenariat avec les lieux** — la liste est du SQL à la main
- **Notation des gens ou de la soirée** — une seule question binaire le samedi
- **Écran d'administration** et **fiche store publique**

## Décisions encore ouvertes

- L'heure du rendez-vous est-elle fixe pour tout le monde (20 h) ?
- Combien de lieux dans la liste au départ, et est-ce qu'on prévient les bars ?
- Comment atteindre assez d'utilisateurs disponibles le même vendredi pour former
  des groupes (recrutement des 12 à 30 premiers testeurs). **C'est le seul point
  qui peut rendre l'app intestable :** en dessous de 6 inscrits, elle ne peut rien
  afficher
- Nom définitif de l'app (actuellement "Sortirio", provisoire)
