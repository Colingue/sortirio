import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityWaiting } from '@/features/availability/components/availability-waiting/availability-waiting';
import { useAvailabilityScreen } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

export default function HomeScreen() {
  const session = useSessionState();
  const userId = session.status === 'ready' ? session.session?.user.id : undefined;
  const { state, handleDeclareAvailability, handleCancelAvailability } =
    useAvailabilityScreen(userId);

  async function declareAndConfirm() {
    const posted = await handleDeclareAvailability();
    if (posted) router.push('/availability-confirmed');
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
        onPress={() => void declareAndConfirm()}
        saving={state.saving}
        failed={state.saveFailed}
      />
    );
  }

  return (
    <AvailabilityWaiting
      canCancel={state.fridayState.postedFriday === state.fridayState.nextOpenFriday}
      onConfirmCancel={() => void handleCancelAvailability()}
      canceling={state.canceling}
      cancelFailed={state.cancelFailed}
      groupFormationAt={state.fridayState.groupFormationAt}
      citySignupCount={state.fridayState.citySignupCount}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
