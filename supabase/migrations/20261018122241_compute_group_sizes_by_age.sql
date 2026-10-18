-- US 3.4: cut a city's birthdates, sorted, into consecutive groups of 3 to 6 that keep
-- ages close. The cut minimizes
--   sum of each group's age spread + extra_group_cost_years × number of groups
-- so an extra group is only made when it saves more than that many years of spread.
-- Without the cost, the minimum would always be groups of 3.
--
-- Dynamic programming: best_cost[i] is the cheapest cut of the first i birthdates,
-- best_size[i] the size of its last group. Sizes are tried from 6 down to 3 and only
-- a strictly cheaper cost replaces, so a tie keeps the bigger group.
--
-- Under 3 birthdates, no cut exists and the result set is empty: no group at all.

create function public.compute_group_sizes_by_age(
  sorted_birthdates date[],
  extra_group_cost_years numeric
)
returns setof integer
language plpgsql
immutable
set search_path = ''
as $$
declare
  member_count integer := coalesce(array_length(sorted_birthdates, 1), 0);
  extra_group_cost_days numeric := extra_group_cost_years * 365.25;
  best_cost numeric[] := array_fill(null::numeric, array[member_count + 1], array[0]);
  best_size integer[] := array_fill(null::integer, array[member_count + 1], array[0]);
  candidate_cost numeric;
  group_size integer;
  position integer;
  sizes integer[] := '{}';
begin
  best_cost[0] := 0;

  for position in 3..member_count loop
    for group_size in reverse 6..3 loop
      continue when group_size > position or best_cost[position - group_size] is null;

      candidate_cost := best_cost[position - group_size]
        + abs(sorted_birthdates[position] - sorted_birthdates[position - group_size + 1])
        + extra_group_cost_days;

      if best_cost[position] is null or candidate_cost < best_cost[position] then
        best_cost[position] := candidate_cost;
        best_size[position] := group_size;
      end if;
    end loop;
  end loop;

  position := member_count;
  while best_size[position] is not null loop
    sizes := best_size[position] || sizes;
    position := position - best_size[position];
  end loop;

  return query select unnest(sizes);
end;
$$;
