import { ScreenStatus } from '@/components/screen-status';
import { AttendanceQuestionCard } from '@/features/attendance/components/attendance-question-card/attendance-question-card';
import { useAttendanceQuestion } from '@/features/attendance/hooks/useAttendanceQuestion/useAttendanceQuestion';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityHome } from '@/features/availability/components/availability-home/availability-home';
import { useAvailabilityScreen } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';
import { cities } from '@/features/city/helpers/cities/cities';
import { GroupSummary } from '@/features/group/components/group-summary/group-summary';
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

  useRegisterPushToken(userId);
  useOpenScreenFromNotification();

  if (state.status !== 'ready' || myGroup.status !== 'ready') {
    return <ScreenStatus failed={state.status === 'failed' || myGroup.status === 'failed'} />;
  }

  if (myGroup.group) {
    return <GroupSummary city={city.name} group={myGroup.group} myUserId={userId} />;
  }

  return (
    <AvailabilityHome
      city={city.name}
      topCard={attendanceCard}
      screen={state}
      onDeclare={handleDeclareAvailability}
      onCancel={() => void handleCancelAvailability()}
    />
  );
}
