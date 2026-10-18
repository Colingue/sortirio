import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { BirthdateInputs } from '@/features/signup/components/birthdate-inputs/birthdate-inputs';
import { SignupStepHeader } from '@/features/signup/components/signup-step-header/signup-step-header';
import { getAgeOn, isAdult } from '@/features/signup/helpers/age/age';
import { parseBirthdate, toBirthdateFields } from '@/features/signup/helpers/birthdate/birthdate';
import { useSignupDraft } from '@/features/signup/providers/signup-draft/signup-draft';

export default function BirthdateScreen() {
  const { draft, update } = useSignupDraft();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [fields, setFields] = useState(() => toBirthdateFields(draft.birthdate));

  const birthdate = parseBirthdate(fields);
  const adult = birthdate !== undefined && isAdult(birthdate, today);
  const impossible = birthdate === undefined && fields.year.length === 4;

  function confirmBirthdate() {
    if (!birthdate) return;

    update({ birthdate });
    router.push('/photo');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={styles.content} onPress={Keyboard.dismiss} accessible={false}>
        <SignupStepHeader step={3} />

        <ThemedText type="title" style={styles.title}>
          Ta date de naissance ?
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.lead}>
          Elle sert à former des groupes d&apos;âges proches. Seul ton âge est affiché, jamais ta
          date.
        </ThemedText>

        <BirthdateInputs fields={fields} onChange={setFields} />

        {birthdate ? (
          <ThemedText themeColor={adult ? 'textSecondary' : 'danger'} style={styles.message}>
            {adult ? `${getAgeOn(birthdate, today)} ans` : 'Dispo est réservé aux plus de 18 ans.'}
          </ThemedText>
        ) : null}
        {impossible ? (
          <ThemedText themeColor="danger" style={styles.message}>
            Cette date n&apos;existe pas.
          </ThemedText>
        ) : null}

        <View style={styles.spacer} />

        <KeyboardStickyView offset={{ opened: insets.bottom + 16 }}>
          <PrimaryButton label="Continuer" onPress={confirmBirthdate} disabled={!adult} />
        </KeyboardStickyView>
      </Pressable>
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
  content: {
    flex: 1,
  },
  title: {
    marginTop: 40,
  },
  lead: {
    marginTop: 10,
  },
  message: {
    marginTop: 12,
  },
  spacer: {
    flex: 1,
  },
});
