-- US 5.3: the chat's authors, for the group it is showing, with no time window
-- (requirements 12, 16, 18).
--
-- The chat used to read its authors from get_my_group(). That function answers "my
-- group of this week" and closes on Saturday 06:00: a chat three weeks old would find
-- no author, or the authors of the next group. get_my_group() itself does not change
-- (requirement 19).
--
-- security definer because group_members and profiles have no policy wide enough: the
-- caller alone cannot see their teammates. The guard is is_member_of_group(), the same
-- one the chat's message policies use, so who may read the messages and who may read
-- their authors stay one decision. It sits in the where: a non-member gets zero rows,
-- not an error. No age: the chat does not show it.

create function public.get_group_members(target_group_id uuid)
returns table (
  user_id uuid,
  first_name text,
  photo_path text
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.first_name, p.photo_path
  from public.group_members gm
  join public.profiles p on p.id = gm.user_id
  where gm.group_id = target_group_id
    and public.is_member_of_group(target_group_id)
  order by p.first_name;
$$;

revoke execute on function public.get_group_members(uuid) from public, anon;
grant execute on function public.get_group_members(uuid) to authenticated;
