-- One row per user per Friday they said yes to. friday defaults to the currently
-- open Friday, so the app never has to send a date — the trigger below is the
-- guard against a client that tries anyway.

create table public.availabilities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  friday date not null default public.open_friday(),
  created_at timestamptz not null default now()
);

-- Posting twice creates one row, and the same index backs friday_state()'s lookup
-- and the user_id foreign key.
alter table public.availabilities
  add constraint availabilities_user_friday_unique unique (user_id, friday);

-- Enabled in the same migration as the table: a table in the public schema is
-- reachable through the Data API, so it must never exist unprotected, not even
-- between two migrations.
alter table public.availabilities enable row level security;

create policy "availabilities_select_own" on public.availabilities
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "availabilities_insert_own" on public.availabilities
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Not used before story 2.2, but the policy costs a line today against a
-- migration tomorrow.
create policy "availabilities_delete_own" on public.availabilities
  for delete to authenticated using ((select auth.uid()) = user_id);

-- A check assumes the valid value never changes; here it changes every week, so a
-- row valid today would become permanently un-restorable after a pg_restore. The
-- trigger re-evaluates open_friday() at insert time instead of baking one answer
-- into the schema.
create function public.availabilities_check_open_friday()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.friday <> public.open_friday() then
    raise exception 'friday must be the currently open Friday'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger availabilities_check_open_friday
  before insert on public.availabilities
  for each row execute function public.availabilities_check_open_friday();
