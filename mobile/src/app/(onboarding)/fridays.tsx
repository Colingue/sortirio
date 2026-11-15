import { router } from 'expo-router';

import { OnboardingSlide } from '@/features/onboarding/components/onboarding-slide/onboarding-slide';

export default function FridaysScreen() {
  return (
    <OnboardingSlide
      step={1}
      title="Chaque vendredi, un verre Dispo."
      body="Inscris-toi pour le prochain !"
      buttonLabel="Suivant"
      onPress={() => router.push('/meet-group')}
    />
  );
}
