import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { FridayDateCard } from '@/features/availability/components/friday-date-card/friday-date-card';
import { getDayOfMonth } from '@/features/availability/helpers/fridays/fridays';
import { type ScreenState } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

export type NoGroupTonightProps = {
  city: string;
  screen: Extract<ScreenState, { status: 'ready' }>;
  onDeclare: () => Promise<boolean>;
};

export function NoGroupTonight({ city, screen, onDeclare }: NoGroupTonightProps) {
  const nextFriday = screen.fridayState.signupFriday;

  async function declareAndConfirm() {
    const posted = await onDeclare();
    if (posted)
      router.push({ pathname: '/availability-confirmed', params: { friday: nextFriday } });
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.icon}>
          <SymbolView
            name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
            size={52}
            tintColor={Colors.accent}
          />
        </View>
        <ThemedText type="title" style={styles.title}>
          Pas de groupe ce soir
        </ThemedText>
        <ThemedText themeColor="accent" style={styles.subtitle}>
          On se retrouve vendredi prochain ?
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.lead}>
          Il est 18 h et il n&apos;y a pas eu assez de monde dispo ce soir pour former un groupe.
          Désolé !
        </ThemedText>

        <View style={styles.card}>
          <FridayDateCard city={city} friday={nextFriday} />
        </View>
      </View>

      <PrimaryButton
        label={
          screen.saving ? 'Un instant…' : `Je suis dispo vendredi ${getDayOfMonth(nextFriday)}`
        }
        onPress={() => void declareAndConfirm()}
        disabled={screen.saving}
      />
      {screen.saveFailed ? (
        <ThemedText type="small" themeColor="danger" style={styles.error}>
          L&apos;enregistrement n&apos;a pas abouti. Réessaie.
        </ThemedText>
      ) : null}
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
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: Colors.backgroundElement,
  },
  title: {
    marginTop: 32,
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  lead: {
    maxWidth: 320,
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    marginTop: 28,
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
  },
});
