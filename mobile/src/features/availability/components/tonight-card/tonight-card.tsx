import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { CountdownBoxes } from '@/features/availability/components/countdown-boxes/countdown-boxes';
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

      {remaining ? (
        <CountdownBoxes label="Inscriptions jusqu'à 18 h, fin dans" remaining={remaining} />
      ) : null}

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
