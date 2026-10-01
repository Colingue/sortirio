import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { type PendingMessage } from '@/features/chat/helpers/groupMessages/groupMessages';

const SENDING_LABEL = 'Envoi…';
const FAILED_LABEL = 'Non envoyé — touche pour réessayer';

export type PendingMessagesProps = {
  pending: PendingMessage[];
  onRetry: (localId: number) => void;
};

export function PendingMessages({ pending, onRetry }: PendingMessagesProps) {
  return (
    <ThemedView style={styles.pending}>
      {pending.map((waiting) => (
        <Pressable
          key={waiting.localId}
          accessibilityRole="button"
          disabled={!waiting.failed}
          onPress={() => onRetry(waiting.localId)}
          style={styles.waiting}
        >
          <ThemedText>{waiting.body}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {waiting.failed ? FAILED_LABEL : SENDING_LABEL}
          </ThemedText>
        </Pressable>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pending: {
    gap: Spacing.three,
  },
  waiting: {
    gap: Spacing.half,
    opacity: 0.6,
  },
});
