-- Story 10.3: the "no report between us" rule of story 10.2, out in its own function so
-- the late group formation checks the very same rule between all its members.
create function public.has_report_between(user_a uuid, user_b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.reports r
    where (r.reporter_id = user_a and r.reported_id = user_b)
      or (r.reporter_id = user_b and r.reported_id = user_a)
  );
$$;

revoke execute on function public.has_report_between(uuid, uuid)
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
      where other.group_id = g.id
        and public.has_report_between(target_user_id, other.user_id)
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
