import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { MemberAvatars } from '@/features/group/components/member-avatars/member-avatars';
import { useGroupDetails } from '@/features/group/hooks/useGroupDetails/useGroupDetails';

const SHOWN_AVATARS = 3;

export function GroupChatHeader({ groupId, onBack }: { groupId: string; onBack: () => void }) {
  const groupDetails = useGroupDetails(groupId);
  const group = groupDetails.status === 'ready' ? groupDetails.group : null;

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        style={styles.back}
        onPress={onBack}
      >
        <SymbolView
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={22}
          tintColor={Colors.text}
        />
      </Pressable>
      {group ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voir le groupe"
          style={styles.group}
          onPress={() => router.push({ pathname: '/past-group/[groupId]', params: { groupId } })}
        >
          <View style={styles.words}>
            <ThemedText style={styles.title}>{formatFridayLabel(group.friday)}</ThemedText>
            <ThemedText type="small" themeColor="textMuted" numberOfLines={1}>
              {group.venueName} · 20 h · {group.members.length} membres
            </ThemedText>
          </View>
          <MemberAvatars
            members={group.members.slice(0, SHOWN_AVATARS)}
            size={28}
            ringColor={Colors.background}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  group: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  words: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
});
