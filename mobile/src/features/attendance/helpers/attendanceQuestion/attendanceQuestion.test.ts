import { supabase } from '@/lib/supabase';

import { fetchPendingAttendanceQuestion, saveAttendanceAnswer } from './attendanceQuestion';

jest.mock('@/lib/supabase', () => ({ supabase: { rpc: jest.fn() } }));

const mockRpc = supabase.rpc as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe('fetchPendingAttendanceQuestion', () => {
  it('has no question when the server returned no row', async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });

    await expect(fetchPendingAttendanceQuestion()).resolves.toBeNull();
  });

  it('renames the row fields', async () => {
    mockRpc.mockResolvedValue({
      data: [{ group_id: 'group-1', friday: '2026-10-16', venue_name: 'Odessa' }],
      error: null,
    });

    await expect(fetchPendingAttendanceQuestion()).resolves.toEqual({
      groupId: 'group-1',
      friday: '2026-10-16',
      venueName: 'Odessa',
    });
  });

  it('throws when the question could not be read', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    await expect(fetchPendingAttendanceQuestion()).rejects.toEqual({ message: 'boom' });
  });
});

describe('saveAttendanceAnswer', () => {
  it('sends the group and the answer', async () => {
    mockRpc.mockResolvedValue({ error: null });

    await saveAttendanceAnswer('group-1', false);

    expect(mockRpc).toHaveBeenCalledWith('save_attendance_answer', {
      target_group_id: 'group-1',
      went: false,
    });
  });

  it('throws when the answer was refused', async () => {
    mockRpc.mockResolvedValue({ error: { message: 'nope' } });

    await expect(saveAttendanceAnswer('group-1', true)).rejects.toEqual({ message: 'nope' });
  });
});
