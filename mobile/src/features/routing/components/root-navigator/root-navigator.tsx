import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { resolveDestination } from '@/features/routing/helpers/destination/destination';

SplashScreen.preventAutoHideAsync();

export function RootNavigator() {
  const state = useSessionState();
  const colorScheme = useColorScheme();
  const ready = state.status === 'ready';

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (state.status !== 'ready') return null;

  const destination = resolveDestination({
    session: state.session,
    hasProfile: state.hasProfile,
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={destination === 'login'}>
          <Stack.Screen name="(auth)/login" />
        </Stack.Protected>

        <Stack.Protected guard={destination === 'onboarding'}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        <Stack.Protected guard={destination === 'home'}>
          <Stack.Screen name="(app)/index" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
