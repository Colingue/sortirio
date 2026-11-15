import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { isAccountBanned } from '@/features/auth/helpers/isAccountBanned/isAccountBanned';
import { getProfileStatus } from '@/features/profile/helpers/getProfileStatus/getProfileStatus';
import { supabase } from '@/lib/supabase';

export type SessionState =
  | { status: 'loading' }
  | {
      status: 'ready';
      session: Session | null;
      banned: boolean;
      hasProfile: boolean;
      onboardingIntroSeen: boolean;
    };

const SessionContext = createContext<SessionState>({ status: 'loading' });
const ProfileCreatedContext = createContext<() => void>(() => {});
const OnboardingIntroSeenContext = createContext<() => void>(() => {});

export function useSessionState(): SessionState {
  return useContext(SessionContext);
}

export function useProfileCreated(): () => void {
  return useContext(ProfileCreatedContext);
}

export function useMarkOnboardingIntroSeen(): () => void {
  return useContext(OnboardingIntroSeenContext);
}

const SIGNED_OUT: SessionState = {
  status: 'ready',
  session: null,
  banned: false,
  hasProfile: false,
  onboardingIntroSeen: false,
};

function useResolvedSessionState() {
  const [auth, setAuth] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const signedOut = () => {
      if (!cancelled) setAuth(SIGNED_OUT);
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
        const [banned, profile] = await Promise.all([
          isAccountBanned(),
          getProfileStatus(cached.user.id),
        ]);
        if (!cancelled) {
          setAuth({
            status: 'ready',
            session: cached,
            banned,
            hasProfile: profile.exists,
            onboardingIntroSeen: profile.onboardingIntroSeen,
          });
        }
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

  return [auth, setAuth] as const;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useResolvedSessionState();

  const profileCreated = useCallback(() => {
    setAuth((current) =>
      current.status === 'ready'
        ? { ...current, hasProfile: true, onboardingIntroSeen: false }
        : current,
    );
  }, [setAuth]);

  const markOnboardingIntroSeen = useCallback(() => {
    setAuth((current) =>
      current.status === 'ready' ? { ...current, onboardingIntroSeen: true } : current,
    );
  }, [setAuth]);

  return (
    <SessionContext.Provider value={auth}>
      <ProfileCreatedContext.Provider value={profileCreated}>
        <OnboardingIntroSeenContext.Provider value={markOnboardingIntroSeen}>
          {children}
        </OnboardingIntroSeenContext.Provider>
      </ProfileCreatedContext.Provider>
    </SessionContext.Provider>
  );
}
