import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useCountdown } from '@/hooks/useCountdown';

import { AvailabilityWaitingSummary } from './availability-waiting-summary';

export type AvailabilityWaitingProps = {
  city: string;
  postedFriday: string;
  canCancel: boolean;
  onConfirmCancel: () => void;
  canceling: boolean;
  cancelFailed: boolean;
  groupFormationAt: string | null;
  citySignupCount: number | null;
};

export function AvailabilityWaiting({
  city,
  postedFriday,
  canCancel,
  onConfirmCancel,
  canceling,
  cancelFailed,
  groupFormationAt,
  citySignupCount,
}: AvailabilityWaitingProps) {
  const [confirming, setConfirming] = useState(false);
  const remaining = useCountdown(groupFormationAt);

  if (!confirming || !canCancel) {
    return (
      <AvailabilityWaitingSummary
        city={city}
        postedFriday={postedFriday}
        canCancel={canCancel}
        onRequestCancel={() => setConfirming(true)}
        remaining={remaining}
        citySignupCount={citySignupCount}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.words}>
        <ThemedText type="title" style={styles.centered}>
          Tu retires ta dispo pour ce vendredi ?
        </ThemedText>

        {cancelFailed ? (
          <ThemedText type="small" themeColor="danger" style={styles.centered}>
            Le retrait n&apos;a pas abouti. Réessaie.
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.buttons}>
        <PrimaryButton label="Je confirme" onPress={onConfirmCancel} disabled={canceling} />

        <Pressable accessibilityRole="button" onPress={() => setConfirming(false)}>
          <ThemedText type="link" themeColor="textSecondary">
            Annuler
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  centered: {
    textAlign: 'center',
  },
  words: {
    gap: 16,
  },
  buttons: {
    alignItems: 'center',
    gap: 16,
    alignSelf: 'stretch',
  },
});
