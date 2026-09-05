# Spec — US 1.1 : Connexion en un tap avec Google

_Écrit le 2026-09-02. Source : `docs/ideas/sortirio-user-stories.md` (story 1.1),
`docs/SPEC.md`, et les records `2026-08-31-backend-supabase`,
`2026-08-30-mobile-stack-expo`._

## Hypothèses (à corriger maintenant, sinon je pars là-dessus)

1. Le projet Supabase existe déjà et `mobile/.env.local` est rempli (le client
   `src/lib/supabase.ts` lève une erreur au démarrage sinon).
2. Il n'y a pas encore de compte Expo / EAS ni de projet Google Cloud : les deux
   sont à créer, gratuitement, pendant cette story.
3. Le téléphone de test est un **Android physique**. L'émulateur suffit pour tout
   sauf la connexion Google, qui a besoin des Google Play Services.
4. Le template Expo présent dans `mobile/src/app` (`index.tsx`, `explore.tsx`,
   les onglets, la splash animée au logo Expo) est **jetable** : cette story le
   remplace par la vraie navigation.
5. La table `profiles` est créée ici avec les colonnes que les stories 1.2 et 1.3
   décrivent déjà — une migration au lieu de trois. La 1.1 n'y **lit** que
   l'existence de la ligne.

## Objectif

Un nouvel arrivant ouvre l'app, appuie sur un bouton, et se retrouve au bon
endroit — sans mot de passe, sans email, sans écran intermédiaire.

C'est la première story à faire tourner sur un vrai téléphone : elle est la seule
qui dépende d'une chaîne d'identifiants externes (Google Cloud, empreinte de
signature Android, build EAS). Découvrir au jour 20 que la signature Android ne
passe pas tuerait le pilote ; c'est pour ça qu'elle est en tête.

### Dans le périmètre

- Le bouton « Continuer avec Google » et la session Supabase qu'il ouvre.
- Le **routage de démarrage** : trois destinations, écran de démarrage maintenu
  tant que la destination n'est pas connue.
- La table `profiles` et ses politiques RLS (le routage a besoin de savoir si la
  ligne existe).
- La configuration qui rend tout ça possible : Google Cloud, provider Google dans
  Supabase, `eas.json`, build de développement.
- Le remplacement de la navigation du template Expo par les vrais groupes de
  routes.

### Hors périmètre

- Le contenu des écrans d'inscription (stories 1.2 et 1.3) et de l'accueil
  (story 2.1) : ici, ce sont des écrans vides qui servent à vérifier le routage.
- « Continuer avec Apple », déconnexion, suppression de compte.
- **L'APK autonome envoyé aux testeurs.** Il ne sert que le jour où l'app part
  chez quelqu'un d'autre, en fin de pilote. Le profil `preview` sera ajouté à ce
  moment-là, pas ici.
- Les notifications et la permission associée.

## Décisions techniques

