import { router } from 'expo-router';
import { useState } from 'react';

import { ScreenStatus } from '@/components/screen-status';
import { AttendanceQuestionCard } from '@/features/attendance/components/attendance-question-card/attendance-question-card';
import { useAttendanceQuestion } from '@/features/attendance/hooks/useAttendanceQuestion/useAttendanceQuestion';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityHome } from '@/features/availability/components/availability-home/availability-home';
import { useAvailabilityScreen } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';
import { cities } from '@/features/city/helpers/cities/cities';
import { GroupSummary } from '@/features/group/components/group-summary/group-summary';
import { saveGroupAnnouncementSeen } from '@/features/group/helpers/groupAnnouncement/groupAnnouncement';
import { fetchMyGroup, type MyGroup } from '@/features/group/helpers/myGroup/myGroup';
import { useMyGroup } from '@/features/group/hooks/useMyGroup/useMyGroup';
import { useOpenScreenFromNotification } from '@/features/notifications/hooks/useOpenScreenFromNotification/useOpenScreenFromNotification';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken/useRegisterPushToken';

export default function HomeScreen() {
  const session = useSessionState();
  const userId = session.status === 'ready' ? session.session?.user.id : undefined;
  const { state, handleDeclareAvailability, handleCancelAvailability } =
    useAvailabilityScreen(userId);
  const myGroup = useMyGroup();
  const attendance = useAttendanceQuestion();
  const attendanceCard = <AttendanceQuestionCard attendance={attendance} />;
  const [city] = cities;
  const [joinedGroup, setJoinedGroup] = useState<MyGroup | null>(null);

  useRegisterPushToken(userId);
  useOpenScreenFromNotification();

  async function declareTonight() {
    if (!(await handleDeclareAvailability())) return;

    const group = await fetchMyGroup().catch(() => null);
    if (!group) return;

    await saveGroupAnnouncementSeen(group.groupId).catch(() => {});
    setJoinedGroup(group);
    router.push('/group-joined');
  }

  if (state.status !== 'ready' || myGroup.status !== 'ready') {
    return <ScreenStatus failed={state.status === 'failed' || myGroup.status === 'failed'} />;
  }

  const group = joinedGroup ?? myGroup.group;
  if (group) {
    return <GroupSummary city={city.name} group={group} myUserId={userId} />;
  }

  return (
    <AvailabilityHome
      city={city.name}
      topCard={attendanceCard}
      screen={state}
      onDeclare={handleDeclareAvailability}
      onDeclareTonight={() => void declareTonight()}
      onCancel={() => void handleCancelAvailability()}
    />
  );
}
