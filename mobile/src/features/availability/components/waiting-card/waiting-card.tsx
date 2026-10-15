import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { AvatarStack } from '@/components/avatar-stack';
import { formatTimeRemaining, type TimeRemaining } from '@/features/availability/helpers/countdown';
import { formatSignupCount } from '@/features/availability/helpers/fridays/fridays';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

type WaitingCardProps = {
  friday: string;
  remaining: TimeRemaining | null;
  citySignupCount: number | null;
};

export function WaitingCard({ friday, remaining, citySignupCount }: WaitingCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <ThemedText themeColor="onAccent" style={styles.date}>
          {formatFridayLabel(friday)}
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.when}>
          20 h · lieu annoncé jeudi à 19 h
        </ThemedText>
      </View>

      <View style={styles.badge}>
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          size={18}
          weight="bold"
          tintColor={Colors.onAccent}
        />
        <ThemedText themeColor="onAccent" style={styles.badgeLabel}>
          Tu es inscrit·e
        </ThemedText>
      </View>

      {remaining ? (
        <View>
          <ThemedText themeColor="onAccent" style={styles.countdownLabel}>
            Annonce de ton groupe dans
          </ThemedText>
          <ThemedText themeColor="onAccent" style={styles.countdown}>
            {formatTimeRemaining(remaining)}
          </ThemedText>
        </View>
      ) : null}

      {citySignupCount !== null ? (
        <View style={styles.people}>
          <AvatarStack />
          <ThemedText themeColor="onAccent" style={styles.peopleLabel}>
            {formatSignupCount(citySignupCount)}, toi compris
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 20,
    borderRadius: Radius.large,
    backgroundColor: Colors.accent,
  },
  date: {
    fontFamily: Fonts.semiBold,
    fontSize: 27,
    lineHeight: 34,
  },
  when: {
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.small,
    backgroundColor: Colors.accentDark,
  },
  badgeLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  countdownLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  countdown: {
    fontFamily: Fonts.bold,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  people: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  peopleLabel: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
});
