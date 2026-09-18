import { formatFridayLabel } from './format-friday-label';

describe('formatFridayLabel', () => {
  it('reads a plain date', () => {
    expect(formatFridayLabel('2026-09-18')).toBe('Vendredi 18 septembre');
  });

  it('covers every month', () => {
    expect(formatFridayLabel('2026-01-02')).toBe('Vendredi 2 janvier');
    expect(formatFridayLabel('2026-02-06')).toBe('Vendredi 6 février');
    expect(formatFridayLabel('2026-03-06')).toBe('Vendredi 6 mars');
    expect(formatFridayLabel('2026-04-03')).toBe('Vendredi 3 avril');
    expect(formatFridayLabel('2026-05-01')).toBe('Vendredi 1 mai');
    expect(formatFridayLabel('2026-06-05')).toBe('Vendredi 5 juin');
    expect(formatFridayLabel('2026-07-03')).toBe('Vendredi 3 juillet');
    expect(formatFridayLabel('2026-08-07')).toBe('Vendredi 7 août');
    expect(formatFridayLabel('2026-09-04')).toBe('Vendredi 4 septembre');
    expect(formatFridayLabel('2026-10-02')).toBe('Vendredi 2 octobre');
    expect(formatFridayLabel('2026-11-06')).toBe('Vendredi 6 novembre');
    expect(formatFridayLabel('2026-12-04')).toBe('Vendredi 4 décembre');
  });

  it('reads the first of the month', () => {
    expect(formatFridayLabel('2026-05-01')).toBe('Vendredi 1 mai');
  });

  it('does not shift the day the way new Date(isoDate) would for a client west of Greenwich', () => {
    const direct = new Date('2026-09-18');
    const behindUtc = direct.getTimezoneOffset() > 0;

    expect(formatFridayLabel('2026-09-18')).toBe('Vendredi 18 septembre');
    if (behindUtc) expect(direct.getDate()).toBe(17);
  });

  it('does not change when the process timezone changes', () => {
    const original = process.env.TZ;
    process.env.TZ = 'Pacific/Honolulu';

    expect(formatFridayLabel('2026-09-18')).toBe('Vendredi 18 septembre');

    process.env.TZ = original;
  });
});
