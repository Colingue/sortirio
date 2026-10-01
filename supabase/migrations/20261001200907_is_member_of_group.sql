-- US 5.1: the door onto group_messages. Both of that table's policies call this
-- function, and nothing else does.
--
-- security definer because a policy runs with the caller's rights and group_members
-- has RLS with zero policy (requirement 19): a policy that joined group_members on its
-- own would see no row, and every message would be invisible to everyone.
--
-- get_my_group() cannot play this role, even though it also crosses group_members.
-- It answers a different question: it returns *the* one group whose Saturday 06:00
-- window is still open, ordered and limited to one row. The chat has no window
-- (requirement 20) and is asked about a group_id the caller names. Reusing it would
-- close the chat at 06:00 and would break the moment a user has two groups.
--
-- The body stays an exists on group_members' primary key, (group_id, user_id): the
-- select policy is evaluated once per row read and once per Realtime subscriber per
-- message, so it must stay an index lookup, never a join.

create function public.is_member_of_group(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  -- auth.uid() wrapped in a select so Postgres evaluates it once, not per row.
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group_id
      and gm.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_member_of_group(uuid) from public, anon;
grant execute on function public.is_member_of_group(uuid) to authenticated;
