import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  useProfileCreated,
  useSessionState,
} from '@/features/auth/providers/session-provider/session-provider';
import { type PickedPhoto } from '@/features/profile/helpers/photo/photo';
import { PhotoPreview } from '@/features/signup/components/photo-preview/photo-preview';
import { PhotoSourceButtons } from '@/features/signup/components/photo-source-buttons/photo-source-buttons';
import { createProfile } from '@/features/signup/helpers/create-profile/create-profile';
import {
  completeDraft,
  useSignupDraft,
} from '@/features/signup/providers/signup-draft/signup-draft';

export default function PhotoScreen() {
  const { draft, update } = useSignupDraft();
  const state = useSessionState();
  const profileCreated = useProfileCreated();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const complete = completeDraft(draft);
  const userId = state.status === 'ready' ? state.session?.user.id : undefined;

  async function choosePhoto(pick: () => Promise<PickedPhoto>) {
    const photo = await pick();
    if (photo.type === 'picked') update({ photoUri: photo.uri });
  }

  async function saveProfile() {
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

        <PhotoPreview uri={draft.photoUri} />
        <PhotoSourceButtons busy={saving} onPick={choosePhoto} />

        {failed ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.centered}>
            L&apos;inscription n&apos;a pas abouti. Réessayer.
          </ThemedText>
        ) : null}
      </ThemedView>

      <PrimaryButton
        label={saving ? 'Un instant…' : 'Terminer'}
        onPress={() => void saveProfile()}
        disabled={!complete || !userId || saving}
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
    gap: Spacing.three,
  },
  centered: {
    textAlign: 'center',
  },
});
