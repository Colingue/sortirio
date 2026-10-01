-- US 5.1: the group screen has nothing to hand the "Discuter" button without the
-- group's id (requirement 4). One column added to the returns table, nothing else
-- touched — the Saturday 06:00 window, the order, the three profile columns all stay
-- exactly as 20260929175926_get_my_group.sql left them.
--
-- drop and create, not create or replace: Postgres refuses to change the return type
-- of an existing function ("cannot change return type of existing function"), and
-- adding a column to a returns table is changing it.
--
-- And the drop alone fails too: profile_photos_select_group reads
-- get_my_group().member_photo_path, so the function has a dependent object. The
-- policy is therefore dropped first and recreated identically at the bottom, in the
-- same migration — it is never absent outside this transaction.

drop policy "profile_photos_select_group" on storage.objects;

drop function public.get_my_group();

create function public.get_my_group()
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
  -- Deterministic order, and I am in the list: seeing myself is the proof I am in
  -- the group (requirement 8).
  order by p.first_name;
$$;

revoke execute on function public.get_my_group() from public, anon;
grant execute on function public.get_my_group() to authenticated;

-- Recreated verbatim from 20260929185352_profile_photos_select_group.sql, original
-- comment included: the policy did not change, only the function it depends on had
-- to be dropped to grow a column.
--
-- US 4.1: the open question left by 20260908205829_profile_photos — "group members will
-- need to see each other's photo (story 4.1), and how, signed URLs or a wider read
-- policy, is that story's decision". It is a read policy, and it is this one.
--
-- The predicate is get_my_group() itself, not a copy of its window. Two reasons:
--
-- 1. The policy cannot look at group_members on its own. It runs as the caller, and
--    group_members has RLS with zero policy, so the join would return nothing. Only a
--    definer function can see that table, and there is already exactly one.
-- 2. A second definer function repeating the Saturday 06:00 bound would be a second
--    thing to keep in phase. Here the photo a teammate may read and the row the screen
--    may read are, by construction, the same decision.
--
-- The cost the spec worried about — "a join per photo" — does not happen: name is
-- compared to a subquery that does not reference the outer row, so Postgres hashes it
-- once per statement (a hashed SubPlan), not once per object. get_my_group() is stable
-- and returns at most six rows.
--
-- profile_photos_select_own stays as it is. Outside the window I still see my own photo;
-- this policy only ever adds my current teammates, and only while their group is
-- visible.

create policy "profile_photos_select_group" on storage.objects
  for select to authenticated
  using (bucket_id = 'profile-photos'
    and name in (select member_photo_path from public.get_my_group()));
