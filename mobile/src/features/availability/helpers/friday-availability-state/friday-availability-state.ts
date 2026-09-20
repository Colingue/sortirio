import { useEffect, useState } from 'react';

import {
  applyCancelAvailability,
  applyDeclareAvailability,
} from '@/features/availability/helpers/apply-availability-action/apply-availability-action';
import {
  fetchFridayState,
  type FridayState,
} from '@/features/availability/helpers/friday-state/friday-state';

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

export function useFridayAvailabilityState(userId: string | undefined) {
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
    const fridayState = await applyDeclareAvailability(userId, state.fridayState);
    setState(
      fridayState
        ? { ...state, saving: false, fridayState }
        : { ...state, saving: false, saveFailed: true },
    );
  }

  async function handleCancelAvailability() {
    if (state.status !== 'ready') return;

    setState({ ...state, canceling: true, cancelFailed: false });
    const fridayState = await applyCancelAvailability(state.fridayState);
    setState(
      fridayState
        ? { ...state, canceling: false, fridayState }
        : { ...state, canceling: false, cancelFailed: true },
    );
  }

  return { state, handleDeclareAvailability, handleCancelAvailability };
}
