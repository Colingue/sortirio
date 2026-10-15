import { StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { Colors } from '@/constants/theme';
import { type GroupMember } from '@/features/group/helpers/myGroup/myGroup';

export type MemberAvatarsProps = {
  members: GroupMember[];
  size: number;
  ringColor?: string;
};

export function MemberAvatars({ members, size, ringColor = Colors.accent }: MemberAvatarsProps) {
  return (
    <View
      style={styles.stack}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {members.map((member, index) => (
        <MemberAvatar
          key={member.userId}
          firstName={member.firstName}
          photoUrl={member.photoUrl}
          size={size}
          colorIndex={index}
          style={{
            borderWidth: size > 48 ? 3 : 2,
            borderColor: ringColor,
            marginLeft: index > 0 ? -size / 4 : 0,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'row',
  },
});
