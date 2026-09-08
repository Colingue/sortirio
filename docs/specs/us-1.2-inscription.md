# Spec — US 1.2 : M'inscrire — ma ville, puis mon profil

_2026-09-06, révisé le 2026-09-08. Fusion des anciennes stories 1.2 et 1.3.
Sources : story 1.2, `docs/SPEC.md`, `us-1.1-connexion.md`, records
`2026-09-03-mobile-feature-folders`, `2026-09-06-testing-on-ios-simulator`,
`2026-08-31-matching-by-city`._

## Objectif

Quatre écrans, une question chacun — **ville, prénom, date de naissance,
photo** — puis **une seule écriture** : la photo part dans Storage, la ligne
`profiles` est créée, et l'utilisateur arrive sur « Se déclarer dispo ».

Avant ce dernier bouton, la base ne contient rien. Une inscription abandonnée ne
laisse aucun profil.

## Ce qui a changé

**Le 2026-09-06** — la ville passe en premier ; les stories 1.2 et 1.3
fusionnent ; la préférence de genre sort du MVP.

**Le 2026-09-08**, après entretien avec Colin :

- **Lyon est la seule ville affichée.** Plus de liste de dix, plus de « bientôt »,
  donc plus de parcours pour un utilisateur hors Lyon : le cas n'existe pas.
- **L'écran genre disparaît**, et la colonne avec lui. Le genre n'est ni demandé,
  ni stocké, ni utilisé. Voir le record `2026-09-08-no-gender-in-profile`
  (`proposed` — en attente de Colin).
- **Le fichier orphelin n'est plus une exigence.** Si l'écriture du profil rate
  après l'envoi de la photo, on propose de réessayer ; la photo restée seule sera
  écrasée à la tentative suivante. Pas de ménage côté serveur.

## Périmètre

**Dedans** : les quatre écrans · la mémoire d'inscription · la règle des 18 ans ·
le choix de la photo · le **bucket Storage** et ses politiques · la suppression de
la colonne `gender` · l'**écriture finale**, photo puis profil.

**Dehors** : l'écran « modifier mon profil » (story 1.4, qui touche déjà le même
écran pour la ville) · l'accueil « Se déclarer dispo » (story 2.1, qui reste
l'écran vide de la 1.1) · toute gestion sérieuse des coupures réseau.

## Hypothèses (corrige-les maintenant)

1. **Le déplacement de `src/lib/auth/` vers `src/features/` se fait ici.** Le
   record `2026-09-03-mobile-feature-folders` est `accepted` et l'attend.
2. **Pas d'indicateur « 2 / 4 »** : quatre écrans, c'est court.
3. **La ville reste en dur dans le code** — une seule entrée ouverte. Une table
   SQL n'apporterait rien tant qu'on n'en ouvre pas une deuxième.
4. **Bucket privé.** Les membres d'un groupe devront voir la photo des autres
   (story 4.1) : ce sera des URLs signées, ou une politique de lecture élargie —
   à trancher dans cette story-là, pas ici.

## Décisions

| Sujet             | Choix                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ville             | **Lyon seule affichée** ; l'écran annonce la couverture, il ne propose pas un choix                                                                 |
| Pourquoi l'écran  | il reste le premier écran même sans choix : il pose que Sortirio marche par ville, et il servira tel quel le jour où une deuxième ouvre             |
| Où vit la liste   | `features/city/cities.ts` — `{ id, label }`, pas de table SQL                                                                                       |
| Prénom            | « Comment veux-tu qu'on t'appelle ? » · 30 caractères max, espaces coupés, vide = bouton désactivé                                                  |
| Date de naissance | `@expo/ui/community/datetime-picker`, `mode="date"`, `maximumDate` = aujourd'hui · l'âge s'affiche dessous                                          |
| 18 ans            | refusé sur l'écran de la date : « Sortirio est réservé aux plus de 18 ans. », impossible d'avancer                                                  |
| Genre             | **supprimé** — pas d'écran, pas de colonne                                                                                                          |
| Photo             | **une seule**, obligatoire — c'est elle qui rend reconnaissable au bar                                                                              |
| Photo, technique  | `expo-image-picker` · `launchImageLibraryAsync` / `launchCameraAsync` · `allowsEditing`, `aspect: [1, 1]`, `quality: 0.7`, `mediaTypes: ['images']` |
| Mémoire           | contexte `SignupDraftProvider` sur le layout du groupe `(onboarding)` : il meurt quand on en sort                                                    |
| Retour arrière    | possible, les réponses sont conservées · app fermée = tout perdu, on repart de la ville                                                              |
| Écriture          | **photo d'abord, ligne ensuite** — voir ci-dessous                                                                                                   |

