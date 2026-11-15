import { type FridayState } from '@/features/availability/helpers/availability/availability';
import { isoDay } from '@/features/date/helpers/isoDay/isoDay';

const WEEK_DAYS = 7;

export function getFollowingFridays(isoFriday: string, count: number): string[] {
  const [year, month, day] = isoFriday.split('-').map(Number);

  return Array.from({ length: count }, (_, index) =>
    isoDay(new Date(year, month - 1, day + WEEK_DAYS * (index + 1))),
  );
}

export function getDayOfMonth(isoDate: string): number {
  return Number(isoDate.split('-')[2]);
}

export function formatSignupCount(count: number): string {
  return count === 1 ? '1 personne inscrite' : `${count} personnes inscrites`;
}

export function isTonightSignupOpen(fridays: {
  signupFriday: string;
  nextOpenFriday: string;
}): boolean {
  return fridays.signupFriday !== fridays.nextOpenFriday;
}

export function getFridayStateAfterPosting(fridayState: FridayState): FridayState {
  return {
    ...fridayState,
    postedFriday: fridayState.signupFriday,
    postedLate: isTonightSignupOpen(fridayState),
  };
}

export function isTonightSignupShown(fridayState: FridayState): boolean {
  if (fridayState.postedFriday === null) return isTonightSignupOpen(fridayState);
  return fridayState.postedFriday !== fridayState.nextOpenFriday;
}

export function isNoGroupTonightShown(fridayState: FridayState): boolean {
  return fridayState.postedFriday !== null && fridayState.postedFriday !== fridayState.signupFriday;
}
