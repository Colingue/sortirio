# Publication App Store — exigences Apple

Source : [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (révision du 16 octobre 2026).
Les US P1 à P8 bloquent la validation Apple. P9 et P10 sont des tâches dans App Store Connect, sans code.

## ✅ P1 — Se connecter avec Apple (iOS)

Règle 4.8 : si l'app propose Google, elle doit aussi proposer une connexion qui permet de cacher son email. Sign in with Apple remplit cette condition.
Ajouter le bouton « Continuer avec Apple » sur l'écran de connexion iOS, au-dessus ou à côté de Google, avec la même taille. Créer ou connecter le compte via Supabase Auth (fournisseur Apple).
Apple ne donne le nom qu'à la première connexion : le garder à ce moment-là. Si l'utilisateur cache son email, on reçoit une adresse relais `@privaterelay.appleid.com` qui doit fonctionner normalement.

## 🚧 P2 — Supprimer mon compte depuis l'app

Règle 5.1.1(v) : si on peut créer un compte dans l'app, on doit pouvoir le supprimer dans l'app.
Ajouter « Supprimer mon compte » dans le profil, avec une confirmation claire (« c'est définitif »). Supprimer le compte et ses données (profil, photos, inscriptions), puis revenir à l'écran de connexion.
Les messages restent dans les chats. L'auteur s'affiche « Utilisateur supprimé », avec un avatar vide à la place de sa photo.
On garde une trace des personnes bannies, pour qu'elles ne puissent pas revenir en recréant un compte.

## P3 — Révoquer l'accès Apple à la suppression du compte

Règle 5.1.1(v) : quand un compte créé avec Apple est supprimé, il faut révoquer son jeton via l'API REST de Sign in with Apple.
Dépendances : P1, P2. Côté serveur (fonction Supabase), au moment de la suppression.

## P4 — Politique de confidentialité

Règle 5.1.1 : un lien dans la fiche App Store **et** dans l'app.
Écrire et héberger une page : données collectées (profil, photo, âge, messages, notifications), à quoi elles servent, prestataires (Supabase, Google, Apple, Expo), durée de conservation, comment supprimer son compte.
Ajouter le lien dans le profil et sur l'écran de connexion.

## P5 — Page support et contact

Règle 1.2 : un contact visible pour les utilisateurs. La fiche App Store demande aussi une URL de support.
Héberger une page support avec un email de contact. Ajouter « Nous contacter » dans le profil.

## P6 — Filtrer les messages choquants dans le chat

Règle 1.2 : l'app doit filtrer le contenu choquant avant qu'il soit publié.
Bloquer ou masquer les messages qui contiennent des insultes ou des mots d'une liste interdite. Une simple liste suffit pour la v1.

## P7 — Bloquer un membre

Règle 1.2 : on doit pouvoir bloquer un utilisateur abusif.
Le signalement (US 7.1) empêche déjà de se retrouver dans le même groupe. À vérifier : est-ce que ça suffit à Apple ? Sinon, masquer aussi ses messages dans le groupe en cours pour la personne qui a signalé.

## P8 — Compte de démo pour la revue Apple

Règle 2.1 : Apple doit pouvoir tester toute l'app avec un compte fourni.
Créer un compte email/mot de passe (ou équivalent) réservé à la revue, déjà dans un groupe formé, avec des messages dans le chat, sans dépendre du jeudi 19 h. Le serveur doit rester en ligne pendant la revue.

## P9 — Fiche App Store (sans code)

Dans App Store Connect : nom, sous-titre, description qui insiste sur « amis, pas rencontres amoureuses », mots-clés, captures iPhone 6.9", catégorie Réseaux sociaux, questionnaire d'âge (viser 17+ ou 18+), fiche « App Privacy », URL confidentialité (P4) et support (P5).

## P10 — TestFlight externe puis soumission (sans code)

1. `eas build -p ios --profile production` puis `eas submit -p ios`.
2. Groupe de testeurs externes avec lien public. Le premier build de chaque version passe une revue Apple (24 à 48 h). Un build expire 90 jours après l'envoi.
3. Soumettre pour revue avec les identifiants de P8 et une note qui explique l'app. Publication manuelle.

## Points ouverts

- P7 : le signalement suffit-il comme « blocage » aux yeux d'Apple ? À voir plus tard.
- P8 : le compte de démo a un groupe déjà formé. Reste à trouver comment le garder actif quel que soit le jour de la revue (par exemple un groupe de démo qui ne passe jamais dans « Passés »).
- Android / Play Store : pas couvert ici (pas de Sign in with Apple, mais la suppression de compte et la politique de confidentialité sont aussi demandées par Google).
