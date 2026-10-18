import { supabase } from '@/lib/supabase';

import {
  buildMyGroup,
  fetchGroupDetails,
  fetchMyGroup,
  findGroupMemberProfile,
  formatJoinedSentence,
  formatMeetingLabel,
  formatMembersSentence,
  formatShortFridayLabel,
  getOtherMembers,
  type GroupRow,
} from './myGroup';

jest.mock('@/lib/supabase', () => ({
  supabase: { rpc: jest.fn(), storage: { from: jest.fn() } },
}));

const mockRpc = supabase.rpc as jest.Mock;
const mockStorageFrom = supabase.storage.from as jest.Mock;
const mockCreateSignedUrls = jest.fn();

function buildRow(overrides: Partial<GroupRow> = {}): GroupRow {
  return {
    group_id: 'group-1',
    friday: '2026-10-16',
    venue_name: 'Odessa',
    venue_address: '14 Rue René Leynaud, 69001 Lyon',
    member_user_id: 'user-1',
    member_first_name: 'Alix',
    member_age: 31,
    member_photo_path: 'user-1/photo.jpg',
    member_joined_late: false,
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockStorageFrom.mockReturnValue({ createSignedUrls: mockCreateSignedUrls });
  mockCreateSignedUrls.mockResolvedValue({ data: [], error: null });
});

describe('buildMyGroup', () => {
  it('has no group when the function returned no row', () => {
    expect(buildMyGroup([], new Map())).toBeNull();
  });

  it('reads the venue from the first row and keeps every member', () => {
    const rows = [
      buildRow(),
      buildRow({ member_user_id: 'user-2', member_first_name: 'Bo', member_age: 24 }),
    ];

    expect(buildMyGroup(rows, new Map())).toEqual({
      groupId: 'group-1',
      friday: '2026-10-16',
      venueName: 'Odessa',
      venueAddress: '14 Rue René Leynaud, 69001 Lyon',
      members: [
        { userId: 'user-1', firstName: 'Alix', age: 31, photoUrl: null, joinedLate: false },
        { userId: 'user-2', firstName: 'Bo', age: 24, photoUrl: null, joinedLate: false },
      ],
    });
  });

  it('tells which members joined after the formation', () => {
    const rows = [buildRow(), buildRow({ member_user_id: 'user-2', member_joined_late: true })];

    expect(buildMyGroup(rows, new Map())?.members.map((member) => member.joinedLate)).toEqual([
      false,
      true,
    ]);
  });

  it('attaches the signed url matching each photo path', () => {
    const rows = [
      buildRow(),
      buildRow({ member_user_id: 'user-2', member_photo_path: 'user-2/p.jpg' }),
    ];
    const urls = new Map([['user-1/photo.jpg', 'https://signed/one']]);

    expect(buildMyGroup(rows, urls)?.members.map((member) => member.photoUrl)).toEqual([
      'https://signed/one',
      null,
    ]);
  });
});

describe('formatJoinedSentence', () => {
  const member = buildMyGroup([buildRow()], new Map())!.members[0];

  it('names the members waiting for the newcomer', () => {
    const others = ['Léa', 'Inès', 'Thomas'].map((firstName) => ({ ...member, firstName }));

    expect(formatJoinedSentence(others)).toBe("Léa, Inès et Thomas t'attendent ce soir.");
  });

  it('agrees with a single member', () => {
    expect(formatJoinedSentence([{ ...member, firstName: 'Léa' }])).toBe("Léa t'attend ce soir.");
  });
});

describe('getOtherMembers', () => {
  it('leaves me out', () => {
    const group = buildMyGroup(
      [buildRow(), buildRow({ member_user_id: 'user-2', member_first_name: 'Bo' })],
      new Map(),
    );

    expect(getOtherMembers(group!, 'user-1').map((member) => member.firstName)).toEqual(['Bo']);
  });

  it('keeps everyone when the user id is unknown', () => {
    const group = buildMyGroup([buildRow()], new Map());

    expect(getOtherMembers(group!, undefined)).toHaveLength(1);
  });
});

