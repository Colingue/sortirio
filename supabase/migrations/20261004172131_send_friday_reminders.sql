-- US 6.1: the Friday 18h reminder, "C'est ce soir ! [lieu], 20 h", to every member of a
-- group of that Friday. Built like send_group_ready_notifications (US 3.3): one
-- http_post carrying the whole array, no call at all when nobody has a token — Expo
-- refuses an empty array.
--
-- The guard is what makes the job idempotent (requirement 5). pg_cron runs it at 16h
-- and 17h UTC, and only one of the two is 18h in Paris: 16h UTC in summer (CEST), 17h
-- UTC in winter (CET). The other slot returns before reading anything. No table records
-- a send; the clock is enough, as in form_friday_groups.
--
-- `moment` defaults to the Paris clock, like form_friday_groups: a Friday 17h / 18h can
-- be checked from psql with a single query instead of waiting for one.
--
-- 20 h is written in the body: same time for every group at the MVP, and no column
-- stores it (requirement 4).
--
-- No groupId in data: the app routes any push carrying one to the chat (US 5.2), and
-- this one must open the group screen instead (requirement 7).
--
-- security invoker, like the job that calls it: pg_cron's postgres bypasses RLS.
-- http_post only queues the request, so an expired token or Expo being down never
-- reaches this code (requirement 6).

create function public.send_friday_reminders(
  moment timestamp default (now() at time zone 'Europe/Paris')
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  messages jsonb;
begin
  if extract(isodow from moment) <> 5 or extract(hour from moment) <> 18 then
    return;
  end if;

  select jsonb_agg(jsonb_build_object(
      'to', p.expo_push_token,
      'title', 'C''est ce soir !',
      'body', v.name || ', 20 h',
      'data', jsonb_build_object('url', '/group')
    ))
    into messages
  from public.group_members gm
  join public.groups g on g.id = gm.group_id
  join public.venues v on v.id = g.venue_id
  join public.profiles p on p.id = gm.user_id
  where g.friday = moment::date
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

revoke execute on function public.send_friday_reminders(timestamp)
  from public, anon, authenticated;
