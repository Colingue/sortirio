import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { cities } from '@/features/city/cities';
import { useSignupDraft } from '@/features/signup/signup-draft';
import { useTheme } from '@/hooks/use-theme';

export default function CityScreen() {
  const theme = useTheme();
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

      <Pressable
        accessibilityRole="button"
        onPress={next}
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
      >
        <ThemedText type="subtitle">Continuer</ThemedText>
      </Pressable>
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
  button: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
  },
});
