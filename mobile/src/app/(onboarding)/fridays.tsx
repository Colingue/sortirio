import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { OnboardingSlide } from '@/features/onboarding/components/onboarding-slide/onboarding-slide';

export default function FridaysScreen() {
  return (
    <OnboardingSlide
      step={1}
      visual={
        <Image
          source={require('@/assets/images/onboarding/fridays.jpg')}
          accessibilityLabel="Quatre personnes, chacune de leur côté, s'inscrivent sur leur téléphone"
          style={styles.photo}
          contentFit="cover"
          contentPosition={{ left: '65%', top: '52%' }}
        />
      }
      title="Chaque vendredi, un verre Dispo."
      body="Inscris-toi pour le prochain !"
      buttonLabel="Suivant"
      onPress={() => router.push('/meet-group')}
    />
  );
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
  },
});
