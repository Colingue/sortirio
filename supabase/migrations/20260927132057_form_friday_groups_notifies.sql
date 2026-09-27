-- US 3.3: the job notifies the city it has just formed, in the same execution as the
-- formation (requirement 7). One line, at the end of the per-city iteration.
--
-- Where it sits is the whole point. It is the last statement of the loop body, so both
-- `continue` above have already had their say: a city skipped for having its groups
-- already (idempotence of US 3.1) and a city skipped for having no venue never reach it.
-- Nobody is notified twice for the same Friday, and nobody is notified for a group that
-- was not formed.
--
-- perform, not a variable: the call returns void and its failure is not the job's
-- business. pg_net hands the request to a background worker after the commit, so the
-- groups and the venues are created whatever Expo answers (requirement 6).

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
  venue_ids uuid[];
  venue_count integer;
  group_index integer;
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
    continue when exists (
      select 1 from public.groups g
      where g.friday = target_friday and g.city = target_city
    );

    select array_agg(v.id order by random())
      into venue_ids
    from public.venues v
    where v.city = target_city;

    venue_count := coalesce(array_length(venue_ids, 1), 0);

    if venue_count = 0 then
      raise warning 'form_friday_groups: no venue for city %, no group formed', target_city;
      continue;
    end if;

    -- order by random() here, not on the insert below: it is the one and only
    -- draw, so re-slicing the array afterwards stays a pure sort. Users already
    -- placed in a group for this Friday are excluded on top of the
    -- unique (user_id, friday) constraint — belt over the schema's suspenders.
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
    group_index := 0;

    -- Under 3 candidates, compute_group_sizes() returns no rows: no group is
    -- created for this city, and no half-formed row is left in `groups`
    -- (requirement 6).
    for group_size in
      select * from public.compute_group_sizes(candidate_count)
    loop
      insert into public.groups (friday, city, venue_id)
        values (
          target_friday,
          target_city,
          venue_ids[(group_index % venue_count) + 1]
        )
        returning id into new_group_id;

      insert into public.group_members (group_id, friday, user_id)
        select new_group_id, target_friday, candidates[i]
        from generate_series(next_index, next_index + group_size - 1) as i;

      next_index := next_index + group_size;
      group_index := group_index + 1;
    end loop;

    perform public.send_group_ready_notifications(target_friday, target_city);
  end loop;
end;
$$;
