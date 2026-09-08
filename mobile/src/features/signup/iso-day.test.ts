import { isoDay } from './iso-day';

describe('isoDay', () => {
  it('writes the date as YYYY-MM-DD', () => {
    expect(isoDay(new Date(1990, 4, 4))).toBe('1990-05-04');
  });

  it('pads the month and the day', () => {
    expect(isoDay(new Date(2008, 0, 1))).toBe('2008-01-01');
  });

  it('keeps the local day of a date born just after midnight', () => {
    expect(isoDay(new Date(2008, 8, 1, 0, 30))).toBe('2008-09-01');
  });

  it('keeps the local day of a date born just before midnight', () => {
    expect(isoDay(new Date(2008, 8, 1, 23, 30))).toBe('2008-09-01');
  });

  it('does not shift the day the way toISOString would in a positive offset', () => {
    const midnight = new Date(2008, 8, 1);
    const shifted = midnight.getTimezoneOffset() > 0;

    expect(isoDay(midnight)).toBe('2008-09-01');
    if (!shifted) expect(midnight.toISOString().slice(0, 10)).toBe('2008-08-31');
  });
});
