-- US 7.1, requirements 13, 14 and 17: a second distinct reporter bans the account, in
-- the same transaction as the report.
--
-- bans has RLS with zero policy (requirement 18): report_member() writes it, as a
-- definer, and am_i_banned() is the only read, limited to the caller's own row. Nothing
-- in it says who reported, nor how many times (requirement 19).
--
-- The ban removes the account from its current group, using the same window as
-- get_my_group(). Its chat and its chat push go with it, since both check
-- group_members. Past groups, the profile and the reports are kept (requirement 17).
--
-- The row lock on the target's profile serialises two reports of the same person: the
-- second one waits, then counts the first, so a simultaneous pair still bans.

create table public.bans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.bans enable row level security;

create or replace function public.report_member(target_user_id uuid)
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

  perform 1 from public.profiles where id = target_user_id for update;

  insert into public.reports (reporter_id, reported_id)
    values (me, target_user_id)
    on conflict do nothing;

  if (select count(*) from public.reports where reported_id = target_user_id) < 2 then
    return;
  end if;

  insert into public.bans (user_id)
    values (target_user_id)
    on conflict do nothing;

  delete from public.group_members gm
  where gm.user_id = target_user_id
    and (now() at time zone 'Europe/Paris') < ((gm.friday + 1) + time '06:00');
end;
$$;

create function public.am_i_banned()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.bans b where b.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.am_i_banned() from public, anon;
grant execute on function public.am_i_banned() to authenticated;
