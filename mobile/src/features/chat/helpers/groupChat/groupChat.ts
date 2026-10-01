import {
  addNewMessages,
  type GroupMessage,
  type PendingMessage,
} from '@/features/chat/helpers/groupMessages/groupMessages';

export type GroupChatState =
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'ready'; messages: GroupMessage[]; pending: PendingMessage[] };

export function buildLoadedChat(current: GroupChatState, messages: GroupMessage[]): GroupChatState {
  return current.status === 'ready'
    ? { ...current, messages: addNewMessages(current.messages, messages) }
    : { status: 'ready', messages, pending: [] };
}

export function addReceivedMessage(
  current: GroupChatState,
  received: GroupMessage,
): GroupChatState {
  if (current.status !== 'ready') return current;

  return { ...current, messages: addNewMessages(current.messages, [received]) };
}

export function addPendingMessage(
  current: GroupChatState,
  localId: number,
  body: string,
): GroupChatState {
  if (current.status !== 'ready') return current;

  return { ...current, pending: [...current.pending, { localId, body, failed: false }] };
}

export function confirmPendingMessage(
  current: GroupChatState,
  localId: number,
  sent: GroupMessage,
): GroupChatState {
  if (current.status !== 'ready') return current;

  return {
    ...current,
    messages: addNewMessages(current.messages, [sent]),
    pending: current.pending.filter((waiting) => waiting.localId !== localId),
  };
}

export function setPendingMessageFailed(
  current: GroupChatState,
  localId: number,
  failed: boolean,
): GroupChatState {
  if (current.status !== 'ready') return current;

  return {
    ...current,
    pending: current.pending.map((waiting) =>
      waiting.localId === localId ? { ...waiting, failed } : waiting,
    ),
  };
}
