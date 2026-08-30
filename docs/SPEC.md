# Sortirio — Spec produit (MVP)

## Concept

Application mobile (iOS + Android, Expo / React Native) pour se faire des **amis**
dans une nouvelle ville. Pas une app de dating — l'objectif est purement amical :
rencontrer des gens qui se ressemblent un minimum (âge) et se retrouver IRL.

Positionnement par rapport aux concurrents étudiés :

- **Knockk** : communautés par centre d'intérêt + événements — pas notre approche
- **Timeleft** : algorithme qui compose des groupes selon âge/personnalité pour des
  dîners réservés — c'est le mécanisme le plus proche, mais on simplifie (pas de
  réservation de restaurant, format plus léger)
- **Bumble BFF** : swipe 1:1 façon dating — pas notre approche

## Mécanisme principal

1. **Créneaux prédéfinis** (ex: "vendredi soir") — pas d'événement ni de lieu
   affiché à l'avance.
2. L'utilisateur choisit un créneau et se déclare disponible ("je suis chaud pour
   rencontrer du monde à ce moment"), puis attend.
3. Un **algorithme forme des groupes de 3 à 6 personnes** à partir des personnes
   disponibles sur ce créneau.
4. L'algorithme **assigne un lieu** (bar, parc...) pioché dans une **liste gérée
   manuellement** (pas d'intégration/réservation automatique pour le MVP).

## Critères de matching (MVP)

- **Âge** (critère principal)
- **Créneau choisi**
- **Rayon géographique** (~10 km autour de la position de l'utilisateur, ex: Lyon)
- **Préférence de genre** (optionnelle — ex: une fille peut vouloir ne rencontrer
  que des filles)

Volontairement simple pour le MVP : pas de centres d'intérêt, pas de langue, pas
de personnalité.

## Après la formation du groupe

- **Chat de groupe** ouvert entre les membres avant la rencontre
- Chaque membre voit les profils des autres : **photo, prénom, âge** — rien
  d'autre
- Chaque invité doit **valider sa présence**
- **Deadline de validation : 12h avant** le créneau
- Pas de remplacement automatique en cas de désistement/non-validation — **le
  groupe se retrouve avec qui est disponible**, même à moins de monde

## Stack technique

- **Expo** (managed workflow) — SDK 57, React Native 0.86, React 19
- **Expo Router** pour la navigation (file-based routing)
- **TypeScript**
- Build/déploiement iOS & Android via **EAS Build**
- Modules Expo prévus : `expo-location` (rayon 10 km), `expo-image-picker` (photo
  de profil), `expo-notifications` (rappels deadline / groupe formé)
- Backend : à définir — piste envisagée **Supabase** (Postgres + Auth + Realtime
  pour le chat + Storage pour les photos)

## Décisions encore ouvertes

- Choix définitif du backend (Supabase vs Firebase vs autre)
- Structure des écrans (onboarding, sélection de créneau, écran d'attente, chat
  de groupe, profil)
- Nom définitif de l'app (actuellement "Sortirio", provisoire)
