import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  useProfileCreated,
  useSessionState,
} from '@/features/auth/providers/session-provider/session-provider';
import { pickFromLibrary } from '@/features/profile/helpers/photo/photo';
import { PhotoPicker } from '@/features/signup/components/photo-picker/photo-picker';
import { SignupStepHeader } from '@/features/signup/components/signup-step-header/signup-step-header';
import { createProfile } from '@/features/signup/helpers/createProfile/createProfile';
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

  async function choosePhoto() {
    const photo = await pickFromLibrary();
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
    <SafeAreaView style={styles.screen}>
      <SignupStepHeader step={4} />

      <ThemedText type="title" style={styles.title}>
        Ajoute ta photo principale
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.lead}>
        Choisis une photo où l&apos;on voit bien ton visage, sans lunettes de soleil.
      </ThemedText>

      <PhotoPicker uri={draft.photoUri} busy={saving} onPress={() => void choosePhoto()} />

      <View style={styles.spacer} />

      {failed ? (
        <ThemedText type="small" themeColor="danger" style={styles.error}>
          L&apos;inscription n&apos;a pas abouti. Réessaie.
        </ThemedText>
      ) : null}

      <PrimaryButton
        label={saving ? 'Un instant…' : 'Terminer'}
        onPress={() => void saveProfile()}
        disabled={!complete || !userId || saving}
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
  spacer: {
    flex: 1,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
