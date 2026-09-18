import type { Session } from '@supabase/supabase-js';

export type Destination = 'login' | 'onboarding' | 'home';

export function resolveDestination(state: {
  session: Session | null;
  hasProfile: boolean;
}): Destination {
  if (!state.session) return 'login';
  return state.hasProfile ? 'home' : 'onboarding';
}
