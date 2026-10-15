import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { cities } from '@/features/city/helpers/cities/cities';
import { SignupStepHeader } from '@/features/signup/components/signup-step-header/signup-step-header';
import { useSignupDraft } from '@/features/signup/providers/signup-draft/signup-draft';

export default function CityScreen() {
  const { update } = useSignupDraft();
  const [city] = cities;

  function confirmCity() {
    update({ city: city.name });
    router.push('/first-name');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <SignupStepHeader step={1} />

      <ThemedText type="title" style={styles.title}>
        Où veux-tu sortir le vendredi soir ?
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.lead}>
        Chaque vendredi, Dispo réunit de petits groupes de 3 à 6 personnes autour d&apos;un verre,
        dans ta ville.
      </ThemedText>

      <ThemedText style={styles.section}>Ville ouverte</ThemedText>
      <View accessibilityState={{ selected: true }} style={styles.card}>
        <View style={styles.pin}>
          <SymbolView
            name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
            size={22}
            tintColor={Colors.onAccent}
          />
        </View>
        <View style={styles.cardWords}>
          <ThemedText style={styles.cityName}>{city.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Un verre chaque vendredi à 20 h
          </ThemedText>
        </View>
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          size={22}
          weight="bold"
          tintColor={Colors.accent}
        />
      </View>
      <ThemedText type="small" themeColor="textMuted" style={styles.note}>
        Pour l&apos;instant, Dispo n&apos;est ouvert qu&apos;à {city.name}. Tu pourras changer de
        ville depuis ton profil si tu déménages.
      </ThemedText>

      <View style={styles.spacer} />

      <PrimaryButton label="Continuer" onPress={confirmCity} />
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
  title: {
    marginTop: 40,
  },
  lead: {
    marginTop: 14,
  },
  section: {
    marginTop: 36,
    marginBottom: 12,
    fontFamily: Fonts.medium,
    fontSize: 18,
    lineHeight: 26,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 14,
    backgroundColor: Colors.backgroundSelected,
  },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
  },
  cardWords: {
    flex: 1,
    gap: 2,
  },
  cityName: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
  },
  note: {
    marginTop: 14,
  },
  spacer: {
    flex: 1,
  },
});
