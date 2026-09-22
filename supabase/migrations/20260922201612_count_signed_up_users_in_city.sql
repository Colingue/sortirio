-- security definer only to cross the availabilities_select_own RLS policy for one
-- thing: a count(*). No row ever leaves this function, and the city queried is never
-- a parameter — it is read from the caller's own profile, so a client cannot ask
-- about a city that is not theirs.

create function public.count_signed_up_users_in_city(target_friday date)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.availabilities a
  join public.profiles p on p.id = a.user_id
  where a.friday = target_friday
    and p.city = (select city from public.profiles where id = (select auth.uid()));
$$;

revoke execute on function public.count_signed_up_users_in_city(date) from anon;
grant execute on function public.count_signed_up_users_in_city(date) to authenticated;
