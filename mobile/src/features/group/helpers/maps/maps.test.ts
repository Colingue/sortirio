import { buildMapsSearchUrl } from './maps';

describe('buildMapsSearchUrl', () => {
  it('searches in Plans on iOS', () => {
    expect(buildMapsSearchUrl('1 Rue de la Paix, 69001 Lyon', 'ios')).toBe(
      'maps://?q=1%20Rue%20de%20la%20Paix%2C%2069001%20Lyon',
    );
  });

  it('lets Android pick its own maps app', () => {
    expect(buildMapsSearchUrl('1 Rue de la Paix, 69001 Lyon', 'android')).toBe(
      'geo:0,0?q=1%20Rue%20de%20la%20Paix%2C%2069001%20Lyon',
    );
  });

  it('encodes the accents of a Lyon address', () => {
    expect(buildMapsSearchUrl('14 Rue René Leynaud, 69001 Lyon', 'ios')).toBe(
      'maps://?q=14%20Rue%20Ren%C3%A9%20Leynaud%2C%2069001%20Lyon',
    );
  });

  it('searches, never routes: no origin and no coordinates', () => {
    const url = buildMapsSearchUrl('Place Bellecour, Lyon', 'ios');

    expect(url).not.toContain('saddr');
    expect(url).not.toContain('daddr');
    expect(url).not.toContain('dirflg');
  });
});
