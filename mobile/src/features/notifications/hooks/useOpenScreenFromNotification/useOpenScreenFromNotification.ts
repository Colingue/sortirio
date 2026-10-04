import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import {
  getNotificationGroupId,
  getNotificationUrl,
} from '@/features/notifications/helpers/notificationGroup/notificationGroup';

export function useOpenScreenFromNotification() {
  useEffect(() => {
    const handledIdentifiers = new Set<string>();

    function openScreenOfResponse(response: Notifications.NotificationResponse) {
      const identifier = response.notification.request.identifier;
      if (handledIdentifiers.has(identifier)) return;
      handledIdentifiers.add(identifier);
      Notifications.clearLastNotificationResponse();

      const groupId = getNotificationGroupId(response.notification);
      if (groupId) {
        router.push({ pathname: '/chat/[groupId]', params: { groupId } });
        return;
      }

      const url = getNotificationUrl(response.notification);
      if (url) router.push(url);
    }

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) openScreenOfResponse(lastResponse);

    const subscription =
      Notifications.addNotificationResponseReceivedListener(openScreenOfResponse);
    return () => subscription.remove();
  }, []);
}
