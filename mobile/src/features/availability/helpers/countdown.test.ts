import { formatTimeRemaining, getTimeUntilDeadline } from './countdown';

describe('getTimeUntilDeadline', () => {
  it('reads several days remaining', () => {
    const now = new Date('2026-09-14T10:00:00Z');
    const deadline = '2026-09-17T14:12:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({
      days: 3,
      hours: 4,
      minutes: 12,
      seconds: 0,
    });
  });

  it('reads less than a day remaining', () => {
    const now = new Date('2026-09-17T10:00:00Z');
    const deadline = '2026-09-17T14:12:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({
      days: 0,
      hours: 4,
      minutes: 12,
      seconds: 0,
    });
  });

  it('reads less than an hour remaining, with the seconds', () => {
    const now = new Date('2026-09-17T13:47:40Z');
    const deadline = '2026-09-17T14:00:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 12,
      seconds: 20,
    });
  });

  it('truncates the seconds, not rounded', () => {
    const now = new Date('2026-09-17T13:59:58.400Z');
    const deadline = '2026-09-17T14:00:00Z';

    expect(getTimeUntilDeadline(deadline, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1,
    });
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
  it('shows days, hours, minutes and seconds', () => {
    expect(formatTimeRemaining({ days: 3, hours: 4, minutes: 12, seconds: 37 })).toBe(
      '3 j 4 h 12 min 37 s',
    );
  });

  it('hides the day when it is zero', () => {
    expect(formatTimeRemaining({ days: 0, hours: 4, minutes: 12, seconds: 37 })).toBe(
      '4 h 12 min 37 s',
    );
  });

  it('hides the day and the hour when both are zero', () => {
    expect(formatTimeRemaining({ days: 0, hours: 0, minutes: 12, seconds: 37 })).toBe(
      '12 min 37 s',
    );
  });

  it('keeps the minutes when only seconds remain', () => {
    expect(formatTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 5 })).toBe('0 min 5 s');
  });
});
