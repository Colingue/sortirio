-- Story 10.3: a late signup that found no group with room (10.2) forms a new one as soon
-- as 3 compatible people of the city are without a group for that Friday, people left
-- out on Thursday included. No job at 18:00: the signup itself does it, and signups
-- close at 18:00 (10.1), so the search stops there.
--
-- Same advisory lock as join_group_with_room, per city and Friday (reentrant within the
-- transaction): two signups at the same second run one after the other, and the second
-- one, under read committed, sees the first one's group. One group, nobody placed twice.
--
-- security definer: it writes groups and group_members, which no client role can write.
create function public.form_late_group(target_user_id uuid, target_friday date)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  target_city text;
  picked_venue_id uuid;
  candidate_id uuid;
  member_ids uuid[];
  new_group_id uuid;
begin
  select p.city into target_city from public.profiles p where p.id = target_user_id;

  perform pg_advisory_xact_lock(hashtext(target_city || target_friday::text));

  member_ids := array[target_user_id];

  -- The newcomer first, then the others in signup order, skipping anyone with a report
  -- against someone already kept (the rule of 10.2, between every two members).
  for candidate_id in
    select a.user_id
    from public.availabilities a
    join public.profiles p on p.id = a.user_id
    where a.friday = target_friday
      and p.city = target_city
      and a.user_id <> target_user_id
      and not exists (
        select 1 from public.group_members gm
        where gm.user_id = a.user_id and gm.friday = target_friday
      )
    order by a.created_at
  loop
    exit when array_length(member_ids, 1) = 6;
    continue when exists (
      select 1 from unnest(member_ids) as kept (id)
      where public.has_report_between(candidate_id, kept.id)
    );
    member_ids := member_ids || candidate_id;
  end loop;

  if array_length(member_ids, 1) < 3 then
    return null;
  end if;

  picked_venue_id := public.pick_venue_for_group(target_city, target_friday);

  if picked_venue_id is null then
    raise warning 'form_late_group: no venue for city %, no group formed', target_city;
    return null;
  end if;

  insert into public.groups (friday, city, venue_id)
    values (target_friday, target_city, picked_venue_id)
    returning id into new_group_id;

  insert into public.group_members (group_id, friday, user_id)
    select new_group_id, target_friday, member_id from unnest(member_ids) as member_id;

  perform public.send_group_ready_notification_to_user(member_id)
  from unnest(member_ids) as member_id;

  return new_group_id;
end;
$$;

revoke execute on function public.form_late_group(uuid, date)
  from public, anon, authenticated;

-- The late signup trigger of 10.2 tries the new group when no group had room.
create or replace function public.availabilities_join_group_when_late()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_at <= ((new.friday - 1) + time '19:00') at time zone 'Europe/Paris' then
    return new;
  end if;

  if public.join_group_with_room(new.user_id, new.friday) is not null then
    perform public.send_group_ready_notification_to_user(new.user_id);
  else
    perform public.form_late_group(new.user_id, new.friday);
  end if;
  return new;
end;
$$;
