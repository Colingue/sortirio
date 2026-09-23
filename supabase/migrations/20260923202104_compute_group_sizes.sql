-- The only algorithmic part of US 3.1's group formation, isolated so it is
-- verifiable in one query, with no user and no random draw involved.
--
-- Greedy with a threshold of 9, not 6: peeling a 6 off a remainder of 6..8 would
-- leave 0..2, and a group under 3 is forbidden. Below 9, the remainder (3..8) is
-- either one group (3..6) or split 3 + (remainder - 3) for 7..8, which is the only
-- way to keep both halves at or above 3. This maximizes the number of 6-groups
-- while never producing a group under 3 — exactly requirement 3 of the PRD.
--
-- Below 3, the recursion never runs and the result set is empty: requirement 6
-- ("no group at all under 3 people") is the base case, not a special branch.

create function public.compute_group_sizes(member_count integer)
returns setof integer
language sql
immutable
set search_path = ''
as $$
  with recursive split as (
    select member_count as remaining, 0 as size
    union all
    select
      case
        when remaining >= 9 then remaining - 6
        when remaining >= 7 then remaining - 3
        else 0
      end,
      case
        when remaining >= 9 then 6
        when remaining >= 7 then 3
        else remaining
      end
    from split
    where remaining >= 3
  )
  select size from split where size > 0;
$$;
