# PRD — US3 (retours phase 1) : l'inscription Google demande deux passages sur iOS

_Écrit le 2026-11-13. Source : `docs/ideas/dispo-retours-phase1.md` (US3),
entretien avec Colin du même jour, spec `us-1.1-connexion.md`._

## Statut — non reproduit (2026-11-13)

Vu une seule fois : 1er lancement de l'app via TestFlight sur iPhone, avec mot de passe
Google et validation dans Google Photos. Trois essais de reproduction, tous réussis du
premier coup :

1. Build de dev, nouveau compte Google jamais utilisé sur Dispo → écarte « nouveau
   compte Supabase ».
2. TestFlight sur iPhone, app supprimée et réinstallée, cookies Google de Safari
   supprimés, mot de passe et validation dans Google Photos → écarte « sortie de l'app
   pendant la validation » (piste 2), dans ces conditions.
3. Lecture du code : piste 3 peu probable (la page de connexion ne s'affiche qu'après
   `INITIAL_SESSION`) ; piste 1 possible seulement sur une erreur réseau ou d'auth
   (aucun trigger sur `auth.users`).

Rien n'est corrigé : sans cause connue, une correction serait une supposition. Si le
bug revient, noter avant le 2ᵉ essai le « Last signed in » du compte dans Supabase :
s'il vient de changer → piste 1 ; sinon → piste 2.

## Le bug

Un tout nouvel utilisateur iOS (installation neuve, aucun compte Dispo) :

1. ouvre l'app → page de connexion ;
2. appuie sur « Continuer avec Google », choisit son compte → **retour sur la page
   de connexion, sans aucun message** ;
3. refait Google → arrive sur la création de profil.

Le premier contact avec l'app échoue en silence. C'est le pire endroit pour un bug :
le nouvel arrivant peut croire que l'app ne marche pas et partir.

## Ce qu'on sait

- **Google ne renvoie pas d'erreur** : sinon `login.tsx` afficherait « La connexion
  n'a pas abouti. Réessaie. ». `signInWithGoogle()` se termine donc sans lever
  d'exception (succès, ou `'cancelled'`).
- Supabase stocke la session dans `expo-sqlite/kv-store`, effacé à la suppression
  de l'app : pas de vieille session qui traîne à l'installation.
- Observé à la toute première installation. Pas encore testé sur Android.

## Pistes à vérifier (dans cet ordre)

1. **Déconnexion silencieuse après la connexion.** `session-provider.tsx` : sur
   l'événement `SIGNED_IN`, `resolve()` appelle `getUser()`, puis
   `isAccountBanned()` et `hasProfile()`. Si l'un échoue, `abandonSession()`
   déconnecte sans rien afficher. Un compte qui vient d'être créé pourrait faire
   échouer l'un de ces appels au premier passage seulement (trigger côté base pas
   encore passé, RPC `am_i_banned`, etc.).
2. **`signInWithGoogle()` renvoie `'cancelled'` au premier passage.** La toute
   première fois, iOS affiche la fenêtre « Dispo veut utiliser google.com pour se
   connecter ». Si ce passage est vu comme une annulation, aucune session n'est
   créée et aucun message n'apparaît, ce qui colle au symptôme.
3. **Événements d'auth dans le désordre.** Chaque événement lance un `resolve()`
   asynchrone, sans garde d'ordre : un `resolve()` lent et plus ancien peut
   écraser l'état d'un plus récent. Le passage arrière-plan → premier plan pendant
   la fenêtre Google (`startAutoRefresh` dans `supabase.ts`) peut ajouter des
   événements.

Pour trancher : logger l'événement reçu par `onAuthStateChange`, la valeur
renvoyée par `signInWithGoogle()`, et toute erreur avant `abandonSession()`, puis
reproduire sur une installation neuve.

## Reproduire

1. Supprimer l'app de l'iPhone (ou du simulateur).
2. Supprimer le compte de test dans Supabase (`auth.users`), pour repartir de zéro.
3. Installer, ouvrir, « Continuer avec Google ».

À faire 3 fois pour savoir si le bug revient à chaque installation neuve.

## Critères de réussite

1. Installation neuve, compte inexistant : **un seul** passage par Google mène à la
   création de profil.
2. Vérifié 3 fois de suite sur iOS, en partant de zéro à chaque fois.
3. Si la connexion échoue vraiment, un message s'affiche : plus aucun échec silencieux
   sur la page de connexion.
4. Les cas de `us-1.1-connexion.md` marchent toujours (fenêtre Google refermée →
   aucun message ; réseau coupé → message d'erreur).
5. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Hors périmètre

- Les comptes existants qui se reconnectent.
- La déconnexion via le bouton « Se déconnecter ».
- Android : à vérifier au passage, pas à corriger ici sauf si c'est le même bug.

## Questions ouvertes

1. Le bug arrive-t-il à chaque installation neuve, ou seulement parfois ?
2. Vu sur TestFlight, en build de développement, ou les deux ?
