import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { formatTimeRemaining } from '@/features/availability/helpers/countdown';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { useCountdown } from '@/hooks/useCountdown';

type LateSignupCardProps = {
  city: string;
  postedFriday: string;
  signupClosesAt: string;
};

export function LateSignupCard({ city, postedFriday, signupClosesAt }: LateSignupCardProps) {
  const remaining = useCountdown(signupClosesAt);

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <SymbolView
          name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
          size={14}
          tintColor={Colors.onAccent}
        />
        <ThemedText themeColor="onAccent" style={styles.badgeLabel}>
          En attente
        </ThemedText>
      </View>

      <View>
        <ThemedText themeColor="onAccent" style={styles.date}>
          Ce soir, {formatFridayLabel(postedFriday)}
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.body}>
          Tous les groupes de {city} sont complets pour l&apos;instant. Dès qu&apos;assez de monde
          est dispo ce soir, on te prévient.
        </ThemedText>
      </View>

      <View style={styles.deadline}>
        <ThemedText themeColor="onAccent" style={styles.deadlineLabel}>
          Recherche jusqu&apos;à 18 h
        </ThemedText>
        {remaining ? (
          <ThemedText themeColor="onAccent" style={styles.remaining}>
            encore {formatTimeRemaining(remaining)}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    gap: 14,
    padding: 20,
    borderRadius: Radius.large,
    backgroundColor: Colors.accent,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentDark,
  },
  badgeLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
  },
  date: {
    fontFamily: Fonts.semiBold,
    fontSize: 25,
    lineHeight: 30,
  },
  body: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.small,
    backgroundColor: Colors.accentDark,
  },
  deadlineLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  remaining: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
