-- US 5.2: every message posted to a group chat pushes a notification to the other
-- members. Built like send_group_ready_notifications (US 3.3): one http_post carrying
-- the whole array, and no call at all when nobody has a token — Expo refuses an empty
-- array. Unlike 3.3 there is no separate function to replay from psql: replaying is
-- inserting a message, so the trigger function does the send itself.
--
-- security definer: the insert comes from an authenticated client, which can read
-- neither group_members nor the tokens in profiles. Execute is revoked from every
-- client role, as in 3.3.
--
-- The whole body sits in an exception block that only raises a warning (requirement
-- 6). The trigger runs inside the insert's transaction, so any error here would roll
-- the message back: a lost push is acceptable, a lost message is not. http_post only
-- queues the request, so an expired token or Expo being down never reaches this code
-- anyway; the block is for everything else.
--
-- The cut at 100 counts characters, not bytes. A composed emoji may be split in two:
-- accepted by the spec.

create function public.send_group_message_notifications()
returns trigger
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  author_first_name text;
  preview text;
  messages jsonb;
begin
  begin
    select p.first_name into author_first_name
    from public.profiles p
    where p.id = new.author_id;

    preview := case
      when char_length(new.body) > 100 then left(new.body, 100) || '…'
      else new.body
    end;

    select jsonb_agg(jsonb_build_object(
        'to', p.expo_push_token,
        'title', author_first_name,
        'body', preview,
        'data', jsonb_build_object('groupId', new.group_id)
      ))
      into messages
    from public.group_members gm
    join public.profiles p on p.id = gm.user_id
    where gm.group_id = new.group_id
      and gm.user_id <> new.author_id
      and p.expo_push_token is not null;

    if messages is not null then
      perform net.http_post(
        url := 'https://exp.host/--/api/v2/push/send',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := messages
      );
    end if;
  exception when others then
    raise warning 'send_group_message_notifications failed for message %: %',
      new.id, sqlerrm;
  end;

  return null;
end;
$$;

revoke execute on function public.send_group_message_notifications()
  from public, anon, authenticated;

create trigger group_messages_send_notifications
  after insert on public.group_messages
  for each row execute function public.send_group_message_notifications();
