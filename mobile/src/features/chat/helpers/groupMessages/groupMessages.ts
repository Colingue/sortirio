import { type RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

const TABLE = 'group_messages';

export type GroupMessage = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type PendingMessage = {
  localId: number;
  body: string;
  failed: boolean;
};

export type MessageAuthor = {
  firstName: string;
  photoUrl: string | null;
  lateJoinedAt: string | null;
};

export type ChatItem =
  | { kind: 'message'; id: string; createdAt: string; message: GroupMessage }
  | { kind: 'joined'; id: string; createdAt: string; text: string };

export type MessageRow = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export function buildGroupMessage(row: MessageRow): GroupMessage {
  return {
    id: row.id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
  };
}

export function addNewMessages(existing: GroupMessage[], incoming: GroupMessage[]): GroupMessage[] {
  const byId = new Map(existing.map((message) => [message.id, message]));

  for (const message of incoming) {
    if (!byId.has(message.id)) byId.set(message.id, message);
  }

  return [...byId.values()].sort(
    (one, other) => one.createdAt.localeCompare(other.createdAt) || one.id.localeCompare(other.id),
  );
}

export function buildChatItems(
  messages: GroupMessage[],
  authorsById: Map<string, MessageAuthor>,
  myUserId: string | undefined,
): ChatItem[] {
  const joined: ChatItem[] = [...authorsById]
    .filter(([, author]) => author.lateJoinedAt !== null)
    .map(([userId, author]) => ({
      kind: 'joined',
      id: `joined:${userId}`,
      createdAt: author.lateJoinedAt as string,
      text:
        userId === myUserId
          ? 'Tu as rejoint le groupe. Les messages précédents sont visibles.'
          : `${author.firstName} a rejoint le groupe`,
    }));
  const sent: ChatItem[] = messages.map((message) => ({
    kind: 'message',
    id: message.id,
    createdAt: message.createdAt,
    message,
  }));

  return [...sent, ...joined].sort(
    (one, other) => Date.parse(one.createdAt) - Date.parse(other.createdAt),
  );
}

export function formatMessageTime(createdAt: string): string {
  const at = new Date(createdAt);
  const hours = String(at.getHours()).padStart(2, '0');
  const minutes = String(at.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatMessageDay(createdAt: string): string {
  const day = new Date(createdAt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function isNewMessageDay(messages: { createdAt: string }[], index: number): boolean {
  if (index === 0) return true;

  return (
    new Date(messages[index - 1].createdAt).toDateString() !==
    new Date(messages[index].createdAt).toDateString()
  );
}

export function findMessageAuthor(
  authorsById: Map<string, MessageAuthor>,
  authorId: string,
): MessageAuthor | undefined {
  return authorsById.get(authorId);
}

export function watchGroupMessages(
  groupId: string,
  onInsert: (message: GroupMessage) => void,
): RealtimeChannel {
  return supabase
    .channel(`group-messages:${groupId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLE, filter: `group_id=eq.${groupId}` },
      (payload) => onInsert(buildGroupMessage(payload.new as MessageRow)),
    )
    .subscribe();
}

export async function createGroupMessage(groupId: string, body: string): Promise<GroupMessage> {
  const { data: session } = await supabase.auth.getSession();
  const authorId = session.session?.user.id;

  if (!authorId) throw new Error('No session to post a group message with.');

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ group_id: groupId, author_id: authorId, body: body.trim() })
    .select('id, author_id, body, created_at')
    .single();

  if (error) throw error;

  return buildGroupMessage(data as MessageRow);
}

export async function fetchGroupMessages(groupId: string): Promise<GroupMessage[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, author_id, body, created_at')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as MessageRow[]).map(buildGroupMessage);
}
