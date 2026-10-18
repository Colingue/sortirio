-- Story 10.1: signing up for a Friday stays open until that Friday 18:00 (Paris), no
-- longer until the Thursday 19:00 group formation. get_next_open_friday keeps its
-- meaning, "the Friday whose groups are not formed yet": the Thursday formation job
-- and the cancel trigger (2.2) depend on it. get_signup_friday carries the new rule.

create function public.get_signup_friday(
  moment timestamp default (now() at time zone 'Europe/Paris')
)
returns date
language sql
stable
set search_path = ''
as $$
  select case
    when moment < coming + time '18:00' then coming
    else coming + 7
  end
  from (
    select (moment::date + ((5 - extract(isodow from moment)::int + 7) % 7))::date as coming
  ) as week;
$$;

alter table public.availabilities
  alter column friday set default public.get_signup_friday();

create or replace function public.availabilities_check_open_friday()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.friday <> public.get_signup_friday() then
    raise exception 'friday must be the Friday open for signup'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

-- The return type grows, so the function is dropped and recreated. `moment` is only
-- there for tests: the app calls it without arguments.
drop function public.get_friday_availability_status();

create function public.get_friday_availability_status(
  moment timestamp default (now() at time zone 'Europe/Paris')
)
returns table (
  next_open_friday date,
  posted_friday date,
  group_formation_at timestamptz,
  city_signup_count integer,
  signup_friday date,
  signup_closes_at timestamptz,
  posted_late boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    public.get_next_open_friday(moment),
    posted.friday,
    case
      when posted.friday is null then null
      else ((posted.friday - 1) + time '19:00') at time zone 'Europe/Paris'
    end,
    public.count_signed_up_users_in_city(coalesce(posted.friday, public.get_signup_friday(moment))),
    public.get_signup_friday(moment),
    (coalesce(posted.friday, public.get_signup_friday(moment)) + time '18:00')
      at time zone 'Europe/Paris',
    coalesce(
      posted.created_at > ((posted.friday - 1) + time '19:00') at time zone 'Europe/Paris',
      false
    )
  from (select 1) as one_row
  left join lateral (
    select a.friday, a.created_at
    from public.availabilities a
    where a.user_id = (select auth.uid())
      and a.friday >= moment::date
    order by a.friday desc
    limit 1
  ) as posted on true;
$$;
