---
type: decision
status: proposed # proposed | accepted | superseded
date: 2026-09-27
tags: [backend]
supersedes:
affects: # [[docs/specs/us-3.3-notification-groupe-pret.md]] — et toute story qui enverra un appel sortant
---

# Les appels HTTP sortants partent de Postgres, avec `pg_net`

## Context

Le jeudi à 19h, un job Postgres appelé par `pg_cron` forme les groupes et leur attribue
un lieu. La story 3.3 lui demande d'envoyer en plus une notification push à chaque
membre, ce qui veut dire joindre l'API d'Expo — un `POST` vers un service extérieur.

Jusqu'ici rien dans le projet ne sort du réseau depuis le backend : tout ce qui appelle
l'extérieur est dans l'app mobile. Le job, lui, tourne sans client, sans serveur devant
lui, dans une transaction. C'est le premier endroit du projet où la base doit parler à
quelqu'un d'autre qu'elle-même, et le choix vaut pour toutes les stories suivantes qui
auront le même besoin (rappel du vendredi, désistement, tout envoi déclenché par le
temps plutôt que par un geste de l'utilisateur).

## Decision

Le backend fait ses appels HTTP sortants depuis Postgres, avec l'extension `pg_net`,
appelée directement par la fonction qui en a besoin.

## Why not something else

- **Une Edge Function appelée par le job** — l'écartée principale. Elle ne supprime pas
  le problème, elle le déplace d'un cran : le job doit toujours sortir du réseau, cette
  fois pour joindre la fonction, donc `pg_net` reste nécessaire de toute façon. En
  échange elle ajoute un déploiement, un runtime de plus, et une clé de service à
  stocker quelque part pour que la base ait le droit de l'appeler. Aucune Edge Function
  n'existe aujourd'hui dans le projet : ce serait une brique entière pour un `POST`.
- **Une Edge Function déclenchée par un cron à part, qui lirait les groupes formés** —
  casse l'exigence 7 de la story : la notification ne serait plus dans la même exécution
  que la formation, il faudrait une trace de « qui a déjà été notifié » pour ne pas
  envoyer deux fois, et l'idempotence acquise en 3.1 ne suffirait plus.
- **Un worker externe (serveur, fonction planifiée ailleurs)** — il faudrait l'héberger,
  le surveiller et lui donner les droits de lecture sur la base. Le projet n'a pas de
  serveur, c'est précisément ce que le record backend Supabase a tranché.
- **Un `http_post` synchrone (extension `http`)** — bloquerait la transaction du job le
  temps de la réponse d'Expo, et un service lent ou indisponible retarderait ou ferait
  échouer la formation des groupes. L'asynchronisme de `pg_net` est exactement ce qu'on
  veut ici.

## Consequences

- ✅ Le job reste une seule fonction, une seule exécution : former, attribuer un lieu,
  notifier. Rien à synchroniser entre deux systèmes.
- ✅ `pg_net` est asynchrone par construction — `net.http_post()` rend un id tout de
  suite et un worker envoie la requête après le commit. Un envoi raté n'a donc aucun
  moyen d'interrompre ce que le job a déjà écrit, sans une ligne de code défensif.
- ⚠️ La contrepartie du même mécanisme : le job ne voit jamais qu'un envoi a échoué. Le
  seul endroit où lire ce qui s'est passé est `net._http_response`, et ses lignes
  vivent 6 heures. Pas de réessai, pas d'alerte.
- ⚠️ De la logique d'intégration entre dans le SQL : l'URL d'Expo, la forme de son
  payload et le texte des notifications vivent dans une migration, où ils ne sont pas
  testables autrement qu'à la main.
- ⚠️ Une extension de plus à activer sur le projet hébergé comme en local, et ses objets
  vivent dans le schéma `net` — une fonction en `search_path = ''` doit écrire
  `net.http_post(...)`.
- → Génère : la story 3.3 (notification « ton groupe est prêt »), et le patron que
  reprendront les envois planifiés suivants.

## Usage

```sql
create extension if not exists pg_net with schema extensions;

perform net.http_post(
  url := 'https://exp.host/--/api/v2/push/send',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := messages
);

-- le seul endroit où lire ce qui est parti (TTL 6 h)
select id, status_code, content from net._http_response order by id desc;
```
