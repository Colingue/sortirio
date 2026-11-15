import { getCountdownUnits, getTimeUntilDeadline } from './countdown';

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

describe('getCountdownUnits', () => {
  it('shows days, hours, minutes and seconds when a day or more remains', () => {
    expect(getCountdownUnits({ days: 1, hours: 0, minutes: 46, seconds: 37 })).toEqual([
      { value: '01', label: 'jour' },
      { value: '00', label: 'heure' },
      { value: '46', label: 'min' },
      { value: '37', label: 'sec' },
    ]);
  });

  it('hides the day under a day', () => {
    expect(getCountdownUnits({ days: 0, hours: 4, minutes: 12, seconds: 5 })).toEqual([
      { value: '04', label: 'heure' },
      { value: '12', label: 'min' },
      { value: '05', label: 'sec' },
    ]);
  });
});
