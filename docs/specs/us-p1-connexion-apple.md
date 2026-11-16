# Spec — US P1 : Se connecter avec Apple (iOS)

_Écrit le 2026-11-16. Source : `docs/ideas/dispo-publication-app-store.md` (P1),
interview du 2026-11-16, record `2026-08-31-backend-supabase` (Auth Apple/Google),
spec `us-1.1-connexion.md`._

## Objectif

Passer la règle 4.8 de l'App Store : l'app propose Google, elle doit aussi proposer
une connexion qui permet de cacher son email. Sign in with Apple remplit cette
condition.

Une connexion Apple doit se comporter exactement comme une connexion Google : même
session Supabase, même routage, même onboarding.

### Dans le périmètre

- Le bouton natif « Continuer avec Apple » sur l'écran de connexion, **iOS seulement**.
- La session Supabase qu'il ouvre (`signInWithIdToken`, fournisseur `apple`).
- La configuration : capacité Sign in with Apple, fournisseur Apple dans Supabase.

### Hors périmètre

- **Android** : garde seulement Google.
- **Le nom envoyé par Apple** : il est ignoré. Le prénom vient toujours de
  l'onboarding, où la personne le tape.
- **La liaison des comptes Google et Apple** : une même personne qui utilise les
  deux boutons avec un email caché a deux comptes séparés. C'est accepté. Si
  l'email Apple n'est pas caché et que c'est le même que celui de Google, Supabase
  relie déjà les deux comptes tout seul.
- **La révocation du jeton Apple à la suppression du compte** : c'est P3.

## Comportement

1. Sur iOS, l'écran de connexion affiche deux boutons : Apple au-dessus, Google
   en dessous, à la même hauteur (54) et avec le même arrondi.
2. Un tap sur Apple ouvre la feuille système Apple. La personne peut cacher son
   email.
3. Au retour, la session Supabase est créée, et le routage existant prend le
   relais : pas de profil, donc direction l'onboarding.
4. Une adresse relais `@privaterelay.appleid.com` est un email comme un autre :
   rien dans l'app ne la traite à part.
5. Fermer la feuille Apple, c'est une annulation, pas une erreur : l'écran reste
   tel quel, sans message.
6. Toute autre erreur affiche le message existant « La connexion n'a pas abouti.
   Réessaie. »
7. Pendant la connexion (`busy`), les deux boutons sont désactivés.

## Décisions techniques

