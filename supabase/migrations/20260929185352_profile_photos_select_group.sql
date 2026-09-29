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
