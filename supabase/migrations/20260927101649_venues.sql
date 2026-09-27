-- One row per real-world venue, filled by hand in SQL (US 3.2, requirement 1). city
-- is a plain text column, not a foreign key: same convention as groups.city and
-- profiles.city ([[docs/adr/2026-08-31-matching-by-city]]).

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  name text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create index venues_city_idx on public.venues (city);

-- Same reasoning as groups/group_members: reachable through the Data API the moment
-- it exists in public, so RLS is on from this migration. No policy yet — the job that
-- will read this (US 3.2's job update) runs as postgres, and no screen reads venues
-- until story 4.1.
alter table public.venues enable row level security;
