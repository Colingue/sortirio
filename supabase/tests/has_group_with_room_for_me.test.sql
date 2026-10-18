begin;
select plan(5);

-- Group A (Lyon, users 1-3, room), group F (Lyon, users 4-9, full). Nobody is grouped
-- for Paris. Candidates: 20, 21, 22 (Lyon), 23 (Paris).
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 23) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg',
  case when right(u.id::text, 2) = '23' then 'paris' else 'lyon' end
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V', 'A');

insert into public.groups (id, friday, city, venue_id) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001');

insert into public.group_members (group_id, friday, user_id)
select g, date '2026-10-23', ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from (values
  ('a0000000-0000-0000-0000-000000000000'::uuid, 1, 3),
  ('f0000000-0000-0000-0000-000000000000'::uuid, 4, 9)
) as spec (g, first_n, last_n),
generate_series(first_n, last_n) as n;

-- 21 reported a member of A, a member of A reported 22: only the full F is left.
insert into public.reports (reporter_id, reported_id) values
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000022');

set local role authenticated;

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000020"}';
select ok(
  public.has_group_with_room_for_me('2026-10-23 15:00'),
  'true when a group of my city has room and nobody reported between us');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000021"}';
select ok(
  not public.has_group_with_room_for_me('2026-10-23 15:00'),
  'false when the group with room holds someone I reported, and the other is full');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000022"}';
select ok(
  not public.has_group_with_room_for_me('2026-10-23 15:00'),
  'false when the group with room holds someone who reported me');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000023"}';
select ok(
  not public.has_group_with_room_for_me('2026-10-23 15:00'),
  'false when the groups with room are in another city');

reset role;
select ok(
  not has_function_privilege('anon', 'public.has_group_with_room_for_me(timestamp)', 'execute'),
  'anon cannot call it');

select * from finish();
rollback;
