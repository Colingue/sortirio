import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { setChatOnScreen } from '@/features/notifications/helpers/notificationDisplay/notificationDisplay';

export function useHideNotificationsOfChat(groupId: string) {
  useFocusEffect(
    useCallback(() => {
      setChatOnScreen(groupId);
      return () => setChatOnScreen(null);
    }, [groupId]),
  );
}
