import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProfileCreated, useSessionState } from '@/features/auth/session-provider';
import { pickFromLibrary, takePhoto, type PickedPhoto } from '@/features/profile/photo';
import { createProfile } from '@/features/signup/create-profile';
import { completeDraft, useSignupDraft } from '@/features/signup/signup-draft';
import { useTheme } from '@/hooks/use-theme';

export default function PhotoScreen() {
  const { draft, update } = useSignupDraft();
  const state = useSessionState();
  const profileCreated = useProfileCreated();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const complete = completeDraft(draft);
  const userId = state.status === 'ready' ? state.session?.user.id : undefined;

  async function choose(pick: () => Promise<PickedPhoto>) {
    const photo = await pick();
    if (photo.type === 'picked') update({ photoUri: photo.uri });
  }

  async function finish() {
    if (!complete || !userId) return;

    setSaving(true);
    setFailed(false);
    try {
      await createProfile(complete, userId);
      profileCreated();
    } catch {
      setFailed(true);
      setSaving(false);
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
        <Choices busy={saving} onPick={choose} />

        {failed ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.centered}>
            L&apos;inscription n&apos;a pas abouti. Réessayer.
          </ThemedText>
        ) : null}
      </ThemedView>

      <PrimaryButton
        label={saving ? 'Un instant…' : 'Terminer'}
        onPress={() => void finish()}
        disabled={!complete || !userId || saving}
      />
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

function Choices({
  busy,
  onPick,
}: {
  busy: boolean;
  onPick: (pick: () => Promise<PickedPhoto>) => Promise<void>;
}) {
  const theme = useTheme();
  const style = [styles.choice, { backgroundColor: theme.backgroundElement }];

  return (
    <ThemedView style={styles.choices}>
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void onPick(pickFromLibrary)}
        style={style}
      >
        <ThemedText>Choisir une photo</ThemedText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void onPick(takePhoto)}
        style={style}
      >
        <ThemedText>Prendre une photo</ThemedText>
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
  centered: {
    textAlign: 'center',
  },
});
