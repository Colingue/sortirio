import { useLocalSearchParams } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  return <ScreenStatus failed={!groupId} />;
}
