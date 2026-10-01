import { useEffect, useState } from 'react';

import {
  fetchGroupMessages,
  type GroupMessage,
} from '@/features/chat/helpers/groupMessages/groupMessages';

export type GroupChatState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; messages: GroupMessage[] };

export function useGroupChat(groupId: string): GroupChatState {
  const [chat, setChat] = useState<GroupChatState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchGroupMessages(groupId)
      .then((messages) => !cancelled && setChat({ status: 'ready', messages }))
      .catch(() => !cancelled && setChat({ status: 'failed' }));

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return chat;
}
