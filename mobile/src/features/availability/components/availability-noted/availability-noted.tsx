import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCountdown } from '@/hooks/use-countdown';

import { AvailabilityNotedSummary } from './availability-noted-summary';

export type AvailabilityNotedProps = {
  canCancel: boolean;
  onConfirmCancel: () => void;
  canceling: boolean;
  cancelFailed: boolean;
  groupFormationAt: string | null;
  citySignupCount: number | null;
};

export function AvailabilityNoted({
  canCancel,
  onConfirmCancel,
  canceling,
  cancelFailed,
  groupFormationAt,
  citySignupCount,
}: AvailabilityNotedProps) {
  const [confirming, setConfirming] = useState(false);
  const remaining = useCountdown(groupFormationAt);

  if (!confirming || !canCancel) {
    return (
      <AvailabilityNotedSummary
        canCancel={canCancel}
        onRequestCancel={() => setConfirming(true)}
        remaining={remaining}
        citySignupCount={citySignupCount}
      />
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
