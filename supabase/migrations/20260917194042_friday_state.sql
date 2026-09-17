-- open_friday and posted_friday answer two different questions: which Friday is
-- currently open for sign-ups, and which Friday (if any) the caller already signed
-- up for that has not passed yet. The app needs both without ever computing today's
-- date itself, so it reads them in one round trip instead of two.

create function public.friday_state()
returns table (open_friday date, posted_friday date)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    public.open_friday(),
    (
      select a.friday
      from public.availabilities a
      where a.user_id = (select auth.uid())
        and a.friday >= (now() at time zone 'Europe/Paris')::date
      order by a.friday desc
      limit 1
    );
$$;
