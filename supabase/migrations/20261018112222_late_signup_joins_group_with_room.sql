-- Story 10.2: a late signup joins, right away, the least full group of their city for
-- that Friday that still has room (under 6) and holds nobody they reported or who
-- reported them. Age is ignored, like in the Thursday formation.
--
-- The advisory lock, per city and Friday, serialises two late signups racing for the
-- last seat: the second one counts the members only once the first has committed, so
-- a group never reaches 7.
--
-- security definer: it writes group_members, which no client role can write.

create function public.join_group_with_room(target_user_id uuid, target_friday date)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  target_city text;
  joined_group_id uuid;
begin
  select p.city into target_city from public.profiles p where p.id = target_user_id;

  perform pg_advisory_xact_lock(hashtext(target_city || target_friday::text));

  select g.id into joined_group_id
  from public.groups g
  join public.group_members gm on gm.group_id = g.id
  where g.friday = target_friday
    and g.city = target_city
  group by g.id
  having count(*) < 6
    and not exists (
      select 1
      from public.group_members other
      join public.reports r
        on (r.reporter_id = target_user_id and r.reported_id = other.user_id)
        or (r.reported_id = target_user_id and r.reporter_id = other.user_id)
      where other.group_id = g.id
    )
  order by count(*), min(gm.created_at)
  limit 1;

  if joined_group_id is null then
    return null;
  end if;

  insert into public.group_members (group_id, friday, user_id)
    values (joined_group_id, target_friday, target_user_id)
    on conflict do nothing;

  return joined_group_id;
end;
$$;

revoke execute on function public.join_group_with_room(uuid, date)
  from public, anon, authenticated;

-- Story 10.2, requirement 9: the push of story 3.3, to the late signup alone. The
-- members already there get nothing: they see the newcomer in the chat.
create function public.send_group_ready_notification_to_user(target_user_id uuid)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  push_token text;
begin
  select p.expo_push_token into push_token from public.profiles p where p.id = target_user_id;

  if push_token is null then
    return;
  end if;

  perform net.http_post(
    url := 'https://exp.host/--/api/v2/push/send',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_array(jsonb_build_object(
      'to', push_token,
      'title', 'Ton groupe est prêt !',
      'body', 'Ouvre l''app pour découvrir le lieu de rendez-vous et les personnes du groupe'
    ))
  );
end;
$$;

revoke execute on function public.send_group_ready_notification_to_user(uuid)
  from public, anon, authenticated;

-- "Late" is deduced, not stored: the availability was created after the Thursday 19:00
-- formation of its Friday. Placed in the same transaction as the signup, so the app
-- finds the group as soon as the insert returns.
create function public.availabilities_join_group_when_late()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_at > ((new.friday - 1) + time '19:00') at time zone 'Europe/Paris'
    and public.join_group_with_room(new.user_id, new.friday) is not null then
    perform public.send_group_ready_notification_to_user(new.user_id);
  end if;
  return new;
end;
$$;

create trigger availabilities_join_group_when_late
  after insert on public.availabilities
  for each row execute function public.availabilities_join_group_when_late();
