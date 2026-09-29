import { router } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityWaiting } from '@/features/availability/components/availability-waiting/availability-waiting';
import { useAvailabilityScreen } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';
import { GroupSummary } from '@/features/group/components/group-summary/group-summary';
import { getOtherMembers } from '@/features/group/helpers/myGroup/myGroup';
import { useMyGroup } from '@/features/group/hooks/useMyGroup/useMyGroup';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken/useRegisterPushToken';

export default function HomeScreen() {
  const session = useSessionState();
  const userId = session.status === 'ready' ? session.session?.user.id : undefined;
  const { state, handleDeclareAvailability, handleCancelAvailability } =
    useAvailabilityScreen(userId);
  const myGroup = useMyGroup();

  useRegisterPushToken(userId);

  async function declareAndConfirm() {
    const posted = await handleDeclareAvailability();
    if (posted) router.push('/availability-confirmed');
  }

  if (state.status !== 'ready' || myGroup.status !== 'ready') {
    return <ScreenStatus failed={state.status === 'failed' || myGroup.status === 'failed'} />;
  }

  if (myGroup.group) {
    return (
      <GroupSummary
        venueName={myGroup.group.venueName}
        otherMembers={getOtherMembers(myGroup.group, userId)}
        onPress={() => router.push('/group')}
      />
    );
  }

  if (state.fridayState.postedFriday === null) {
    return (
      <AvailabilityInvitation
        nextOpenFriday={state.fridayState.nextOpenFriday}
        onPress={() => void declareAndConfirm()}
        saving={state.saving}
        failed={state.saveFailed}
      />
    );
  }

  return (
    <AvailabilityWaiting
      canCancel={state.fridayState.postedFriday === state.fridayState.nextOpenFriday}
      onConfirmCancel={() => void handleCancelAvailability()}
      canceling={state.canceling}
      cancelFailed={state.cancelFailed}
      groupFormationAt={state.fridayState.groupFormationAt}
      citySignupCount={state.fridayState.citySignupCount}
    />
  );
}
