begin;
select plan(6);

-- Members a1..a3 in group A (Lyon, 3), b1..b4 in B (Lyon, 4), f1..f6 in F (Lyon, full),
-- p1..p3 in P (Paris, 3). Late signups: x, y, z, w (Lyon), q (Paris, nothing for her).
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 30) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg',
  case when right(u.id::text, 2)::int between 20 and 22 or right(u.id::text, 2)::int = 29
    then 'paris' else 'lyon' end
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V', 'A'),
  ('10000000-0000-0000-0000-000000000002', 'paris', 'V', 'A');

insert into public.groups (id, friday, city, venue_id) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000000', '2026-10-23', 'paris', '10000000-0000-0000-0000-000000000002');

-- A: users 1-3 · B: 4-7 · F: 8-13 · P (paris): 20-22
insert into public.group_members (group_id, friday, user_id)
select g, date '2026-10-23', ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from (values
  ('a0000000-0000-0000-0000-000000000000'::uuid, 1, 3),
  ('b0000000-0000-0000-0000-000000000000'::uuid, 4, 7),
  ('f0000000-0000-0000-0000-000000000000'::uuid, 8, 13),
  ('c0000000-0000-0000-0000-000000000000'::uuid, 20, 22)
) as spec (g, first_n, last_n),
generate_series(first_n, last_n) as n;

-- x (24): no report → the least full group, A.
select is(
  public.join_group_with_room('00000000-0000-0000-0000-000000000024', '2026-10-23'),
  'a0000000-0000-0000-0000-000000000000'::uuid,
  'joins the least full group of the city');
select ok(
  exists (select 1 from public.group_members
    where user_id = '00000000-0000-0000-0000-000000000024'
      and group_id = 'a0000000-0000-0000-0000-000000000000'),
  'the membership row exists');

-- y (25) reported a member of A (now 4, like B): only B is left.
insert into public.reports (reporter_id, reported_id) values
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000001');
select is(
  public.join_group_with_room('00000000-0000-0000-0000-000000000025', '2026-10-23'),
  'b0000000-0000-0000-0000-000000000000'::uuid,
  'skips a group holding someone I reported');

-- z (26) was reported by members of A and B: F is full, nothing left.
insert into public.reports (reporter_id, reported_id) values
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000026'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000026');
select is(
  public.join_group_with_room('00000000-0000-0000-0000-000000000026', '2026-10-23'),
  null::uuid,
  'skips groups holding someone who reported me, and full groups');
select ok(
  not exists (select 1 from public.group_members
    where user_id = '00000000-0000-0000-0000-000000000026'),
  'no group, no membership row');

-- q (29) lives in Paris: P is the only Paris group.
select is(
  public.join_group_with_room('00000000-0000-0000-0000-000000000029', '2026-10-23'),
  'c0000000-0000-0000-0000-000000000000'::uuid,
  'only groups of my city');

select * from finish();
rollback;
