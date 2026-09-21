import { useEffect, useState } from 'react';

import {
  cancelAvailability,
  declareAvailability,
  fetchFridayState,
  type FridayState,
} from '@/features/availability/helpers/availability/availability';
import { askNotificationPermission } from '@/features/notifications/helpers/askNotificationPermission/askNotificationPermission';

export type ScreenState =
  | { status: 'loading' }
  | { status: 'failed' }
  | {
      status: 'ready';
      fridayState: FridayState;
      saving: boolean;
      saveFailed: boolean;
      canceling: boolean;
      cancelFailed: boolean;
    };

export function useAvailabilityScreen(userId: string | undefined) {
  const [state, setState] = useState<ScreenState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const ready = (fridayState: FridayState) =>
      !cancelled &&
      setState({
        status: 'ready',
        fridayState,
        saving: false,
        saveFailed: false,
        canceling: false,
        cancelFailed: false,
      });

    fetchFridayState()
      .then(ready)
      .catch(() => !cancelled && setState({ status: 'failed' }));

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDeclareAvailability() {
    if (!userId || state.status !== 'ready') return;

    setState({ ...state, saving: true, saveFailed: false });
    try {
      const postedFriday = state.fridayState.nextOpenFriday;
      await declareAvailability(userId);
      void askNotificationPermission();
      setState({ ...state, saving: false, fridayState: { ...state.fridayState, postedFriday } });
    } catch {
      setState({ ...state, saving: false, saveFailed: true });
    }
  }

  async function handleCancelAvailability() {
    if (state.status !== 'ready' || state.fridayState.postedFriday === null) return;

    const postedFriday = state.fridayState.postedFriday;
    setState({ ...state, canceling: true, cancelFailed: false });
    try {
      await cancelAvailability(postedFriday);
      setState({
        ...state,
        canceling: false,
        fridayState: { ...state.fridayState, postedFriday: null },
      });
    } catch {
      setState({ ...state, canceling: false, cancelFailed: true });
    }
  }

  return { state, handleDeclareAvailability, handleCancelAvailability };
}
