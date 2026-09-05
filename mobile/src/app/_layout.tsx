import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { destinationFor } from '@/lib/auth/destination';
import { SessionProvider, useSessionState } from '@/lib/auth/session-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const state = useSessionState();
  const colorScheme = useColorScheme();
  const ready = state.status === 'ready';

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (state.status !== 'ready') return null;

  const destination = destinationFor({
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
          <Stack.Screen name="(onboarding)/profile" />
          <Stack.Screen name="(onboarding)/city" />
        </Stack.Protected>

        <Stack.Protected guard={destination === 'home'}>
          <Stack.Screen name="(app)/index" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
