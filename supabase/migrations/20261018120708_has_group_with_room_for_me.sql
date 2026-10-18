-- Story 10.4: the choice of a group with room, out of join_group_with_room (10.2) in its
-- own function, so the home alert and the placement apply the very same rule: my city,
-- that Friday, under 6 members, nobody reported between us. Age is ignored.
--
-- No lock here: join_group_with_room takes it before calling.
create function public.find_group_with_room(target_user_id uuid, target_friday date)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select g.id
  from public.groups g
  join public.group_members gm on gm.group_id = g.id
  where g.friday = target_friday
    and g.city = (select p.city from public.profiles p where p.id = target_user_id)
  group by g.id
  having count(*) < 6
    and not exists (
      select 1
      from public.group_members other
      where other.group_id = g.id
        and public.has_report_between(target_user_id, other.user_id)
    )
  order by count(*), min(gm.created_at)
  limit 1;
$$;

revoke execute on function public.find_group_with_room(uuid, date)
  from public, anon, authenticated;

create or replace function public.join_group_with_room(target_user_id uuid, target_friday date)
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

  joined_group_id := public.find_group_with_room(target_user_id, target_friday);

  if joined_group_id is null then
    return null;
  end if;

  insert into public.group_members (group_id, friday, user_id)
    values (joined_group_id, target_friday, target_user_id)
    on conflict do nothing;

  return joined_group_id;
end;
$$;

-- The home alert: true when signing up now would place me in a group. security definer
-- because RLS hides the other groups; only a boolean leaves, never a count. `moment` is
-- only there for tests: the app calls it without arguments. Before Thursday 19:00 no
-- group exists for the signup Friday, so it is false.
create function public.has_group_with_room_for_me(
  moment timestamp default (now() at time zone 'Europe/Paris')
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.find_group_with_room((select auth.uid()), public.get_signup_friday(moment))
    is not null;
$$;

revoke execute on function public.has_group_with_room_for_me(timestamp) from public, anon;
grant execute on function public.has_group_with_room_for_me(timestamp) to authenticated;
