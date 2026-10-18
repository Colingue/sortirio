begin;
select plan(4);

-- 1 and 2 were placed by the Thursday formation; 3 joined on Friday afternoon.
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 3) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U' || right(u.id::text, 1), date '1995-01-01', u.id || '/p.jpg', 'lyon'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V', 'A');
insert into public.groups (id, friday, city, venue_id, created_at) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon',
   '10000000-0000-0000-0000-000000000001', '2026-10-22 19:00 Europe/Paris');
insert into public.group_members (group_id, friday, user_id, created_at) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000001', '2026-10-22 19:00 Europe/Paris'),
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000002', '2026-10-22 19:00 Europe/Paris'),
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000003', '2026-10-23 15:13 Europe/Paris');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000001"}';

select is(
  (select array_agg(member_joined_late order by member_first_name) from public.get_my_group()),
  array[false, false, true],
  'get_my_group: only the member who joined after the formation is late');
select is(
  (select array_agg(member_joined_late order by member_first_name)
   from public.get_group_details('a0000000-0000-0000-0000-000000000000')),
  array[false, false, true],
  'get_group_details: same');
select is(
  (select late_joined_at from public.get_group_members('a0000000-0000-0000-0000-000000000000')
   where user_id = '00000000-0000-0000-0000-000000000003'),
  timestamptz '2026-10-23 15:13 Europe/Paris',
  'get_group_members: the arrival time of a late member');
select is(
  (select late_joined_at from public.get_group_members('a0000000-0000-0000-0000-000000000000')
   where user_id = '00000000-0000-0000-0000-000000000001'),
  null::timestamptz,
  'get_group_members: no arrival time for a member of the formation');

select * from finish();
rollback;
