-- US 5.3: the "Mes groupes" tab, every group I am or was a member of
-- (requirements 5 to 8, 15).
--
-- security definer, like get_my_group(): groups, group_members and venues keep zero
-- policy, and profiles is not opened wider (the push token stays private). The caller
-- only ever sees groups they belong to: the first join is on their own user_id.
--
-- No window: this week's group shows as soon as its row exists, past ones stay.
-- One row per group, first names already aggregated, so the app renames fields and
-- groups nothing. friday desc: most recent first, a stable order that does not move
-- while the list is read (requirement 6).

create function public.get_my_groups()
returns table (
  group_id uuid,
  friday date,
  venue_name text,
  member_first_names text[]
)
language sql
stable
security definer
set search_path = ''
as $$
  -- auth.uid() wrapped in a select so Postgres evaluates it once, not per row.
  -- group_members_user_friday_unique (user_id, friday) serves this lookup.
  select
    g.id,
    g.friday,
    v.name,
    array_agg(p.first_name order by p.first_name)
  from public.group_members mine
  join public.groups g on g.id = mine.group_id
  join public.venues v on v.id = g.venue_id
  join public.group_members member on member.group_id = g.id
  join public.profiles p on p.id = member.user_id
  where mine.user_id = (select auth.uid())
  group by g.id, g.friday, v.name
  order by g.friday desc;
$$;

revoke execute on function public.get_my_groups() from public, anon;
grant execute on function public.get_my_groups() to authenticated;
