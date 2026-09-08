import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { hasProfile } from '@/features/profile/has-profile';
import { supabase } from '@/lib/supabase';

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

      const { error } = await supabase.auth.getUser();
      if (error) return abandonSession();

      try {
        const exists = await hasProfile(cached.user.id);
        if (!cancelled) setState({ status: 'ready', session: cached, hasProfile: exists });
      } catch {
        return abandonSession();
      }
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => void resolve(session), 0);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}
