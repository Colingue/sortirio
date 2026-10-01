import { useEffect, useState } from 'react';

import {
  addNewMessages,
  buildGroupMessage,
  fetchGroupMessages,
  type GroupMessage,
  type MessageRow,
} from '@/features/chat/helpers/groupMessages/groupMessages';
import { supabase } from '@/lib/supabase';

export type GroupChatState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; messages: GroupMessage[] };

export function useGroupChat(groupId: string): GroupChatState {
  const [chat, setChat] = useState<GroupChatState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const channel = supabase
      .channel(`group-messages:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          if (cancelled) return;

          const received = buildGroupMessage(payload.new as MessageRow);

          setChat((current) =>
            current.status === 'ready'
              ? { status: 'ready', messages: addNewMessages(current.messages, [received]) }
              : current,
          );
        },
      )
      .subscribe();

    fetchGroupMessages(groupId)
      .then((messages) => {
        if (cancelled) return;

        setChat((current) => ({
          status: 'ready',
          messages:
            current.status === 'ready' ? addNewMessages(current.messages, messages) : messages,
        }));
      })
      .catch(() => !cancelled && setChat({ status: 'failed' }));

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [groupId]);

  return chat;
}
