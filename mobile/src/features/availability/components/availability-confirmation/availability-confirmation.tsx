import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { getDayOfMonth } from '@/features/availability/helpers/fridays/fridays';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

export type AvailabilityConfirmationProps = {
  city: string;
  friday: string;
  onAcknowledge: () => void;
};

export function AvailabilityConfirmation({
  city,
  friday,
  onAcknowledge,
}: AvailabilityConfirmationProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.check}>
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={56}
            weight="bold"
            tintColor={Colors.onAccent}
          />
        </View>
        <ThemedText type="title" style={styles.title}>
          Bravo, tu es inscrit·e !
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.lead}>
          On forme les groupes jeudi à 19 h. Tu recevras une notification avec ton groupe et le
          lieu.
        </ThemedText>

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
      </View>

      <PrimaryButton label="J'ai compris" onPress={onAcknowledge} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: Colors.accent,
  },
  title: {
    marginTop: 32,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  lead: {
    maxWidth: 320,
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 14,
    marginTop: 32,
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
