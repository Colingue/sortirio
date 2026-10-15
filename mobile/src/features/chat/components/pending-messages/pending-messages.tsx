import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { type PendingMessage } from '@/features/chat/helpers/groupMessages/groupMessages';

const SENDING_LABEL = 'Envoi…';
const FAILED_LABEL = 'Non envoyé — touche pour réessayer';

export type PendingMessagesProps = {
  pending: PendingMessage[];
  onRetry: (localId: number) => void;
};

export function PendingMessages({ pending, onRetry }: PendingMessagesProps) {
  return (
    <View style={styles.pending}>
      {pending.map((waiting) => (
        <Pressable
          key={waiting.localId}
          accessibilityRole="button"
          disabled={!waiting.failed}
          onPress={() => onRetry(waiting.localId)}
          style={styles.waiting}
        >
          <View style={styles.bubble}>
            <ThemedText themeColor="onAccent" style={styles.body}>
              {waiting.body}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor={waiting.failed ? 'danger' : 'textMuted'}>
            {waiting.failed ? FAILED_LABEL : SENDING_LABEL}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pending: {
    gap: 10,
    marginTop: 10,
  },
  waiting: {
    alignItems: 'flex-end',
    gap: 2,
  },
  bubble: {
    maxWidth: 260,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.accent,
    opacity: 0.6,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
});
