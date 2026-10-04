import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ReportMemberButton } from '@/features/group/components/report-member-button/report-member-button';
import { MEETING_TIME_LABEL, type GroupMember } from '@/features/group/helpers/myGroup/myGroup';
import { useTheme } from '@/hooks/useTheme';

export type GroupDetailsProps = {
  venueName: string;
  venueAddress: string;
  members: GroupMember[];
  myUserId: string | undefined;
  reportedUserIds: Set<string>;
  onReportMember: (userId: string) => Promise<void>;
  onOpenAddress: () => void;
  onOpenChat: () => void;
  onBack: () => void;
};

export function GroupDetails({
  venueName,
  venueAddress,
  members,
  myUserId,
  reportedUserIds,
  onReportMember,
  onOpenAddress,
  onOpenChat,
  onBack,
}: GroupDetailsProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">{venueName}</ThemedText>

        <Pressable accessibilityRole="link" onPress={onOpenAddress}>
          <ThemedText type="linkPrimary">{venueAddress}</ThemedText>
        </Pressable>

        <ThemedText type="subtitle">{MEETING_TIME_LABEL}</ThemedText>

        {members.map((member) => (
          <ThemedView key={member.userId} style={styles.member}>
            <Image
              source={member.photoUrl ? { uri: member.photoUrl } : undefined}
              style={[styles.face, { backgroundColor: theme.backgroundElement }]}
              contentFit="cover"
            />
            <ThemedText style={styles.name}>
              {member.firstName}, {member.age} ans
            </ThemedText>
            {member.userId !== myUserId && (
              <ReportMemberButton
                firstName={member.firstName}
                reported={reportedUserIds.has(member.userId)}
                onReport={() => onReportMember(member.userId)}
              />
            )}
          </ThemedView>
        ))}
      </ScrollView>

      <PrimaryButton label="Discuter" onPress={onOpenChat} />

      <Pressable accessibilityRole="button" onPress={onBack}>
        <ThemedText type="link" themeColor="textSecondary">
          Retour
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  content: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  name: {
    flex: 1,
  },
  face: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
