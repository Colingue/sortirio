import * as Notifications from 'expo-notifications';

import { getNotificationGroupId } from '@/features/notifications/helpers/notificationGroup/notificationGroup';

let groupIdOfChatOnScreen: string | null = null;

export function setChatOnScreen(groupId: string | null): void {
  groupIdOfChatOnScreen = groupId;
}

export function showNotificationsInForeground(): void {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const isOfChatOnScreen =
        groupIdOfChatOnScreen !== null &&
        getNotificationGroupId(notification) === groupIdOfChatOnScreen;
      return {
        shouldShowBanner: !isOfChatOnScreen,
        shouldShowList: !isOfChatOnScreen,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    },
  });
}