## L'écriture, en une fois

Un seul bouton écrit, celui du dernier écran. L'ordre n'est pas neutre :

1. `upload('{userId}/photo.jpg', blob, { contentType: 'image/jpeg', upsert: true })` sur le bucket `profile-photos`
2. `insert` dans `profiles` avec `photo_path` = ce chemin.

**Photo d'abord** : l'inverse — la ligne d'abord — produirait un profil valide
pointant vers une photo inexistante, et le routage de la 1.1 enverrait
l'utilisateur sur l'accueil avec un profil cassé. C'est le seul état interdit, et
la base l'empêche déjà : toutes les colonnes de `profiles` sont `not null`, donc
l'insert passe entier ou pas du tout.

Si l'`insert` échoue, on propose de réessayer. La photo déjà envoyée peut rester :
le chemin est fixe (`{userId}/photo.jpg`), donc la tentative suivante l'écrase —
d'où `upsert: true`. Supprimer le fichier quand on le peut est bien, ne pas y
arriver n'est pas un bug.

Le fichier s'obtient depuis l'URI du sélecteur ; **la forme exacte de l'envoi sur
téléphone** (`ArrayBuffer` plutôt que `Blob`) est à vérifier au moment de coder.

## Base de données

Deux migrations :

1. `drop_profile_gender` : `alter table public.profiles drop column gender;`
2. `profile_photos` : le bucket privé et ses politiques.

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

La table `profiles` existe depuis la story 1.1. Ce que cette story y écrit :
`birthdate` au format `YYYY-MM-DD` sans heure ni fuseau, `photo_path` = le chemin
Storage (pas une URL), `first_name`, `city`.

## Fichiers

```
app/(onboarding)/_layout.tsx       nouveau — Stack du groupe + SignupDraftProvider
app/(onboarding)/city.tsx          réécrit — le premier écran
app/(onboarding)/first-name.tsx    nouveau
app/(onboarding)/birthdate.tsx     nouveau
app/(onboarding)/photo.tsx         nouveau — et le bouton qui écrit tout
app/(onboarding)/profile.tsx       supprimé
app/_layout.tsx                    les écrans protégés du groupe, ville en tête
features/signup/signup-draft.tsx   nouveau — le contexte et son hook
features/signup/age.ts + .test.ts  nouveau — la seule logique pure
features/signup/create-profile.ts  nouveau — l'écriture en une fois
features/city/cities.ts            nouveau — la liste
features/profile/photo.ts          nouveau — pickFromLibrary / takePhoto
supabase/migrations/<ts>_drop_profile_gender.sql
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

export type PickedPhoto = { type: "picked"; uri: string } | { type: "cancelled" };

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

**Manuel, sur le simulateur iOS** (`npm run ios`, record
`2026-09-06-testing-on-ios-simulator`) :

1. compte neuf → écran ville, Lyon seule affichée
2. prénom vide ou un espace → bouton désactivé
3. date donnant 17 ans → message, impossible d'avancer
4. retour arrière depuis la photo → ville, prénom et date toujours là
5. app relancée au milieu → on repart de la ville, et `profiles` est vide
6. dernier bouton → une ligne dans `profiles`, un fichier dans `profile-photos`,
   et on arrive sur l'écran d'accueil
7. relancer l'app → on va directement à l'accueil (le routage de la 1.1 voit le
   profil)

**Reporté au premier vrai téléphone** : l'appareil photo, le refus de permission
caméra, le recadrage carré natif, et la forme de l'envoi (`ArrayBuffer`).

## Fini quand

Les 7 points passent sur le simulateur, et `npm run lint`, `npm run typecheck`,
`npm test` sont verts.

**Jamais dans cette story** : écrire quoi que ce soit avant le dernier bouton ·
demander la localisation · demander le genre.

## Questions ouvertes

1. **Le texte de l'écran ville.** Il doit se lire « Sortirio est à Lyon pour
   l'instant », pas comme une liste à une entrée. Formulation à trancher en
   codant.
2. Le record `2026-09-08-no-gender-in-profile` est `proposed` : la suppression de
   la colonne attend que Colin le passe en `accepted`.
