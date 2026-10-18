begin;
select plan(6);

-- Rows are dated for a fixed week: the insert trigger checks the real clock.
alter table public.availabilities disable trigger user;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-00000000000a'),
  ('00000000-0000-0000-0000-00000000000b');
insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-00000000000a', '2026-10-23', '2026-10-22 20:00 Europe/Paris'),
  ('00000000-0000-0000-0000-00000000000b', '2026-10-23', '2026-10-21 12:00 Europe/Paris');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000a"}';

select is(
  (select signup_friday from public.get_friday_availability_status('2026-10-22 20:30')),
  date '2026-10-23', 'thursday evening: signup targets this Friday');
select is(
  (select next_open_friday from public.get_friday_availability_status('2026-10-22 20:30')),
  date '2026-10-30', 'next open Friday still flips at Thursday 19 h');
select is(
  (select signup_closes_at from public.get_friday_availability_status('2026-10-22 20:30')),
  timestamptz '2026-10-23 18:00 Europe/Paris', 'signup closes Friday 18 h, Paris');
select ok(
  (select posted_late from public.get_friday_availability_status('2026-10-22 20:30')),
  'posted after Thursday 19 h is late');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000b"}';
select ok(
  not (select posted_late from public.get_friday_availability_status('2026-10-22 20:30')),
  'posted before Thursday 19 h is not late');

set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000c"}';
select ok(
  not (select posted_late from public.get_friday_availability_status('2026-10-22 20:30')),
  'nothing posted is not late');

select * from finish();
rollback;
