-- Story 10.3: the group announcement shows "Groupe de dernière minute" for a group
-- formed after the Thursday 19:00 formation. Deduced from groups.created_at, not stored.
--
-- The return type grows, so the function is dropped and recreated.

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
  member_joined_late boolean,
  group_formed_late boolean
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
    member.created_at > g.created_at,
    g.created_at > ((g.friday - 1) + time '19:00') at time zone 'Europe/Paris'
  from my_group
  join public.groups g on g.id = my_group.group_id
  join public.venues v on v.id = g.venue_id
  join public.group_members member on member.group_id = my_group.group_id
  join public.profiles p on p.id = member.user_id
  order by p.first_name;
$$;

revoke execute on function public.get_my_group() from public, anon;
grant execute on function public.get_my_group() to authenticated;
