begin;
select plan(9);

alter table public.availabilities disable trigger availabilities_check_open_friday;

-- Lyon: F (users 1-6) is full and holds V1; V2 is free. L (7) was left out on Thursday.
-- Y1 (8), Y2 (9), Y3 (10) sign up late; Y2 reported Y1.
-- Marseille: 6 left out on Thursday (11-16) and a late signup (17). Paris has no venue:
-- 18, 19 left out, 20 late.
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 20) as n;

insert into public.profiles (id, first_name, birthdate, photo_path, city, expo_push_token)
select u.id, 'U', date '1995-01-01', u.id || '/p.jpg',
  case
    when right(u.id::text, 2)::int between 11 and 17 then 'marseille'
    when right(u.id::text, 2)::int >= 18 then 'paris'
    else 'lyon'
  end,
  'ExponentPushToken[' || right(u.id::text, 2) || ']'
from auth.users u
where u.id::text like '00000000-0000-0000-0000-%';

insert into public.venues (id, city, name, address) values
  ('10000000-0000-0000-0000-000000000001', 'lyon', 'V1', 'A'),
  ('10000000-0000-0000-0000-000000000002', 'lyon', 'V2', 'A'),
  ('10000000-0000-0000-0000-000000000003', 'marseille', 'M', 'A');
insert into public.groups (id, friday, city, venue_id) values
  ('f0000000-0000-0000-0000-000000000000', '2026-10-23', 'lyon', '10000000-0000-0000-0000-000000000001');
insert into public.group_members (group_id, friday, user_id)
select 'f0000000-0000-0000-0000-000000000000', '2026-10-23',
  ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 6) as n;

-- Left out on Thursday: posted on Wednesday, no group.
insert into public.availabilities (user_id, friday, created_at)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid, '2026-10-23',
  '2026-10-21 12:00 Europe/Paris'::timestamptz + n * interval '1 minute'
from (select generate_series(7, 7) union all select generate_series(11, 16)
  union all select generate_series(18, 19)) as left_out (n);

insert into public.reports (reporter_id, reported_id) values
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000008');

create temporary table queued_before as select count(*) as n from net.http_request_queue;

insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000008', '2026-10-23', '2026-10-23 10:00 Europe/Paris');
select ok(
  not exists (select 1 from public.group_members where user_id = '00000000-0000-0000-0000-000000000008'),
  'two people without a group: no group');

insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000009', '2026-10-23', '2026-10-23 10:01 Europe/Paris');
select ok(
  not exists (select 1 from public.group_members where user_id = '00000000-0000-0000-0000-000000000009'),
  'three without a group, but a report between two: no group');

insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000010', '2026-10-23', '2026-10-23 10:02 Europe/Paris');
select is(
  (select array_agg(right(gm.user_id::text, 2) order by gm.user_id)
   from public.group_members gm
   join public.groups g on g.id = gm.group_id
   where g.city = 'lyon' and g.id <> 'f0000000-0000-0000-0000-000000000000'),
  array['07', '08', '10'],
  'the third compatible one forms a group, with the one left out on Thursday');
select is(
  (select g.venue_id from public.groups g
   where g.city = 'lyon' and g.id <> 'f0000000-0000-0000-0000-000000000000'),
  '10000000-0000-0000-0000-000000000002'::uuid,
  'the group gets the venue nobody has tonight');
select is(
  (select count(*) from net.http_request_queue) - (select n from queued_before),
  3::bigint,
  'one push per member of the new group');
select ok(
  (select bool_and(convert_from(q.body, 'UTF8')::jsonb -> 0 ->> 'title' = 'Ton groupe est prêt !')
   from (select * from net.http_request_queue order by id desc limit 3) as q),
  'the push is the one of story 3.3');

insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000017', '2026-10-23', '2026-10-23 11:00 Europe/Paris');
select is(
  (select count(*) from public.group_members gm join public.groups g on g.id = gm.group_id
   where g.city = 'marseille'),
  6::bigint,
  'a late group holds 6 members at most');
select ok(
  exists (select 1 from public.group_members where user_id = '00000000-0000-0000-0000-000000000017'),
  'the late signup is in it');

insert into public.availabilities (user_id, friday, created_at) values
  ('00000000-0000-0000-0000-000000000020', '2026-10-23', '2026-10-23 12:00 Europe/Paris');
select ok(
  not exists (select 1 from public.groups where city = 'paris'),
  'a city without a venue gets no group, and the signup succeeds');

select * from finish();
rollback;
