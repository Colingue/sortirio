-- US 3.2: every group the job creates gets a venue from its own city, in the very same
-- insert (requirement 2) — never an update afterwards, so a group without a venue does
-- not exist even for the length of a statement.
--
-- The draw is the shuffle plus the modulo below, and nothing else. Shuffling the city's
-- venues once, then handing group i the venue at (i mod venue_count), *is* "spread as
-- far as possible" (requirement 5): 7 groups over 5 venues lands on 2, 2, 1, 1, 1 with
-- no code counting anything. Re-drawing order by random() on every execution is what
-- makes a venue free to come back the following week (requirement 7).
--
-- The venue draw sits after the idempotence check and before the first insert: a city
-- with no venue at all must create no group (requirement 6), and the warning is there
-- because that case is a configuration mistake — the list has to be filled before
-- Thursday. Without the raise, a forgotten city produces nothing and says nothing.
-- The second cron slot the same evening retries it, so venues inserted in between still
-- get their groups.

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
  end loop;
end;
$$;
