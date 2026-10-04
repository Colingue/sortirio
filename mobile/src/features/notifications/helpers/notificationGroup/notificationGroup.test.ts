import { type Notification } from 'expo-notifications';

import { getNotificationGroupId, getNotificationUrl } from './notificationGroup';

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

describe('getNotificationUrl', () => {
  it('returns the group screen carried by the Friday reminder', () => {
    expect(getNotificationUrl(buildNotification({ url: '/group' }))).toBe('/group');
  });

  it('returns null for a notification without url', () => {
    expect(getNotificationUrl(buildNotification(undefined))).toBeNull();
    expect(getNotificationUrl(buildNotification({ groupId: 'g1' }))).toBeNull();
  });

  it('returns null for any url other than the group screen', () => {
    expect(getNotificationUrl(buildNotification({ url: '/chat/g1' }))).toBeNull();
    expect(getNotificationUrl(buildNotification({ url: 42 }))).toBeNull();
  });
});
