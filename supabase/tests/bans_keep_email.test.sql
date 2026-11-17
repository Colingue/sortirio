begin;
select plan(5);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'Target@Example.com'),
  ('00000000-0000-0000-0000-000000000002', 'a@example.com'),
  ('00000000-0000-0000-0000-000000000003', 'b@example.com');

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

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002"}', true);
select public.report_member('00000000-0000-0000-0000-000000000001');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003"}', true);
select public.report_member('00000000-0000-0000-0000-000000000001');

select is(
  (select email from public.bans where user_id = '00000000-0000-0000-0000-000000000001'),
  'target@example.com', 'a ban stores the lowercased email of the banned account');

delete from auth.users where id = '00000000-0000-0000-0000-000000000001';

select is((select count(*)::int from public.bans), 1, 'the ban survives the deletion of the account');
select is((select email from public.bans), 'target@example.com', 'it keeps the email');
select is((select user_id from public.bans), null, 'and its user_id becomes null');

-- Same email, new account, reported twice again: the ban follows the new account.
insert into auth.users (id, email) values ('00000000-0000-0000-0000-000000000004', 'Target@Example.com');
insert into public.profiles (id, first_name, birthdate, photo_path, city)
values ('00000000-0000-0000-0000-000000000004', 'U', date '1995-01-01', '00000000-0000-0000-0000-000000000004/p.jpg', 'lyon');
insert into public.group_members (group_id, user_id, friday)
values ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000004', date '2999-01-01');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002"}', true);
select public.report_member('00000000-0000-0000-0000-000000000004');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003"}', true);
select public.report_member('00000000-0000-0000-0000-000000000004');

select is(
  (select user_id from public.bans where email = 'target@example.com'),
  '00000000-0000-0000-0000-000000000004'::uuid, 'the row follows the new account, still one row');

select * from finish();
rollback;
