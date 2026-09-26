import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type AvailabilityConfirmationProps = {
  onAcknowledge: () => void;
};

export function AvailabilityConfirmation({ onAcknowledge }: AvailabilityConfirmationProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title" style={styles.centered}>
          Bravo, tu es inscrit pour vendredi prochain !
        </ThemedText>

        <ThemedText themeColor="textSecondary" style={styles.centered}>
          On forme les groupes jeudi 19 h, et on t&apos;envoie une notification dès que ton groupe
          est prêt.
        </ThemedText>
      </ThemedView>

      <PrimaryButton label="J'ai compris" onPress={onAcknowledge} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centered: {
    textAlign: 'center',
  },
  words: {
    gap: Spacing.three,
  },
});
