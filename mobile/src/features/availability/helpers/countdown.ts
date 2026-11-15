export type TimeRemaining = { days: number; hours: number; minutes: number; seconds: number };

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function getTimeUntilDeadline(deadlineIso: string, now: Date): TimeRemaining | null {
  const diffMs = new Date(deadlineIso).getTime() - now.getTime();
  if (diffMs <= 0) return null;

  return {
    days: Math.floor(diffMs / DAY_MS),
    hours: Math.floor((diffMs % DAY_MS) / HOUR_MS),
    minutes: Math.floor((diffMs % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((diffMs % MINUTE_MS) / SECOND_MS),
  };
}

export type CountdownUnit = { value: string; label: string };

export function getCountdownUnits(remaining: TimeRemaining): CountdownUnit[] {
  const pad = (value: number) => String(value).padStart(2, '0');
  const units = [
    { value: pad(remaining.hours), label: 'heure' },
    { value: pad(remaining.minutes), label: 'min' },
    { value: pad(remaining.seconds), label: 'sec' },
  ];

  return remaining.days > 0 ? [{ value: pad(remaining.days), label: 'jour' }, ...units] : units;
}
