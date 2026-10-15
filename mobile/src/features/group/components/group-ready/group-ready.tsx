import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { GroupAnnouncementDetails } from '@/features/group/components/group-announcement-details/group-announcement-details';
import { MemberAvatars } from '@/features/group/components/member-avatars/member-avatars';
import { OnAccentButton } from '@/features/group/components/on-accent-button/on-accent-button';
import {
  formatMeetingLabel,
  formatMembersSentence,
  getOtherMembers,
  type MyGroup,
} from '@/features/group/helpers/myGroup/myGroup';

export type GroupReadyProps = {
  group: MyGroup;
  myUserId: string | undefined;
  onOpenGroup: () => void;
  onClose: () => void;
};

export function GroupReady({ group, myUserId, onOpenGroup, onClose }: GroupReadyProps) {
  const otherMembers = getOtherMembers(group, myUserId);
  const me = group.members.filter((member) => member.userId === myUserId);

  return (
    <SafeAreaView style={styles.screen}>
      <ThemedText themeColor="onAccent" style={styles.brand}>
        Dispo
      </ThemedText>

      <View style={styles.body}>
        <MemberAvatars members={[...otherMembers, ...me]} size={64} />
        <ThemedText themeColor="onAccent" style={styles.title}>
          Ton groupe est prêt !
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.members}>
          {formatMembersSentence(otherMembers)}
        </ThemedText>
        <GroupAnnouncementDetails
          meetingLabel={formatMeetingLabel(group.friday)}
          venueName={group.venueName}
          venueAddress={group.venueAddress}
        />
      </View>

      <View style={styles.actions}>
        <OnAccentButton label="Voir mon groupe" onPress={onOpenGroup} />
        <Pressable accessibilityRole="button" style={styles.later} onPress={onClose}>
          <ThemedText themeColor="onAccent" style={styles.laterLabel}>
            Plus tard, retour à l&apos;accueil
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: Colors.accent,
  },
  brand: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 44,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginTop: 28,
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 40,
    lineHeight: 44,
  },
  members: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 6,
  },
  later: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  laterLabel: {
    fontFamily: Fonts.medium,
  },
});
