import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { CityHeader } from '@/features/availability/components/city-header/city-header';
import { InvitationCard } from '@/features/availability/components/invitation-card/invitation-card';
import { UpcomingFridays } from '@/features/availability/components/upcoming-fridays/upcoming-fridays';

export type AvailabilityInvitationProps = {
  city: string;
  nextOpenFriday: string;
  citySignupCount: number | null;
  onPress: () => void;
  saving: boolean;
  failed: boolean;
};

export function AvailabilityInvitation({
  city,
  nextOpenFriday,
  citySignupCount,
  onPress,
  saving,
  failed,
}: AvailabilityInvitationProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <CityHeader city={city} />

        <ThemedText type="title" style={styles.title}>
          Participe au prochain verre Dispo
        </ThemedText>

        <ThemedText type="subtitle" style={styles.section}>
          Prochain verre
        </ThemedText>
        <InvitationCard
          friday={nextOpenFriday}
          citySignupCount={citySignupCount}
          saving={saving}
          onPress={onPress}
        />
        {failed ? (
          <ThemedText type="small" themeColor="danger" style={styles.error}>
            L&apos;enregistrement n&apos;a pas abouti. Réessaie.
          </ThemedText>
        ) : null}

        <ThemedText type="subtitle" style={styles.section}>
          Autres verres Dispo
        </ThemedText>
        <UpcomingFridays after={nextOpenFriday} city={city} />
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
    marginTop: 24,
    fontSize: 28,
    lineHeight: 34,
  },
  section: {
    marginTop: 26,
    marginBottom: 12,
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
  },
});
