import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  useMarkOnboardingIntroSeen,
  useSessionState,
} from '@/features/auth/providers/session-provider/session-provider';
import { OnboardingSlide } from '@/features/onboarding/components/onboarding-slide/onboarding-slide';
import { PlacePill } from '@/features/onboarding/components/place-pill/place-pill';
import { saveOnboardingIntroSeen } from '@/features/onboarding/helpers/saveOnboardingIntroSeen/saveOnboardingIntroSeen';

export default function DrinkScreen() {
  const state = useSessionState();
  const markOnboardingIntroSeen = useMarkOnboardingIntroSeen();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const userId = state.status === 'ready' ? state.session?.user.id : undefined;

  async function completeOnboarding() {
    if (!userId) return;

    setSaving(true);
    setFailed(false);
    try {
      await saveOnboardingIntroSeen(userId);
      markOnboardingIntroSeen();
    } catch {
      setFailed(true);
      setSaving(false);
    }
  }

  return (
    <OnboardingSlide
      step={3}
      visual={
        <>
          <Image
            source={require('@/assets/images/onboarding/drink.jpg')}
            accessibilityLabel="Un groupe trinque en terrasse"
            style={styles.photo}
            contentFit="cover"
            contentPosition={{ left: '45%', top: '50%' }}
          />
          <View style={styles.pill}>
            <PlacePill label="Vendredi · 20 h · au bar" />
          </View>
        </>
      }
      title="Vendredi, tu rejoins ton groupe !"
      body="Rendez-vous au bar à 20 h avec ton groupe."
      buttonLabel={saving ? 'Un instant…' : "C'est parti"}
      onPress={() => void completeOnboarding()}
      busy={saving}
      error={failed ? "Ça n'a pas abouti. Réessaie." : undefined}
    />
  );
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
  },
  pill: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
});
