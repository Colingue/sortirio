import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { getCountdownUnits, type TimeRemaining } from '@/features/availability/helpers/countdown';

type CountdownBoxesProps = {
  label: string;
  remaining: TimeRemaining;
};

export function CountdownBoxes({ label, remaining }: CountdownBoxesProps) {
  return (
    <View style={styles.container}>
      <ThemedText themeColor="onAccent" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.row}>
        {getCountdownUnits(remaining).map((unit) => (
          <View key={unit.label} style={styles.box}>
            <ThemedText themeColor="accent" style={styles.value}>
              {unit.value}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.unit}>
              {unit.label}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: Radius.small,
    backgroundColor: Colors.surface,
  },
  value: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
