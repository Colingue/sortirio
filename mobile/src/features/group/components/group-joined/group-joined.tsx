import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { ChatOpenRow } from '@/features/group/components/chat-open-row/chat-open-row';
import { GroupAnnouncementDetails } from '@/features/group/components/group-announcement-details/group-announcement-details';
import { MemberAvatars } from '@/features/group/components/member-avatars/member-avatars';
import { OnAccentButton } from '@/features/group/components/on-accent-button/on-accent-button';
import {
  formatJoinedSentence,
  formatMeetingLabel,
  getOtherMembers,
  type MyGroup,
} from '@/features/group/helpers/myGroup/myGroup';

export type GroupJoinedProps = {
  group: MyGroup;
  myUserId: string | undefined;
  onOpenChat: () => void;
  onOpenGroup: () => void;
};

export function GroupJoined({ group, myUserId, onOpenChat, onOpenGroup }: GroupJoinedProps) {
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
          Tu rejoins un groupe !
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.members}>
          {formatJoinedSentence(otherMembers)}
        </ThemedText>
        <GroupAnnouncementDetails
          meetingLabel={formatMeetingLabel(group.friday)}
          venueName={group.venueName}
          venueAddress={group.venueAddress}
        >
          <ChatOpenRow />
        </GroupAnnouncementDetails>
      </View>

      <View style={styles.actions}>
        <OnAccentButton label="Dire bonjour dans le chat" onPress={onOpenChat} />
        <Pressable
          accessibilityRole="button"
          onPress={onOpenGroup}
          style={({ pressed }) => [styles.outline, pressed && styles.pressed]}
        >
          <ThemedText themeColor="onAccent" style={styles.outlineLabel}>
            Voir mon groupe
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
    gap: 8,
  },
  outline: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    borderColor: Colors.onAccent,
  },
  pressed: {
    opacity: 0.6,
  },
  outlineLabel: {
    fontFamily: Fonts.semiBold,
  },
});
