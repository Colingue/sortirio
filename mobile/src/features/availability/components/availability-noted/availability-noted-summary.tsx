import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatTimeRemaining, type TimeRemaining } from '@/features/availability/helpers/countdown';

export type AvailabilityNotedSummaryProps = {
  canCancel: boolean;
  onRequestCancel: () => void;
  remaining: TimeRemaining | null;
  citySignupCount: number | null;
};

export function AvailabilityNotedSummary({
  canCancel,
  onRequestCancel,
  remaining,
  citySignupCount,
}: AvailabilityNotedSummaryProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title" style={styles.centered}>
          C&apos;est noté ✅, on te prévient jeudi 19 h.
        </ThemedText>

        {remaining ? (
          <ThemedView style={styles.countdown}>
            <ThemedText themeColor="textSecondary" style={styles.centered}>
              ⏳ On forme ton groupe dans
            </ThemedText>
            <ThemedText type="subtitle" style={styles.centered}>
              {formatTimeRemaining(remaining)}
            </ThemedText>
          </ThemedView>
        ) : null}

        {citySignupCount !== null ? (
          <ThemedText themeColor="textSecondary" style={styles.centered}>
            👥 {citySignupCount}{' '}
            {citySignupCount === 1 ? 'personne inscrite' : 'personnes inscrites'} à Lyon
          </ThemedText>
        ) : null}
      </ThemedView>

      {canCancel ? (
        <Pressable accessibilityRole="button" onPress={onRequestCancel}>
          <ThemedText type="link" themeColor="textSecondary">
            Annuler ma dispo
          </ThemedText>
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  centered: {
    textAlign: 'center',
  },
  words: {
    gap: Spacing.three,
  },
  countdown: {
    gap: Spacing.one,
  },
});
