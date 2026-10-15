import { router } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { GroupDetails } from '@/features/group/components/group-details/group-details';
import { openMapsForAddress } from '@/features/group/helpers/maps/maps';
import { useMyGroup } from '@/features/group/hooks/useMyGroup/useMyGroup';

export default function GroupScreen() {
  const myGroup = useMyGroup();
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;

  if (myGroup.status !== 'ready' || !myGroup.group) {
    return <ScreenStatus failed={myGroup.status === 'failed'} />;
  }

  const { group } = myGroup;

  return (
    <GroupDetails
      friday={group.friday}
      venueName={group.venueName}
      venueAddress={group.venueAddress}
      members={group.members}
      myUserId={myUserId}
      onOpenMember={(userId) =>
        router.push({
          pathname: '/member/[groupId]/[userId]',
          params: { groupId: group.groupId, userId },
        })
      }
      onOpenAddress={() => void openMapsForAddress(group.venueAddress)}
      onOpenChat={() =>
        router.push({ pathname: '/chat/[groupId]', params: { groupId: group.groupId } })
      }
      onBack={() => router.back()}
    />
  );
}
