-- US P2: deleting an account must not delete its messages. The foreign key used to
-- cascade, which erased the author's lines from every chat. Now the message stays and
-- author_id becomes null: the app reads null as "Utilisateur supprimé".
--
-- The insert policy still checks author_id = auth.uid(), so a null author can never be
-- written by a client: only a deletion produces one.

alter table public.group_messages alter column author_id drop not null;

alter table public.group_messages
  drop constraint group_messages_author_id_fkey,
  add constraint group_messages_author_id_fkey
    foreign key (author_id) references auth.users (id) on delete set null;
