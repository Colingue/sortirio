import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { type MyGroupsItem } from '@/features/group/helpers/myGroups/myGroups';

export type MyGroupsRowProps = {
  group: MyGroupsItem;
};

function openGroup(groupId: string) {
  router.push({ pathname: '/past-group/[groupId]', params: { groupId } });
}

export function MyGroupsRow({ group }: MyGroupsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={styles.row}
      onPress={() => openGroup(group.groupId)}
    >
      <ThemedText type="subtitle">{group.fridayLabel}</ThemedText>
      <ThemedText>{group.venueName}</ThemedText>
      <ThemedText themeColor="textSecondary">{group.memberFirstNames}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
});
