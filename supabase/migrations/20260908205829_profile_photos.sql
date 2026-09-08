-- The sign-up photo. Private bucket: group members will need to see each other's
-- photo (story 4.1), and how — signed URLs or a wider read policy — is that story's
-- decision, not this one. Until then nobody reads a photo but its owner.

insert into storage.buckets (id, name, public)
  values ('profile-photos', 'profile-photos', false);

-- Every policy is bounded to the first folder of the object name, so a user only
-- ever reaches {their id}/. auth.uid() is wrapped in a select so Postgres evaluates
-- it once per query instead of once per row.
--
-- update and delete are not decoration: after a failed sign-up the next attempt has
-- to overwrite the file it already uploaded at the same fixed path.

create policy "profile_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "profile_photos_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "profile_photos_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "profile_photos_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
