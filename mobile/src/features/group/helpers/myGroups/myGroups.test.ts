import { buildMyGroupsItem } from './myGroups';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

describe('buildMyGroupsItem', () => {
  it('labels the friday and lists the first names', () => {
    expect(
      buildMyGroupsItem({
        group_id: 'group-1',
        friday: '2026-10-02',
        venue_name: 'Odessa',
        member_first_names: ['Alix', 'Bo', 'Chloé'],
      }),
    ).toEqual({
      groupId: 'group-1',
      fridayLabel: 'Vendredi 2 octobre',
      venueName: 'Odessa',
      memberFirstNames: 'Alix, Bo, Chloé',
    });
  });
});