| Sujet               | Choix                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Bibliothèque Google | `@react-native-google-signin/google-signin` — jeton d'identité natif, pas de redirection web                                          |
| Remise à Supabase   | `supabase.auth.signInWithIdToken({ provider: 'google', token })`                                                                      |
| Identifiants Google | un client **Web** (celui que Supabase et Android utilisent) + un client **Android** (nom de package + empreinte SHA-1 issue d'EAS)    |
| Session             | déjà en place : `expo-sqlite/kv-store` + `autoRefreshToken` dans `src/lib/supabase.ts`                                                |
| Routage             | `Stack.Protected guard={…}` d'expo-router, dans le layout racine — pas de `router.replace` impératif                                  |
| Écran de démarrage  | `SplashScreen.preventAutoHideAsync()` puis `hideAsync()` quand la destination est connue ; la splash animée du template est supprimée |
| Décision de routage | une fonction pure `destinationFor()`, testée unitairement                                                                             |

## Commandes

```bash
# mobile/
npm run start                 # Metro pour le build de développement
npm run android               # lance sur l'appareil connecté
npm run lint                  # ESLint
npm run format:check          # Prettier
npm run typecheck             # tsc --noEmit  (script à ajouter)
npm test                      # jest-expo     (à ajouter, voir Tests)

# builds
npx eas build --profile development --platform android  # le seul build de cette story
npx eas credentials --platform android                  # lire l'empreinte SHA-1

# base de données (à la racine du dépôt)
npx supabase migration new profiles
npx supabase db push
```

## Structure des fichiers

```
mobile/
  eas.json                            ← nouveau : profil development uniquement
  app.json                            ← android.package, plugin google-signin
  src/app/
    _layout.tsx                       ← providers + Stack.Protected + splash
    (auth)/login.tsx                  ← le bouton, et rien d'autre
    (onboarding)/profile.tsx          ← vide (story 1.2)
    (onboarding)/city.tsx             ← vide (story 1.3)
    (app)/index.tsx                   ← vide (story 2.1)
  src/lib/
    supabase.ts                       ← inchangé
    auth/session-provider.tsx         ← contexte : session + hasProfile + status
    auth/google.ts                    ← signInWithGoogle()
    auth/destination.ts               ← fonction pure + son test
supabase/
  config.toml                         ← nouveau (npx supabase init)
  migrations/<horodatage>_profiles.sql
```

**Supprimés** : `src/app/index.tsx`, `src/app/explore.tsx`,
`src/components/app-tabs*.tsx`, `hint-row.tsx`, `web-badge.tsx`,
`external-link.tsx`, `animated-icon*`, `ui/collapsible.tsx` — décor du template.

## Style de code

La logique de routage est une fonction pure, pour qu'elle soit lisible et
testable sans téléphone :

```ts
// src/lib/auth/destination.ts
export type Destination = "login" | "onboarding" | "home";

export function destinationFor(state: {
  session: Session | null;
  hasProfile: boolean;
}): Destination {
  if (!state.session) return "login";
  return state.hasProfile ? "home" : "onboarding";
}
```

L'annulation n'est pas une erreur, et ça se voit dans le code :

```ts
// src/lib/auth/google.ts
export async function signInWithGoogle(): Promise<"signed-in" | "cancelled"> {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (response.type === "cancelled") return "cancelled";

  const idToken = response.data.idToken;
  if (!idToken) throw new Error("Google n'a pas renvoyé de jeton d'identité.");

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
  if (error) throw error;
  return "signed-in";
}
```

Conventions : fichiers en `kebab-case`, TypeScript strict, pas de `any`, imports
via l'alias `@/`, tout le texte affiché en français.

## Base de données

```sql
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  birthdate date not null,
  gender text not null,
  photo_path text not null,
  city text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
```

Toutes les colonnes sont `not null` : une ligne `profiles` ne peut donc pas
exister à moitié, ce qui est exactement la règle « rien n'est écrit avant le
dernier bouton » des stories 1.2 et 1.3.

_Mise à jour du 2026-09-05 : la colonne `gender_preference` a été retirée de cette
migration, la préférence de genre étant sortie du MVP._

La lecture faite par le routage :

```ts
const { data } = await supabase
  .from("profiles")
  .select("id")
  .eq("id", userId)
  .maybeSingle();
const hasProfile = data !== null;
```

## Tests

- **Automatisé** : `jest-expo`, et trois tests sur `destinationFor` — pas de
  session, session sans profil, session avec profil. C'est la seule vraie logique
  de la story, et c'est celle qui produit le bug du « flash de l'écran de
  connexion ». Trois tests, un fichier, aucune infrastructure.
- **Manuel, sur un Android physique**, une case par critère d'acceptation :
  1. app fraîchement installée → un seul bouton
  2. connexion → arrivée sur l'inscription
  3. app tuée puis relancée **avec du réseau** → arrivée directe sur
     l'inscription, **sans voir l'écran de connexion**
  4. inscription abandonnée → on repart de son début, écrans vides
  5. fenêtre Google refermée → écran de connexion inchangé, aucun message
  6. mode avion au démarrage → retour à l'écran de connexion ; un tap sur le
     bouton y affiche le message d'erreur avec « Réessayer »
  7. utilisateur supprimé depuis Supabase → retour à l'écran de connexion

Pas d'autre test automatisé dans cette story : le reste est de la configuration
externe, qu'aucun test local ne peut valider.

## Limites

- **Toujours** : `npm run lint`, `npm run typecheck` et `npm test` avant de
  commiter ; RLS activée dans la **même** migration que la table ; tout secret
  passe par `.env.local`.
- **Demander d'abord** : ajouter une dépendance hors de celles listées ici ;
  toucher à `app.json` (plugins, package) ; modifier un record de `docs/adr/`.
- **Jamais** : commiter `.env.local` ou un secret client Google ; mettre une clé
  `service_role` dans l'app mobile ; créer une table sans RLS ; supprimer un test
  qui échoue.

## Critères de réussite

La story est finie quand, sur ton Android physique avec le build de
développement :

1. Une installation neuve affiche un unique bouton « Continuer avec Google ».
2. Un tap ouvre le sélecteur de comptes Google natif, et le retour crée une
   session Supabase visible dans la table `auth.users`.
3. Relancer l'app après l'avoir tuée ne fait jamais apparaître l'écran de
   connexion à quelqu'un qui a une session, **tant que le serveur répond**. Si le
   serveur est injoignable, la session est abandonnée et on repart de l'écran de
   connexion : c'est le seul endroit où l'app sait afficher « Réessayer ».
4. Les trois destinations sont atteignables et il n'en existe pas de quatrième.
5. Refermer la fenêtre Google ne produit aucun message d'erreur ; couper le
   réseau en produit un, avec « Réessayer ».
6. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Questions ouvertes

1. ~~**Nom de package Android.**~~ **Tranché le 2026-09-02 : `com.sortirio.app`**,
   écrit dans `mobile/app.json`. Il est figé dans l'empreinte de signature Google :
   le changer plus tard oblige à reconfigurer le client Android.
2. **`jest-expo`** ajoute une dépendance de développement et un fichier de
   configuration. Je le recommande pour les trois tests ci-dessus ; si tu préfères
   zéro outillage de test au mois 1, la story tient quand même avec la seule
   checklist manuelle.
3. **Message d'erreur** : un bandeau dans l'écran de connexion, ou une boîte de
   dialogue système ? Je pars sur un texte sous le bouton, plus discret et plus
   simple.
