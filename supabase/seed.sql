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

-- Ten real, well-rated bars in central Lyon (1er/2e), plausible fixture for US 3.2 —
-- not the prod list, that one Colin fills by hand (see docs/specs/us-3.2). Since
-- groups.venue_id is not null, a city with no venue here forms no group at all: this
-- block is a dependency of story 3.1's scenarios, not decoration.
--
-- To replay US 3.2's two edge cases, then `npx supabase db reset`:
--   fewer venues than groups → seed 40 signups above and delete all but five venues
--     below; 7 groups over 5 venues must land on 2,2,1,1,1
--   city with no venue → add seed_city_signups('Marseille', 12) above; Marseille must
--     form no group at all and log a warning
insert into public.venues (city, name, address) values
  ('Lyon', 'L''Antiquaire', '20 Rue Hippolyte Flandrin, 69001 Lyon'),
  ('Lyon', 'Boston Tavern', '8 Place des Terreaux, 69001 Lyon'),
  ('Lyon', 'Le Wallace Bar', '2 Rue Octavio Mey, 69001 Lyon'),
  ('Lyon', 'Hopstore', '27 Rue de la Martinière, 69001 Lyon'),
  ('Lyon', 'Pépouze', '8 Place Saint-Vincent, 69001 Lyon'),
  ('Lyon', 'La Serre', '4 Rue du Jardin des Plantes, 69001 Lyon'),
  ('Lyon', 'Soif', '4 Rue Terme, 69001 Lyon'),
  ('Lyon', 'Le Comptoir de la Bourse', '33 Rue de la Bourse, 69002 Lyon'),
  ('Lyon', 'The Monkey Club', '19 Place Tolozan, 69001 Lyon'),
  ('Lyon', 'Odessa', '14 Rue René Leynaud, 69001 Lyon');
