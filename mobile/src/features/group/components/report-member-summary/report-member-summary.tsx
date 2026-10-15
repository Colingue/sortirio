import { StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { type GroupMemberProfile } from '@/features/group/helpers/myGroup/myGroup';

export function ReportMemberSummary({ profile }: { profile: GroupMemberProfile }) {
  const { member } = profile;

  return (
    <View style={styles.member}>
      <MemberAvatar
        firstName={member.firstName}
        photoUrl={member.photoUrl}
        size={56}
        colorIndex={profile.colorIndex}
      />
      <View>
        <ThemedText style={styles.name}>
          {member.firstName}, {member.age} ans
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          Groupe du {formatFridayLabel(profile.friday).toLowerCase()}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  name: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
});
