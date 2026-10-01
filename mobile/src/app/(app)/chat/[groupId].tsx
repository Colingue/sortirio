import { useLocalSearchParams } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { MessageList } from '@/features/chat/components/message-list/message-list';
import { type MessageAuthor } from '@/features/chat/helpers/groupMessages/groupMessages';
import { useGroupChat } from '@/features/chat/hooks/useGroupChat/useGroupChat';
import { useMyGroup } from '@/features/group/hooks/useMyGroup/useMyGroup';

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const myGroup = useMyGroup();
  const chat = useGroupChat(groupId);

  if (chat.status !== 'ready') return <ScreenStatus failed={chat.status === 'failed'} />;

  const members = myGroup.status === 'ready' ? (myGroup.group?.members ?? []) : [];
  const authorsById = new Map<string, MessageAuthor>(
    members.map((member) => [
      member.userId,
      { firstName: member.firstName, photoUrl: member.photoUrl },
    ]),
  );

  return <MessageList messages={chat.messages} authorsById={authorsById} />;
}
