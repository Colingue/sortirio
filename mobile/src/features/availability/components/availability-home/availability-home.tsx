import { router } from 'expo-router';
import { type ReactElement, type ReactNode } from 'react';
import { type RefreshControlProps } from 'react-native';

import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityWaiting } from '@/features/availability/components/availability-waiting/availability-waiting';
import { NoGroupTonight } from '@/features/availability/components/no-group-tonight/no-group-tonight';
import { TonightSignup } from '@/features/availability/components/tonight-signup/tonight-signup';
import {
  isNoGroupTonightShown,
  isTonightSignupShown,
} from '@/features/availability/helpers/fridays/fridays';
import { type ScreenState } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

type AvailabilityHomeProps = {
  city: string;
  topCard?: ReactNode;
  refreshControl?: ReactElement<RefreshControlProps>;
  screen: Extract<ScreenState, { status: 'ready' }>;
  onDeclare: () => Promise<boolean>;
  onDeclareTonight: () => void;
  onCancel: () => void;
};

export function AvailabilityHome({
  city,
  topCard,
  refreshControl,
  screen,
  onDeclare,
  onDeclareTonight,
  onCancel,
}: AvailabilityHomeProps) {
  const { fridayState } = screen;
  const shared = { city, topCard, refreshControl };

  async function declareAndConfirm(friday: string) {
    const posted = await onDeclare();
    if (posted) router.push({ pathname: '/availability-confirmed', params: { friday } });
  }

  if (isNoGroupTonightShown(fridayState)) {
    return <NoGroupTonight city={city} screen={screen} onDeclare={onDeclare} />;
  }

  if (isTonightSignupShown(fridayState)) {
    return <TonightSignup {...shared} screen={screen} onPress={onDeclareTonight} />;
  }

  if (fridayState.postedFriday === null) {
    return (
      <AvailabilityInvitation
        {...shared}
        nextOpenFriday={fridayState.nextOpenFriday}
        citySignupCount={fridayState.citySignupCount}
        onPress={() => void declareAndConfirm(fridayState.nextOpenFriday)}
        saving={screen.saving}
        failed={screen.saveFailed}
      />
    );
  }

  return (
    <AvailabilityWaiting
      {...shared}
      postedFriday={fridayState.postedFriday}
      canCancel={fridayState.postedFriday === fridayState.nextOpenFriday}
      onConfirmCancel={onCancel}
      canceling={screen.canceling}
      cancelFailed={screen.cancelFailed}
      groupFormationAt={fridayState.groupFormationAt}
      citySignupCount={fridayState.citySignupCount}
    />
  );
}
