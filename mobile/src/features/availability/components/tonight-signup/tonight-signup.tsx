import { type ReactNode, type ReactElement } from 'react';
import { type RefreshControlProps } from 'react-native';

import { LateSignupWaiting } from '@/features/availability/components/late-signup-waiting/late-signup-waiting';
import { TonightInvitation } from '@/features/availability/components/tonight-invitation/tonight-invitation';
import { type ScreenState } from '@/features/availability/hooks/useAvailabilityScreen/useAvailabilityScreen';

type TonightSignupProps = {
  refreshControl?: ReactElement<RefreshControlProps>;
  city: string;
  topCard?: ReactNode;
  screen: Extract<ScreenState, { status: 'ready' }>;
  onPress: () => void;
};

export function TonightSignup({
  city,
  topCard,
  screen,
  onPress,
  refreshControl,
}: TonightSignupProps) {
  const { fridayState } = screen;

  if (fridayState.postedFriday !== null) {
    return (
      <LateSignupWaiting
        city={city}
        topCard={topCard}
        refreshControl={refreshControl}
        postedFriday={fridayState.postedFriday}
        signupClosesAt={fridayState.signupClosesAt}
      />
    );
  }

  return (
    <TonightInvitation
      city={city}
      topCard={topCard}
      refreshControl={refreshControl}
      signupFriday={fridayState.signupFriday}
      signupClosesAt={fridayState.signupClosesAt}
      onPress={onPress}
      saving={screen.saving}
      failed={screen.saveFailed}
    />
  );
}
