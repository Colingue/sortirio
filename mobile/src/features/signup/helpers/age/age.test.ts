import { getAgeOn, isAdult } from './age';

describe('getAgeOn', () => {
  it('counts a plain age', () => {
    expect(getAgeOn(new Date(1990, 4, 4), new Date(2026, 8, 8))).toBe(36);
  });

  it('counts the birthday itself as the new age', () => {
    expect(getAgeOn(new Date(2008, 8, 8), new Date(2026, 8, 8))).toBe(18);
  });

  it('has not counted the birthday the day before', () => {
    expect(getAgeOn(new Date(2008, 8, 8), new Date(2026, 8, 7))).toBe(17);
  });

  it('has not counted a birthday later in the year', () => {
    expect(getAgeOn(new Date(2008, 11, 25), new Date(2026, 8, 8))).toBe(17);
  });

  it('makes someone born on 29 February wait for 1 March in a common year', () => {
    expect(getAgeOn(new Date(2008, 1, 29), new Date(2026, 1, 28))).toBe(17);
    expect(getAgeOn(new Date(2008, 1, 29), new Date(2026, 2, 1))).toBe(18);
  });

  it('counts the birthday of someone born on 29 February in a leap year', () => {
    expect(getAgeOn(new Date(2008, 1, 29), new Date(2028, 1, 29))).toBe(20);
  });
});

describe('isAdult', () => {
  it('accepts someone turning 18 today', () => {
    expect(isAdult(new Date(2008, 8, 8), new Date(2026, 8, 8))).toBe(true);
  });

  it('refuses someone turning 18 tomorrow', () => {
    expect(isAdult(new Date(2008, 8, 9), new Date(2026, 8, 8))).toBe(false);
  });

  it('accepts a comfortable adult', () => {
    expect(isAdult(new Date(1990, 4, 4), new Date(2026, 8, 8))).toBe(true);
  });

  it('refuses a child', () => {
    expect(isAdult(new Date(2020, 0, 1), new Date(2026, 8, 8))).toBe(false);
  });
});
