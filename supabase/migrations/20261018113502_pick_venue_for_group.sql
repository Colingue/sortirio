-- Story 10.3: the venue draw of story 3.2, callable at any time on the Friday, so a late
-- group formed at 15:00 gets a venue nobody has tonight. A random venue among the least
-- used of the city that Friday: a free one while one is left, else the spread of 3.2.
-- null when the city has no venue.
create function public.pick_venue_for_group(target_city text, target_friday date)
returns uuid
language sql
volatile
security definer
set search_path = ''
as $$
  select v.id
  from public.venues v
  left join public.groups g on g.venue_id = v.id and g.friday = target_friday
  where v.city = target_city
  group by v.id
  order by count(g.id), random()
  limit 1;
$$;

revoke execute on function public.pick_venue_for_group(text, date)
  from public, anon, authenticated;

-- The Thursday job draws group by group through the same function. Picking the least
-- used each time is the round-robin of 3.2 (7 groups for 5 venues → 2, 2, 1, 1, 1).
create or replace function public.form_friday_groups(
  moment timestamp default (now() at time zone 'Europe/Paris')
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  target_friday date := public.get_next_open_friday(moment) - 7;
  target_city text;
  candidates uuid[];
  candidate_count integer;
  next_index integer;
  group_size integer;
  new_group_id uuid;
begin
  if target_friday <= moment::date then
    return;
  end if;

  for target_city in
    select distinct p.city
    from public.availabilities a
    join public.profiles p on p.id = a.user_id
    where a.friday = target_friday
  loop
    -- Idempotence (requirement 7): a city that already has a group for this
    -- Friday is skipped, never topped up or overwritten.
    -- ponytail: a late signup in the seconds between 19:00 and this job can form a
    -- late group first (story 10.3) and make the job skip the whole city. Accepted;
    -- the fix is to form groups from whoever is still ungrouped instead of skipping.
    continue when exists (
      select 1 from public.groups g
      where g.friday = target_friday and g.city = target_city
    );

    if not exists (select 1 from public.venues v where v.city = target_city) then
      raise warning 'form_friday_groups: no venue for city %, no group formed', target_city;
      continue;
    end if;

    select array_agg(a.user_id order by random())
      into candidates
    from public.availabilities a
    join public.profiles p on p.id = a.user_id
    where a.friday = target_friday
      and p.city = target_city
      and not exists (
        select 1 from public.group_members gm
        where gm.user_id = a.user_id and gm.friday = target_friday
      );

    candidate_count := coalesce(array_length(candidates, 1), 0);
    next_index := 1;

    for group_size in
      select * from public.compute_group_sizes(candidate_count)
    loop
      insert into public.groups (friday, city, venue_id)
        values (target_friday, target_city, public.pick_venue_for_group(target_city, target_friday))
        returning id into new_group_id;

      insert into public.group_members (group_id, friday, user_id)
        select new_group_id, target_friday, candidates[i]
        from generate_series(next_index, next_index + group_size - 1) as i;

      next_index := next_index + group_size;
    end loop;

    perform public.send_group_ready_notifications(target_friday, target_city);
  end loop;
end;
$$;
