# Sortirio — MVP

_Issu de la session d'idéation du 2026-08-31. Ce document fige la direction et les
paris ; la spec produit détaillée vit dans `docs/SPEC.md`._

## Problème

Comment permettre à quelqu'un qui vient d'emménager de se retrouver, sans effort, à
une table avec 3 à 5 inconnus de son âge un vendredi soir — et d'en ressortir avec un
groupe qui continue sans l'app.

## Direction retenue

L'app ne vend pas un événement, elle vend **une décision en un tap** : « vendredi, je
suis chaud ». Tout le reste est fait par le système. L'utilisateur ne choisit ni les
gens, ni le lieu, ni l'heure — c'est précisément ce qui supprime l'effort et la
comparaison.

Deux choses portent l'expérience et méritent le meilleur du mois de développement :
**le chat de groupe**, parce que c'est lui qui fait que 5 inconnus se retrouvent
réellement dans le bar (on n'a rien d'autre : pas de réservation, pas d'hôte), et **la
notification du jeudi soir**, le seul moment où l'app existe vraiment.

Le reste est délibérément pauvre : profil réduit à photo / prénom / âge, matching sur
l'âge seul, lieux gérés en SQL à la main.

## Déroulé d'une semaine

| Moment                     | Ce qui se passe                                                              |
| -------------------------- | ---------------------------------------------------------------------------- |
| Samedi → jeudi 19 h        | On se déclare dispo. L'accueil montre un compte à rebours et le nombre d'inscrits |
| **Jeudi 19 h**             | L'algo forme les groupes, attribue un lieu à chacun, envoie une notification  |
| Jeudi 19 h → vendredi 12 h | Chacun confirme sa présence. Le chat est ouvert                               |
| Vendredi 18 h              | Rappel push : « c'est ce soir, [lieu], 20 h »                                 |
| **Vendredi 20 h**          | La rencontre. Le groupe se retrouve via le chat                               |
| Samedi matin               | Une question, un tap : « tu y es allé ? »                                     |
| Après                      | Le chat reste ouvert                                                          |

## Périmètre du MVP

**Compte & profil** — connexion Apple / Google · photo, prénom, date de naissance,
genre · **ville choisie dans une liste** à
l'inscription (Lyon seule ouverte, les autres en « bientôt ») · modification du
profil. Pas de géolocalisation : la question utile est « où veux-tu sortir », pas
« où es-tu maintenant ».

**Se déclarer dispo** — un écran, un bouton pour le prochain vendredi · annulable
jusqu'au jeudi 19 h · écran d'attente avec compte à rebours et nombre d'inscrits.

**Formation des groupes** — tâche planifiée le jeudi à 19 h (aucun écran) · groupes de
3 à 6 par ville et âge · exclusion des paires signalées · un lieu
distinct par groupe, tiré d'une table remplie à la main · notification push.

**Le groupe** — écran avec lieu, adresse, heure et membres (photo, prénom, âge) ·
bouton « je confirme » · bouton « je ne viens plus » qui poste automatiquement dans le
chat · chat temps réel · rappels push le vendredi matin et à 18 h.

**Sécurité** — signaler un membre : les deux ne seront plus jamais placés dans le même
groupe. Automatique, sans modération manuelle.

**Mesure** — la question du samedi (taux de présence réel) et le fait de reposer une
dispo dans les 3 semaines.

## Ce qu'on ne fait pas

- **Archivage des chats** — un testeur en accumulera 4 au maximum sur le pilote.
- **Autres créneaux que le vendredi, autres villes que Lyon** — le volume d'utilisateurs
  ne le permet pas. Les autres villes sont listées mais fermées, juste pour savoir où
  la demande existe.
- **Centres d'intérêt, personnalité, langue** — si les soirées marchent avec l'âge seul,
  on a la réponse ; sinon on saura quoi ajouter.
- **Remplacement automatique en cas de désistement** — le groupe sort avec qui reste.
- **Réservation ou partenariat avec les bars** — la liste de lieux est du SQL à la main.
- **Noter les gens ou la soirée** — une seule question binaire, pas de système de
  réputation.
- **Écran d'administration, fiche store publique, connexion par email** — hors sujet sur
  un mois.

## Les paris à vérifier

- [ ] **Les gens viennent vraiment.** Le pari le plus risqué : c'est gratuit, sans
      réservation, avec des inconnus. → la question du samedi donne le chiffre dès le
      premier vendredi.
- [ ] **Un chat suffit pour se retrouver dans un bar bondé.** → être sur place au premier
      vendredi et observer.
- [ ] **L'âge seul suffit à composer un groupe qui accroche.** → si les gens reposent une
      dispo, c'est validé.
- [ ] **Le chat survit à la soirée.** → regarder s'il y a des messages le lundi suivant.

**Ce qui peut tuer le projet, et ce n'est pas technique :** ne pas réunir 12 personnes
disponibles le même vendredi. En dessous de 6, l'app ne peut littéralement rien
afficher. À régler _avant_ d'écrire du code, pas après.

## Questions encore ouvertes

- L'heure du rendez-vous est-elle fixe pour tout le monde (20 h) ?
- Combien de lieux dans la liste au départ, et est-ce qu'on prévient les bars ?
- Le nom de l'app.
