-- US 4.1: the one and only door onto a group. groups, group_members and venues keep
-- their RLS with zero policy — "nobody reads" stays the right default — and this
-- function is the single exception, granted to authenticated alone.
--
-- security definer because reading a group means crossing four tables: three with no
-- read policy at all, and profiles, which has profiles_select_own. Widening that policy
-- to teammates is what this function exists to avoid: a select policy exposes the whole
-- row, expo_push_token included (requirement 13). A definer function exposes exactly
-- three columns of someone else's profile — first name, age, photo — and nothing else.
--
-- The age is computed here so the birthdate never leaves the database (requirement 9).
-- photo_path is not profile data, it is the storage key the app signs a URL for; the
-- policy that lets it read a teammate's photo is the next migration, and it reads that
-- key from this very function rather than duplicating the window below.
--
-- The Saturday 06:00 bound is an access rule, not a display rule (requirement 14): it
-- lives in the where clause, computed in Europe/Paris, so a phone set to another
-- timezone cannot shift it and a client has no date to pass — hence none to forge. The
-- lower bound is the existence of the row itself (requirement 1): a late Thursday job
-- delays the screen, it does not break it.
--
-- order by friday limit 1 is a belt over group_members_user_friday_unique's suspenders.
-- One group per Friday is a schema constraint and form_friday_groups only ever builds
-- the coming Friday, so there is never a second candidate; if there ever were, the
-- nearest Friday wins and the two are never mixed into one list.

create function public.get_my_group()
returns table (
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
