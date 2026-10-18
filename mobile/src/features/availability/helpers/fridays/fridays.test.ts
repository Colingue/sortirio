import {
  formatSignupCount,
  getDayOfMonth,
  getFollowingFridays,
  isTonightSignupOpen,
  getFridayStateAfterPosting,
  isTonightSignupShown,
} from './fridays';

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

describe('isTonightSignupOpen', () => {
  it('is open when the signup Friday already formed its groups', () => {
    expect(isTonightSignupOpen({ signupFriday: '2026-10-23', nextOpenFriday: '2026-10-30' })).toBe(
      true,
    );
  });

  it('is closed when signup and group formation target the same Friday', () => {
    expect(isTonightSignupOpen({ signupFriday: '2026-10-23', nextOpenFriday: '2026-10-23' })).toBe(
      false,
    );
  });
});

describe('getFridayStateAfterPosting', () => {
  const fridays = {
    nextOpenFriday: '2026-10-30',
    postedFriday: null,
    groupFormationAt: null,
    citySignupCount: 4,
    signupFriday: '2026-10-23',
    signupClosesAt: '2026-10-23T16:00:00Z',
    postedLate: false,
  };

  it('posts the signup Friday, late when tonight signup is open', () => {
    expect(getFridayStateAfterPosting(fridays)).toEqual({
      ...fridays,
      postedFriday: '2026-10-23',
      postedLate: true,
    });
  });

  it('posts the signup Friday, not late before Thursday 19 h', () => {
    const beforeFormation = { ...fridays, nextOpenFriday: '2026-10-23' };

    expect(getFridayStateAfterPosting(beforeFormation)).toEqual({
      ...beforeFormation,
      postedFriday: '2026-10-23',
      postedLate: false,
    });
  });
});

describe('isTonightSignupShown', () => {
  const tonight = {
    nextOpenFriday: '2026-10-30',
    postedFriday: null,
    groupFormationAt: null,
    citySignupCount: 4,
    signupFriday: '2026-10-23',
    signupClosesAt: '2026-10-23T16:00:00Z',
    postedLate: false,
  };

  it('shows it to someone with nothing posted while tonight signup is open', () => {
    expect(isTonightSignupShown(tonight)).toBe(true);
  });

  it('shows it to a late signup', () => {
    expect(isTonightSignupShown({ ...tonight, postedFriday: '2026-10-23', postedLate: true })).toBe(
      true,
    );
  });

  it('hides it from someone who posted before Thursday 19 h', () => {
    expect(isTonightSignupShown({ ...tonight, postedFriday: '2026-10-23' })).toBe(false);
  });

  it('hides it outside the tonight window', () => {
    expect(isTonightSignupShown({ ...tonight, nextOpenFriday: '2026-10-23' })).toBe(false);
  });
});
