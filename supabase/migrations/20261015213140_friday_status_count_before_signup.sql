create or replace function public.get_friday_availability_status()
returns table (
  next_open_friday date,
  posted_friday date,
  group_formation_at timestamptz,
  city_signup_count integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    public.get_next_open_friday(),
    posted.friday,
    case
      when posted.friday is null then null
      else ((posted.friday - 1) + time '19:00') at time zone 'Europe/Paris'
    end,
    public.count_signed_up_users_in_city(coalesce(posted.friday, public.get_next_open_friday()))
  from (select 1) as one_row
  left join lateral (
    select a.friday
    from public.availabilities a
    where a.user_id = (select auth.uid())
      and a.friday >= (now() at time zone 'Europe/Paris')::date
    order by a.friday desc
    limit 1
  ) as posted on true;
$$;
