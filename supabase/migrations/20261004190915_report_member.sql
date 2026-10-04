-- US 7.1: the only way into public.reports, and the only way to know who I reported.
--
-- report_member() is security definer because reports has zero policy and the check of
-- requirement 4 crosses group_members, which has zero policy too. The server decides
-- who may be reported, never the app: the target must share, or have shared, a group
-- with the caller. Anyone else, myself included, is refused with an error, so a client
-- cannot probe for user ids by watching what succeeds.
--
-- on conflict do nothing is requirement 5: a second report of the same person is not an
-- error, it is simply nothing. There is no delete anywhere (requirement 6).
--
-- get_my_reported_user_ids() lets the group screen show "Signalé" (requirement 8). It
-- only ever returns rows where I am the reporter: nothing in it says who reported me
-- (requirement 19).

create function public.report_member(target_user_id uuid)
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
  if target_user_id = me or not exists (
    select 1
    from public.group_members mine
    join public.group_members other on other.group_id = mine.group_id
    where mine.user_id = me
      and other.user_id = target_user_id
  ) then
    raise exception 'cannot report this user' using errcode = '42501';
  end if;

  insert into public.reports (reporter_id, reported_id)
    values (me, target_user_id)
    on conflict do nothing;
end;
$$;

revoke execute on function public.report_member(uuid) from public, anon;
grant execute on function public.report_member(uuid) to authenticated;

create function public.get_my_reported_user_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  -- auth.uid() wrapped in a select so Postgres evaluates it once, not per row.
  select r.reported_id
  from public.reports r
  where r.reporter_id = (select auth.uid());
$$;

revoke execute on function public.get_my_reported_user_ids() from public, anon;
grant execute on function public.get_my_reported_user_ids() to authenticated;
