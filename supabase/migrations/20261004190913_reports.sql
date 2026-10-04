-- US 7.1: one row per "A reported B". The primary key is requirement 5: reporting the
-- same person twice is one row, so it counts once towards a ban. The check is the
-- other half of it: nobody reports themselves, whatever the function above it does.
--
-- RLS with zero policy (requirements 18, 19): nobody reads this table, not even the
-- reporter. report_member() writes it, as a definer, and is the only door.
--
-- The primary key leads with reporter_id; the second index serves the other direction,
-- "who reported B", which the ban counts and the reported_id foreign key needs.

create table public.reports (
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reported_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reporter_id, reported_id),
  constraint reports_not_self check (reporter_id <> reported_id)
);

create index reports_reported_id_idx on public.reports (reported_id);

-- Enabled in the same migration as the table: a table in the public schema is
-- reachable through the Data API, so it must never exist unprotected, not even
-- between two migrations.
alter table public.reports enable row level security;
