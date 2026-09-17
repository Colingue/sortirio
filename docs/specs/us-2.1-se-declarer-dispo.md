# Spec — US 2.1 : Un bouton pour dire « vendredi, je suis chaud »

_2026-09-15, après entretien avec Colin. Sources : story 2.1, `docs/SPEC.md`,
`us-1.2-inscription.md`, records `2026-08-31-backend-supabase`,
`2026-09-03-mobile-feature-folders`._

## Contexte

`(app)/index.tsx` est un écran vide depuis la story 1.1. C'est là que l'utilisateur
atterrit en sortant de l'inscription, et c'est le premier écran de l'app qui fait
quelque chose.

Sans dispo posée, rien en aval n'existe : pas de groupes le jeudi 19 h, pas de chat,
pas de soirée. C'est aussi la donnée que mesure le `SPEC.md` — « l'utilisateur repose
une disponibilité dans les 3 semaines ».

**Ce qui a été tranché le 2026-09-15 :**

- Après le tap, on affiche **« C'est noté, on te prévient jeudi 19 h »** et rien de
  plus. Le compte à rebours et le nombre d'inscrits restent la story 2.3.
- La **permission de notification est demandée ici**, juste après le tap : l'écran
  promet une notif, et attendre la story 3.3 voudrait dire demander le jeudi soir,
  trop tard.
- **C'est la base qui dit quel vendredi est ouvert**, pour l'affichage comme pour
  l'écriture. L'écran attend sa réponse plutôt que de calculer sur l'horloge du
  téléphone.
- **Il n'y a pas de creux, pour qui n'a rien posé.** Le critère de la story qui disait
  « jeudi 19 h 01, le bouton est indisponible » est faux et a été corrigé : dès que les
  groupes sont partis, le même bouton revient avec la date du vendredi suivant.
- **Celui qui a coché son vendredi garde son message d'attente** jusqu'au bout de sa
  soirée. On ne lui propose pas le vendredi d'après pendant que le sien arrive : à
  jeudi 19 h 01, il lit encore « on te prévient jeudi 19 h », pas un bouton pour la
  semaine suivante.

## Spécifications

### Le vendredi ouvert

Un seul calcul, en base, dans le fuseau `Europe/Paris` :

> Le vendredi ouvert est le prochain vendredi dont la formation des groupes — jeudi
> 19 h, la veille — n'est pas encore passée.

Mardi → le vendredi qui vient. Jeudi 18 h → le vendredi qui vient, encore. Jeudi
19 h 01 → le vendredi de la semaine suivante. Il y a toujours un vendredi ouvert.

Fonction `public.open_friday()`, `stable`, retourne une `date`. C'est le seul endroit
où cette règle est écrite : l'app ne la recalcule jamais.

### La table

`public.availabilities` : `id`, `user_id` → `auth.users`, `friday date`, `created_at`.

- `unique (user_id, friday)` — poser deux fois ne crée qu'une ligne.
- `friday` a pour défaut `public.open_friday()`. **L'app n'envoie jamais de date** :
  elle insère une ligne et la base la date elle-même.
- Un trigger `before insert` refuse la ligne si `friday <> public.open_friday()`. Sans
  lui, un client qui envoie la date à la main pourrait s'inscrire dans un vendredi
  déjà formé. Un trigger plutôt qu'une contrainte `check` parce que la valeur valide
  change avec le temps : une ligne valide aujourd'hui doit rester valide.
- RLS activée dans la même migration que la table. Trois politiques bornées à
  `(select auth.uid()) = user_id` : `select`, `insert`, `delete` — `delete` est là pour
  la story 2.2, mais la politique coûte une ligne et son absence coûterait une
  migration.

### L'écran

Trois états, dans cet ordre :

1. **Chargement** — on attend la réponse de la base. C'est le prix assumé du « la base
   tranche ».
2. **Le bouton** — la date du vendredi ouvert, et un unique bouton « Je suis dispo ».
3. **C'est noté** — « C'est noté, on te prévient jeudi 19 h ». Pas de compte à rebours,
   pas de compteur.

**Ce qui départage le 2 et le 3 n'est pas le vendredi ouvert, c'est le vendredi de
l'utilisateur.** L'état 3 s'affiche tant qu'il a une dispo posée sur un vendredi qui
n'est pas passé — le sien, même une fois les groupes formés. Le bouton ne revient que le
samedi, sa soirée derrière lui, avec le vendredi ouvert. C'est le rythme que décrit déjà
`SPEC.md` : « samedi → jeudi 19 h, les utilisateurs se déclarent disponibles ».

Jeudi 19 h 01, deux utilisateurs voient donc deux écrans différents : celui qui n'a rien
posé se voit proposer le vendredi de la semaine suivante, celui qui a coché garde son
message d'attente.

C'est la base qui répond à ça aussi, **en un seul appel** : le vendredi ouvert, et le
vendredi posé par l'utilisateur s'il n'est pas passé. L'écran ne compare aucune date.

Si l'écriture échoue, on reste sur le bouton avec un message qui propose de réessayer.

### La permission de notification

`expo-notifications`, demandée **une fois, après une écriture réussie**, jamais avant.
Un refus ne change rien : la dispo est posée, on ne relance pas, on n'affiche pas de
message. L'enregistrement du token push appartient à la story 3.3, qui envoie.

## Critères de validation

- [ ] Mardi, sans dispo posée : l'écran affiche la date du vendredi qui vient et un
      unique bouton « Je suis dispo ».
- [ ] Un tap : la ligne est créée pour le vendredi ouvert et l'écran passe à « C'est
      noté » sans rechargement manuel.
- [ ] Deux taps rapides : une seule ligne en base.
- [ ] L'app rouverte avec une dispo déjà posée : « C'est noté », pas de bouton.
- [ ] Jeudi 18 h 59 puis jeudi 19 h 01, **sans dispo posée** : la date affichée passe du
      vendredi qui vient à celui de la semaine suivante, et le bouton reste actif dans
      les deux cas.
- [ ] Jeudi 19 h 01, **avec** une dispo posée pour le vendredi qui vient d'être formé :
      « C'est noté », et aucun bouton pour la semaine suivante.
- [ ] Le samedi qui suit sa soirée : le bouton revient, avec le vendredi d'après.
- [ ] Une insertion directe avec `friday` fixé à un vendredi passé ou futur est refusée
      par la base, pas seulement par l'app.
- [ ] Un utilisateur ne peut lire aucune dispo autre que la sienne.
- [ ] La pop-up de notification apparaît après le premier tap réussi, et une seule fois.
- [ ] Permission refusée : la dispo est quand même posée, l'écran affiche « C'est noté ».
- [ ] `npm run lint`, `npm run typecheck`, `npm test` verts.

## Hors périmètre

Annuler sa dispo (2.2) · le compte à rebours et le nombre d'inscrits (2.3) · la
formation des groupes (3.1) · l'envoi de la notif du jeudi et le token push (3.3) ·
relancer l'utilisateur qui a refusé la permission · la gestion sérieuse des coupures
réseau.

Verrue assumée : entre jeudi 19 h 01 et le samedi, celui qui a coché lit « on te
prévient jeudi 19 h » alors que jeudi 19 h est passé. Tant que la story 3.1 ne forme pas
les groupes et que la 3.3 n'envoie rien, il n'y a rien de plus vrai à afficher. Ce sont
elles qui remplaceront cet écran par le groupe.
