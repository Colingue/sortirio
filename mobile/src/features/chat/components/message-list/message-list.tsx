import { useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { MessageBubble } from '@/features/chat/components/message-bubble/message-bubble';
import { PendingMessages } from '@/features/chat/components/pending-messages/pending-messages';
import {
  buildChatItems,
  findMessageAuthor,
  formatMessageDay,
  formatMessageTime,
  isNewMessageDay,
  type ChatItem,
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
  const list = useRef<FlatList<ChatItem>>(null);
  const authorIds = [...authorsById.keys()];
  const items = buildChatItems(messages, authorsById, myUserId);

  return (
    <FlatList
      ref={list}
      data={items}
      keyExtractor={(chatItem) => chatItem.id}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
      ListFooterComponent={<PendingMessages pending={pending} onRetry={onRetry} />}
      renderItem={({ item: chatItem, index }) => (
        <View style={styles.message}>
          {isNewMessageDay(items, index) ? (
            <ThemedText themeColor="textMuted" style={styles.day}>
              {formatMessageDay(chatItem.createdAt)}
            </ThemedText>
          ) : null}
          {chatItem.kind === 'joined' ? (
            <ThemedText style={styles.joined}>{chatItem.text}</ThemedText>
          ) : (
            <MessageBubble
              body={chatItem.message.body}
              time={formatMessageTime(chatItem.createdAt)}
              author={findMessageAuthor(authorsById, chatItem.message.authorId)}
              colorIndex={Math.max(authorIds.indexOf(chatItem.message.authorId), 0)}
              mine={chatItem.message.authorId === myUserId}
            />
          )}
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
  joined: {
    alignSelf: 'center',
    maxWidth: 300,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.small,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundSelected,
    color: Colors.accentDark,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  day: {
    alignSelf: 'center',
    marginTop: 6,
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
});
