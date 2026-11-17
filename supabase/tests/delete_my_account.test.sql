begin;
select plan(8);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'Me@Example.com'),
  ('00000000-0000-0000-0000-000000000002', 'other@example.com');

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'lyon'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address)
values ('00000000-0000-0000-0000-0000000000a1', 'lyon', 'V', 'A');
insert into public.groups (id, friday, city, venue_id)
values ('00000000-0000-0000-0000-0000000000b1', date '2999-01-01', 'lyon',
  '00000000-0000-0000-0000-0000000000a1');
insert into public.group_members (group_id, user_id, friday)
select '00000000-0000-0000-0000-0000000000b1', u.id, date '2999-01-01'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-00000000000_';

insert into public.availabilities (user_id)
values ('00000000-0000-0000-0000-000000000001');
insert into public.reports (reporter_id, reported_id)
values ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001');
insert into public.group_messages (group_id, author_id, body)
values ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000001', 'salut');
insert into public.bans (user_id, email)
values ('00000000-0000-0000-0000-000000000001', 'me@example.com');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001"}', true);
select public.delete_my_account();

select is((select count(*)::int from auth.users where id = '00000000-0000-0000-0000-000000000001'), 0, 'the account is gone');
select is((select count(*)::int from public.profiles where id = '00000000-0000-0000-0000-000000000001'), 0, 'the profile is gone');
select is((select count(*)::int from public.availabilities where user_id = '00000000-0000-0000-0000-000000000001'), 0, 'the sign-ups are gone');
select is((select count(*)::int from public.group_members where user_id = '00000000-0000-0000-0000-000000000001'), 0, 'the group membership is gone');
select is((select count(*)::int from public.reports where reported_id = '00000000-0000-0000-0000-000000000001'), 0, 'the reports are gone');
select is((select author_id from public.group_messages), null, 'the message stays, with a null author');
select is((select email from public.bans), 'me@example.com', 'the ban stays, with its email');
select is((select count(*)::int from auth.users where id = '00000000-0000-0000-0000-000000000002'), 1, 'nobody else is touched');

select * from finish();
rollback;
