import * as Notifications from 'expo-notifications';

import { supabase } from '@/lib/supabase';

import { registerPushToken } from './pushToken';

jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: { eas: { projectId: 'project-1' } } } },
}));

const mockGetPermissions = Notifications.getPermissionsAsync as jest.Mock;
const mockGetToken = Notifications.getExpoPushTokenAsync as jest.Mock;
const mockFrom = supabase.from as jest.Mock;
const mockUpdate = jest.fn();
const mockEq = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockFrom.mockReturnValue({ update: mockUpdate });
  mockUpdate.mockReturnValue({ eq: mockEq });
  mockEq.mockResolvedValue({ error: null });
});

describe('registerPushToken', () => {
  it('writes the token on the profile when the permission is granted', async () => {
    mockGetPermissions.mockResolvedValue({ granted: true });
    mockGetToken.mockResolvedValue({ data: 'ExponentPushToken[abc]' });

    await registerPushToken('user-1');

    expect(mockGetToken).toHaveBeenCalledWith({ projectId: 'project-1' });
    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockUpdate).toHaveBeenCalledWith({ expo_push_token: 'ExponentPushToken[abc]' });
    expect(mockEq).toHaveBeenCalledWith('id', 'user-1');
  });

  it('asks for no token and writes nothing when the permission is refused', async () => {
    mockGetPermissions.mockResolvedValue({ granted: false });

    await registerPushToken('user-1');

    expect(mockGetToken).not.toHaveBeenCalled();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('swallows a failure to read the token', async () => {
    mockGetPermissions.mockResolvedValue({ granted: true });
    mockGetToken.mockRejectedValue(new Error('no projectId'));

    await expect(registerPushToken('user-1')).resolves.toBeUndefined();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('rewrites the token on every call, same value or not', async () => {
    mockGetPermissions.mockResolvedValue({ granted: true });
    mockGetToken.mockResolvedValue({ data: 'ExponentPushToken[abc]' });

    await registerPushToken('user-1');
    await registerPushToken('user-1');

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
