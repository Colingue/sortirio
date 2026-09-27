import { useEffect } from 'react';

import { registerPushToken } from '@/features/notifications/helpers/pushToken/pushToken';

export function useRegisterPushToken(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;
    void registerPushToken(userId);
  }, [userId]);
}
