-- US 5.1: without this line Realtime broadcasts nothing for the table and the
-- subscription stays silent, with no error anywhere (requirement 21).
--
-- A migration and not a click in the dashboard: the hosted project is rebuilt from
-- supabase/migrations alone, so a publication set by hand is a drift waiting to
-- happen — the next `db reset --linked` would silently kill the chat.
--
-- supabase_realtime is created by the platform, so this is an alter, not a create.

alter publication supabase_realtime add table public.group_messages;
