# PRD — US P2 : Supprimer mon compte depuis l'app

_Écrit le 2026-11-17. Source : `docs/ideas/dispo-publication-app-store.md` (P2),
interview du 2026-11-17, spec `us-7.1-signaler-un-membre.md`, migrations `bans`,
`group_messages`._

## Résumé

Un bouton « Supprimer mon compte » dans le profil. Une confirmation dit que c'est
définitif. Le compte et ses données (profil, photo, inscriptions) sont supprimés, puis
l'app revient à l'écran de connexion. Les messages restent dans les chats, signés
« Utilisateur supprimé ». Un banni qui supprime son compte ne peut pas se réinscrire
avec le même email.

## Problème

Règle App Store 5.1.1(v) : si on peut créer un compte dans l'app, on doit pouvoir le
supprimer dans l'app. Sans ça, l'app est refusée.

## Objectif

Qu'un utilisateur supprime son compte seul, depuis l'app, sans écrire à personne.

**Succès :**

- le compte, le profil, la photo et les inscriptions n'existent plus ;
- les chats restent lisibles ;
- un banni ne revient pas avec le même email.

## Exigences fonctionnelles

### Le bouton et la confirmation

1. Le profil (`my-profile`) a un bouton **« Supprimer mon compte »**, en bas, sobre
   (pas le bouton principal de l'écran).
2. Il ouvre une confirmation : « Supprimer mon compte ? C'est définitif. Ton profil, ta
   photo et tes inscriptions seront effacés. Tes messages restent dans les chats, sous
   « Utilisateur supprimé ». » Boutons : « Annuler » et « Supprimer » (destructif).
3. Annuler ne fait rien.
4. Pendant la suppression, les boutons sont désactivés. Une erreur affiche « La
   suppression n'a pas abouti. Réessaie. » et le compte reste intact.

### Ce qui est supprimé

5. Le profil, la photo (le fichier dans le bucket `profile-photos`), les
   inscriptions (`availabilities`), les appartenances aux groupes (`group_members`),
   les signalements faits et reçus (`reports`), et le compte d'authentification.
6. Après la suppression, l'app **se déconnecte** et affiche l'écran de connexion.
7. Se reconnecter avec le même email (non banni) crée un **nouveau compte vide** :
   onboarding normal.

### Ce qui reste

8. Les **messages** restent dans les chats, avec leur texte et leur heure. **Supprimer un
   utilisateur ne doit jamais supprimer ses messages** : aujourd'hui
   `group_messages.author_id` est en `on delete cascade`, ce qui les efface. Il faut
   changer ça (voir _Données_), sinon l'exigence est fausse.
9. L'auteur d'un message supprimé s'affiche **« Utilisateur supprimé »**, avec un
   **avatar vide** à la place de la photo. Même chose dans la liste des groupes (dernier
   message). Aujourd'hui l'app affiche « Un membre » (`message-bubble.tsx`, `myGroups.ts`) :
   le libellé change.
10. Les autres membres voient le chat comme avant. Le membre supprimé n'apparaît plus
    dans la liste des membres du groupe.

### Les bannis

11. La table `bans` **reste**. Elle garde l'**email** du banni, et non plus seulement
    l'id du compte (l'id change à chaque nouveau compte).
12. Supprimer le compte d'un banni **ne supprime pas** sa ligne dans `bans`.
13. Une nouvelle inscription avec un email présent dans `bans` est **refusée** (Apple ou
    Google), la comparaison se fait en minuscules.
14. Seuls les bannis sont tracés. L'email d'une personne non bannie n'est gardé nulle
    part après sa suppression.

## Données — ce qu'il faut changer

| Table / objet                | Aujourd'hui                                          | Changement                                                                                             |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `group_messages.author_id`   | `not null`, `on delete cascade` : **supprime les messages** | nullable, `on delete set null`. `null` = utilisateur supprimé                                          |
| `bans`                       | `user_id` clé primaire, `on delete cascade` : **efface le ban** | colonne `email` (not null, rempli depuis `auth.users` ; ligne existante rattrapée), `user_id` nullable, `on delete set null`, clé primaire sur `id` ou `email` |
| `report_member()`            | insère `user_id`                                     | insère aussi l'email de la cible                                                                        |
| Refus à l'inscription        | **n'existe pas** : l'exigence 16 de la story 7.1 n'est pas livrée (hook commenté dans `supabase/config.toml`, aucune migration) | hook Auth `before_user_created` (fonction Postgres) qui refuse un email présent dans `bans`             |
| Suppression                  | n'existe pas                                         | fonction `delete_my_account()` (`security definer`), voir ci-dessous                                    |
| `get_my_groups()`, trigger push | — | rien à changer : le dernier message joint le profil en `left join`, et le trigger ne tourne qu'à l'insertion, donc l'auteur existe |

Les autres tables (`profiles`, `availabilities`, `group_members`, `reports`) ont déjà
`on delete cascade` vers `auth.users` : supprimer l'utilisateur suffit.

## Décisions techniques

