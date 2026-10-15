import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { AvatarStack } from '@/components/avatar-stack';
import { formatSignupCount } from '@/features/availability/helpers/fridays/fridays';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

type InvitationCardProps = {
  friday: string;
  citySignupCount: number | null;
  saving: boolean;
  onPress: () => void;
};

export function InvitationCard({ friday, citySignupCount, saving, onPress }: InvitationCardProps) {
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

      {citySignupCount ? (
        <View style={styles.people}>
          <AvatarStack />
          <ThemedText themeColor="onAccent" style={styles.peopleLabel}>
            Déjà {formatSignupCount(citySignupCount)}
          </ThemedText>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: saving }}
        disabled={saving}
        onPress={onPress}
        style={({ pressed }) => [styles.button, (pressed || saving) && styles.dimmed]}
      >
        <ThemedText themeColor="accent" style={styles.buttonLabel}>
          {saving ? 'Un instant…' : 'Je suis dispo'}
        </ThemedText>
      </Pressable>
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
});
