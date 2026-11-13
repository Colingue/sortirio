import { useCallback, useEffect, useState } from 'react';

import {
  getTimeUntilDeadline,
  type TimeRemaining,
} from '@/features/availability/helpers/countdown';
import { useRunOnForeground } from '@/hooks/useRunOnForeground';

const TICK_MS = 1000;

export function useCountdown(deadlineIso: string | null): TimeRemaining | null {
  const [, forceTick] = useState(0);
  const tick = useCallback(() => forceTick((count) => count + 1), []);

  useEffect(() => {
    if (deadlineIso === null) return;

    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, [deadlineIso, tick]);

  useRunOnForeground(tick);

  if (deadlineIso === null) return null;
  return getTimeUntilDeadline(deadlineIso, new Date());
}
