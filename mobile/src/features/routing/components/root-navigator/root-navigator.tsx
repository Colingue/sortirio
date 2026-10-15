import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { NavigationTheme } from '@/constants/theme';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { GroupAnnouncement } from '@/features/group/components/group-announcement/group-announcement';
import { resolveDestination } from '@/features/routing/helpers/destination/destination';

SplashScreen.preventAutoHideAsync();

export function RootNavigator() {
  const state = useSessionState();
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
    <ThemeProvider value={NavigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={destination === 'login'}>
          <Stack.Screen name="(auth)/login" />
        </Stack.Protected>

        <Stack.Protected guard={destination === 'onboarding'}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        <Stack.Protected guard={destination === 'home'}>
          <Stack.Screen name="(app)/(tabs)" />
          <Stack.Screen name="(app)/availability-confirmed" />
          <Stack.Screen name="(app)/group" />
          <Stack.Screen name="(app)/past-group/[groupId]" />
          <Stack.Screen name="(app)/chat/[groupId]" />
        </Stack.Protected>
      </Stack>
      {destination === 'home' && <GroupAnnouncement myUserId={state.session?.user.id} />}
    </ThemeProvider>
  );
}
