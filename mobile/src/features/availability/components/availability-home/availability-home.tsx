import { router } from 'expo-router';
import { type ReactNode } from 'react';

import { AvailabilityInvitation } from '@/features/availability/components/availability-invitation/availability-invitation';
import { AvailabilityWaiting } from '@/features/availability/components/availability-waiting/availability-waiting';
import { TonightSignup } from '@/features/availability/components/tonight-signup/tonight-signup';
import { isTonightSignupShown } from '@/features/availability/helpers/fridays/fridays';
import { type ScreenState } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

type AvailabilityHomeProps = {
  city: string;
  topCard?: ReactNode;
  screen: Extract<ScreenState, { status: 'ready' }>;
  onDeclare: () => Promise<boolean>;
  onCancel: () => void;
};

export function AvailabilityHome({
  city,
  topCard,
  screen,
  onDeclare,
  onCancel,
}: AvailabilityHomeProps) {
  const { fridayState } = screen;

  async function declareAndConfirm(friday: string) {
    const posted = await onDeclare();
    if (posted) router.push({ pathname: '/availability-confirmed', params: { friday } });
  }

  if (isTonightSignupShown(fridayState)) {
    return (
      <TonightSignup
        city={city}
        topCard={topCard}
        screen={screen}
        onPress={() => void onDeclare()}
      />
    );
  }

  if (fridayState.postedFriday === null) {
    return (
      <AvailabilityInvitation
        city={city}
        topCard={topCard}
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
      city={city}
      topCard={topCard}
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
