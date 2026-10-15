import { router } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityWaiting } from '@/features/availability/components/availability-waiting/availability-waiting';
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
  const [city] = cities;

  useRegisterPushToken(userId);
  useOpenScreenFromNotification();

  async function declareAndConfirm(friday: string) {
    const posted = await handleDeclareAvailability();
    if (posted) router.push({ pathname: '/availability-confirmed', params: { friday } });
  }

  if (state.status !== 'ready' || myGroup.status !== 'ready') {
    return <ScreenStatus failed={state.status === 'failed' || myGroup.status === 'failed'} />;
  }

  if (myGroup.group) {
    return <GroupSummary city={city.name} group={myGroup.group} myUserId={userId} />;
  }

  if (state.fridayState.postedFriday === null) {
    return (
      <AvailabilityInvitation
        city={city.name}
        nextOpenFriday={state.fridayState.nextOpenFriday}
        citySignupCount={state.fridayState.citySignupCount}
        onPress={() => void declareAndConfirm(state.fridayState.nextOpenFriday)}
        saving={state.saving}
        failed={state.saveFailed}
      />
    );
  }

  return (
    <AvailabilityWaiting
      city={city.name}
      postedFriday={state.fridayState.postedFriday}
      canCancel={state.fridayState.postedFriday === state.fridayState.nextOpenFriday}
      onConfirmCancel={() => void handleCancelAvailability()}
      canceling={state.canceling}
      cancelFailed={state.cancelFailed}
      groupFormationAt={state.fridayState.groupFormationAt}
      citySignupCount={state.fridayState.citySignupCount}
    />
  );
}
