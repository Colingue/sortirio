import { supabase } from '@/lib/supabase';

import { fetchMyReportedUserIds, saveMemberReport } from './report';

jest.mock('@/lib/supabase', () => ({ supabase: { rpc: jest.fn() } }));

const mockRpc = supabase.rpc as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe('fetchMyReportedUserIds', () => {
  it('gives the ids I reported', async () => {
    mockRpc.mockResolvedValue({ data: ['user-2', 'user-3'], error: null });

    await expect(fetchMyReportedUserIds()).resolves.toEqual(new Set(['user-2', 'user-3']));
  });

  it('gives nothing when I reported nobody', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    await expect(fetchMyReportedUserIds()).resolves.toEqual(new Set());
  });
});

describe('saveMemberReport', () => {
  it('reports the member by id', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    await saveMemberReport('user-2');

    expect(mockRpc).toHaveBeenCalledWith('report_member', { target_user_id: 'user-2' });
  });

  it('throws when the server refuses', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'cannot report this user' } });

    await expect(saveMemberReport('user-9')).rejects.toEqual({
      message: 'cannot report this user',
    });
  });
});
