import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type AvailabilityNotedProps = {
  canCancel: boolean;
  onConfirmCancel: () => void;
  canceling: boolean;
  cancelFailed: boolean;
};

export function AvailabilityNoted({
  canCancel,
  onConfirmCancel,
  canceling,
  cancelFailed,
}: AvailabilityNotedProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming || !canCancel) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.centered}>
          C&apos;est noté, on te prévient jeudi 19 h.
        </ThemedText>

        {canCancel ? (
          <Pressable accessibilityRole="button" onPress={() => setConfirming(true)}>
            <ThemedText type="link" themeColor="textSecondary">
              Annuler ma dispo
            </ThemedText>
          </Pressable>
        ) : null}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title" style={styles.centered}>
          Tu annules ta dispo pour ce vendredi ?
        </ThemedText>

        {cancelFailed ? (
          <ThemedText themeColor="textSecondary" style={styles.centered}>
            L&apos;annulation n&apos;a pas abouti. Réessaie.
          </ThemedText>
        ) : null}
      </ThemedView>

      <ThemedView style={styles.buttons}>
        <PrimaryButton label="Je confirme" onPress={onConfirmCancel} disabled={canceling} />

        <Pressable accessibilityRole="button" onPress={() => setConfirming(false)}>
          <ThemedText type="link" themeColor="textSecondary">
            Annuler
          </ThemedText>
        </Pressable>
      </ThemedView>
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
  buttons: {
    alignItems: 'center',
    gap: Spacing.three,
    alignSelf: 'stretch',
  },
});
