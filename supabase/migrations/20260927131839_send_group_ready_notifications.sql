-- US 3.3: everything the notification send is, for one city and one Friday. Kept out of
-- form_friday_groups so the job stays readable, and so an envoi can be replayed by hand
-- from psql without waiting for a Thursday.
--
-- One http_post per city, never one per member: the messages of the whole city go up as
-- a single JSON array, which is the shape Expo's API expects anyway. No token in the
-- city means no array at all, and no call — Expo refuses an empty one.
--
-- The join on group_members is what holds requirement 4: someone available but left out
-- of every group has no row there, so no message is built for them. Nothing else in this
-- function filters anyone.
--
-- The title and the body are frozen here, identical for everyone (requirement 5): no
-- venue name, no first names. Discovering them is what opening the app is for.
--
-- security invoker, like the job that calls it: the caller is pg_cron's postgres, which
-- bypasses RLS. Execute is revoked from every client role — nothing outside the database
-- has any business sending a push.

create function public.send_group_ready_notifications(target_friday date, target_city text)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  messages jsonb;
begin
  select jsonb_agg(jsonb_build_object(
      'to', p.expo_push_token,
      'title', 'Ton groupe est prêt !',
      'body', 'Ouvre l''app pour découvrir le lieu de rendez-vous et les personnes du groupe'
    ))
    into messages
  from public.group_members gm
  join public.groups g on g.id = gm.group_id
  join public.profiles p on p.id = gm.user_id
  where g.friday = target_friday
    and g.city = target_city
    and p.expo_push_token is not null;

  if messages is null then
    return;
  end if;

  perform net.http_post(
    url := 'https://exp.host/--/api/v2/push/send',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := messages
  );
end;
$$;

revoke execute on function public.send_group_ready_notifications(date, text)
  from public, anon, authenticated;
