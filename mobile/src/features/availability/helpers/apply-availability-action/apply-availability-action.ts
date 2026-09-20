import { cancelAvailability } from '@/features/availability/helpers/cancel-availability/cancel-availability';
import { declareAvailability } from '@/features/availability/helpers/declare-availability/declare-availability';
import type { FridayState } from '@/features/availability/helpers/friday-state/friday-state';
import { askNotificationPermission } from '@/features/notifications/helpers/ask-notification-permission/ask-notification-permission';

export async function applyDeclareAvailability(
  userId: string,
  fridayState: FridayState,
): Promise<FridayState | null> {
  try {
    await declareAvailability(userId);
    void askNotificationPermission();
    return { ...fridayState, postedFriday: fridayState.nextOpenFriday };
  } catch {
    return null;
  }
}

export async function applyCancelAvailability(
  fridayState: FridayState,
): Promise<FridayState | null> {
  if (fridayState.postedFriday === null) return null;

  try {
    await cancelAvailability(fridayState.postedFriday);
    return { ...fridayState, postedFriday: null };
  } catch {
    return null;
  }
}
