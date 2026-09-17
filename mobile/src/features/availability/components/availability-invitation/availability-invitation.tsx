import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { fridayLabel } from '@/features/availability/helpers/friday-label/friday-label';

export type AvailabilityInvitationProps = {
  openFriday: string;
};

export function AvailabilityInvitation({ openFriday }: AvailabilityInvitationProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">{fridayLabel(openFriday)}</ThemedText>
      </ThemedView>

      <PrimaryButton label="Je suis dispo" onPress={() => {}} />
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
  words: {
    gap: Spacing.three,
  },
});
