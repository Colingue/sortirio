import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { isAccountBanned } from '@/features/auth/helpers/isAccountBanned/isAccountBanned';
import { hasProfile } from '@/features/profile/helpers/hasProfile/hasProfile';
import { supabase } from '@/lib/supabase';

export type SessionState =
  | { status: 'loading' }
  | { status: 'ready'; session: Session | null; banned: boolean; hasProfile: boolean };

const SessionContext = createContext<SessionState>({ status: 'loading' });
const ProfileCreatedContext = createContext<() => void>(() => {});

export function useSessionState(): SessionState {
  return useContext(SessionContext);
}

export function useProfileCreated(): () => void {
  return useContext(ProfileCreatedContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<SessionState>({ status: 'loading' });

  const profileCreated = useCallback(() => {
    setAuth((current) => (current.status === 'ready' ? { ...current, hasProfile: true } : current));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const signedOut = () => {
      if (!cancelled) setAuth({ status: 'ready', session: null, banned: false, hasProfile: false });
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
        const [banned, exists] = await Promise.all([isAccountBanned(), hasProfile(cached.user.id)]);
        if (!cancelled) setAuth({ status: 'ready', session: cached, banned, hasProfile: exists });
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

  return (
    <SessionContext.Provider value={auth}>
      <ProfileCreatedContext.Provider value={profileCreated}>
        {children}
      </ProfileCreatedContext.Provider>
    </SessionContext.Provider>
  );
}
