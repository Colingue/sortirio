import { StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, MemberNameColors } from '@/constants/theme';
import { type MessageAuthor } from '@/features/chat/helpers/groupMessages/groupMessages';

const UNKNOWN_AUTHOR_LABEL = 'Un membre';

export type MessageBubbleProps = {
  body: string;
  time: string;
  author: MessageAuthor | undefined;
  colorIndex: number;
  mine: boolean;
};

export function MessageBubble({ body, time, author, colorIndex, mine }: MessageBubbleProps) {
  if (mine) {
    return (
      <View style={[styles.bubble, styles.mine]}>
        <ThemedText themeColor="onAccent" style={styles.body}>
          {body}
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.myTime}>
          {time}
        </ThemedText>
      </View>
    );
  }

  const firstName = author?.firstName ?? UNKNOWN_AUTHOR_LABEL;

  return (
    <View style={styles.row}>
      <MemberAvatar
        firstName={firstName}
        photoUrl={author?.photoUrl ?? null}
        size={30}
        colorIndex={colorIndex}
      />
      <View style={[styles.bubble, styles.theirs]}>
        <ThemedText
          style={[styles.name, { color: MemberNameColors[colorIndex % MemberNameColors.length] }]}
        >
          {firstName} · {time}
        </ThemedText>
        <ThemedText style={styles.body}>{body}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubble: {
    maxWidth: 260,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  theirs: {
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    backgroundColor: Colors.backgroundElement,
  },
  mine: {
    alignSelf: 'flex-end',
    borderRadius: 14,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.accent,
  },
  name: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  myTime: {
    alignSelf: 'flex-end',
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.8,
  },
});
