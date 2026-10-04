-- US 5.3: the chat does not close, so a teammate's photo does not either
-- (requirements 13, 17, 18). profile_photos_select_group read get_my_group(), which
-- closes on Saturday 06:00: a week later, every photo of an old chat failed to sign.
--
-- The predicate becomes "this path belongs to someone who shares, or shared, a group
-- with me". A definer function again, for the reason the old policy gave: the policy
-- runs as the caller, and group_members has RLS with zero policy.
--
-- Not get_my_groups(), which returns first names, and not get_group_members(), which
-- takes a group the policy does not have. And the policy no longer depends on
-- get_my_group(): that function stays as it is (requirement 19), and can now change
-- without dropping a policy.
--
-- Cost: mine is found by group_members_user_friday_unique (user_id, friday), the
-- teammates by the primary key (group_id, user_id). name is compared to a subquery that
-- does not reference the outer row, so Postgres hashes it once per statement, as before.
--
-- Accepted by the spec: a stranger's photo, once seen for an evening, stays visible to
-- their former teammates for good. Story 7.1 (report) is the way out.

create function public.get_my_teammate_photo_paths()
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  -- auth.uid() wrapped in a select so Postgres evaluates it once, not per row.
  select p.photo_path
  from public.group_members mine
  join public.group_members other on other.group_id = mine.group_id
  join public.profiles p on p.id = other.user_id
  where mine.user_id = (select auth.uid());
$$;

revoke execute on function public.get_my_teammate_photo_paths() from public, anon;
grant execute on function public.get_my_teammate_photo_paths() to authenticated;

drop policy "profile_photos_select_group" on storage.objects;

create policy "profile_photos_select_group" on storage.objects
  for select to authenticated
  using (bucket_id = 'profile-photos'
    and name in (select public.get_my_teammate_photo_paths()));
