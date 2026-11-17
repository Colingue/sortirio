-- US P2: the caller deletes their own account. Deleting the auth.users row is the whole
-- job: profiles, availabilities, group_members and reports cascade, group_messages keeps
-- its rows with a null author, and bans keeps the banned email.
--
-- security definer because a client cannot touch auth.users. The id comes from the
-- session, never from an argument: nobody can delete someone else.
--
-- The photo file is not handled here: a delete on storage.objects would leave the file
-- orphaned in the storage backend, so the app removes it through the Storage API first.

create function public.delete_my_account()
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  -- auth.uid() read once into a variable, not per row.
  me uuid := (select auth.uid());
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;

  delete from auth.users where id = me;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