| Sujet              | Choix                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Bibliothèque       | `expo-apple-authentication` (`npx expo install`), seule nouvelle dépendance                                                                    |
| Bouton             | `AppleAuthenticationButton` natif, `buttonType` `CONTINUE`, `buttonStyle` `BLACK`, `cornerRadius` = `Radius.medium`, hauteur 54                |
| Affichage          | `Platform.OS === 'ios'` : le bouton n'existe pas sur Android                                                                                   |
| Portée demandée    | `EMAIL` seulement. `FULL_NAME` n'est pas demandé, puisque le nom est ignoré                                                                     |
| Remise à Supabase  | `supabase.auth.signInWithIdToken({ provider: 'apple', token: credential.identityToken })`                                                      |
| Annulation         | erreur au code `ERR_REQUEST_CANCELED`, traduite en `'cancelled'`, comme Google                                                                  |
| Config Expo        | plugin `expo-apple-authentication` dans `app.json`, puis `npx expo prebuild` (voir mémoire : `npm run ios` n'applique pas les plugins seul)    |
| Supabase           | Auth → Providers → Apple activé, **Client IDs** = `com.colingue.dispo.dev`, le seul bundle ID iOS (dev et App Store). Pas de clé secrète : le flux est natif seulement |
| Apple Developer    | capacité Sign in with Apple sur l'App ID. EAS la synchronise au build quand le plugin est présent                                              |

## Structure des fichiers

```
mobile/
  app.json                                          ← plugin expo-apple-authentication
  package.json                                      ← expo-apple-authentication
  assets/images/google-logo.png                     ← nouveau : logo « G » officiel
  src/app/(auth)/login.tsx                          ← bouton Apple au-dessus de Google, relook Google
  src/features/auth/helpers/signInWithApple/
    signInWithApple.ts                              ← nouveau, même forme que signInWithGoogle
```

## Style de code

Même forme que `signInWithGoogle`, même type de retour :

```ts
// src/features/auth/helpers/signInWithApple/signInWithApple.ts
import * as AppleAuthentication from 'expo-apple-authentication';

import { supabase } from '@/lib/supabase';

export async function signInWithApple(): Promise<'signed-in' | 'cancelled'> {
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return 'cancelled';
    throw error;
  }

  if (!credential.identityToken) throw new Error("Apple n'a pas renvoyé de jeton d'identité.");

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });
  if (error) throw error;
  return 'signed-in';
}
```

Dans `login.tsx`, la fonction `signIn` prend le fournisseur en paramètre, pour
partager `busy` et `failed` entre les deux boutons.

## Tests

- **Automatisé** : aucun. Le helper ne contient qu'un appel natif et un appel
  Supabase, sans logique à tester sans téléphone.
- **Manuel**, sur un **iPhone physique** (le simulateur gère mal Sign in with
  Apple, d'après la doc Expo) :
  1. iOS : deux boutons, Apple au-dessus, même taille que Google
  2. Apple, email visible → session créée → onboarding
  3. Apple avec email caché (sur un autre identifiant Apple, ou après avoir
     retiré l'app dans Réglages → Identifiant Apple → Se connecter avec Apple) →
     `auth.users` contient une adresse `@privaterelay.appleid.com` → onboarding
  4. Feuille Apple fermée → écran inchangé, aucun message
  5. Relance de l'app après une connexion Apple → pas d'écran de connexion
  6. Android : pas de bouton Apple (vérifié au prochain build Android)

## Limites

- **Toujours** : `npm run lint`, `npm run typecheck` et `npm test` avant de
  commiter ; `npx expo prebuild` après la modification d'`app.json`.
- **Demander d'abord** : toute dépendance autre que `expo-apple-authentication`.
- **Jamais** : demander ou stocker le nom envoyé par Apple ; afficher le bouton
  sur Android.

## Critères de réussite

1. Sur iPhone, une connexion Apple, avec ou sans email caché, mène à l'onboarding
   habituel.
2. Le bouton Apple est le bouton natif, au-dessus de Google, à la même hauteur.
3. Fermer la feuille Apple ne produit aucun message.
4. Android n'affiche aucun bouton Apple.
5. `npm run lint`, `npm run typecheck` et `npm test` passent.

## Relook du bouton Google

_Décidé le 2026-11-16._ Le bouton Google doit ressembler à un vrai bouton Google,
selon la charte de Google (Sign in with Google branding guidelines) :

- fond blanc, bordure grise fine (`#747775`, 1 px), texte `#1F1F1F` ;
- le logo « G » officiel en couleurs à gauche, en image PNG dans
  `assets/images/` (pas de dépendance SVG) ;
- libellé « Continuer avec Google » ;
- même hauteur (54) et même arrondi que le bouton Apple.

Le `GoogleSigninButton` natif de la bibliothèque est écarté : sa hauteur et son
libellé sont fixes, donc impossible de l'aligner sur le bouton Apple.

## Décisions prises

- **Nonce : non.** Apple et Supabase acceptent un nonce, qui empêche de rejouer un
  jeton volé. Risque faible ici : le jeton expire en quelques minutes, et pour le
  voler il faut déjà avoir la main sur le téléphone. Même choix que pour Google.
  Évite `expo-crypto`.
- **Bundle ID : `com.colingue.dispo.dev`**, le seul, utilisé aussi par la fiche
  App Store Connect. Rien à changer côté App Store Connect ; il suffit de le
  mettre dans les Client IDs Apple de Supabase.
