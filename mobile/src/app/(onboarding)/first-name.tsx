import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSignupDraft } from '@/features/signup/providers/signup-draft/signup-draft';
import { useTheme } from '@/hooks/use-theme';

const MAX_LENGTH = 30;

export default function FirstNameScreen() {
  const theme = useTheme();
  const { draft, update } = useSignupDraft();
  const [typed, setTyped] = useState(draft.firstName ?? '');
  const firstName = typed.trim();

  function confirmFirstName() {
    update({ firstName });
    router.push('/birthdate');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">Comment veux-tu qu&apos;on t&apos;appelle ?</ThemedText>
        <TextInput
          value={typed}
          onChangeText={setTyped}
          maxLength={MAX_LENGTH}
          autoFocus
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          placeholder="Ton prénom"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />
      </ThemedView>

      <PrimaryButton
        label="Continuer"
        onPress={confirmFirstName}
        disabled={firstName.length === 0}
      />
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
    gap: Spacing.four,
  },
  input: {
    fontSize: 24,
    fontWeight: 500,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
});
