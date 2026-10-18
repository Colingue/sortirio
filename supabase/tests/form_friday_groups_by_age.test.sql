begin;
select plan(4);

alter table public.availabilities disable trigger availabilities_check_open_friday;

insert into public.venues (city, name, address) values ('lyon', 'V', 'A');

-- Lyon: users 1-4 born 1981-1985, users 5-12 born 2000-2004. Paris: users 21-24,
-- born 1960 to 2004, the only 4 of their city.
insert into auth.users (id)
select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 24) as n
where n <= 12 or n >= 21;

insert into public.profiles (id, first_name, birthdate, photo_path, city)
select u.id, 'U',
  case
    when u.n <= 4 then date '1981-01-01' + (u.n - 1) * 548
    when u.n <= 12 then date '2000-01-01' + (u.n - 5) * 209
    else date '1960-01-01' + (u.n - 21) * 5000
  end,
  u.id || '/p.jpg',
  case when u.n <= 12 then 'lyon' else 'paris' end
from (
  select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid as id, n
  from generate_series(1, 24) as n
  where n <= 12 or n >= 21
) as u;

insert into public.venues (city, name, address) values ('paris', 'P', 'A');

insert into public.availabilities (user_id, friday, created_at)
select p.id, '2026-10-30', '2026-10-27 12:00 Europe/Paris'
from public.profiles p;

select public.form_friday_groups('2026-10-29 19:30');

select is(
  (select count(*) from public.groups where friday = '2026-10-30' and city = 'lyon'),
  3::bigint,
  'an age gap in Lyon: 3 groups instead of 6 + 6');

select is(
  (select array_agg(gm.user_id order by gm.user_id)
   from public.group_members gm
   where gm.group_id = (
     select group_id from public.group_members
     where user_id = '00000000-0000-0000-0000-000000000001')),
  array(
    select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
    from generate_series(1, 4) as n),
  'the 4 born 1981-1985 are together, with nobody born 2000-2004');

select is(
  (select count(*) from public.group_members gm
   join public.groups g on g.id = gm.group_id
   where g.friday = '2026-10-30' and g.city = 'paris'
   group by g.id),
  4::bigint,
  'Paris, 4 people born 1960 to 2004: one group of 4');

select hasnt_function('public', 'compute_group_sizes', 'the old cut is gone');

select * from finish();
rollback;
