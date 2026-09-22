import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityNoted } from '@/features/availability/components/availability-noted/availability-noted';
import { useAvailabilityScreen } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

export default function HomeScreen() {
  const session = useSessionState();
  const userId = session.status === 'ready' ? session.session?.user.id : undefined;
  const { state, handleDeclareAvailability, handleCancelAvailability } =
    useAvailabilityScreen(userId);

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
        onPress={() => void handleDeclareAvailability()}
        saving={state.saving}
        failed={state.saveFailed}
      />
    );
  }

  return (
    <AvailabilityNoted
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
