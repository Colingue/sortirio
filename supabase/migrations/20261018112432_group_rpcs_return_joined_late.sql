-- Story 10.2: the group screen shows a "Nouveau" badge on a member who joined late, and
-- the chat a "X a rejoint le groupe" line at their arrival. "Late" is deduced, not
-- stored: the Thursday formation inserts the group and its members in one transaction,
-- so they share its created_at; anyone who joined afterwards has a later one.
--
-- The return types grow, so the functions are dropped and recreated.

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
  member_photo_path text,
  member_joined_late boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with my_group as (
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
    p.photo_path,
    member.created_at > g.created_at
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
  member_photo_path text,
  member_joined_late boolean
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
    p.photo_path,
    member.created_at > g.created_at
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

drop function public.get_group_members(uuid);

create function public.get_group_members(target_group_id uuid)
returns table (
  user_id uuid,
  first_name text,
  photo_path text,
  late_joined_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.first_name,
    p.photo_path,
    case when gm.created_at > g.created_at then gm.created_at end
  from public.group_members gm
  join public.groups g on g.id = gm.group_id
  join public.profiles p on p.id = gm.user_id
  where gm.group_id = target_group_id
    and public.is_member_of_group(target_group_id)
  order by p.first_name;
$$;

revoke execute on function public.get_group_members(uuid) from public, anon;
grant execute on function public.get_group_members(uuid) to authenticated;