| Sujet                 | Choix                                                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Suppression du compte | Fonction Postgres `delete_my_account()`, `security definer`, `search_path = ''`, qui fait `delete from auth.users where id = auth.uid()`. Pas d'Edge Function : il n'y en a aucune dans le projet |
| Photo                 | Supprimée **côté app d'abord**, par l'API Storage (la policy `profile_photos_delete_own` existe). Un `delete` SQL sur `storage.objects` laisserait le fichier orphelin dans le stockage     |
| Ordre                 | 1) supprimer la photo, 2) appeler `delete_my_account()`, 3) `supabase.auth.signOut()`. Si 1 échoue : stop, compte intact. Si 2 échoue : réessayer marche, supprimer une photo absente passe |
| Retour à la connexion | Le routage existant (`destination.ts`) renvoie vers la connexion dès qu'il n'y a plus de session. Rien à ajouter                                                                            |
| Affichage de l'auteur | Dans le chat, l'auteur est cherché par `authorId` parmi les membres. `authorId` `null` → « Utilisateur supprimé » et avatar vide. Auteur non `null` mais absent des membres (retiré du groupe) → « Un membre », inchangé. Une seule constante partagée par le chat et la liste des groupes       |
| Avatar vide           | Le composant d'avatar existant sans photo. À vérifier à l'implémentation : sinon, un cercle gris                                                                                             |
| Refus de réinscription | Hook `before_user_created`. Message d'erreur neutre : ne dit pas « banni »                                                                                                                  |

## Structure des fichiers (indicatif)

```
supabase/migrations/
  <date>_group_messages_author_set_null.sql
  <date>_bans_keep_email.sql              ← email, user_id nullable, report_member() à jour
  <date>_block_banned_email_at_signup.sql ← fonction du hook
  <date>_delete_my_account.sql
supabase/config.toml                      ← [auth.hook.before_user_created] activé
mobile/src/features/profile/
  helpers/deleteMyAccount/deleteMyAccount.ts   ← photo, RPC, signOut
  components/delete-account-button/            ← bouton + confirmation
mobile/src/features/chat/                 ← auteur absent = « Utilisateur supprimé »
```

## Tests

- **Automatisé** : le helper de chat (`groupMessages`) avec `author_id` `null` ;
  la règle « auteur absent » du chat. Tests SQL dans `supabase/tests/` : après
  `delete_my_account()`, les messages restent avec `author_id` null, la ligne `bans`
  reste avec son email, un email banni est refusé au `before_user_created`.
- **Manuel**, sur iPhone :
  1. Profil → Supprimer → Annuler : rien ne change
  2. Supprimer → confirmer : écran de connexion
  3. Un autre compte voit le chat : messages gardés, « Utilisateur supprimé », avatar vide
  4. Se reconnecter avec le même email : onboarding vide
  5. Banni : supprimer son compte, puis se réinscrire avec le même email : refusé
  6. Coupure réseau pendant la suppression : message d'erreur, compte intact

## Limites

- **Toujours** : `npm run lint`, `npm run typecheck` et `npm test` avant de commiter.
- **Demander d'abord** : toute Edge Function ou dépendance nouvelle.
- **Jamais** : laisser un `on delete cascade` du compte vers `group_messages` ; toucher `docs/SPEC.md` ; garder l'email d'une personne non bannie ;
  supprimer les messages.

## Hors périmètre

- **Révoquer le jeton Apple** : c'est P3.
- **Les signalements reçus** : supprimés avec le compte. 1 signalement + suppression =
  on repart de zéro. Accepté.
- **Un banni qui revient avec un autre email** ou un autre compte Google : pas bloqué.
  Accepté en V1. Apple « Masquer mon e-mail » donne une adresse relais stable : le
  blocage tient pour le même identifiant Apple.
- **Délai de grâce**, récupération du compte, export des données.
- **Supprimer les messages** d'un compte supprimé.
- **La page Politique de confidentialité** : c'est P4.

## Risques / questions ouvertes

- **Le blocage de l'email à l'inscription est une décision structurelle** (hook Auth).
  La story 7.1 l'a déjà signalé. Record écrit en `proposed` :
  `docs/adr/2026-11-17-block-banned-email-at-signup.md`. En attente de Colin.
- **P3 va probablement imposer une Edge Function** : la révocation Apple appelle une API
  avec une clé secrète. Le plus simple aujourd'hui est la fonction SQL ; P3 la
  remplacera alors par une Edge Function. Alternative : faire l'Edge Function dès P2,
  plus lourd maintenant mais pas de réécriture. **Recommandation : SQL maintenant.**
- **Les groupes passés** perdent le membre supprimé dans leur liste (cascade sur
  `group_members`). Les tailles affichées peuvent baisser. Accepté.
- **Un `delete` sur `auth.users` depuis une fonction `definer`** doit être vérifié sur
  le projet Supabase réel (droits du propriétaire de la fonction).

## Critères de réussite

1. Depuis le profil, un utilisateur supprime son compte et arrive sur la connexion.
2. Plus aucune ligne de profil, d'inscription, de signalement ni de fichier photo à son nom.
3. Ses messages restent, signés « Utilisateur supprimé », avatar vide.
4. Un banni qui supprime son compte ne peut pas se réinscrire avec le même email.
5. `npm run lint`, `npm run typecheck` et `npm test` passent.
