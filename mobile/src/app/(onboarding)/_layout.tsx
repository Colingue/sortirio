import { Stack } from 'expo-router';

import { SignupDraftProvider } from '@/features/signup/providers/signup-draft/signup-draft';

export default function OnboardingLayout() {
  return (
    <SignupDraftProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="city" />
        <Stack.Screen name="first-name" />
        <Stack.Screen name="birthdate" />
        <Stack.Screen name="photo" />
      </Stack>
    </SignupDraftProvider>
  );
}
