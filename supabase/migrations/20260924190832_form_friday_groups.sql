-- The job. It never takes a Friday as input: get_next_open_friday() - 7 is the
-- Friday that just closed (after jeudi 19h, that function already answers with
-- the *next* Friday, so seven days earlier is the one whose availabilities are
-- final). The guard below repeats that same subtraction, so if jeudi 19h has not
-- actually passed yet, target_friday lands on or before today and the job is a
-- no-op — this is what lets pg_cron (task 5) schedule two UTC slots without ever
-- forming a Friday's groups twice.
--
-- volatile, not stable: order by random() below makes two calls with the same
-- arguments return different rows, which is exactly what stable promises never
-- happens. security invoker, with execute revoked from every client role: pg_cron
-- runs this as postgres, nobody else needs to.

create function public.form_friday_groups()
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  target_friday date := public.get_next_open_friday() - 7;
  target_city text;
  candidates uuid[];
  candidate_count integer;
  next_index integer;
  group_size integer;
  new_group_id uuid;
begin
  if target_friday <= current_date then
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

    -- Under 3 candidates, compute_group_sizes() returns no rows: no group is
    -- created for this city, and no half-formed row is left in `groups`
    -- (requirement 6).
    for group_size in
      select * from public.compute_group_sizes(candidate_count)
    loop
      insert into public.groups (friday, city)
        values (target_friday, target_city)
        returning id into new_group_id;

      insert into public.group_members (group_id, friday, user_id)
        select new_group_id, target_friday, candidates[i]
        from generate_series(next_index, next_index + group_size - 1) as i;

      next_index := next_index + group_size;
    end loop;
  end loop;
end;
$$;

-- Only pg_cron, running as postgres, may call this — a client must never be able
-- to trigger group formation by hand.
revoke execute on function public.form_friday_groups() from public, anon, authenticated;
