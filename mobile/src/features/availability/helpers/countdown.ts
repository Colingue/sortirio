export type TimeRemaining = { days: number; hours: number; minutes: number };

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function getTimeUntilDeadline(deadlineIso: string, now: Date): TimeRemaining | null {
  const diffMs = new Date(deadlineIso).getTime() - now.getTime();
  if (diffMs <= 0) return null;

  return {
    days: Math.floor(diffMs / DAY_MS),
    hours: Math.floor((diffMs % DAY_MS) / HOUR_MS),
    minutes: Math.floor((diffMs % HOUR_MS) / MINUTE_MS),
  };
}

export function formatTimeRemaining(remaining: TimeRemaining): string {
  const parts: string[] = [];
  if (remaining.days > 0) parts.push(`${remaining.days} j`);
  if (remaining.days > 0 || remaining.hours > 0) parts.push(`${remaining.hours} h`);
  parts.push(`${remaining.minutes} min`);

  return parts.join(' ');
}
