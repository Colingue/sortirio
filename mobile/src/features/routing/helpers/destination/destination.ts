import type { Session } from '@supabase/supabase-js';

export type Destination = 'login' | 'banned' | 'signup' | 'onboarding' | 'home';

export function resolveDestination(state: {
  session: Session | null;
  banned: boolean;
  hasProfile: boolean;
  onboardingIntroSeen: boolean;
}): Destination {
  if (!state.session) return 'login';
  if (state.banned) return 'banned';
  if (!state.hasProfile) return 'signup';
  return state.onboardingIntroSeen ? 'home' : 'onboarding';
}
