import type { Session } from '@supabase/supabase-js';

export type Destination = 'login' | 'banned' | 'onboarding' | 'home';

export function resolveDestination(state: {
  session: Session | null;
  banned: boolean;
  hasProfile: boolean;
}): Destination {
  if (!state.session) return 'login';
  if (state.banned) return 'banned';
  return state.hasProfile ? 'home' : 'onboarding';
}
