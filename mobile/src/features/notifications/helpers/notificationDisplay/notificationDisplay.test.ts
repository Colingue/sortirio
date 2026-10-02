import * as Notifications from 'expo-notifications';

import { setChatOnScreen, showNotificationsInForeground } from './notificationDisplay';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
}));

const mockSetHandler = Notifications.setNotificationHandler as jest.Mock;

function buildNotification(data: unknown): Notifications.Notification {
  return { request: { content: { data } } } as unknown as Notifications.Notification;
}

async function getDisplayOf(notification: Notifications.Notification) {
  showNotificationsInForeground();
  const [{ handleNotification }] = mockSetHandler.mock.calls[0];
  return handleNotification(notification);
}

const shown = {
  shouldShowBanner: true,
  shouldShowList: true,
  shouldPlaySound: false,
  shouldSetBadge: false,
};

const hidden = { ...shown, shouldShowBanner: false, shouldShowList: false };

afterEach(() => {
  setChatOnScreen(null);
  mockSetHandler.mockClear();
});

describe('showNotificationsInForeground', () => {
  it('shows the banner of a notification arriving while the app is open', async () => {
    await expect(getDisplayOf(buildNotification({ groupId: 'g1' }))).resolves.toEqual(shown);
  });

  it('hides a notification of the chat on screen', async () => {
    setChatOnScreen('g1');

    await expect(getDisplayOf(buildNotification({ groupId: 'g1' }))).resolves.toEqual(hidden);
  });

  it('shows a notification of another group, or without a group, over a chat', async () => {
    setChatOnScreen('g1');

    await expect(getDisplayOf(buildNotification({ groupId: 'g2' }))).resolves.toEqual(shown);
    await expect(getDisplayOf(buildNotification({}))).resolves.toEqual(shown);
  });

  it('shows the notifications of a chat once it is left', async () => {
    setChatOnScreen('g1');
    setChatOnScreen(null);

    await expect(getDisplayOf(buildNotification({ groupId: 'g1' }))).resolves.toEqual(shown);
  });
});
