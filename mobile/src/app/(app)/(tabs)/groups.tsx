import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenStatus } from '@/components/screen-status';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { MyGroupsRow } from '@/features/group/components/my-groups-row/my-groups-row';
import { MyGroupsSectionTitle } from '@/features/group/components/my-groups-section-title/my-groups-section-title';
import { PendingGroupCard } from '@/features/group/components/pending-group-card/pending-group-card';
import { useMyGroups } from '@/features/group/hooks/useMyGroups/useMyGroups';

export default function MyGroupsScreen() {
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;
  const myGroups = useMyGroups(myUserId);

  if (myGroups.status !== 'ready') return <ScreenStatus failed={myGroups.status === 'failed'} />;

  const { upcoming, past } = myGroups;
  const isEmpty = upcoming === null && past.length === 0;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Mes groupes
        </ThemedText>
        <ThemedText themeColor="textMuted" style={styles.lead}>
          {isEmpty
            ? 'Tes groupes apparaîtront ici après ton premier vendredi.'
            : 'Les chats restent ouverts après la soirée.'}
        </ThemedText>

        {upcoming ? (
          <>
            <MyGroupsSectionTitle title="À venir" count={1} marginTop={22} />
            {upcoming.kind === 'group' ? (
              <MyGroupsRow group={upcoming.group} />
            ) : (
              <PendingGroupCard
                friday={upcoming.friday}
                isFormedThursday={upcoming.isFormedThursday}
              />
            )}
          </>
        ) : null}

        {past.length > 0 ? (
          <>
            <MyGroupsSectionTitle title="Passés" count={past.length} marginTop={28} />
            <View style={styles.cards}>
              {past.map((group) => (
                <MyGroupsRow key={group.groupId} group={group} />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
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
    fontSize: 14,
    lineHeight: 21,
  },
  cards: {
    gap: 10,
  },
});
