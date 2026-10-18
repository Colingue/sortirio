-- Two late signups at the same moment, on two real connections (dblink): the one that
-- holds the city lock forms the group, the other one waits, then joins it. Rows are
-- committed by those connections, so they are deleted at the end.
begin;
select plan(4);

create extension if not exists dblink;

-- The server's network address, not 127.0.0.1: dblink wants a password check, and
-- loopback is trusted.
create temporary table peer as
  select format('dbname=postgres user=postgres password=postgres host=%s port=%s',
    host(inet_server_addr()), inet_server_port()) as conninfo;

select dblink_connect('setup', (select conninfo from peer));
select dblink_connect('first', (select conninfo from peer));
select dblink_connect('second', (select conninfo from peer));

-- L1 (1), L2 (2) were left out on Thursday; A (3) and B (4) sign up late, together.
select dblink_exec('setup', $sql$
  insert into auth.users (id)
  select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
  from generate_series(1, 4) as n;
  insert into public.profiles (id, first_name, birthdate, photo_path, city)
  select u.id, 'U', date '1995-01-01', u.id || '/p.jpg', 'concurrency-city'
  from auth.users u where u.id::text like '00000000-0000-0000-0000-%';
  insert into public.venues (city, name, address) values ('concurrency-city', 'V', 'A');
  insert into public.availabilities (user_id, friday, created_at)
  select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
    public.get_signup_friday(),
    (public.get_signup_friday() - 2 + time '12:00') at time zone 'Europe/Paris'
  from generate_series(1, 2) as n;
$sql$);

-- first takes the lock inside an open transaction; second's signup blocks on it.
select dblink_exec('first', 'begin');
select dblink_exec('first', $sql$
  insert into public.availabilities (user_id, friday, created_at) values (
    '00000000-0000-0000-0000-000000000003', public.get_signup_friday(),
    (public.get_signup_friday() + time '10:00') at time zone 'Europe/Paris')
$sql$);
select dblink_send_query('second', $sql$
  insert into public.availabilities (user_id, friday, created_at) values (
    '00000000-0000-0000-0000-000000000004', public.get_signup_friday(),
    (public.get_signup_friday() + time '10:00') at time zone 'Europe/Paris')
$sql$);
select pg_sleep(0.3);
select is(dblink_is_busy('second'), 1, 'the second signup waits for the city lock');
select dblink_exec('first', 'commit');
select * from dblink_get_result('second') as result (status text);

select is(
  (select count(*) from public.groups where city = 'concurrency-city'),
  1::bigint,
  'one group is formed');
select is(
  (select count(*) from public.group_members gm join public.groups g on g.id = gm.group_id
   where g.city = 'concurrency-city'),
  4::bigint,
  'both signups and both left out are in it');
select is(
  (select count(distinct gm.user_id) from public.group_members gm
   join public.groups g on g.id = gm.group_id where g.city = 'concurrency-city'),
  4::bigint,
  'nobody is placed twice');

select dblink_exec('setup', $sql$
  delete from public.groups where city = 'concurrency-city';
  delete from public.venues where city = 'concurrency-city';
  delete from auth.users where id::text like '00000000-0000-0000-0000-00000000000_';
$sql$);
select dblink_disconnect('setup');
select dblink_disconnect('first');
select dblink_disconnect('second');

select * from finish();
rollback;
