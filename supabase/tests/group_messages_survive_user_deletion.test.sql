begin;
select plan(4);

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002');

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'lyon'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address)
values ('00000000-0000-0000-0000-0000000000a1', 'lyon', 'V', 'A');

insert into public.groups (id, friday, city, venue_id)
values ('00000000-0000-0000-0000-0000000000b1', date '2026-11-20', 'lyon',
  '00000000-0000-0000-0000-0000000000a1');

insert into public.group_members (group_id, user_id, friday)
values ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000001', date '2026-11-20');

insert into public.group_messages (id, group_id, author_id, body)
values ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000b1',
  '00000000-0000-0000-0000-000000000001', 'salut');

delete from auth.users where id = '00000000-0000-0000-0000-000000000001';

select is(
  (select count(*)::int from public.group_messages where id = '00000000-0000-0000-0000-0000000000c1'),
  1, 'the message survives the deletion of its author');
select is(
  (select author_id from public.group_messages where id = '00000000-0000-0000-0000-0000000000c1'),
  null, 'its author_id becomes null');
select is(
  (select count(*)::int from public.profiles where id = '00000000-0000-0000-0000-000000000001'),
  0, 'the profile goes with the account');
select is(
  (select count(*)::int from public.group_members where user_id = '00000000-0000-0000-0000-000000000001'),
  0, 'the group membership goes with the account');

select * from finish();
rollback;
