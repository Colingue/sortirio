import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { getDayOfMonth } from '@/features/availability/helpers/fridays/fridays';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

export function FridayDateCard({ city, friday }: { city: string; friday: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.day}>
        <ThemedText themeColor="onAccent" style={styles.dayName}>
          VEN.
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.dayNumber}>
          {getDayOfMonth(friday)}
        </ThemedText>
      </View>
      <View style={styles.cardWords}>
        <ThemedText style={styles.cardTitle}>{formatFridayLabel(friday)} · 20 h</ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          {city} · groupe annoncé jeudi à 19 h
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.backgroundElement,
  },
  day: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    backgroundColor: Colors.accent,
  },
  dayName: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    lineHeight: 13,
  },
  dayNumber: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    lineHeight: 26,
  },
  cardWords: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
});
