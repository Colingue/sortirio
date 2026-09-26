import { router } from 'expo-router';

import { AvailabilityConfirmation } from '@/features/availability/components/availability-confirmation/availability-confirmation';

export default function AvailabilityConfirmedScreen() {
  return <AvailabilityConfirmation onAcknowledge={() => router.back()} />;
}
