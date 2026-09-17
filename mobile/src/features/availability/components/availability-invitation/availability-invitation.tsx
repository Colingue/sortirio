import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { fridayLabel } from '@/features/availability/helpers/friday-label/friday-label';

export type AvailabilityInvitationProps = {
  openFriday: string;
  onPress: () => void;
  saving: boolean;
  failed: boolean;
};

export function AvailabilityInvitation({
  openFriday,
  onPress,
  saving,
  failed,
}: AvailabilityInvitationProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">{fridayLabel(openFriday)}</ThemedText>

        {failed ? (
          <ThemedText themeColor="textSecondary">
            L&apos;enregistrement n&apos;a pas abouti. Réessaie.
          </ThemedText>
        ) : null}
      </ThemedView>

      <PrimaryButton
        label={saving ? 'Un instant…' : 'Je suis dispo'}
        onPress={onPress}
        disabled={saving}
      />
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
