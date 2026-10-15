import { router, useLocalSearchParams } from 'expo-router';

import { AvailabilityConfirmation } from '@/features/availability/components/availability-confirmation/availability-confirmation';
import { cities } from '@/features/city/helpers/cities/cities';

export default function AvailabilityConfirmedScreen() {
  const { friday } = useLocalSearchParams<{ friday: string }>();
  const [city] = cities;

  return (
    <AvailabilityConfirmation
      city={city.name}
      friday={friday}
      onAcknowledge={() => router.back()}
    />
  );
}
