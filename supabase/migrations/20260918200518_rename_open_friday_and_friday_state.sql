-- Both open_friday and friday_state were noun phrases: nothing in the name said they
-- compute something, or for whom. Renamed so the name alone answers "what does calling
-- this do, and for whose data": get_next_open_friday (a global answer, no auth.uid())
-- and get_friday_availability_status (a per-caller answer, security invoker).

create function public.get_next_open_friday(
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

alter table public.availabilities
  alter column friday set default public.get_next_open_friday();

create or replace function public.availabilities_check_open_friday()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.friday <> public.get_next_open_friday() then
    raise exception 'friday must be the currently open Friday'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create function public.get_friday_availability_status()
returns table (next_open_friday date, posted_friday date)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    public.get_next_open_friday(),
    (
      select a.friday
      from public.availabilities a
      where a.user_id = (select auth.uid())
        and a.friday >= (now() at time zone 'Europe/Paris')::date
      order by a.friday desc
      limit 1
    );
$$;

drop function public.friday_state();
drop function public.open_friday(timestamp);
