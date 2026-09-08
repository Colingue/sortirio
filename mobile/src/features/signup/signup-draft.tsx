import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type SignupDraft = {
  city?: string;
  firstName?: string;
  birthdate?: Date;
  photoUri?: string;
};

export type CompleteDraft = {
  [Key in keyof SignupDraft]-?: NonNullable<SignupDraft[Key]>;
};

type SignupDraftValue = {
  draft: SignupDraft;
  update: (fields: Partial<SignupDraft>) => void;
};

const SignupDraftContext = createContext<SignupDraftValue | null>(null);

export function useSignupDraft(): SignupDraftValue {
  const value = useContext(SignupDraftContext);
  if (!value) throw new Error('useSignupDraft must be used inside a SignupDraftProvider.');

  return value;
}

export function completeDraft(draft: SignupDraft): CompleteDraft | null {
  const { city, firstName, birthdate, photoUri } = draft;
  if (!city || !firstName || !birthdate || !photoUri) return null;

  return { city, firstName, birthdate, photoUri };
}

export function SignupDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>({});

  const update = useCallback((fields: Partial<SignupDraft>) => {
    setDraft((current) => ({ ...current, ...fields }));
  }, []);

  const value = useMemo(() => ({ draft, update }), [draft, update]);

  return <SignupDraftContext.Provider value={value}>{children}</SignupDraftContext.Provider>;
}
