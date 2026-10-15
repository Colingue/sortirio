import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { SignupStepHeader } from '@/features/signup/components/signup-step-header/signup-step-header';
import { useSignupDraft } from '@/features/signup/providers/signup-draft/signup-draft';

const MAX_LENGTH = 30;

export default function FirstNameScreen() {
  const { draft, update } = useSignupDraft();
  const [typed, setTyped] = useState(draft.firstName ?? '');
  const [focused, setFocused] = useState(false);
  const firstName = typed.trim();

  function confirmFirstName() {
    update({ firstName });
    router.push('/birthdate');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <SignupStepHeader step={2} />

      <ThemedText type="title" style={styles.title}>
        Comment tu t&apos;appelles ?
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.lead}>
        C&apos;est le prénom que verront les membres de ton groupe.
      </ThemedText>

      <View style={styles.field}>
        <ThemedText style={styles.label}>Prénom</ThemedText>
        <TextInput
          value={typed}
          onChangeText={setTyped}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={MAX_LENGTH}
          autoFocus
          autoCorrect={false}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="done"
          accessibilityLabel="Prénom"
          placeholder="Ton prénom"
          placeholderTextColor={Colors.placeholder}
          style={[styles.input, focused && styles.inputFocused]}
        />
      </View>

      <View style={styles.spacer} />

      <PrimaryButton
        label="Continuer"
        onPress={confirmFirstName}
        disabled={firstName.length === 0}
      />
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
    marginTop: 10,
  },
  field: {
    gap: 8,
    marginTop: 32,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: Colors.text,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  spacer: {
    flex: 1,
  },
});
