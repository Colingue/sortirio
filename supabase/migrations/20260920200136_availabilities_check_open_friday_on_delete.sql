-- availabilities_delete_own (2.1) checks only user_id: any owned row could be deleted,
-- including one whose Friday already formed its groups. A trigger carries the date
-- rule instead of a second RLS policy, for the same reason as the insert trigger: the
-- valid value changes every week, so a check constraint would go stale.

create function public.availabilities_check_open_friday_on_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.friday <> public.get_next_open_friday() then
    raise exception 'cannot cancel a Friday that already formed its groups'
      using errcode = '23514';
  end if;
  return old;
end;
$$;

create trigger availabilities_check_open_friday_on_delete
  before delete on public.availabilities
  for each row execute function public.availabilities_check_open_friday_on_delete();
