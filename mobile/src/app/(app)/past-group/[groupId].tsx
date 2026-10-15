import { router, useLocalSearchParams } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { GroupDetails } from '@/features/group/components/group-details/group-details';
import { openMapsForAddress } from '@/features/group/helpers/maps/maps';
import { useGroupDetails } from '@/features/group/hooks/useGroupDetails/useGroupDetails';
import { useMemberReports } from '@/features/group/hooks/useMemberReports/useMemberReports';

export default function PastGroupScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const groupDetails = useGroupDetails(groupId);
  const memberReports = useMemberReports();
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;

  if (groupDetails.status !== 'ready' || !groupDetails.group) {
    return <ScreenStatus failed={groupDetails.status !== 'loading'} />;
  }

  const { group } = groupDetails;

  return (
    <GroupDetails
      friday={group.friday}
      venueName={group.venueName}
      venueAddress={group.venueAddress}
      members={group.members}
      myUserId={myUserId}
      reportedUserIds={memberReports.reportedUserIds}
      onReportMember={memberReports.saveMemberReport}
      onOpenAddress={() => void openMapsForAddress(group.venueAddress)}
      onOpenChat={() =>
        router.push({ pathname: '/chat/[groupId]', params: { groupId: group.groupId } })
      }
      onBack={() => router.back()}
    />
  );
}
