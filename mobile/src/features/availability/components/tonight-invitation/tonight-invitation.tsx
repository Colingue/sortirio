import { type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { CityHeader } from '@/features/availability/components/city-header/city-header';
import { TonightCard } from '@/features/availability/components/tonight-card/tonight-card';
import { UpcomingFridays } from '@/features/availability/components/upcoming-fridays/upcoming-fridays';

export type TonightInvitationProps = {
  city: string;
  topCard?: ReactNode;
  signupFriday: string;
  signupClosesAt: string;
  onPress: () => void;
  saving: boolean;
  failed: boolean;
};

export function TonightInvitation({
  city,
  topCard,
  signupFriday,
  signupClosesAt,
  onPress,
  saving,
  failed,
}: TonightInvitationProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <CityHeader city={city} />
        {topCard}

        <ThemedText type="title" style={styles.title}>
          Envie de sortir ce soir ?
        </ThemedText>

        <ThemedText type="subtitle" style={styles.section}>
          Ce soir
        </ThemedText>
        <TonightCard
          city={city}
          signupFriday={signupFriday}
          signupClosesAt={signupClosesAt}
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
        <UpcomingFridays after={signupFriday} city={city} />
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
