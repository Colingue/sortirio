import type { Session } from '@supabase/supabase-js';

import { resolveDestination } from './destination';

const signedInSession: Session = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: '00000000-0000-0000-0000-000000000000',
    aud: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-09-02T10:00:00.000Z',
  },
};

describe('resolveDestination', () => {
  it('sends a visitor without a session to the login screen', () => {
    expect(resolveDestination({ session: null, hasProfile: false })).toBe('login');
  });

  it('sends a signed-in user without a profile to onboarding', () => {
    expect(resolveDestination({ session: signedInSession, hasProfile: false })).toBe('onboarding');
  });

  it('sends a signed-in user with a profile home', () => {
    expect(resolveDestination({ session: signedInSession, hasProfile: true })).toBe('home');
  });
});
