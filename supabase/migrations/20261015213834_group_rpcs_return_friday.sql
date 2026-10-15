-- The group screens show the evening's date ("Vendredi 16 octobre · 20 h"), not just
-- "Vendredi". One column, friday, added to get_my_group() and get_group_details();
-- the window, the guard and the order stay exactly as before.
--
-- drop and create: adding a column to a returns table changes the return type. No
-- policy depends on these functions any more (profile_photos_select_group reads
-- get_my_teammate_photo_paths() since 20261004165637).

drop function public.get_my_group();

create function public.get_my_group()
returns table (
  group_id uuid,
  friday date,
  venue_name text,
  venue_address text,
  member_user_id uuid,
  member_first_name text,
  member_age integer,
  member_photo_path text
)
language sql
stable
security definer
set search_path = ''
as $$
  with my_group as (
    -- auth.uid() is wrapped in a select so Postgres evaluates it once, not per row.
    -- The (user_id, friday) unique index serves this lookup and its ordering.
    select gm.group_id
    from public.group_members gm
    where gm.user_id = (select auth.uid())
      and (now() at time zone 'Europe/Paris') < ((gm.friday + 1) + time '06:00')
    order by gm.friday
    limit 1
  )
  select
    my_group.group_id,
    g.friday,
    v.name,
    v.address,
    p.id,
    p.first_name,
    extract(year from age(p.birthdate))::integer,
    p.photo_path
  from my_group
  join public.groups g on g.id = my_group.group_id
  join public.venues v on v.id = g.venue_id
  join public.group_members member on member.group_id = my_group.group_id
  join public.profiles p on p.id = member.user_id
  order by p.first_name;
$$;

revoke execute on function public.get_my_group() from public, anon;
grant execute on function public.get_my_group() to authenticated;

drop function public.get_group_details(uuid);

create function public.get_group_details(target_group_id uuid)
returns table (
  group_id uuid,
  friday date,
  venue_name text,
  venue_address text,
  member_user_id uuid,
  member_first_name text,
  member_age integer,
  member_photo_path text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    g.id,
    g.friday,
    v.name,
    v.address,
    p.id,
    p.first_name,
    extract(year from age(p.birthdate))::integer,
    p.photo_path
  from public.groups g
  join public.venues v on v.id = g.venue_id
  join public.group_members member on member.group_id = g.id
  join public.profiles p on p.id = member.user_id
  where g.id = target_group_id
    and public.is_member_of_group(target_group_id)
  order by p.first_name;
$$;

revoke execute on function public.get_group_details(uuid) from public, anon;
grant execute on function public.get_group_details(uuid) to authenticated;
