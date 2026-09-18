import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityNoted } from '@/features/availability/components/availability-noted/availability-noted';
import { declareAvailability } from '@/features/availability/helpers/declare-availability/declare-availability';
import { askNotificationPermission } from '@/features/notifications/helpers/ask-notification-permission/ask-notification-permission';
import {
  fetchFridayState,
  type FridayState,
} from '@/features/availability/helpers/friday-state/friday-state';

type ScreenState =
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'ready'; fridayState: FridayState; saving: boolean; saveFailed: boolean };

export default function HomeScreen() {
  const session = useSessionState();
  const [state, setState] = useState<ScreenState>({ status: 'loading' });
  const userId = session.status === 'ready' ? session.session?.user.id : undefined;

  useEffect(() => {
    let cancelled = false;
    const ready = (fridayState: FridayState) =>
      !cancelled && setState({ status: 'ready', fridayState, saving: false, saveFailed: false });

    fetchFridayState()
      .then(ready)
      .catch(() => !cancelled && setState({ status: 'failed' }));

    return () => {
      cancelled = true;
    };
  }, []);

  async function declare() {
    if (!userId || state.status !== 'ready') return;

    setState({ ...state, saving: true, saveFailed: false });
    try {
      const postedFriday = state.fridayState.nextOpenFriday;
      await declareAvailability(userId);
      setState({ ...state, saving: false, fridayState: { ...state.fridayState, postedFriday } });
      void askNotificationPermission();
    } catch {
      setState({ ...state, saving: false, saveFailed: true });
    }
  }

  if (state.status !== 'ready') {
    return (
      <ThemedView style={styles.centered}>
        {state.status === 'loading' ? (
          <ActivityIndicator />
        ) : (
          <ThemedText themeColor="textSecondary">Une erreur, réessaie plus tard.</ThemedText>
        )}
      </ThemedView>
    );
  }

  if (state.fridayState.postedFriday === null) {
    return (
      <AvailabilityInvitation
        nextOpenFriday={state.fridayState.nextOpenFriday}
        onPress={() => void declare()}
        saving={state.saving}
        failed={state.saveFailed}
      />
    );
  }

  return <AvailabilityNoted />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
