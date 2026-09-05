-- One row per signed-up user. Story 1.1 only reads whether the row exists; stories
-- 1.2 and 1.3 fill it in. Every column is not null, so a half-written profile cannot
-- exist — that is the "nothing is saved before the last button" rule of the sign-up
-- flow, enforced by the database rather than the app.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  birthdate date not null,
  gender text not null,
  photo_path text not null,
  city text not null,
  created_at timestamptz not null default now()
);

-- Enabled in the same migration as the table: a table in the public schema is
-- reachable through the Data API, so it must never exist unprotected, not even
-- between two migrations.
alter table public.profiles enable row level security;

-- auth.uid() is wrapped in a select so Postgres evaluates it once per query
-- instead of once per row.

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

-- Both using and with check: without with check, a user could hand their row to
-- someone else by rewriting its id.
create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
