# Spec — US 1.2 : M'inscrire — ma ville, puis mon profil

_2026-09-06. Fusion des anciennes stories 1.2 et 1.3. Sources : story 1.2,
`docs/SPEC.md`, `us-1.1-connexion.md`, records `2026-09-03-mobile-feature-folders`,
`2026-09-06-testing-on-expo-web`, `2026-08-31-matching-by-city`._

## Objectif

Cinq écrans, une question chacun — **ville, prénom, date de naissance, genre,
photo** — puis **une seule écriture** : la photo part dans Storage, la ligne
`profiles` est créée, et l'utilisateur arrive sur « Se déclarer dispo ».

Avant ce dernier bouton, la base ne contient rien. Une inscription abandonnée ne
laisse ni ligne, ni fichier.

## Ce qui a changé le 2026-09-06

- **La ville passe en premier** : une seule ville est ouverte, autant le dire
  avant de faire remplir quoi que ce soit.
- **Les stories 1.2 et 1.3 fusionnent.** La ville en tête, elles ne se testaient
  plus séparément : sans l'écran ville il n'y a pas d'entrée, sans le profil il
  n'y a rien à écrire.
- **La préférence de genre sort du MVP**, profil et matching compris.

## Périmètre

**Dedans** : les cinq écrans · la mémoire d'inscription · la règle des 18 ans ·
le choix de la photo · le **bucket Storage** et ses politiques · l'**écriture
finale**, photo puis profil.

**Dehors** : l'écran « modifier mon profil » (story 1.4, qui touche déjà le même
écran pour la ville) · l'accueil « Se déclarer dispo » (story 2.1, qui reste
l'écran vide de la 1.1).

## Hypothèses (corrige-les maintenant)

1. **Le déplacement de `src/lib/auth/` vers `src/features/` se fait ici.** Le
   record `2026-09-03-mobile-feature-folders` est `accepted` et l'attend.
2. **L'écran genre avance au tap**, sans bouton « Continuer ».
3. **Pas d'indicateur « 3 / 5 »** : cinq écrans, c'est court.
4. **Liste de villes en dur dans le code** — dix villes, une seule ouverte. Une
   table SQL n'apporterait rien tant qu'on n'en ouvre pas une deuxième.
5. **Bucket privé.** Les membres d'un groupe devront voir la photo des autres
   (story 4.1) : ce sera des URLs signées, ou une politique de lecture élargie —
   à trancher dans cette story-là, pas ici.

## Décisions

| Sujet             | Choix                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ville             | liste de 10 villes, **Lyon** seule sélectionnable, les autres marquées « bientôt »                                                                  |
| Ville « bientôt » | sélectionnable quand même, avec un message immédiat : la suite de l'inscription se fait normalement, mais aucune dispo ne sera possible             |
| Où vit la liste   | `features/city/cities.ts` — `{ id, label, open }`, pas de table SQL                                                                                 |
| Prénom            | « Comment veux-tu qu'on t'appelle ? » · 30 caractères max, espaces coupés, vide = bouton désactivé                                                  |
| Date de naissance | `@expo/ui/community/datetime-picker`, `mode="date"`, `maximumDate` = aujourd'hui · l'âge s'affiche dessous                                          |
| 18 ans            | refusé sur l'écran de la date : « Sortirio est réservé aux plus de 18 ans. », impossible d'avancer                                                  |
| Genre             | trois boutons — Femme / Homme / Autre · stocké `'woman' \| 'man' \| 'other'`, **jamais affiché** aux autres                                         |
| Photo             | **une seule**, obligatoire — ce n'est pas une app de dating                                                                                         |
| Photo, technique  | `expo-image-picker` · `launchImageLibraryAsync` / `launchCameraAsync` · `allowsEditing`, `aspect: [1, 1]`, `quality: 0.7`, `mediaTypes: ['images']` |
| Mémoire           | contexte `SignupDraftProvider` sur le layout du groupe `(onboarding)` : il meurt quand on en sort                                                   |
| Retour arrière    | possible, les réponses sont conservées · app fermée = tout perdu, on repart de la ville                                                             |
| Écriture          | **photo d'abord, ligne ensuite** — voir ci-dessous                                                                                                  |

## L'écriture, en une fois

Un seul bouton écrit, celui du dernier écran. L'ordre n'est pas neutre :

1. `supabase.storage.from('profile-photos').upload(\`\${userId}/photo.jpg\`, blob, { contentType: 'image/jpeg' })`
2. `insert` dans `profiles` avec `photo_path` = ce chemin.

**Photo d'abord** : si l'envoi échoue, il ne reste rien. Si c'est l'`insert` qui
échoue, on **supprime le fichier** qu'on vient d'envoyer, puis on propose de
réessayer. L'inverse — la ligne d'abord — produirait un profil valide pointant
vers une photo inexistante, et le routage de la 1.1 enverrait l'utilisateur sur
l'accueil avec un profil cassé.

