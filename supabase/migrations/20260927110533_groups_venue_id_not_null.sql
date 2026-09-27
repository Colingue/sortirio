-- Puts into the schema what the previous migration's job already promises, so
-- requirement 2 ("a group without a venue exists at no point, not even transiently")
-- stops depending on the job's code being right.
--
-- The delete is the price of the constraint: groups formed before US 3.2 have no venue,
-- and set not null would refuse to run while they are there. They are safe to drop —
-- test data for a past Friday, no screen reads groups until story 4.1, and no tester has
-- the app yet. This is the same pre-pilot window as the "rewrite a migration and replay
-- the database" exception in supabase/CLAUDE.md, and it dies the same day: once a tester
-- is signed up, a group row is somebody's Friday, and a migration may no longer delete
-- one. group_members follows through its on delete cascade.

delete from public.groups where venue_id is null;

alter table public.groups
  alter column venue_id set not null;
