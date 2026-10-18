import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { formatTimeRemaining } from '@/features/availability/helpers/countdown';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { useCountdown } from '@/hooks/useCountdown';

type TonightCardProps = {
  city: string;
  signupFriday: string;
  signupClosesAt: string;
  saving: boolean;
  onPress: () => void;
};

export function TonightCard({
  city,
  signupFriday,
  signupClosesAt,
  saving,
  onPress,
}: TonightCardProps) {
  const remaining = useCountdown(signupClosesAt);

  return (
    <View style={styles.card}>
      <View>
        <ThemedText themeColor="onAccent" style={styles.date}>
          {formatFridayLabel(signupFriday)}
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.when}>
          20 h · {city}
        </ThemedText>
      </View>

      <View style={styles.deadline}>
        <SymbolView
          name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
          size={18}
          tintColor={Colors.onAccent}
        />
        <ThemedText themeColor="onAccent" style={styles.deadlineLabel}>
          Inscriptions jusqu&apos;à 18 h
        </ThemedText>
        {remaining ? (
          <ThemedText themeColor="onAccent" style={styles.remaining}>
            encore {formatTimeRemaining(remaining)}
          </ThemedText>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: saving }}
        disabled={saving}
        onPress={onPress}
        style={({ pressed }) => [styles.button, (pressed || saving) && styles.dimmed]}
      >
        <ThemedText themeColor="accent" style={styles.buttonLabel}>
          {saving ? 'Un instant…' : 'Je suis dispo ce soir'}
        </ThemedText>
      </Pressable>
      <ThemedText type="small" themeColor="onAccent" style={styles.hint}>
        Tu rejoins tout de suite un groupe qui a de la place.
      </ThemedText>
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
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.small,
    backgroundColor: Colors.accentDark,
  },
  deadlineLabel: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  remaining: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: Radius.small,
    backgroundColor: Colors.surface,
  },
  dimmed: {
    opacity: 0.8,
  },
  buttonLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
  },
  hint: {
    marginTop: -6,
    textAlign: 'center',
  },
});
