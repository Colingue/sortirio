import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ageOn, isAdult } from '@/features/signup/age';
import { useSignupDraft } from '@/features/signup/signup-draft';

const DEFAULT_AGE = 25;

function defaultBirthdate(today: Date): Date {
  return new Date(today.getFullYear() - DEFAULT_AGE, today.getMonth(), today.getDate());
}

export default function BirthdateScreen() {
  const { draft, update } = useSignupDraft();
  const today = new Date();
  const [birthdate, setBirthdate] = useState(draft.birthdate ?? defaultBirthdate(today));
  const adult = isAdult(birthdate, today);

  function next() {
    update({ birthdate });
    router.push('/photo');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">Quand es-tu né ?</ThemedText>

        <DateTimePicker
          value={birthdate}
          onValueChange={(_event, date) => setBirthdate(date)}
          mode="date"
          display="spinner"
          locale="fr_FR"
          maximumDate={today}
        />

        <ThemedText themeColor="textSecondary" style={styles.age}>
          {ageOn(birthdate, today)} ans
        </ThemedText>

        {adult ? null : (
          <ThemedText themeColor="textSecondary" style={styles.age}>
            Sortirio est réservé aux plus de 18 ans.
          </ThemedText>
        )}
      </ThemedView>

      <PrimaryButton label="Continuer" onPress={next} disabled={!adult} />
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
  age: {
    textAlign: 'center',
  },
});
