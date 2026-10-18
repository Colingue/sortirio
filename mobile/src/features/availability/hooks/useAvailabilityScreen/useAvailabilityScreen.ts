import { useEffect, useState } from 'react';

import {
  cancelAvailability,
  declareAvailability,
  fetchFridayState,
  type FridayState,
} from '@/features/availability/helpers/availability/availability';
import { getFridayStateAfterPosting } from '@/features/availability/helpers/fridays/fridays';
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

function getCountWithoutMe(count: number | null): number | null {
  return count === null ? null : Math.max(0, count - 1);
}

type SetScreen = (screen: ScreenState) => void;

async function runDeclareAvailability(
  userId: string | undefined,
  screen: ScreenState,
  setScreen: SetScreen,
): Promise<boolean> {
  if (!userId || screen.status !== 'ready') return false;

  setScreen({ ...screen, saving: true, saveFailed: false });
  try {
    await declareAvailability(userId);
    await askNotificationPermission();

    const fridayState = await fetchFridayState().catch(() =>
      getFridayStateAfterPosting(screen.fridayState),
    );
    setScreen({ ...screen, saving: false, fridayState });
    return true;
  } catch {
    setScreen({ ...screen, saving: false, saveFailed: true });
    return false;
  }
}

async function runCancelAvailability(screen: ScreenState, setScreen: SetScreen) {
  if (screen.status !== 'ready' || screen.fridayState.postedFriday === null) return;

  const postedFriday = screen.fridayState.postedFriday;
  setScreen({ ...screen, canceling: true, cancelFailed: false });
  try {
    await cancelAvailability(postedFriday);
    setScreen({
      ...screen,
      canceling: false,
      fridayState: {
        ...screen.fridayState,
        postedFriday: null,
        citySignupCount: getCountWithoutMe(screen.fridayState.citySignupCount),
      },
    });
  } catch {
    setScreen({ ...screen, canceling: false, cancelFailed: true });
  }
}

export function useAvailabilityScreen(userId: string | undefined) {
  const [screen, setScreen] = useState<ScreenState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const ready = (fridayState: FridayState) =>
      !cancelled &&
      setScreen({
        status: 'ready',
        fridayState,
        saving: false,
        saveFailed: false,
        canceling: false,
        cancelFailed: false,
      });

    fetchFridayState()
      .then(ready)
      .catch(() => !cancelled && setScreen({ status: 'failed' }));

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    state: screen,
    handleDeclareAvailability: () => runDeclareAvailability(userId, screen, setScreen),
    handleCancelAvailability: () => runCancelAvailability(screen, setScreen),
  };
}
