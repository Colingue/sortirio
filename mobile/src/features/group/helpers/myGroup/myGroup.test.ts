import { supabase } from '@/lib/supabase';

import { buildMyGroup, fetchMyGroup, getOtherMembers, type GroupRow } from './myGroup';

jest.mock('@/lib/supabase', () => ({
  supabase: { rpc: jest.fn(), storage: { from: jest.fn() } },
}));

const mockRpc = supabase.rpc as jest.Mock;
const mockStorageFrom = supabase.storage.from as jest.Mock;
const mockCreateSignedUrls = jest.fn();

function buildRow(overrides: Partial<GroupRow> = {}): GroupRow {
  return {
    venue_name: 'Odessa',
    venue_address: '14 Rue René Leynaud, 69001 Lyon',
    member_user_id: 'user-1',
    member_first_name: 'Alix',
    member_age: 31,
    member_photo_path: 'user-1/photo.jpg',
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
      venueName: 'Odessa',
      venueAddress: '14 Rue René Leynaud, 69001 Lyon',
      members: [
        { userId: 'user-1', firstName: 'Alix', age: 31, photoUrl: null },
        { userId: 'user-2', firstName: 'Bo', age: 24, photoUrl: null },
      ],
    });
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
