import { deleteMyAccount } from './deleteMyAccount';

const calls: string[] = [];
const mockRemove = jest.fn();
const mockRpc = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: { from: () => ({ remove: (paths: string[]) => mockRemove(paths) }) },
    rpc: (name: string) => mockRpc(name),
  },
}));
jest.mock('@/features/auth/helpers/signOut/signOut', () => ({
  signOut: () => mockSignOut(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  calls.length = 0;
  mockRemove.mockImplementation(async () => (calls.push('photo'), { error: null }));
  mockRpc.mockImplementation(async () => (calls.push('rpc'), { error: null }));
  mockSignOut.mockImplementation(async () => void calls.push('signOut'));
});

describe('deleteMyAccount', () => {
  it('removes the photo, deletes the account, then signs out', async () => {
    await deleteMyAccount('u1');

    expect(mockRemove).toHaveBeenCalledWith(['u1/photo.jpg']);
    expect(mockRpc).toHaveBeenCalledWith('delete_my_account');
    expect(calls).toEqual(['photo', 'rpc', 'signOut']);
  });

  it('stops before the account when the photo removal fails', async () => {
    mockRemove.mockResolvedValue({ error: new Error('photo') });

    await expect(deleteMyAccount('u1')).rejects.toThrow('photo');
    expect(mockRpc).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('does not sign out when the account deletion fails', async () => {
    mockRpc.mockResolvedValue({ error: new Error('rpc') });

    await expect(deleteMyAccount('u1')).rejects.toThrow('rpc');
    expect(mockSignOut).not.toHaveBeenCalled();
  });
});
