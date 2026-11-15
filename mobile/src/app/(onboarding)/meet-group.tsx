import { router } from 'expo-router';

import { OnboardingSlide } from '@/features/onboarding/components/onboarding-slide/onboarding-slide';

export default function MeetGroupScreen() {
  return (
    <OnboardingSlide
      step={2}
      title="Jeudi 19 h, on forme les groupes"
      body="Tu découvres ton groupe et votre bar. Le chat s'ouvre aussitôt pour faire connaissance avant le verre."
      buttonLabel="Suivant"
      onPress={() => router.push('/drink')}
    />
  );
}
