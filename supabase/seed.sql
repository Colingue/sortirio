-- ============================================================================
-- LOCAL FIXTURE ONLY. Never played against the hosted project
-- (`db reset --linked`), and never shipped by `db push` — db push sends
-- migrations, not this file. See supabase/CLAUDE.md.
-- ============================================================================
--
-- None of US 3.1's scenarios (12, 13, 20, 7, 2 signups) are checkable without real
-- users. seed_city_signups() fabricates `user_count` fake, already-signed-up users
-- in one city, through the same tables and triggers a real sign-up would use — so
-- the availabilities row it creates is accepted by availabilities_check_open_friday
-- like any other, not inserted around it.
--
-- pg_temp: the function lives only for this script's session, so nothing leaks
-- into the public schema after `db reset` finishes.

create function pg_temp.seed_city_signups(city_name text, user_count integer)
returns void
language plpgsql
as $$
declare
  i integer;
  fake_id uuid;
begin
  for i in 1..user_count loop
    fake_id := gen_random_uuid();

    insert into auth.users (id, email)
      values (fake_id, format('seed-%s-%s@sortirio.test', lower(city_name), i));

    insert into public.profiles (id, first_name, birthdate, photo_path, city)
      values (
        fake_id,
        format('Seed%s', i),
        date '1995-01-01',
        format('%s/photo.jpg', fake_id),
        city_name
      );

    -- friday defaults to get_next_open_friday(): the same Friday the job will
    -- target once jeudi 19h has passed for it.
    insert into public.availabilities (user_id) values (fake_id);
  end loop;
end;
$$;

-- Change the count below to replay a PRD scenario, then `npx supabase db reset`:
-- 12 → 6+6 · 13 → 6+4+3 · 20 → 6+6+5+3 · 7 → 4+3 · 2 → no group.
select pg_temp.seed_city_signups('Lyon', 12);
