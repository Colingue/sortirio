-- One row per group formed for a Friday, one row per membership. friday is
-- denormalized onto group_members so the "one group per user per Friday" rule
-- (US 3.1, requirement 5) is a schema constraint, not a job-code promise: the unique
-- index below is what actually prevents it, not the code that populates it.

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  friday date not null,
  city text not null,
  created_at timestamptz not null default now(),
  -- Exists only so group_members can carry a composite foreign key back to
  -- (id, friday) — that is what stops a member's friday from ever diverging from
  -- their group's.
  unique (id, friday)
);

create index groups_friday_city_idx on public.groups (friday, city);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  friday date not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id),
  constraint group_members_user_friday_unique unique (user_id, friday),
  foreign key (group_id, friday) references public.groups (id, friday)
);

-- Enabled in the same migration as the tables: a table in the public schema is
-- reachable through the Data API, so it must never exist unprotected, not even
-- between two migrations. No policy is created here on purpose: the job that fills
-- these tables runs as postgres (bypassrls), and nothing in this commit reads them —
-- the read policy ("I can see my own group") arrives with the screen that needs it.
-- Until then, RLS with zero policies means "nobody reads", which is the right default.
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
