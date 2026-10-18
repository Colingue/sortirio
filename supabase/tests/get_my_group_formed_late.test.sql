begin;
select plan(2);

-- 1 is in the Thursday group, 2 in a group formed on Friday afternoon.
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 2) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'lyon'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V', 'A');
insert into public.groups (id, friday, city, venue_id, created_at) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon',
   '10000000-0000-0000-0000-000000000001', '2026-10-22 19:00 Europe/Paris'),
  ('b0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon',
   '10000000-0000-0000-0000-000000000001', '2026-10-23 15:00 Europe/Paris');
insert into public.group_members (group_id, friday, user_id) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000002');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000001"}';
select is(
  (select bool_and(group_formed_late) from public.get_my_group()),
  false,
  'a group of the Thursday formation is not late');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000002"}';
select is(
  (select bool_and(group_formed_late) from public.get_my_group()),
  true,
  'a group formed after Thursday 19 h is late');

select * from finish();
rollback;
