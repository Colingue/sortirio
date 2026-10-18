begin;
select plan(4);

-- Rows are dated for a fixed week: only the open-Friday check reads the real clock.
alter table public.availabilities disable trigger availabilities_check_open_friday;

insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 5) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city, expo_push_token)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'lyon',
  'ExponentPushToken[' || right(u.id::text, 1) || ']'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V', 'A');
insert into public.groups (id, friday, city, venue_id) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001');
insert into public.group_members (group_id, friday, user_id) values
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000000', '2026-10-23', '00000000-0000-0000-0000-000000000003');

create temporary table queued_before as select count(*) as n from net.http_request_queue;

-- 4 signs up on Thursday 20:00, after the formation: late.
insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000004', '2026-10-23', '2026-10-22 20:00 Europe/Paris');

select ok(
  exists (select 1 from public.group_members
    where user_id = '00000000-0000-0000-0000-000000000004'),
  'a late signup joins a group with room');
select is(
  (select count(*) from net.http_request_queue) - (select n from queued_before),
  1::bigint,
  'one push request is queued');
select ok(
  (select convert_from(q.body, 'UTF8')::jsonb from net.http_request_queue q order by q.id desc limit 1)
    = jsonb_build_array(jsonb_build_object(
        'to', 'ExponentPushToken[4]',
        'title', 'Ton groupe est prêt !',
        'body', 'Ouvre l''app pour découvrir le lieu de rendez-vous et les personnes du groupe'
      )),
  'the push goes to the late signup only');

-- 5 signs up on Wednesday: not late, the Thursday formation places them.
insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000005', '2026-10-23', '2026-10-21 12:00 Europe/Paris');
select ok(
  not exists (select 1 from public.group_members
    where user_id = '00000000-0000-0000-0000-000000000005'),
  'a signup before Thursday 19 h is not placed');

select * from finish();
rollback;
