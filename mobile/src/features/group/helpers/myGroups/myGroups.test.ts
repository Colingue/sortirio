import { buildMyGroupsItem, formatLastMessageTime, type MyGroupsRow } from './myGroups';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

const NOW = new Date('2026-10-16T21:00:00');

function buildRow(overrides: Partial<MyGroupsRow> = {}): MyGroupsRow {
  return {
    group_id: 'group-1',
    friday: '2026-10-02',
    venue_name: 'Odessa',
    member_first_names: ['Alix', 'Bo', 'Chloé'],
    last_message_body: null,
    last_message_at: null,
    last_message_author_id: null,
    last_message_author_first_name: null,
    ...overrides,
  };
}

describe('buildMyGroupsItem', () => {
  it('labels the friday and keeps the first names', () => {
    expect(buildMyGroupsItem(buildRow(), 'user-1', NOW)).toEqual({
      groupId: 'group-1',
      fridayLabel: 'Vendredi 2 octobre',
      venueName: 'Odessa',
      memberFirstNames: ['Alix', 'Bo', 'Chloé'],
      lastMessage: null,
    });
  });

  it('names the author of the last message', () => {
    const row = buildRow({
      last_message_body: 'Je suis au fond',
      last_message_at: '2026-10-16T20:04:00',
      last_message_author_id: 'user-2',
      last_message_author_first_name: 'Inès',
    });

    expect(buildMyGroupsItem(row, 'user-1', NOW).lastMessage).toEqual({
      preview: 'Inès : Je suis au fond',
      timeLabel: '20:04',
    });
  });

  it('says Toi when I wrote the last message', () => {
    const row = buildRow({
      last_message_body: 'On remet ça ?',
      last_message_at: '2026-10-16T20:04:00',
      last_message_author_id: 'user-1',
      last_message_author_first_name: 'Alix',
    });

    expect(buildMyGroupsItem(row, 'user-1', NOW).lastMessage?.preview).toBe('Toi : On remet ça ?');
  });
});

describe('formatLastMessageTime', () => {
  it('gives the hour today, the weekday this week, the date before', () => {
    expect(formatLastMessageTime('2026-10-16T08:30:00', NOW)).toBe('08:30');
    expect(formatLastMessageTime('2026-10-13T12:00:00', NOW)).toBe('mar.');
    expect(formatLastMessageTime('2026-09-27T12:00:00', NOW)).toBe('27 sept.');
  });
});
