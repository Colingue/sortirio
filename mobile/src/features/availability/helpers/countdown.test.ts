import { formatTimeRemaining, getTimeUntilDeadline } from './countdown';

describe('getTimeUntilDeadline', () => {
  it('reads several days remaining', () => {
    const now = new Date('2026-09-14T10:00:00Z');
    const deadline = '2026-09-17T14:12:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({ days: 3, hours: 4, minutes: 12 });
  });

  it('reads less than a day remaining', () => {
    const now = new Date('2026-09-17T10:00:00Z');
    const deadline = '2026-09-17T14:12:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({ days: 0, hours: 4, minutes: 12 });
  });

  it('reads less than an hour remaining, minutes truncated not rounded', () => {
    const now = new Date('2026-09-17T13:47:40Z');
    const deadline = '2026-09-17T14:00:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({ days: 0, hours: 0, minutes: 12 });
  });

  it('returns null once the deadline has passed', () => {
    const now = new Date('2026-09-17T14:00:01Z');
    const deadline = '2026-09-17T14:00:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toBeNull();
  });

  it('returns null exactly at the deadline', () => {
    const now = new Date('2026-09-17T14:00:00Z');
    const deadline = '2026-09-17T14:00:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toBeNull();
  });
});

describe('formatTimeRemaining', () => {
  it('shows days, hours and minutes', () => {
    expect(formatTimeRemaining({ days: 3, hours: 4, minutes: 12 })).toBe('3 j 4 h 12 min');
  });

  it('hides the day when it is zero', () => {
    expect(formatTimeRemaining({ days: 0, hours: 4, minutes: 12 })).toBe('4 h 12 min');
  });

  it('hides the day and the hour when both are zero', () => {
    expect(formatTimeRemaining({ days: 0, hours: 0, minutes: 12 })).toBe('12 min');
  });
});
