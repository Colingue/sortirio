import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { cities } from '@/features/city/cities';
import { useSignupDraft } from '@/features/signup/signup-draft';

export default function CityScreen() {
  const { update } = useSignupDraft();
  const [city] = cities;

  function next() {
    update({ city: city.id });
    router.push('/first-name');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">Sortirio est à {city.label}.</ThemedText>
        <ThemedText themeColor="textSecondary">
          C&apos;est la seule ville pour l&apos;instant : on préfère bien faire sortir les Lyonnais
          avant d&apos;aller ailleurs. Les autres viendront.
        </ThemedText>
      </ThemedView>

      <PrimaryButton label="Continuer" onPress={next} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  words: {
    gap: Spacing.three,
  },
});
