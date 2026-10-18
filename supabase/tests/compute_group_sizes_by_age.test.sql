begin;
select plan(7);

-- 12 birthdates spread evenly over 6 years: no age gap worth an extra group.
select results_eq(
  $$ select public.compute_group_sizes_by_age(
       array(select (date '1998-01-01' + n * 199) from generate_series(0, 11) as n),
       5) $$,
  array[6, 6],
  'continuous ages: as many groups of 6 as possible');

-- 4 people born 1981-1985, then 8 born 2000-2004: the older 4 stay on their own.
select results_eq(
  $$ select public.compute_group_sizes_by_age(
       array(
         select d from (
           select date '1981-01-01' + n * 548 as d from generate_series(0, 3) as n
           union all
           select date '2000-01-01' + n * 209 from generate_series(0, 7) as n
         ) as birthdates order by d),
       5) limit 1 $$,
  array[4],
  'an age gap: the older 4 form the first group on their own');

select is(
  (select count(*) from public.compute_group_sizes_by_age(
     array(
       select d from (
         select date '1981-01-01' + n * 548 as d from generate_series(0, 3) as n
         union all
         select date '2000-01-01' + n * 209 from generate_series(0, 7) as n
       ) as birthdates order by d),
     5)),
  3::bigint,
  'an age gap: 3 groups instead of 6 + 6');

select results_eq(
  $$ select public.compute_group_sizes_by_age(
       array[date '1960-01-01', date '1975-01-01', date '1990-01-01', date '2000-01-01', date '2006-01-01'],
       5) $$,
  array[5],
  'five people: one group whatever the ages');

select is_empty(
  $$ select public.compute_group_sizes_by_age(array[date '1990-01-01', date '1991-01-01'], 5) $$,
  'under 3 people: no group');

-- Every count from 3 to 40, with uneven ages: everyone placed, groups of 3 to 6.
select is_empty(
  $$ select member_count
     from generate_series(3, 40) as member_count
     cross join lateral (
       select array(
         select date '1970-01-01' + ((n * n * 37) % 9000)
         from generate_series(1, member_count) as n
         order by 1) as birthdates
     ) as input
     cross join lateral (
       select sum(s) as total, min(s) as smallest, max(s) as largest
       from public.compute_group_sizes_by_age(input.birthdates, 5) as s
     ) as sizes
     where sizes.total is distinct from member_count
        or sizes.smallest < 3
        or sizes.largest > 6 $$,
  'from 3 to 40 people: everyone placed in groups of 3 to 6');

-- A huge extra-group cost falls back to the old rule: the fewest groups possible.
select is_empty(
  $$ select member_count
     from generate_series(3, 40) as member_count
     where (
       select count(*) from public.compute_group_sizes_by_age(
         array(
           select date '1970-01-01' + ((n * n * 37) % 9000)
           from generate_series(1, member_count) as n
           order by 1),
         1000)
     ) <> ceil(member_count / 6.0) $$,
  'a huge extra-group cost: the fewest groups possible');

select * from finish();
rollback;
