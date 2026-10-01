import { useEffect, useRef, useState } from 'react';

import {
  addPendingMessage,
  addReceivedMessage,
  buildLoadedChat,
  confirmPendingMessage,
  setPendingMessageFailed,
  type GroupChatState,
} from '@/features/chat/helpers/groupChat/groupChat';
import {
  createGroupMessage,
  fetchGroupMessages,
  watchGroupMessages,
} from '@/features/chat/helpers/groupMessages/groupMessages';
import { supabase } from '@/lib/supabase';

export type GroupChat = GroupChatState & { createMessage: (body: string) => void };

export function useGroupChat(groupId: string): GroupChat {
  const [chat, setChat] = useState<GroupChatState>({ status: 'loading' });
  const lastLocalId = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const channel = watchGroupMessages(groupId, (received) => {
      if (!cancelled) setChat((current) => addReceivedMessage(current, received));
    });

    fetchGroupMessages(groupId)
      .then((messages) => !cancelled && setChat((current) => buildLoadedChat(current, messages)))
      .catch(() => !cancelled && setChat({ status: 'failed' }));

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [groupId]);

  function createMessage(body: string) {
    const written = body.trim();
    if (!written) return;

    lastLocalId.current += 1;
    const localId = lastLocalId.current;

    setChat((current) => addPendingMessage(current, localId, written));

    createGroupMessage(groupId, written)
      .then((sent) => setChat((current) => confirmPendingMessage(current, localId, sent)))
      .catch(() => setChat((current) => setPendingMessageFailed(current, localId, true)));
  }

  return { ...chat, createMessage };
}
