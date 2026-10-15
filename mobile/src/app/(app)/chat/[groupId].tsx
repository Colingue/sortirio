import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenStatus } from '@/components/screen-status';
import { Colors } from '@/constants/theme';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { MessageComposer } from '@/features/chat/components/message-composer/message-composer';
import { MessageList } from '@/features/chat/components/message-list/message-list';
import { useGroupChat } from '@/features/chat/hooks/useGroupChat/useGroupChat';
import { GroupChatHeader } from '@/features/group/components/group-chat-header/group-chat-header';
import { useGroupMembers } from '@/features/group/hooks/useGroupMembers/useGroupMembers';
import { useHideNotificationsOfChat } from '@/features/notifications/hooks/useHideNotificationsOfChat/useHideNotificationsOfChat';

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const authorsById = useGroupMembers(groupId);
  const chat = useGroupChat(groupId);
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;
  useHideNotificationsOfChat(groupId);

  if (chat.status !== 'ready') return <ScreenStatus failed={chat.status === 'failed'} />;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        <GroupChatHeader groupId={groupId} onBack={() => router.back()} />
        <MessageList
          messages={chat.messages}
          pending={chat.pending}
          authorsById={authorsById}
          myUserId={myUserId}
          onRetry={chat.saveFailedMessage}
        />
        <MessageComposer onSend={chat.createMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
