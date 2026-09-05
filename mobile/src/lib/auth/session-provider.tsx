import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { hasProfile } from '@/lib/auth/profile';
import { supabase } from '@/lib/supabase';

/**
 * `loading` is a real state, not an absence of one: the navigation must not mount
 * before it ends, or the login screen flashes past someone who is already signed in.
 */
export type SessionState =
  { status: 'loading' } | { status: 'ready'; session: Session | null; hasProfile: boolean };

const SessionContext = createContext<SessionState>({ status: 'loading' });

export function useSessionState(): SessionState {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const signedOut = () => {
      if (!cancelled) setState({ status: 'ready', session: null, hasProfile: false });
    };

    const abandonSession = async () => {
      await supabase.auth.signOut();
      signedOut();
    };

    async function resolve(cached: Session | null) {
      if (!cached) return signedOut();

      // getSession() only reads local storage, so a user deleted from Supabase would
      // still look signed in until their token expired. getUser() asks the server.
      const { error } = await supabase.auth.getUser();
      if (error) return abandonSession();

      try {
        const exists = await hasProfile(cached.user.id);
        if (!cancelled) setState({ status: 'ready', session: cached, hasProfile: exists });
      } catch {
        // We cannot tell where this session belongs, and guessing wrong either sends a
        // signed-up user through sign-up again or drops a new one on an empty home.
        // Back to the login screen, where tapping the button retries the whole thing.
        return abandonSession();
      }
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // supabase-js holds a lock for the duration of this callback, and calling back
      // into it from inside deadlocks. Hand the work to the next tick.
      setTimeout(() => void resolve(session), 0);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}
