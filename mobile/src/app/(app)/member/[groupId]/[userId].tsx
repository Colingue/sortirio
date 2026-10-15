import { router, useLocalSearchParams } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { MemberProfile } from '@/features/group/components/member-profile/member-profile';
import { findGroupMemberProfile } from '@/features/group/helpers/myGroup/myGroup';
import { useGroupDetails } from '@/features/group/hooks/useGroupDetails/useGroupDetails';
import { useMemberReports } from '@/features/group/hooks/useMemberReports/useMemberReports';

export default function MemberProfileScreen() {
  const { groupId, userId } = useLocalSearchParams<{ groupId: string; userId: string }>();
  const groupDetails = useGroupDetails(groupId);
  const memberReports = useMemberReports();
  const profile =
    groupDetails.status === 'ready' ? findGroupMemberProfile(groupDetails.group, userId) : null;

  if (!profile) return <ScreenStatus failed={groupDetails.status !== 'loading'} />;

  return (
    <MemberProfile
      profile={profile}
      reported={memberReports.reportedUserIds.has(userId)}
      onReport={() =>
        router.push({ pathname: '/report-member/[groupId]/[userId]', params: { groupId, userId } })
      }
      onBack={() => router.back()}
    />
  );
}
