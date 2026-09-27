-- US 3.3: the Thursday job has to reach Expo's push API, and the job is a Postgres
-- function called by pg_cron. pg_net is what lets Postgres make an outbound HTTP call.
--
-- The alternative — an Edge Function called by the job — was set aside in the spec: it
-- would need the job to reach the network anyway, just one hop further away, plus a
-- deployment and a secret to hold. Nothing in this project deploys an Edge Function yet.
--
-- The call it gives us is asynchronous by construction: net.http_post() returns an id
-- immediately and a background worker sends the request after the commit. That is
-- exactly requirement 6 — a failed send has no way to interrupt the group formation,
-- because the formation has already committed when the request leaves.
--
-- Watch out: despite the `with schema extensions` below, pg_net puts its objects in the
-- `net` schema. A function running with search_path = '' must write net.http_post(...).
-- Responses are readable in net._http_response, and only there — they live 6 hours.

create extension if not exists pg_net with schema extensions;
