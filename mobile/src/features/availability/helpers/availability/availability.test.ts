import { supabase } from '@/lib/supabase';

import {
  cancelAvailability,
  declareAvailability,
  fetchFridayState,
  fetchHasGroupWithRoomForMe,
} from './availability';

jest.mock('@/lib/supabase', () => ({
  supabase: { rpc: jest.fn(), from: jest.fn() },
}));

const mockRpc = supabase.rpc as jest.Mock;
const mockFrom = supabase.from as jest.Mock;
const mockSingle = jest.fn();
const mockEq = jest.fn();
const mockInsert = jest.fn();
const mockDelete = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockRpc.mockReturnValue({ single: mockSingle });
  mockFrom.mockReturnValue({ insert: mockInsert, delete: mockDelete });
  mockDelete.mockReturnValue({ eq: mockEq });
});

describe('fetchFridayState', () => {
  it('reads the next open Friday and the posted one from the RPC row', async () => {
    mockSingle.mockResolvedValue({
      data: {
        next_open_friday: '2026-09-25',
        posted_friday: '2026-09-18',
        group_formation_at: '2026-09-17T17:00:00Z',
        city_signup_count: 12,
        signup_friday: '2026-09-18',
        signup_closes_at: '2026-09-18T16:00:00Z',
        posted_late: true,
      },
      error: null,
    });

    await expect(fetchFridayState()).resolves.toEqual({
      nextOpenFriday: '2026-09-25',
      postedFriday: '2026-09-18',
      groupFormationAt: '2026-09-17T17:00:00Z',
      citySignupCount: 12,
      signupFriday: '2026-09-18',
      signupClosesAt: '2026-09-18T16:00:00Z',
      postedLate: true,
    });
    expect(mockRpc).toHaveBeenCalledWith('get_friday_availability_status');
  });

  it('reads nulls for the deadline and the count when nothing is posted', async () => {
    mockSingle.mockResolvedValue({
      data: {
        next_open_friday: '2026-09-25',
        posted_friday: null,
        group_formation_at: null,
        city_signup_count: null,
        signup_friday: '2026-09-25',
        signup_closes_at: '2026-09-25T16:00:00Z',
        posted_late: false,
      },
      error: null,
    });

    await expect(fetchFridayState()).resolves.toEqual({
      nextOpenFriday: '2026-09-25',
      postedFriday: null,
      groupFormationAt: null,
      citySignupCount: null,
      signupFriday: '2026-09-25',
      signupClosesAt: '2026-09-25T16:00:00Z',
      postedLate: false,
    });
  });

  it('throws when the RPC fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('boom') });

    await expect(fetchFridayState()).rejects.toThrow('boom');
  });
});

describe('declareAvailability', () => {
  it('inserts the caller as an availability row', async () => {
    mockInsert.mockResolvedValue({ error: null });

    await declareAvailability('user-1');

    expect(mockFrom).toHaveBeenCalledWith('availabilities');
    expect(mockInsert).toHaveBeenCalledWith({ user_id: 'user-1' });
  });

  it('ignores an already-declared conflict', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505' } });

    await expect(declareAvailability('user-1')).resolves.toBeUndefined();
  });

  it('throws any other error', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23514', message: 'nope' } });

    await expect(declareAvailability('user-1')).rejects.toEqual({
      code: '23514',
      message: 'nope',
    });
  });
});

describe('cancelAvailability', () => {
  it('deletes the row for the given Friday', async () => {
    mockEq.mockResolvedValue({ error: null });

    await cancelAvailability('2026-09-25');

    expect(mockFrom).toHaveBeenCalledWith('availabilities');
    expect(mockEq).toHaveBeenCalledWith('friday', '2026-09-25');
  });

  it('throws when the delete is refused', async () => {
    mockEq.mockResolvedValue({ error: { code: '23514', message: 'too late' } });

    await expect(cancelAvailability('2026-09-25')).rejects.toEqual({
      code: '23514',
      message: 'too late',
    });
  });
});

describe('fetchHasGroupWithRoomForMe', () => {
  it('returns the boolean of the RPC', async () => {
    mockRpc.mockResolvedValue({ data: true, error: null });

    await expect(fetchHasGroupWithRoomForMe()).resolves.toBe(true);
    expect(mockRpc).toHaveBeenCalledWith('has_group_with_room_for_me');
  });

  it('returns false when no group has room for me', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });

    await expect(fetchHasGroupWithRoomForMe()).resolves.toBe(false);
  });

  it('returns false when the RPC fails', async () => {
    mockRpc.mockResolvedValue({ data: null, error: new Error('network') });

    await expect(fetchHasGroupWithRoomForMe()).resolves.toBe(false);
  });

  it('returns false when the request throws', async () => {
    mockRpc.mockRejectedValue(new Error('offline'));

    await expect(fetchHasGroupWithRoomForMe()).resolves.toBe(false);
  });
});
