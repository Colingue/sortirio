import * as Notifications from 'expo-notifications';

import { showNotificationsInForeground } from './notificationDisplay';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
}));

const mockSetHandler = Notifications.setNotificationHandler as jest.Mock;

describe('showNotificationsInForeground', () => {
  it('shows the banner of a notification arriving while the app is open', async () => {
    showNotificationsInForeground();

    const [{ handleNotification }] = mockSetHandler.mock.calls[0];

    await expect(handleNotification()).resolves.toEqual({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    });
  });
});
