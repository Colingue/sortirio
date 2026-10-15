import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { CityHeader } from '@/features/availability/components/city-header/city-header';
import { NextSteps } from '@/features/availability/components/next-steps/next-steps';
import { WaitingCard } from '@/features/availability/components/waiting-card/waiting-card';
import { type TimeRemaining } from '@/features/availability/helpers/countdown';

export type AvailabilityWaitingSummaryProps = {
  city: string;
  postedFriday: string;
  canCancel: boolean;
  onRequestCancel: () => void;
  remaining: TimeRemaining | null;
  citySignupCount: number | null;
};

export function AvailabilityWaitingSummary({
  city,
  postedFriday,
  canCancel,
  onRequestCancel,
  remaining,
  citySignupCount,
}: AvailabilityWaitingSummaryProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <CityHeader city={city} />

        <ThemedText type="title" style={styles.title}>
          C&apos;est noté, tu es dispo vendredi !
        </ThemedText>

        <ThemedText type="subtitle" style={styles.section}>
          Prochain verre
        </ThemedText>
        <WaitingCard
          friday={postedFriday}
          remaining={remaining}
          citySignupCount={citySignupCount}
        />

        {canCancel ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRequestCancel}
            style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
          >
            <ThemedText themeColor="textSecondary" style={styles.cancelLabel}>
              Retirer ma disponibilité
            </ThemedText>
          </Pressable>
        ) : null}

        <ThemedText type="subtitle" style={styles.section}>
          Et ensuite ?
        </ThemedText>
        <NextSteps />
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
  cancel: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 12,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  pressed: {
    backgroundColor: Colors.backgroundElement,
  },
  cancelLabel: {
    fontFamily: Fonts.medium,
  },
});
