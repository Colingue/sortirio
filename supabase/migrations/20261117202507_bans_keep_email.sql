-- US P2: a ban must outlive the account. bans was keyed on the account id with
-- on delete cascade, so deleting the account erased the ban, and a new account has a new
-- id anyway. The person is now identified by email, lowercased, and the row survives:
-- user_id turns nullable and goes null when the account is deleted.
--
-- Only banned people are kept this way: no other email survives a deletion.
--
-- If the same email is banned again from a new account (before sign-up refuses it), the
-- row follows the new account id, so am_i_banned() still finds it.

alter table public.bans add column email text;

update public.bans b
set email = lower(u.email)
from auth.users u
where u.id = b.user_id;

alter table public.bans alter column email set not null;

alter table public.bans
  drop constraint bans_pkey,
  drop constraint bans_user_id_fkey,
  alter column user_id drop not null,
  add primary key (email),
  add constraint bans_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete set null;

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

  insert into public.bans (user_id, email)
    select u.id, lower(u.email) from auth.users u where u.id = target_user_id
    on conflict (email) do update set user_id = excluded.user_id;

  delete from public.group_members gm
  where gm.user_id = target_user_id
    and (now() at time zone 'Europe/Paris') < ((gm.friday + 1) + time '06:00');
end;
$$;
