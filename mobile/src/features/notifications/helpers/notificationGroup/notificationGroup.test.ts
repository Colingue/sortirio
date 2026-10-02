import { type Notification } from 'expo-notifications';

import { getNotificationGroupId } from './notificationGroup';

function buildNotification(data: unknown): Notification {
  return { request: { content: { data } } } as unknown as Notification;
}

describe('getNotificationGroupId', () => {
  it('returns the group id carried by a message notification', () => {
    expect(getNotificationGroupId(buildNotification({ groupId: 'g1' }))).toBe('g1');
  });

  it('returns null for a notification without data', () => {
    expect(getNotificationGroupId(buildNotification(undefined))).toBeNull();
    expect(getNotificationGroupId(buildNotification(null))).toBeNull();
    expect(getNotificationGroupId(buildNotification({}))).toBeNull();
  });

  it('returns null when the group id is not a string', () => {
    expect(getNotificationGroupId(buildNotification({ groupId: 42 }))).toBeNull();
  });
});
