-- Mes groupes shows each group's faces with their photo, not only initials. One column
-- added to get_my_groups(): member_photo_paths, in the same order as member_first_names.
-- The app signs them; profile_photos_select_group already lets me read every teammate's
-- photo, past groups included (20261004165637). The rest stays as
-- 20261015220536_get_my_groups_last_message.sql left it.
--
-- drop and create: adding a column to a returns table changes the return type.

drop function public.get_my_groups();

create function public.get_my_groups()
returns table (
  group_id uuid,
  friday date,
  venue_name text,
  member_first_names text[],
  member_photo_paths text[],
  last_message_body text,
  last_message_at timestamptz,
  last_message_author_id uuid,
  last_message_author_first_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  -- auth.uid() wrapped in a select so Postgres evaluates it once, not per row.
  -- group_messages_group_created_idx serves the last message lookup.
  select
    g.id,
    g.friday,
    v.name,
    array_agg(p.first_name order by p.first_name, p.id),
    array_agg(p.photo_path order by p.first_name, p.id),
    last_message.body,
    last_message.created_at,
    last_message.author_id,
    last_message.first_name
  from public.group_members mine
  join public.groups g on g.id = mine.group_id
  join public.venues v on v.id = g.venue_id
  join public.group_members member on member.group_id = g.id
  join public.profiles p on p.id = member.user_id
  left join lateral (
    select m.body, m.created_at, m.author_id, author.first_name
    from public.group_messages m
    left join public.profiles author on author.id = m.author_id
    where m.group_id = g.id
    order by m.created_at desc, m.id desc
    limit 1
  ) last_message on true
  where mine.user_id = (select auth.uid())
  group by g.id, g.friday, v.name, last_message.body, last_message.created_at,
    last_message.author_id, last_message.first_name
  order by g.friday desc;
$$;

revoke execute on function public.get_my_groups() from public, anon;
grant execute on function public.get_my_groups() to authenticated;
