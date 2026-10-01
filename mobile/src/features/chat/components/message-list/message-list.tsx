import { Image } from 'expo-image';
import { useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  findMessageAuthor,
  formatMessageTime,
  type GroupMessage,
  type MessageAuthor,
} from '@/features/chat/helpers/groupMessages/groupMessages';
import { useTheme } from '@/hooks/useTheme';

const UNKNOWN_AUTHOR_LABEL = 'Un membre';

export type MessageListProps = {
  messages: GroupMessage[];
  authorsById: Map<string, MessageAuthor>;
};

export function MessageList({ messages, authorsById }: MessageListProps) {
  const theme = useTheme();
  const list = useRef<FlatList<GroupMessage>>(null);

  return (
    <FlatList
      ref={list}
      data={messages}
      keyExtractor={(message) => message.id}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
      renderItem={({ item: message }) => {
        const author = findMessageAuthor(authorsById, message.authorId);

        return (
          <ThemedView style={styles.message}>
            <Image
              source={author?.photoUrl ? { uri: author.photoUrl } : undefined}
              style={[styles.face, { backgroundColor: theme.backgroundElement }]}
              contentFit="cover"
            />
            <ThemedView style={styles.said}>
              <ThemedView style={styles.who}>
                <ThemedText type="smallBold">
                  {author?.firstName ?? UNKNOWN_AUTHOR_LABEL}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatMessageTime(message.createdAt)}
                </ThemedText>
              </ThemedView>
              <ThemedText>{message.body}</ThemedText>
            </ThemedView>
          </ThemedView>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  message: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  face: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  said: {
    flex: 1,
    gap: Spacing.half,
  },
  who: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
});
