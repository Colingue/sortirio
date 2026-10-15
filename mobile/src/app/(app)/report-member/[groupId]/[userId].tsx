import { router, useLocalSearchParams } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { MemberReport } from '@/features/group/components/member-report/member-report';
import { findGroupMemberProfile } from '@/features/group/helpers/myGroup/myGroup';
import { saveMemberReport } from '@/features/group/helpers/report/report';
import { useGroupDetails } from '@/features/group/hooks/useGroupDetails/useGroupDetails';

export default function ReportMemberScreen() {
  const { groupId, userId } = useLocalSearchParams<{ groupId: string; userId: string }>();
  const groupDetails = useGroupDetails(groupId);
  const profile =
    groupDetails.status === 'ready' ? findGroupMemberProfile(groupDetails.group, userId) : null;

  if (!profile) return <ScreenStatus failed={groupDetails.status !== 'loading'} />;

  return (
    <MemberReport
      profile={profile}
      onReport={() => saveMemberReport(userId)}
      onReported={() => router.dismiss(2)}
      onCancel={() => router.back()}
    />
  );
}
