import { useEffect, useState } from 'react';

import {
  getTimeUntilDeadline,
  type TimeRemaining,
} from '@/features/availability/helpers/countdown';

const TICK_MS = 60_000;

export function useCountdown(deadlineIso: string | null): TimeRemaining | null {
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (deadlineIso === null) return;

    const interval = setInterval(() => forceTick((tick) => tick + 1), TICK_MS);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  if (deadlineIso === null) return null;
  return getTimeUntilDeadline(deadlineIso, new Date());
}
