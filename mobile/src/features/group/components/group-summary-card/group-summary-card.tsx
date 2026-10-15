import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { MemberAvatars } from '@/features/group/components/member-avatars/member-avatars';
import { OnAccentButton } from '@/features/group/components/on-accent-button/on-accent-button';
import { OpenChatButton } from '@/features/group/components/open-chat-button/open-chat-button';
import {
  formatMembersCount,
  formatShortFridayLabel,
  type GroupMember,
  type MyGroup,
} from '@/features/group/helpers/myGroup/myGroup';

export type GroupSummaryCardProps = {
  group: MyGroup;
  orderedMembers: GroupMember[];
  onOpenGroup: () => void;
  onOpenChat: () => void;
};

export function GroupSummaryCard({
  group,
  orderedMembers,
  onOpenGroup,
  onOpenChat,
}: GroupSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <SymbolView
          name={{ ios: 'checkmark', android: 'check' }}
          size={14}
          tintColor={Colors.onAccent}
        />
        <ThemedText type="smallBold" themeColor="onAccent">
          Groupe formé
        </ThemedText>
      </View>
      <View>
        <ThemedText themeColor="onAccent" style={styles.date}>
          Vendredi {formatShortFridayLabel(group.friday)} · 20 h
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.venue}>
          {group.venueName}
        </ThemedText>
        <ThemedText type="small" themeColor="onAccent">
          {group.venueAddress}
        </ThemedText>
      </View>
      <View style={styles.people}>
        <MemberAvatars members={orderedMembers} size={40} />
        <ThemedText themeColor="onAccent" style={styles.peopleLabel}>
          {formatMembersCount(group.members)}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <OnAccentButton label="Voir mon groupe" onPress={onOpenGroup} />
        <OpenChatButton color="onAccent" onPress={onOpenChat} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    marginTop: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: Radius.large,
    backgroundColor: Colors.accent,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentDark,
  },
  date: {
    fontFamily: Fonts.semiBold,
    fontSize: 25,
    lineHeight: 30,
  },
  venue: {
    marginTop: 4,
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  people: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  peopleLabel: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  actions: {
    gap: 8,
    marginTop: 2,
  },
});
