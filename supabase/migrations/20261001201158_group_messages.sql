-- US 5.1: the group chat. One row per message, text only (requirement 8), timestamped
-- by the server (requirement 9) so the order never depends on a phone's clock.
--
-- groups, group_members and venues have RLS with zero policy and read through
-- get_my_group() instead. This table breaks that pattern on purpose (requirement 17):
-- Realtime authorizes a subscription by evaluating the table's select policy, so
-- without real policies there is no subscription at all — a definer function cannot
-- be subscribed to. Both policies go through is_member_of_group(), which is the only
-- thing allowed to look at group_members.
--
-- No update and no delete policy. The absence is the implementation: editing and
-- deleting a message are out of scope, and a missing policy is how you say so.
--
-- The length bounds live here and not only in the screen (requirement 15): the Data
-- API is reachable with the publishable key, so the screen's disabled button is a
-- courtesy and this check is the rule. 2000 is "nobody ever hits it, and nobody
-- writes a novel into the table".

create table public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint group_messages_body_filled check (length(trim(body)) between 1 and 2000)
);

-- The query of requirement 5: a group's whole history, oldest first.
create index group_messages_group_created_idx
  on public.group_messages (group_id, created_at);

-- Enabled in the same migration as the table: a table in the public schema is
-- reachable through the Data API, so it must never exist unprotected, not even
-- between two migrations.
alter table public.group_messages enable row level security;

create policy "group_messages_select" on public.group_messages
  for select to authenticated
  using (public.is_member_of_group(group_id));

-- author_id is checked against the session (requirement 18): a member of the group
-- may write, but only under their own name.
create policy "group_messages_insert" on public.group_messages
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and public.is_member_of_group(group_id)
  );
