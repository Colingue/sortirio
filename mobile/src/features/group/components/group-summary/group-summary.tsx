import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { CityHeader } from '@/features/availability/components/city-header/city-header';
import { UpcomingFridays } from '@/features/availability/components/upcoming-fridays/upcoming-fridays';
import { GroupSummaryCard } from '@/features/group/components/group-summary-card/group-summary-card';
import { getOtherMembers, type MyGroup } from '@/features/group/helpers/myGroup/myGroup';

export type GroupSummaryProps = {
  city: string;
  group: MyGroup;
  myUserId: string | undefined;
};

export function GroupSummary({ city, group, myUserId }: GroupSummaryProps) {
  const me = group.members.filter((member) => member.userId === myUserId);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <CityHeader city={city} />

        <ThemedText type="title" style={styles.title}>
          Ton groupe est prêt
        </ThemedText>

        <GroupSummaryCard
          group={group}
          orderedMembers={[...getOtherMembers(group, myUserId), ...me]}
          onOpenGroup={() => router.push('/group')}
          onOpenChat={() =>
            router.push({ pathname: '/chat/[groupId]', params: { groupId: group.groupId } })
          }
        />

        <ThemedText type="subtitle" style={styles.section}>
          Autres verres Dispo
        </ThemedText>
        <UpcomingFridays after={group.friday} city={city} />
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
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    lineHeight: 34,
  },
  section: {
    marginTop: 24,
    marginBottom: 12,
  },
});
