import { StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { ReportMemberButton } from '@/features/group/components/report-member-button/report-member-button';
import { type GroupMember } from '@/features/group/helpers/myGroup/myGroup';

export type GroupMemberRowProps = {
  member: GroupMember;
  index: number;
  isMe: boolean;
  reported: boolean;
  onReport: () => Promise<void>;
};

export function GroupMemberRow({ member, index, isMe, reported, onReport }: GroupMemberRowProps) {
  return (
    <View style={styles.row}>
      <MemberAvatar
        firstName={member.firstName}
        photoUrl={member.photoUrl}
        size={38}
        colorIndex={index}
        style={isMe && styles.ring}
      />
      <ThemedText style={styles.name}>
        {isMe ? 'Toi' : member.firstName}
        <ThemedText themeColor="textMuted"> · {member.age} ans</ThemedText>
      </ThemedText>
      {isMe ? null : (
        <ReportMemberButton firstName={member.firstName} reported={reported} onReport={onReport} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ring: {
    borderWidth: 2,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.medium,
  },
});
