-- US 7.1: the page of a past group, so a member can be reported after the evening
-- (requirement 1). get_my_group() closes on Saturday 06:00, which is exactly when
-- someone who was made uncomfortable wants to act.
--
-- Same columns as get_my_group(), so the app builds both pages with the same code. The
-- difference is the group: named by the caller, with no time window, guarded by
-- is_member_of_group() like get_group_members() and the chat. A non-member gets zero
-- rows, not an error. get_my_group() itself does not change.
--
-- security definer for the same reason as get_my_group(): groups, group_members and
-- venues have zero policy, and profiles is not opened wider (the push token stays
-- private). Three columns of a teammate's profile leave, the age computed here.

create function public.get_group_details(target_group_id uuid)
returns table (
  group_id uuid,
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
