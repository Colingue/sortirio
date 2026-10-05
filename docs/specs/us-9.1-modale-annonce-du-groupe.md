# PRD — Une modale annonce le groupe, une seule fois

_2026-10-04 · Story 9.1_

## Résumé

À l'ouverture de l'app, si j'ai un groupe visible que l'app ne m'a pas encore annoncé,
une modale « Ton groupe est là » s'affiche, **quel que soit l'écran d'arrivée**. Un seul
bouton la ferme. Le fait de l'avoir vue est retenu **par groupe, sur le téléphone** :
elle ne revient plus pour ce groupe, et revient pour le suivant.

## Problème

L'annonce du groupe repose aujourd'hui sur le push de la story 3.3. Celui qui a refusé
les notifications — refus qui ne doit rien bloquer (story 2.1) — ou qui ne tape pas
dessus ouvre l'app sans que rien ne lui dise que la seule nouvelle de la semaine est
arrivée. Le bloc groupe de l'accueil (story 4.1) est là, mais rien ne le signale.

## Objectif

Qu'aucun membre ne passe à côté de son groupe, avec ou sans notifications.

**Succès :** chaque membre voit l'annonce une fois par groupe, et jamais deux fois sur le
même téléphone.

## Utilisateur et scénario

En tant que membre d'un groupe qui ouvre l'app, je veux être accueilli par une annonce
que mon groupe est là, afin de ne pas passer à côté de la seule nouvelle de la semaine —
sans qu'elle me soit répétée à chaque ouverture.

## Exigences fonctionnelles

### Quand la modale s'affiche

1. Elle s'affiche **à l'ouverture de l'app**, quel que soit l'écran sur lequel l'app
   s'ouvre : accueil, page du groupe (rappel du vendredi, story 6.1), chat (story 5.2)…
   Elle n'est pas liée à l'accueil.
2. Condition : j'ai un **groupe visible** au sens de la story 4.1 (sa ligne existe, et
   samedi 6 h, heure de Paris, n'est pas passé) **et** ce groupe n'est pas encore marqué
   « déjà vu » sur ce téléphone.
3. Sans groupe visible (pas dispo, dispo mais non groupé, ou samedi 6 h passé) : aucune
   modale.
4. Un groupe qui se forme **pendant que l'app est ouverte** n'est pas annoncé avant la
   prochaine ouverture — même limite que la 4.1, qui ne rafraîchit pas l'accueil seule.

### Ce qu'elle montre

5. Le texte **« Ton groupe est là »**, seul. Ni lieu, ni heure, ni membres : le bloc
   groupe et la page du groupe portent déjà ces détails.
6. **Un seul bouton**, qui la ferme. Aucune autre action : ni confirmer sa présence, ni
   se désister, ni annuler sa dispo, ni ouvrir la page du groupe.

### La mémoire « déjà vue »

7. Elle est retenue **par groupe** : la clé est l'identifiant du groupe. Un nouveau groupe
   le jeudi suivant a un autre identifiant, donc la modale revient — sans aucun calcul de
   date.
8. Elle vit **sur le téléphone**, dans le stockage local déjà utilisé pour la session
   (`expo-sqlite/kv-store`). Aucune migration, aucune nouvelle dépendance.
9. Le groupe est marqué « déjà vu » **quand je ferme la modale**. Elle ne réapparaît ni en
   naviguant dans l'app, ni après avoir tué et relancé l'app.

## Hors périmètre

- **La mémoire en base** : réinstaller l'app ou changer de téléphone fait revoir la
  modale une fois. Accepté : cas rare, conséquence bénigne.
- Les détails du groupe dans la modale (lieu, heure, photos).
- Toute action autre que fermer.
- L'apparition en direct d'un groupe formé pendant que l'app est ouverte.
- Le nettoyage des anciennes clés « déjà vu » : une clé par semaine, négligeable.

## Risques / questions ouvertes

- **Doublon assumé avec le push de la 3.3** : qui a les notifications apprend deux fois
  la même chose. La modale existe pour les autres et ne doit pas dépendre du push.
- **Redondance sur la page du groupe** : celui qui ouvre l'app via le rappel du vendredi
  (6.1) voit la modale par-dessus la page de son groupe. Accepté : la règle reste « à
  l'ouverture, quel que soit l'écran ».
- **SPEC.md** ne mentionne pas cette modale. Il reste inchangé tant que Colin ne demande
  pas de le modifier.
