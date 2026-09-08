import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { pickFromLibrary, takePhoto, type PickedPhoto } from '@/features/profile/photo';
import { useSignupDraft } from '@/features/signup/signup-draft';
import { useTheme } from '@/hooks/use-theme';

export default function PhotoScreen() {
  const theme = useTheme();
  const { draft, update } = useSignupDraft();
  const [busy, setBusy] = useState(false);

  async function choose(pick: () => Promise<PickedPhoto>) {
    setBusy(true);
    try {
      const photo = await pick();
      if (photo.type === 'picked') update({ photoUri: photo.uri });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.words}>
        <ThemedText type="title">Une photo de toi.</ThemedText>
        <ThemedText themeColor="textSecondary">
          C&apos;est elle qui te rend reconnaissable au bar. Une seule suffit.
        </ThemedText>

        <Preview uri={draft.photoUri} />

        <ThemedView style={styles.choices}>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => void choose(pickFromLibrary)}
            style={[styles.choice, { backgroundColor: theme.backgroundElement }]}
          >
            <ThemedText>Choisir une photo</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => void choose(takePhoto)}
            style={[styles.choice, { backgroundColor: theme.backgroundElement }]}
          >
            <ThemedText>Prendre une photo</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <PrimaryButton label="Terminer" onPress={() => {}} disabled={!draft.photoUri} />
    </ThemedView>
  );
}

function Preview({ uri }: { uri?: string }) {
  const theme = useTheme();

  if (!uri) {
    return <ThemedView style={[styles.preview, { backgroundColor: theme.backgroundElement }]} />;
  }

  return <Image source={{ uri }} style={styles.preview} contentFit="cover" />;
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
  preview: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: Spacing.three,
  },
  choices: {
    gap: Spacing.two,
  },
  choice: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
});
