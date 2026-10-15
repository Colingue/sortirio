import { buildMyProfile, parseIsoDay } from './myProfile';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

describe('parseIsoDay', () => {
  it('reads the day as a local date', () => {
    expect(parseIsoDay('1999-03-07')).toEqual(new Date(1999, 2, 7));
  });
});

describe('buildMyProfile', () => {
  it('turns the birthdate into an age', () => {
    const row = {
      first_name: 'Camille',
      birthdate: '1999-03-07',
      city: 'Lyon',
      photo_path: 'id/photo.jpg',
    };

    expect(buildMyProfile(row, 'https://photo', new Date(2026, 9, 16))).toEqual({
      firstName: 'Camille',
      age: 27,
      city: 'Lyon',
      photoUrl: 'https://photo',
    });
  });
});
