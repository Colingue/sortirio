import { type ReactNode } from 'react';

import { LateSignupWaiting } from '@/features/availability/components/late-signup-waiting/late-signup-waiting';
import { TonightInvitation } from '@/features/availability/components/tonight-invitation/tonight-invitation';
import { type ScreenState } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

type TonightSignupProps = {
  city: string;
  topCard?: ReactNode;
  screen: Extract<ScreenState, { status: 'ready' }>;
  onPress: () => void;
};

export function TonightSignup({ city, topCard, screen, onPress }: TonightSignupProps) {
  const { fridayState } = screen;

  if (fridayState.postedFriday !== null) {
    return (
      <LateSignupWaiting
        city={city}
        topCard={topCard}
        postedFriday={fridayState.postedFriday}
        signupClosesAt={fridayState.signupClosesAt}
      />
    );
  }

  return (
    <TonightInvitation
      city={city}
      topCard={topCard}
      signupFriday={fridayState.signupFriday}
      signupClosesAt={fridayState.signupClosesAt}
      onPress={onPress}
      saving={screen.saving}
      failed={screen.saveFailed}
    />
  );
}
