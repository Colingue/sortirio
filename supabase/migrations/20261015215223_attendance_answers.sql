-- US 8.1: the Saturday question, "tu y es allé ?", one tap, yes or no. It measures the
-- real attendance rate, nothing else: no rating, no comment.
--
-- One row per member of a group who answered. The foreign key points at
-- group_members (group_id, user_id): only a member of the group can ever have an
-- answer for it, and the answer goes when the membership goes. No answer row means
-- "did not answer", counted as absent from the measure.
--
-- Zero policy, like reports: the app only reaches this table through the two security
-- definer functions below.

create table public.attendance_answers (
  group_id uuid not null,
  user_id uuid not null,
  attended boolean not null,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id),
  foreign key (group_id, user_id) references public.group_members (group_id, user_id)
    on delete cascade
);

alter table public.attendance_answers enable row level security;

-- The question stays on the home screen from Saturday 06:00, the moment
-- get_my_group() lets the group go, until the next Thursday 19:00, when the next groups
-- are formed. Paris time, like every other window. Once answered, it is never asked
-- again for that evening.
create function public.get_pending_attendance_question()
returns table (
  group_id uuid,
  friday date,
  venue_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  -- auth.uid() wrapped in a select so Postgres evaluates it once, not per row.
  -- The (user_id, friday) unique index serves this lookup and its ordering.
  select g.id, g.friday, v.name
  from public.group_members gm
  join public.groups g on g.id = gm.group_id
  join public.venues v on v.id = g.venue_id
  where gm.user_id = (select auth.uid())
    and (now() at time zone 'Europe/Paris') >= ((gm.friday + 1) + time '06:00')
    and (now() at time zone 'Europe/Paris') < ((gm.friday + 6) + time '19:00')
    and not exists (
      select 1
      from public.attendance_answers a
      where a.group_id = gm.group_id
        and a.user_id = gm.user_id
    )
  order by gm.friday desc
  limit 1;
$$;

revoke execute on function public.get_pending_attendance_question() from public, anon;
grant execute on function public.get_pending_attendance_question() to authenticated;

-- A non-member is refused by the foreign key. A second answer is nothing: the first
-- one stands.
create function public.save_attendance_answer(target_group_id uuid, went boolean)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  insert into public.attendance_answers (group_id, user_id, attended)
    values (target_group_id, (select auth.uid()), went)
    on conflict do nothing;
$$;

revoke execute on function public.save_attendance_answer(uuid, boolean) from public, anon;
grant execute on function public.save_attendance_answer(uuid, boolean) to authenticated;
