import { getDefaultBirthdate } from './get-default-birthdate';

describe('getDefaultBirthdate', () => {
  it('lands 25 years before today', () => {
    expect(getDefaultBirthdate(new Date(2026, 8, 9))).toEqual(new Date(2001, 8, 9));
  });

  it('keeps the day and the month', () => {
    const birthdate = getDefaultBirthdate(new Date(2026, 0, 31));
    expect(birthdate.getMonth()).toBe(0);
    expect(birthdate.getDate()).toBe(31);
  });

  it('rolls a 29 February over to 1 March on a common year', () => {
    expect(getDefaultBirthdate(new Date(2028, 1, 29))).toEqual(new Date(2003, 2, 1));
  });
});
