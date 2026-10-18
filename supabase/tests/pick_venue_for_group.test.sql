begin;
select plan(5);

alter table public.availabilities disable trigger availabilities_check_open_friday;

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V1', 'A'),
  ('10000000-0000-0000-0000-000000000002', 'lyon', 'V2', 'A'),
  ('10000000-0000-0000-0000-000000000003', 'lyon', 'V3', 'A'),
  ('10000000-0000-0000-0000-000000000009', 'paris', 'P', 'A');

-- Tonight V1 and V2 are taken in Lyon; next week's groups do not count.
insert into public.groups (friday, city, venue_id) values
  ('2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001'),
  ('2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000002'),
  ('2026-10-30', 'lyon', '10000000-0000-0000-0000-000000000003');

select is(
  public.pick_venue_for_group('lyon', '2026-10-23'),
  '10000000-0000-0000-0000-000000000003'::uuid,
  'picks the venue nobody has tonight');

insert into public.groups (friday, city, venue_id) values
  ('2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000003'),
  ('2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001');
select isnt(
  public.pick_venue_for_group('lyon', '2026-10-23'),
  '10000000-0000-0000-0000-000000000001'::uuid,
  'all taken: one of the least used');

select is(
  public.pick_venue_for_group('marseille', '2026-10-23'),
  null::uuid,
  'no venue in the city: null');

-- The Thursday job, next week: 21 Lyon users → 4 groups (6, 6, 6, 3) for 3 venues.
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 21) as n;
insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'lyon'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';
delete from public.groups where friday = '2026-10-30';
insert into public.availabilities (user_id, friday, created_at)
select u.id, '2026-10-30', '2026-10-27 12:00 Europe/Paris'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

select public.form_friday_groups('2026-10-29 19:30');

select is(
  (select count(*) from public.groups where friday = '2026-10-30' and city = 'lyon'),
  4::bigint,
  'the job forms 4 groups');
select is(
  (select array_agg(n order by n desc) from (
    select count(*) as n from public.groups
    where friday = '2026-10-30' and city = 'lyon' group by venue_id) as uses),
  array[2, 1, 1]::bigint[],
  'the job spreads the venues: 2, 1, 1');

select * from finish();
rollback;
