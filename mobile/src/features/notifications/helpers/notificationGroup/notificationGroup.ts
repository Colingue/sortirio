import { type Notification } from 'expo-notifications';

export function getNotificationGroupId(notification: Notification): string | null {
  const groupId = notification.request.content.data?.groupId;
  return typeof groupId === 'string' ? groupId : null;
}
