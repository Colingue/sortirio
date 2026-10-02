import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { getNotificationGroupId } from '@/features/notifications/helpers/notificationGroup/notificationGroup';

export function useOpenChatFromNotification() {
  useEffect(() => {
    const handledIdentifiers = new Set<string>();

    function openChatOfResponse(response: Notifications.NotificationResponse) {
      const identifier = response.notification.request.identifier;
      if (handledIdentifiers.has(identifier)) return;
      handledIdentifiers.add(identifier);
      Notifications.clearLastNotificationResponse();

      const groupId = getNotificationGroupId(response.notification);
      if (!groupId) return;
      router.push({ pathname: '/chat/[groupId]', params: { groupId } });
    }

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) openChatOfResponse(lastResponse);

    const subscription = Notifications.addNotificationResponseReceivedListener(openChatOfResponse);
    return () => subscription.remove();
  }, []);
}
