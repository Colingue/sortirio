import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenStatus } from '@/components/screen-status';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { MyGroupsRow } from '@/features/group/components/my-groups-row/my-groups-row';
import { useMyGroups } from '@/features/group/hooks/useMyGroups/useMyGroups';

export default function MyGroupsScreen() {
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;
  const myGroups = useMyGroups(myUserId);

  if (myGroups.status !== 'ready') return <ScreenStatus failed={myGroups.status === 'failed'} />;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <FlatList
        data={myGroups.groups}
        keyExtractor={(group) => group.groupId}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <ThemedText type="title" style={styles.title}>
              Mes groupes
            </ThemedText>
            <ThemedText themeColor="textMuted" style={styles.lead}>
              {myGroups.groups.length === 0
                ? 'Tes groupes apparaîtront ici après ton premier vendredi.'
                : 'Les chats restent ouverts après la soirée.'}
            </ThemedText>
          </>
        }
        renderItem={(entry) => <MyGroupsRow group={entry.item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    gap: 10,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  lead: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 21,
  },
});
