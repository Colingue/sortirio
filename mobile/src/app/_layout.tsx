import { KeyboardProvider } from 'react-native-keyboard-controller';

import { SessionProvider } from '@/features/auth/providers/session-provider/session-provider';
import { showNotificationsInForeground } from '@/features/notifications/helpers/notificationDisplay/notificationDisplay';
import { RootNavigator } from '@/features/routing/components/root-navigator/root-navigator';

showNotificationsInForeground();

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </KeyboardProvider>
  );
}
