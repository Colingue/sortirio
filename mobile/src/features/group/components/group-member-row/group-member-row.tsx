import { Pressable, StyleSheet } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { type GroupMember } from '@/features/group/helpers/myGroup/myGroup';

export type GroupMemberRowProps = {
  member: GroupMember;
  index: number;
  isMe: boolean;
  onOpenProfile: () => void;
};

export function GroupMemberRow({ member, index, isMe, onOpenProfile }: GroupMemberRowProps) {
  return (
    <Pressable
      accessibilityRole={isMe ? undefined : 'button'}
      accessibilityLabel={isMe ? undefined : `Voir le profil de ${member.firstName}`}
      disabled={isMe}
      onPress={onOpenProfile}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
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
    </Pressable>
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
  pressed: {
    opacity: 0.6,
  },
  ring: {
    borderWidth: 2,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.medium,
  },
});