describe('findGroupMemberProfile', () => {
  it('gives the member with its place in the group and the friday', () => {
    const group = buildMyGroup(
      [buildRow(), buildRow({ member_user_id: 'user-2', member_first_name: 'Bo' })],
      new Map(),
    );

    expect(findGroupMemberProfile(group, 'user-2')).toEqual({
      member: { userId: 'user-2', firstName: 'Bo', age: 31, photoUrl: null, joinedLate: false },
      colorIndex: 1,
      friday: '2026-10-16',
    });
  });

  it('gives nothing when the user is not in the group', () => {
    const group = buildMyGroup([buildRow()], new Map());

    expect(findGroupMemberProfile(group, 'user-9')).toBeNull();
    expect(findGroupMemberProfile(null, 'user-1')).toBeNull();
  });
});

describe('formatMeetingLabel', () => {
  it('gives the day, the date and the hour', () => {
    expect(formatMeetingLabel('2026-10-16')).toBe('Vendredi 16 octobre · 20 h');
  });
});

describe('formatShortFridayLabel', () => {
  it('gives the day and the short month', () => {
    expect(formatShortFridayLabel('2026-10-16')).toBe('16 oct.');
  });
});

describe('formatMembersSentence', () => {
  it('lists the others, then me', () => {
    const group = buildMyGroup(
      [
        buildRow({ member_first_name: 'Léa' }),
        buildRow({ member_user_id: 'user-2', member_first_name: 'Hugo' }),
      ],
      new Map(),
    );

    expect(formatMembersSentence(group!.members)).toBe('Léa, Hugo et toi.');
  });
});

describe('fetchMyGroup', () => {
  it('has no group outside the visibility window', async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });

    await expect(fetchMyGroup()).resolves.toBeNull();
    expect(mockCreateSignedUrls).not.toHaveBeenCalled();
  });

  it('signs every photo path in one call', async () => {
    mockRpc.mockResolvedValue({
      data: [buildRow(), buildRow({ member_user_id: 'user-2', member_photo_path: 'user-2/p.jpg' })],
      error: null,
    });
    mockCreateSignedUrls.mockResolvedValue({
      data: [{ path: 'user-1/photo.jpg', signedUrl: 'https://signed/one', error: null }],
      error: null,
    });

    const group = await fetchMyGroup();

    expect(mockCreateSignedUrls).toHaveBeenCalledTimes(1);
    expect(mockCreateSignedUrls).toHaveBeenCalledWith(['user-1/photo.jpg', 'user-2/p.jpg'], 3600);
    expect(group?.members.map((member) => member.photoUrl)).toEqual(['https://signed/one', null]);
  });

  it('still gives the venue when no photo could be signed', async () => {
    mockRpc.mockResolvedValue({ data: [buildRow()], error: null });
    mockCreateSignedUrls.mockResolvedValue({ data: null, error: { message: 'nope' } });

    const group = await fetchMyGroup();

    expect(group?.venueName).toBe('Odessa');
    expect(group?.members[0].photoUrl).toBeNull();
  });

  it('throws when the group could not be read at all', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    await expect(fetchMyGroup()).rejects.toEqual({ message: 'boom' });
  });
});

describe('fetchGroupDetails', () => {
  it('asks for the group by id', async () => {
    mockRpc.mockResolvedValue({ data: [buildRow()], error: null });

    const group = await fetchGroupDetails('group-1');

    expect(mockRpc).toHaveBeenCalledWith('get_group_details', { target_group_id: 'group-1' });
    expect(group?.venueName).toBe('Odessa');
  });

  it('has no group when I am not a member', async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });

    await expect(fetchGroupDetails('group-9')).resolves.toBeNull();
  });
});
