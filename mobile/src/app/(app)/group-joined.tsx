import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ScreenStatus } from '@/components/screen-status';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { GroupJoined } from '@/features/group/components/group-joined/group-joined';
import { useMyGroup } from '@/features/group/hooks/useMyGroup/useMyGroup';

export default function GroupJoinedScreen() {
  const myGroup = useMyGroup();
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;

  if (myGroup.status !== 'ready' || !myGroup.group) {
    return <ScreenStatus failed={myGroup.status === 'failed'} />;
  }

  const { group } = myGroup;

  return (
    <>
      <StatusBar style="light" />
      <GroupJoined
        group={group}
        myUserId={myUserId}
        onOpenChat={() =>
          router.replace({ pathname: '/chat/[groupId]', params: { groupId: group.groupId } })
        }
        onOpenGroup={() => router.replace('/group')}
      />
    </>
  );
}
