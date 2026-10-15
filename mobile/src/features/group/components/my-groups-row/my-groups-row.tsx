import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { GroupFaces } from '@/features/group/components/group-faces/group-faces';
import { type MyGroupsItem } from '@/features/group/helpers/myGroups/myGroups';

export type MyGroupsRowProps = {
  group: MyGroupsItem;
};

export function MyGroupsRow({ group }: MyGroupsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() =>
        router.push({ pathname: '/past-group/[groupId]', params: { groupId: group.groupId } })
      }
    >
      <GroupFaces firstNames={group.memberFirstNames} />
      <View style={styles.words}>
        <View style={styles.line}>
          <ThemedText style={styles.date}>{group.fridayLabel}</ThemedText>
          {group.lastMessage ? (
            <ThemedText type="small" themeColor="textMuted">
              {group.lastMessage.timeLabel}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" themeColor="textMuted">
          {group.venueName} · {group.memberFirstNames.length} membres
        </ThemedText>
        {group.lastMessage ? (
          <ThemedText themeColor="textSecondary" numberOfLines={1} style={styles.preview}>
            {group.lastMessage.preview}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Colors.backgroundElement,
  },
  pressed: {
    backgroundColor: Colors.backgroundSelected,
  },
  words: {
    flex: 1,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  date: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  preview: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});
