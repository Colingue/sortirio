import { SessionProvider } from '@/features/auth/providers/session-provider/session-provider';
import { RootNavigator } from '@/features/routing/components/root-navigator/root-navigator';

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
