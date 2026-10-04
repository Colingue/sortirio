import { FlatList, StyleSheet } from 'react-native';

import { ScreenStatus } from '@/components/screen-status';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MyGroupsRow } from '@/features/group/components/my-groups-row/my-groups-row';
import { useMyGroups } from '@/features/group/hooks/useMyGroups/useMyGroups';

export default function MyGroupsScreen() {
  const myGroups = useMyGroups();

  if (myGroups.status !== 'ready') return <ScreenStatus failed={myGroups.status === 'failed'} />;

  if (myGroups.groups.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary" style={styles.empty}>
          Tes groupes apparaîtront ici après ton premier vendredi.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={myGroups.groups}
        keyExtractor={(group) => group.groupId}
        renderItem={(entry) => <MyGroupsRow group={entry.item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Spacing.six,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  empty: {
    textAlign: 'center',
  },
});
