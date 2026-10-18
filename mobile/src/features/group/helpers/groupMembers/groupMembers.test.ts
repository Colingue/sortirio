import { buildMessageAuthors, type GroupMemberRow } from './groupMembers';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

function buildRow(overrides: Partial<GroupMemberRow> = {}): GroupMemberRow {
  return {
    user_id: 'user-1',
    first_name: 'Alix',
    photo_path: 'user-1/photo.jpg',
    late_joined_at: null,
    ...overrides,
  };
}

describe('buildMessageAuthors', () => {
  it('maps each member to their first name and signed photo', () => {
    const authors = buildMessageAuthors(
      [
        buildRow(),
        buildRow({ user_id: 'user-2', first_name: 'Bo', photo_path: 'user-2/photo.jpg' }),
      ],
      new Map([
        ['user-1/photo.jpg', 'https://signed/1'],
        ['user-2/photo.jpg', 'https://signed/2'],
      ]),
    );

    expect(authors.get('user-1')).toEqual({
      firstName: 'Alix',
      photoUrl: 'https://signed/1',
      lateJoinedAt: null,
    });
    expect(authors.get('user-2')).toEqual({
      firstName: 'Bo',
      photoUrl: 'https://signed/2',
      lateJoinedAt: null,
    });
  });

  it('keeps the arrival time of a member who joined late', () => {
    const authors = buildMessageAuthors(
      [buildRow({ late_joined_at: '2026-10-16T13:13:00+00:00' })],
      new Map(),
    );

    expect(authors.get('user-1')?.lateJoinedAt).toBe('2026-10-16T13:13:00+00:00');
  });

  it('has no photo when the path could not be signed', () => {
    expect(buildMessageAuthors([buildRow()], new Map()).get('user-1')?.photoUrl).toBeNull();
  });
});
