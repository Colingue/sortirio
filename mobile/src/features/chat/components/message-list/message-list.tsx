import { useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { MessageBubble } from '@/features/chat/components/message-bubble/message-bubble';
import { PendingMessages } from '@/features/chat/components/pending-messages/pending-messages';
import {
  findMessageAuthor,
  formatMessageDay,
  formatMessageTime,
  isNewMessageDay,
  type GroupMessage,
  type MessageAuthor,
  type PendingMessage,
} from '@/features/chat/helpers/groupMessages/groupMessages';

export type MessageListProps = {
  messages: GroupMessage[];
  pending: PendingMessage[];
  authorsById: Map<string, MessageAuthor>;
  myUserId: string | undefined;
  onRetry: (localId: number) => void;
};

export function MessageList({
  messages,
  pending,
  authorsById,
  myUserId,
  onRetry,
}: MessageListProps) {
  const list = useRef<FlatList<GroupMessage>>(null);
  const authorIds = [...authorsById.keys()];

  return (
    <FlatList
      ref={list}
      data={messages}
      keyExtractor={(message) => message.id}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
      ListFooterComponent={<PendingMessages pending={pending} onRetry={onRetry} />}
      renderItem={({ item: message, index }) => (
        <View style={styles.message}>
          {isNewMessageDay(messages, index) ? (
            <ThemedText themeColor="textMuted" style={styles.day}>
              {formatMessageDay(message.createdAt)}
            </ThemedText>
          ) : null}
          <MessageBubble
            body={message.body}
            time={formatMessageTime(message.createdAt)}
            author={findMessageAuthor(authorsById, message.authorId)}
            colorIndex={Math.max(authorIds.indexOf(message.authorId), 0)}
            mine={message.authorId === myUserId}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  message: {
    gap: 10,
  },
  day: {
    alignSelf: 'center',
    marginTop: 6,
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
});
