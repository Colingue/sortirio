import { parseBirthdate, toBirthdateFields } from './birthdate';

describe('parseBirthdate', () => {
  it('reads a complete date', () => {
    expect(parseBirthdate({ day: '04', month: '05', year: '1990' })).toEqual(new Date(1990, 4, 4));
  });

  it('accepts a single-digit day and month', () => {
    expect(parseBirthdate({ day: '4', month: '5', year: '1990' })).toEqual(new Date(1990, 4, 4));
  });

  it('refuses an unfinished year', () => {
    expect(parseBirthdate({ day: '04', month: '05', year: '199' })).toBeUndefined();
  });

  it('refuses a day that does not exist', () => {
    expect(parseBirthdate({ day: '31', month: '02', year: '1990' })).toBeUndefined();
    expect(parseBirthdate({ day: '29', month: '02', year: '2001' })).toBeUndefined();
  });

  it('accepts 29 February in a leap year', () => {
    expect(parseBirthdate({ day: '29', month: '02', year: '2000' })).toEqual(new Date(2000, 1, 29));
  });

  it('refuses a month out of range', () => {
    expect(parseBirthdate({ day: '01', month: '13', year: '1990' })).toBeUndefined();
    expect(parseBirthdate({ day: '00', month: '05', year: '1990' })).toBeUndefined();
  });

  it('refuses anything but digits', () => {
    expect(parseBirthdate({ day: '1a', month: '05', year: '1990' })).toBeUndefined();
  });
});

describe('toBirthdateFields', () => {
  it('pads day and month', () => {
    expect(toBirthdateFields(new Date(1990, 4, 4))).toEqual({
      day: '04',
      month: '05',
      year: '1990',
    });
  });

  it('leaves the fields empty without a date', () => {
    expect(toBirthdateFields(undefined)).toEqual({ day: '', month: '', year: '' });
  });
});
