import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { GroupDetailsHeader } from '@/features/group/components/group-details-header/group-details-header';
import { GroupMeetingCard } from '@/features/group/components/group-meeting-card/group-meeting-card';
import { GroupMemberRow } from '@/features/group/components/group-member-row/group-member-row';
import { OpenChatButton } from '@/features/group/components/open-chat-button/open-chat-button';
import { type GroupMember } from '@/features/group/helpers/myGroup/myGroup';

export type GroupDetailsProps = {
  friday: string;
  venueName: string;
  venueAddress: string;
  members: GroupMember[];
  myUserId: string | undefined;
  onOpenMember: (userId: string) => void;
  onOpenAddress: () => void;
  onOpenChat: () => void;
  onBack: () => void;
};

export function GroupDetails(props: GroupDetailsProps) {
  const joinedLate = props.members.some(
    (member) => member.userId === props.myUserId && member.joinedLate,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <GroupDetailsHeader onBack={props.onBack} />
      <GroupMeetingCard
        friday={props.friday}
        venueName={props.venueName}
        venueAddress={props.venueAddress}
        onOpenAddress={props.onOpenAddress}
      />
      {joinedLate ? (
        <View style={styles.joined}>
          <ThemedText style={styles.joinedTitle}>Tu as rejoint le groupe</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Un empêchement ? Préviens le groupe directement dans le chat.
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.whoHeader}>
        <ThemedText type="subtitle">Qui vient</ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          {props.members.length} personnes
        </ThemedText>
      </View>
      <ScrollView style={styles.list}>
        {props.members.map((member, index) => (
          <GroupMemberRow
            key={member.userId}
            member={member}
            index={index}
            isMe={member.userId === props.myUserId}
            onOpenProfile={() => props.onOpenMember(member.userId)}
          />
        ))}
      </ScrollView>

      <OpenChatButton color="accent" onPress={props.onOpenChat} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
    backgroundColor: Colors.background,
  },
  joined: {
    gap: 2,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.card,
    backgroundColor: Colors.backgroundElement,
  },
  joinedTitle: {
    fontFamily: Fonts.semiBold,
  },
  whoHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  list: {
    flex: 1,
    marginTop: 4,
    marginBottom: 12,
  },
});
