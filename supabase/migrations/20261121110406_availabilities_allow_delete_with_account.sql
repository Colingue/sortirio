-- US P2: deleting an account cascades to availabilities, and the open-Friday check
-- blocked it for anyone signed up to a Friday that already formed its groups. When the
-- user row is gone (an account deletion), the date rule does not apply.

create or replace function public.availabilities_check_open_friday_on_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.friday <> public.get_next_open_friday()
     and exists (select 1 from auth.users where id = old.user_id) then
    raise exception 'cannot cancel a Friday that already formed its groups'
      using errcode = '23514';
  end if;
  return old;
end;
$$;