Sur le web, le fichier s'obtient par `fetch(uri)` puis `.blob()`. **Sur téléphone
ce chemin sera probablement différent** (`ArrayBuffer`) — la doc Supabase ne
tranche pas, à vérifier au jour de la bascule.

## Base de données

Une migration, `profile_photos` : le bucket privé et ses politiques.

```sql
insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', false);

create policy "profile_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
```

Mêmes conditions pour `select`, `update` et `delete` : chacun n'atteint que son
dossier. **`update` et `delete` sont nécessaires** — sans eux, réessayer après un
échec ne peut ni remplacer ni nettoyer le fichier.

La table `profiles` existe déjà (story 1.1) et ne change pas. Ce que cette story
y écrit : `birthdate` au format `YYYY-MM-DD` sans heure ni fuseau, `gender` parmi
`'woman' | 'man' | 'other'`, `photo_path` = le chemin Storage (pas une URL).

## Fichiers

```
app/(onboarding)/_layout.tsx       nouveau — Stack du groupe + SignupDraftProvider
app/(onboarding)/city.tsx          réécrit — le premier écran
app/(onboarding)/first-name.tsx    nouveau
app/(onboarding)/birthdate.tsx     nouveau
app/(onboarding)/gender.tsx        nouveau
app/(onboarding)/photo.tsx         nouveau — et le bouton qui écrit tout
app/(onboarding)/profile.tsx       supprimé
app/_layout.tsx                    les écrans protégés du groupe, ville en tête
features/signup/signup-draft.tsx   nouveau — le contexte et son hook
features/signup/age.ts + .test.ts  nouveau — la seule logique pure
features/signup/create-profile.ts  nouveau — l'écriture en une fois
features/city/cities.ts            nouveau — la liste et son `open`
features/profile/photo.ts          nouveau — pickFromLibrary / takePhoto
supabase/migrations/<ts>_profile_photos.sql
```

Déplacements (hypothèse 1) : `lib/auth/session-provider.tsx` → `features/auth/`,
`google.ts` → `features/auth/sign-in-with-google.ts`, `profile.ts` →
`features/profile/has-profile.ts`, `destination.ts` (+ test) →
`features/routing/`. `lib/` ne garde que `supabase.ts`.

## Signatures

```ts
export function ageOn(birthdate: Date, today: Date): number;
export function isAdult(birthdate: Date, today: Date): boolean;

export type PickedPhoto =
  | { type: "picked"; uri: string }
  | { type: "cancelled" };

export async function createProfile(
  draft: CompleteDraft,
  userId: string,
): Promise<void>;
```

`ageOn` est pure, sans réseau ni React, testée à côté. Renoncer au sélecteur de
photo n'est pas une erreur — comme l'annulation Google de la 1.1.

Conventions : `kebab-case`, TypeScript strict, pas de `any`, **aucun
commentaire**, alias `@/`, textes en français.

## Tests

**Automatisé** — `age.test.ts` : anniversaire aujourd'hui (18 pile → accepté),
anniversaire demain (17 → refusé), né un 29 février, un âge banal.

**Manuel, dans le navigateur** (`npm run web`) :

1. compte neuf → écran ville · seule Lyon est sélectionnable
2. ville « bientôt » → message immédiat, mais l'inscription continue
3. prénom vide ou un espace → bouton désactivé
4. date donnant 17 ans → message, impossible d'avancer
5. retour arrière depuis le genre → ville, prénom et date toujours là
6. onglet rechargé au milieu → on repart de la ville, et `profiles` est vide
7. dernier bouton → une ligne dans `profiles`, un fichier dans `profile-photos`,
   et on arrive sur l'écran d'accueil
8. relancer l'app → on va directement à l'accueil (le routage de la 1.1 voit le
   profil)

**Reporté au premier vrai téléphone** : l'appareil photo, le refus de permission
caméra, le recadrage carré natif, et la forme de l'envoi (`ArrayBuffer`).

## Fini quand

Les 8 points passent dans le navigateur, et `npm run lint`, `npm run typecheck`,
`npm test` sont verts.

**Jamais dans cette story** : écrire quoi que ce soit avant le dernier bouton ·
laisser un fichier orphelin après un échec · demander la localisation · afficher
le genre à un autre utilisateur.

## Questions ouvertes

1. **Quelles dix villes** dans la liste ? Je pars sur Lyon, Paris, Marseille,
   Toulouse, Bordeaux, Lille, Nantes, Strasbourg, Montpellier, Rennes.
2. L'écran genre avance-t-il au tap (hypothèse 2), ou bouton « Continuer » comme
   les autres ?
3. Une ville « bientôt » laisse l'utilisateur finir son inscription pour ne pas
   le coincer dans une boucle — mais il arrive alors sur un accueil qui ne lui
   propose rien. Ce message d'accueil appartient à la story 2.1 : je le signale,
   je ne l'écris pas ici.
