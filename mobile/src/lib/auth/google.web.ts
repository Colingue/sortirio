import { supabase } from '@/lib/supabase';

// The native module's web implementation is sponsor-only and throws, so on web we
// talk to Google Identity Services directly. It returns the same kind of ID token,
// so the Supabase call below is identical to the native one in google.ts.

const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const scriptSrc = 'https://accounts.google.com/gsi/client';

type PromptNotification = {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
  getDismissedReason(): string;
};

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        nonce: string;
        callback: (response: { credential: string }) => void;
      }): void;
      prompt(listener: (notification: PromptNotification) => void): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

/**
 * Google Identity Services puts a nonce in the ID token whether or not we ask for
 * one, and Supabase rejects a token whose nonce it cannot check. So we own it:
 * Google gets the SHA-256 hash, Supabase gets the plaintext it hashes itself.
 */
async function createNonce(): Promise<{ nonce: string; hashedNonce: string }> {
  const random = crypto.getRandomValues(new Uint8Array(32));
  const nonce = btoa(String.fromCharCode(...random));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce));
  const hashedNonce = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return { nonce, hashedNonce };
}

let loading: Promise<void> | undefined;

function loadGoogleIdentityServices(): Promise<void> {
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Le script Google n'a pas pu être chargé."));
    document.head.appendChild(script);
  });
  return loading;
}

/** Closing the Google sheet is not a failure, so it is a return value, not a throw. */
export async function signInWithGoogle(): Promise<'signed-in' | 'cancelled'> {
  if (!clientId) {
    throw new Error('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID — see .env.example.');
  }

  await loadGoogleIdentityServices();
  const google = window.google;
  if (!google) throw new Error("Google Identity Services ne s'est pas initialisé.");

  const { nonce, hashedNonce } = await createNonce();

  const idToken = await new Promise<string | null>((resolve) => {
    google.accounts.id.initialize({
      client_id: clientId,
      nonce: hashedNonce,
      callback: ({ credential }) => resolve(credential),
    });
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        resolve(null);
      } else if (
        notification.isDismissedMoment() &&
        notification.getDismissedReason() !== 'credential_returned'
      ) {
        resolve(null);
      }
    });
  });

  if (idToken === null) return 'cancelled';

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
    nonce,
  });
  if (error) throw error;
  return 'signed-in';
}
