import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { ScreenStatus } from '@/components/screen-status';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { MessageComposer } from '@/features/chat/components/message-composer/message-composer';
import { MessageList } from '@/features/chat/components/message-list/message-list';
import { useGroupChat } from '@/features/chat/hooks/useGroupChat/useGroupChat';
import { useGroupMembers } from '@/features/group/hooks/useGroupMembers/useGroupMembers';
import { useHideNotificationsOfChat } from '@/features/notifications/hooks/useHideNotificationsOfChat/useHideNotificationsOfChat';

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const authorsById = useGroupMembers(groupId);
  const chat = useGroupChat(groupId);
  useHideNotificationsOfChat(groupId);

  if (chat.status !== 'ready') return <ScreenStatus failed={chat.status === 'failed'} />;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <MessageList
        messages={chat.messages}
        pending={chat.pending}
        authorsById={authorsById}
        onRetry={chat.saveFailedMessage}
      />
      <MessageComposer onSend={chat.createMessage} />

      <Pressable accessibilityRole="button" style={styles.back} onPress={() => router.back()}>
        <ThemedText type="link" themeColor="textSecondary">
          Retour
        </ThemedText>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Spacing.six,
  },
  back: {
    alignItems: 'center',
    paddingBottom: Spacing.four,
  },
});
