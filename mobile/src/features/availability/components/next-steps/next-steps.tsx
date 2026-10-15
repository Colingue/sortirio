import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

const STEPS = [
  { when: 'Jeudi 19 h', what: "On t'annonce ton groupe (3 à 6 pers.) et le lieu" },
  { when: 'Vendredi 20 h', what: 'Vous vous retrouvez sur place' },
];

export function NextSteps() {
  return (
    <View style={styles.list}>
      {STEPS.map((step) => (
        <View key={step.when} style={styles.row}>
          <ThemedText themeColor="accent" style={styles.when}>
            {step.when}
          </ThemedText>
          <ThemedText style={styles.what}>{step.what}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  when: {
    width: 100,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  what: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
