-- The next Friday whose group formation — Thursday 19:00, the day before — has not
-- happened yet. Called without an argument, it answers for now (that is what the
-- availabilities.friday default, its trigger, and friday_state() do). The argument
-- exists so the Thursday 18:59 / 19:01 boundary can be checked with a single query
-- instead of waiting for an actual Thursday.

create function public.open_friday(
  moment timestamp default (now() at time zone 'Europe/Paris')
)
returns date
language sql
stable
set search_path = ''
as $$
  select case
    when moment < (coming - 1) + time '19:00' then coming
    else coming + 7
  end
  from (
    select (moment::date + ((5 - extract(isodow from moment)::int + 7) % 7))::date as coming
  ) as week;
$$;
