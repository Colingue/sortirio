import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="fridays" />
      <Stack.Screen name="meet-group" />
      <Stack.Screen name="drink" />
    </Stack>
  );
}
