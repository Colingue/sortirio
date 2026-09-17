import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityNoted } from '@/features/availability/components/availability-noted/availability-noted';
import {
  fetchFridayState,
  type FridayState,
} from '@/features/availability/helpers/friday-state/friday-state';

type ScreenState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; fridayState: FridayState };

export default function HomeScreen() {
  const [state, setState] = useState<ScreenState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchFridayState()
      .then((fridayState) => {
        if (!cancelled) setState({ status: 'ready', fridayState });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'failed' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === 'loading') {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (state.status === 'failed') {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">
          Une erreur est survenue. Réessaie plus tard.
        </ThemedText>
      </ThemedView>
    );
  }

  if (state.fridayState.postedFriday === null) {
    return <AvailabilityInvitation openFriday={state.fridayState.openFriday} />;
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
