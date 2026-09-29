import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MEETING_TIME_LABEL, type GroupMember } from '@/features/group/helpers/myGroup/myGroup';
import { useTheme } from '@/hooks/useTheme';

export type GroupSummaryProps = {
  venueName: string;
  otherMembers: GroupMember[];
  onPress: () => void;
};

export function GroupSummary({ venueName, otherMembers, onPress }: GroupSummaryProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">{MEETING_TIME_LABEL}</ThemedText>
        <ThemedText type="subtitle">{venueName}</ThemedText>

        <ThemedView style={styles.faces}>
          {otherMembers.map((member) => (
            <Image
              key={member.userId}
              source={member.photoUrl ? { uri: member.photoUrl } : undefined}
              style={[styles.face, { backgroundColor: theme.backgroundElement }]}
              contentFit="cover"
              accessibilityLabel={member.firstName}
            />
          ))}
        </ThemedView>
      </ThemedView>

      <PrimaryButton label="Voir mon groupe" onPress={onPress} />
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
  faces: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  face: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
