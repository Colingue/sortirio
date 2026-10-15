import { formatSignupCount, getDayOfMonth, getFollowingFridays } from './fridays';

describe('getFollowingFridays', () => {
  it('lists the next Fridays, one week apart', () => {
    expect(getFollowingFridays('2026-10-16', 3)).toEqual([
      '2026-10-23',
      '2026-10-30',
      '2026-11-06',
    ]);
  });

  it('crosses the end of the year', () => {
    expect(getFollowingFridays('2026-12-25', 2)).toEqual(['2027-01-01', '2027-01-08']);
  });
});

describe('getDayOfMonth', () => {
  it('reads the day of an ISO date', () => {
    expect(getDayOfMonth('2026-10-06')).toBe(6);
  });
});

describe('formatSignupCount', () => {
  it('writes one person in the singular', () => {
    expect(formatSignupCount(1)).toBe('1 personne inscrite');
  });

  it('writes several people in the plural', () => {
    expect(formatSignupCount(15)).toBe('15 personnes inscrites');
  });
});
